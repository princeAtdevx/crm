output "vpc_id" {
  value = aws_vpc.main.id
}

output "private_subnet_ids" {
  value       = aws_subnet.private[*].id
  description = "Where ECS tasks and RDS live. Feeds AWS_VPC_SUBNETS in GitHub Environment variables."
}

output "public_subnet_ids" {
  value = aws_subnet.public[*].id
}

output "ecs_tasks_security_group_id" {
  value       = aws_security_group.ecs_tasks.id
  description = "Feeds AWS_VPC_SECURITY_GROUP in GitHub Environment variables."
}

output "rds_security_group_id" {
  value = aws_security_group.rds.id
}
