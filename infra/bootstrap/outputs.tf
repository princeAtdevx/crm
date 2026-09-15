output "state_bucket_name" {
  value       = aws_s3_bucket.terraform_state.id
  description = "Pass this into every environment root's backend config (backend.tfvars)."
}

output "lock_table_name" {
  value       = aws_dynamodb_table.terraform_lock.name
  description = "Pass this into every environment root's backend config (backend.tfvars)."
}
