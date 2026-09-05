# Bootstrap: creates the S3 bucket + DynamoDB table that every other
# infra/ root (environments/staging, environments/production) uses as
# its remote state backend.
#
# This root deliberately uses LOCAL state (no `backend` block below) -- it
# cannot use the S3 backend it's creating, that would be a chicken-and-egg
# problem. Run this once, by hand, before anything else in infra/. Its
# own state file (infra/bootstrap/terraform.tfstate) is small, applied
# rarely, and safe to keep local; back it up somewhere if you're the only
# person who will ever run this root.
#
# Boilerplate only: nothing in infra/ has been applied yet. This is not
# wired to a real AWS account -- running `terraform apply` here is the first
# real step, and it is a REAL, BILLED action once you do. Nothing in this
# repo runs `terraform apply` for you.

terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Versioned so a bad state write can be recovered from a prior version, and
# force_destroy left false on purpose -- deleting this bucket should be a
# deliberate, separate action, never a side effect of `terraform destroy`
# run against the wrong root.
resource "aws_s3_bucket" "terraform_state" {
  bucket = var.state_bucket_name

  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "terraform_state" {
  bucket = aws_s3_bucket.terraform_state.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Lock table. PAY_PER_REQUEST over provisioned capacity -- applies are
# infrequent and bursty, not a steady load worth pre-provisioning for.
resource "aws_dynamodb_table" "terraform_lock" {
  name         = var.lock_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  lifecycle {
    prevent_destroy = true
  }
}
