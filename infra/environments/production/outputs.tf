# Same mapping as environments/staging/outputs.tf -- each value goes to the
# "production" GitHub Environment instead of "staging", and to
# .aws/task-definition.*.production.json's REPLACE_* placeholders.

output "aws_deploy_role_arn" {
  value       = module.oidc.deploy_role_arn
  description = "-> GitHub secret AWS_DEPLOY_ROLE_ARN"
}

output "aws_ecr_repository" {
  value       = module.ecr.repository_name
  description = "-> GitHub variable AWS_ECR_REPOSITORY"
}

output "aws_ecs_cluster" {
  value       = module.ecs_cluster.cluster_name
  description = "-> GitHub variable AWS_ECS_CLUSTER"
}

output "aws_ecs_api_service" {
  value       = module.ecs_service_api.service_name
  description = "-> GitHub variable AWS_ECS_API_SERVICE"
}

output "aws_ecs_worker_service" {
  value       = module.ecs_service_worker.service_name
  description = "-> GitHub variable AWS_ECS_WORKER_SERVICE"
}

output "aws_vpc_subnets" {
  value       = join(",", module.networking.private_subnet_ids)
  description = "-> GitHub variable AWS_VPC_SUBNETS (comma-separated, used by the migrate job's run-task network-configuration)"
}

output "aws_vpc_security_group" {
  value       = module.networking.ecs_tasks_security_group_id
  description = "-> GitHub variable AWS_VPC_SECURITY_GROUP"
}

output "aws_s3_bucket" {
  value       = module.web_hosting.bucket_name
  description = "-> GitHub variable AWS_S3_BUCKET"
}

output "aws_cloudfront_distribution_id" {
  value       = module.web_hosting.distribution_id
  description = "-> GitHub variable AWS_CLOUDFRONT_DISTRIBUTION_ID"
}

output "web_url" {
  value = "https://${module.web_hosting.distribution_domain_name}"
}

output "secrets_manager_arn" {
  value       = module.rds.app_secret_arn
  description = "-> replaces every REPLACE_WITH_PRODUCTION_SECRETS_MANAGER_ARN in .aws/task-definition.*.production.json"
}

output "ecs_task_execution_role_arn" {
  value       = module.ecs_cluster.task_execution_role_arn
  description = "-> replaces REPLACE_WITH_ECS_TASK_EXECUTION_ROLE_ARN in .aws/task-definition.*.production.json"
}

output "ecs_task_role_arn" {
  value       = module.ecs_cluster.task_role_arn
  description = "-> replaces REPLACE_WITH_ECS_TASK_ROLE_ARN in .aws/task-definition.*.production.json"
}
