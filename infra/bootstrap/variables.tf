variable "aws_region" {
  description = "AWS region for the state bucket and lock table."
  type        = string
  default     = "ap-south-1" # Mumbai, per the SoW's India data-residency requirement.
}

variable "state_bucket_name" {
  description = "Globally unique S3 bucket name for Terraform remote state. S3 bucket names are global across ALL AWS accounts, not just yours -- REPLACE_WITH_UNIQUE_NAME before applying."
  type        = string
  default     = "REPLACE_WITH_UNIQUE_NAME-crm-terraform-state"
}

variable "lock_table_name" {
  description = "DynamoDB table name for Terraform state locking."
  type        = string
  default     = "crm-terraform-locks"
}
