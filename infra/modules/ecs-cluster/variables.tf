variable "name_prefix" {
  type = string
}

variable "stage" {
  type = string
}

variable "app_secret_arn" {
  description = "ARN of the Secrets Manager secret holding DATABASE_URL etc. (rds module's app_secret_arn output)."
  type        = string
}
