output "cluster_name" {
  value       = aws_ecs_cluster.main.name
  description = "Feeds AWS_ECS_CLUSTER in GitHub Environment variables."
}

output "cluster_arn" {
  value = aws_ecs_cluster.main.arn
}

output "task_execution_role_arn" {
  value       = aws_iam_role.task_execution.arn
  description = "Feeds executionRoleArn (REPLACE_WITH_ECS_TASK_EXECUTION_ROLE_ARN) in .aws/task-definition.*.json for this stage."
}

output "task_role_arn" {
  value       = aws_iam_role.task.arn
  description = "Feeds taskRoleArn (REPLACE_WITH_ECS_TASK_ROLE_ARN) in .aws/task-definition.*.json for this stage."
}
