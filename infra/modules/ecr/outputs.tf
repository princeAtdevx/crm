output "repository_url" {
  value       = aws_ecr_repository.backend.repository_url
  description = "Feeds AWS_ECR_REPOSITORY in GitHub Environment variables (the part after the registry host, e.g. \"crm-staging-backend\")."
}

output "repository_name" {
  value = aws_ecr_repository.backend.name
}
