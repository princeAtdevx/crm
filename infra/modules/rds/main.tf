# RDS Postgres for one stage, with credentials managed natively by Secrets
# Manager (manage_master_user_password = true) rather than a Terraform
# variable -- the master password is never in a .tf file, a plan, or state
# in plaintext. The DATABASE_URL string the app actually needs (with the
# password interpolated) is assembled into a SEPARATE Secrets Manager secret
# below, since ECS's `secrets` task-definition field expects one whole
# connection string under one key, not RDS's own split username/password
# secret shape.

resource "aws_db_subnet_group" "main" {
  name       = "${var.name_prefix}-db-subnets"
  subnet_ids = var.private_subnet_ids

  tags = {
    Stage = var.stage
  }
}

resource "aws_db_instance" "main" {
  identifier     = "${var.name_prefix}-db"
  engine         = "postgres"
  engine_version = "18"

  instance_class    = var.instance_class
  allocated_storage = var.allocated_storage_gb
  storage_type      = "gp3"
  storage_encrypted = true

  db_name  = "crm"
  username = "crm_app"

  manage_master_user_password = true

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [var.rds_security_group_id]
  publicly_accessible    = false
  multi_az               = var.multi_az

  backup_retention_period = var.backup_retention_days
  skip_final_snapshot     = var.stage == "staging" # staging data is disposable; production takes a final snapshot on destroy
  deletion_protection     = var.stage == "production"

  tags = {
    Stage = var.stage
  }
}

# The connection-string secret the ECS task definitions actually reference
# (.aws/task-definition.{api,worker,migrate}.{stage}.json's
# `secrets[].valueFrom`). Built from RDS's own managed-password secret via a
# data source below, so the master password never passes through a Terraform
# variable or a `resource` block's plaintext arguments.
data "aws_secretsmanager_secret_version" "rds_master" {
  secret_id = aws_db_instance.main.master_user_secret[0].secret_arn
}

locals {
  rds_password = jsondecode(data.aws_secretsmanager_secret_version.rds_master.secret_string)["password"]
  database_url = "postgresql://${aws_db_instance.main.username}:${local.rds_password}@${aws_db_instance.main.address}:${aws_db_instance.main.port}/${aws_db_instance.main.db_name}"
}

resource "aws_secretsmanager_secret" "app" {
  name = "${var.name_prefix}/backend"

  tags = {
    Stage = var.stage
  }
}

resource "aws_secretsmanager_secret_version" "app" {
  secret_id = aws_secretsmanager_secret.app.id

  # One key, DATABASE_URL, matching every task definition's
  # `secrets[].valueFrom` suffix (":DATABASE_URL::"). Additional backend
  # secrets (JWT_SECRET, REDIS_URL once a worker exists, etc.) get added as
  # more keys in this same JSON -- see the ADD-A-SECRET note in this
  # module's README-equivalent (environments/{stage}/main.tf comment).
  secret_string = jsonencode({
    DATABASE_URL = local.database_url
  })
}
