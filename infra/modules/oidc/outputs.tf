output "deploy_role_arn" {
  value       = aws_iam_role.deploy.arn
  description = "Feeds the AWS_DEPLOY_ROLE_ARN secret on this stage's GitHub Environment."
}
