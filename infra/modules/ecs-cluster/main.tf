resource "aws_ecs_cluster" "main" {
  name = "${var.name_prefix}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Stage = var.stage
  }
}

# Execution role: used by the ECS AGENT (not the app) to pull the image from
# ECR and write logs to CloudWatch. Shared by API, worker, and migrate task
# definitions -- see .aws/task-definition.*.json's `executionRoleArn`.
data "aws_iam_policy_document" "ecs_task_execution_trust" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "task_execution" {
  name               = "${var.name_prefix}-ecs-execution"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_execution_trust.json
}

resource "aws_iam_role_policy_attachment" "task_execution_managed" {
  role       = aws_iam_role.task_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# The managed policy above covers ECR pull + basic CloudWatch Logs, but NOT
# reading the Secrets Manager secret the task definitions' `secrets[]` field
# references -- that needs an explicit grant, scoped to just this stage's
# app secret (not every secret in the account).
data "aws_iam_policy_document" "read_app_secret" {
  statement {
    actions   = ["secretsmanager:GetSecretValue"]
    resources = [var.app_secret_arn]
  }
}

resource "aws_iam_role_policy" "task_execution_secrets" {
  name   = "${var.name_prefix}-ecs-execution-secrets"
  role   = aws_iam_role.task_execution.id
  policy = data.aws_iam_policy_document.read_app_secret.json
}

# Task role: used by the APPLICATION itself (NestJS API/worker/migrate code)
# for any AWS API calls it makes directly -- S3, SES, etc. Empty today
# (no such calls exist in apps/backend yet); attach policies to this role,
# not the execution role above, as that need arises. See
# .aws/task-definition.*.json's `taskRoleArn`.
data "aws_iam_policy_document" "ecs_task_trust" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "task" {
  name               = "${var.name_prefix}-ecs-task"
  assume_role_policy = data.aws_iam_policy_document.ecs_task_trust.json
}
