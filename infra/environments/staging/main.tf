# STAGING environment root. Wires every module in infra/modules/ into
# one complete stage's infrastructure, sized deliberately smaller than
# production (see ecs_desired_count, rds instance_class below) -- matching
# the "low staging traffic" sizing already reflected in
# .aws/task-definition.{api,worker}.staging.json (cpu 256/memory 512) and
# .github/workflows/backend-staging.yml's setup checklist (desired-count 1).
#
# Boilerplate only: this has never been applied. Fill in terraform.tfvars
# (copy terraform.tfvars.example) and backend.tfvars (copy
# backend.tfvars.example, using the bucket/table names output by
# infra/bootstrap) before running `terraform init`.

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Values supplied via `terraform init -backend-config=backend.tfvars`,
  # not hardcoded here -- backend.tfvars is gitignored (see .gitignore
  # entry added alongside this file) since bucket/table names alone aren't
  # sensitive, but keeping every environment's backend config out of git
  # avoids two stages accidentally pointing at the same state key.
  backend "s3" {
    key     = "staging/terraform.tfstate"
    encrypt = true
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  name_prefix = "crm-staging"
  stage       = "staging"
}

module "networking" {
  source = "../../modules/networking"

  name_prefix = local.name_prefix
  stage       = local.stage
}

module "oidc" {
  source = "../../modules/oidc"

  name_prefix = local.name_prefix
  github_org  = var.github_org
  github_repo = var.github_repo
  branch      = "staging"

  # Staging applies FIRST in the two-stage rollout this repo uses (see
  # .github/workflows/*-staging.yml preceding *-production.yml
  # historically) -- so staging owns creating the account-wide OIDC
  # provider. If production is ever applied to a fresh account before
  # staging, flip this pair of booleans (set production's to true,
  # staging's to false) instead of applying both -- see the note on
  # create_oidc_provider in modules/oidc/variables.tf.
  create_oidc_provider = true
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
  instance_class        = "db.t4g.micro"
  multi_az              = false
  backup_retention_days = 7
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
  desired_count               = 1
  cpu                         = "256"
  memory                      = "512"
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
  cpu                         = "256"
  memory                      = "512"
}

module "web_hosting" {
  source = "../../modules/web-hosting"

  name_prefix = local.name_prefix
  stage       = local.stage
  bucket_name = var.web_bucket_name
}
