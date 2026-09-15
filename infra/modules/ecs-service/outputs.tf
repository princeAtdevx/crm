output "service_name" {
  value       = aws_ecs_service.main.name
  description = "Feeds AWS_ECS_API_SERVICE or AWS_ECS_WORKER_SERVICE in GitHub Environment variables, depending on which service_name this module call used."
}
