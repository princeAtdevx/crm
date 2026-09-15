# PRODUCTION environment root. Mirrors environments/staging/main.tf's shape
# exactly (same modules, same wiring) -- only the sizing arguments differ,
# matching .aws/task-definition.{api,worker}.production.json (cpu
# 512/memory 1024) and the larger, Multi-AZ RDS instance production
# warrants. Kept as a fully separate root (not a shared module with a
# `stage` conditional) on purpose, matching the "fully independent
# pipelines" decision already made for the GitHub Actions workflows --
# staging and production are free to diverge in shape, not just size.
#
# Boilerplate only: this has never been applied. Fill in terraform.tfvars
# (copy terraform.tfvars.example) and backend.tfvars (copy
# backend.tfvars.example) before running `terraform init`. Apply staging
# FIRST -- see create_oidc_provider below.

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    key     = "production/terraform.tfstate"
    encrypt = true
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  name_prefix = "crm-production"
  stage       = "production"
}

module "networking" {
  source = "../../modules/networking"

  name_prefix = local.name_prefix
  stage       = local.stage

  # Production gets its own VPC, fully separate from staging's -- no
  # shared networking, no peering. Two AZs is still the default here (see
  # modules/networking's file header on the single-NAT tradeoff); widen to
  # 3 AZs + one NAT per AZ first if production HA requirements call for it.
}

module "oidc" {
  source = "../../modules/oidc"

  name_prefix = local.name_prefix
  github_org  = var.github_org
  github_repo = var.github_repo
  branch      = "main"

  # False: staging's root creates the account-wide OIDC provider (see
  # environments/staging/main.tf). Applying production BEFORE staging in a
  # fresh account will fail here with no such provider to reference --
  # apply staging first, or flip this to true and staging's to false.
  create_oidc_provider = false
}

module "ecr" {
  source = "../../modules/ecr"

  name_prefix = local.name_prefix
  stage       = local.stage
}

module "rds" {
  source = "../../modules/rds"

  name_prefix           = local.name_prefix
  stage                 = local.stage
  private_subnet_ids    = module.networking.private_subnet_ids
  rds_security_group_id = module.networking.rds_security_group_id
  instance_class        = "db.t4g.small"
  multi_az              = true
  backup_retention_days = 30
}

module "ecs_cluster" {
  source = "../../modules/ecs-cluster"

  name_prefix    = local.name_prefix
  stage          = local.stage
  app_secret_arn = module.rds.app_secret_arn
}

module "ecs_service_api" {
  source = "../../modules/ecs-service"

  name_prefix                 = local.name_prefix
  stage                       = local.stage
  aws_region                  = var.aws_region
  service_name                = "api"
  cluster_arn                 = module.ecs_cluster.cluster_arn
  task_execution_role_arn     = module.ecs_cluster.task_execution_role_arn
  task_role_arn               = module.ecs_cluster.task_role_arn
  private_subnet_ids          = module.networking.private_subnet_ids
  ecs_tasks_security_group_id = module.networking.ecs_tasks_security_group_id

  # Boilerplate default of 1 -- raise once real production traffic is
  # known; this is the one number in this file most likely to need
  # changing before go-live (with an ALB + target group added in front,
  # which does not exist yet -- see .github/workflows/backend-production.yml's
  # setup checklist item 4 on the missing /health route it would need).
  desired_count = 1
  cpu           = "512"
  memory        = "1024"
}

module "ecs_service_worker" {
  source = "../../modules/ecs-service"

  name_prefix                 = local.name_prefix
  stage                       = local.stage
  aws_region                  = var.aws_region
  service_name                = "worker"
  cluster_arn                 = module.ecs_cluster.cluster_arn
  task_execution_role_arn     = module.ecs_cluster.task_execution_role_arn
  task_role_arn               = module.ecs_cluster.task_role_arn
  private_subnet_ids          = module.networking.private_subnet_ids
  ecs_tasks_security_group_id = module.networking.ecs_tasks_security_group_id
  desired_count               = 1
  cpu                         = "512"
  memory                      = "1024"
}

module "web_hosting" {
  source = "../../modules/web-hosting"

  name_prefix = local.name_prefix
  stage       = local.stage
  bucket_name = var.web_bucket_name
  price_class = "PriceClass_All" # wider edge coverage than staging's PriceClass_100
}
