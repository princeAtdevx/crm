output "app_secret_arn" {
  value       = aws_secretsmanager_secret.app.arn
  description = "Feeds every REPLACE_WITH_{STAGING,PRODUCTION}_SECRETS_MANAGER_ARN placeholder in .aws/task-definition.*.json for this stage."
}

output "endpoint" {
  value       = aws_db_instance.main.address
  description = "For reference/debugging only -- application code reads the full connection string from Secrets Manager, never this directly."
}
