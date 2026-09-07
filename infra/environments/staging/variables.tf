variable "aws_region" {
  type    = string
  default = "ap-south-1"
}

variable "github_org" {
  description = "GitHub org/user that owns the repo."
  type        = string
}

variable "github_repo" {
  type    = string
  default = "origem-crm"
}

variable "web_bucket_name" {
  description = "Globally unique S3 bucket name for the staging web build. REPLACE_WITH_UNIQUE_NAME in terraform.tfvars."
  type        = string
}
