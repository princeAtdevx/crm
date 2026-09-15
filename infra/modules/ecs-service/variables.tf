variable "name_prefix" {
  type = string
}

variable "stage" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "service_name" {
  description = "\"api\" or \"worker\" -- matches the container name used in .aws/task-definition.{api,worker}.{stage}.json."
  type        = string
}

variable "cluster_arn" {
  type = string
}

variable "task_execution_role_arn" {
  type = string
}

variable "task_role_arn" {
  type = string
}

variable "private_subnet_ids" {
  type = list(string)
}

variable "ecs_tasks_security_group_id" {
  type = string
}

variable "desired_count" {
  description = "1 for staging (see .github/workflows/backend-staging.yml's setup checklist); size up for production once real traffic is known."
  type        = number
  default     = 1
}

variable "cpu" {
  type    = string
  default = "256"
}

variable "memory" {
  type    = string
  default = "512"
}

variable "log_retention_days" {
  type    = number
  default = 30
}
