# GitHub Actions OIDC -> IAM role assumption for one stage. Every
# `Configure AWS credentials (OIDC)` step across the four GitHub Actions
# workflows (web-staging, web-production, backend-staging,
# backend-production) assumes the role this module creates for its stage.
#
# The OIDC PROVIDER itself (aws_iam_openid_connect_provider) is account-wide,
# not per-stage -- it's created ONCE by whichever environment applies first
# (see environments/staging/main.tf and environments/production/main.tf,
# which both reference it via a shared boolean toggle). Creating it twice
# fails: AWS only allows one OIDC provider per issuer URL per account.

data "tls_certificate" "github" {
  count = var.create_oidc_provider ? 1 : 0
  url   = "https://token.actions.githubusercontent.com"
}

resource "aws_iam_openid_connect_provider" "github" {
  count = var.create_oidc_provider ? 1 : 0

  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.github[0].certificates[0].sha1_fingerprint]
}

data "aws_iam_openid_connect_provider" "github" {
  count = var.create_oidc_provider ? 0 : 1
  url   = "https://token.actions.githubusercontent.com"
}

locals {
  oidc_provider_arn = var.create_oidc_provider ? aws_iam_openid_connect_provider.github[0].arn : data.aws_iam_openid_connect_provider.github[0].arn
}

# Deploy role: assumed by the `push-image`, `migrate`, and `deploy` jobs.
# Trust is scoped to THIS repo AND THIS branch -- a workflow run on any
# other branch (or a fork's PR) cannot assume it. staging and production use
# SEPARATE roles (separate module calls with different `branch` values), so
# a staging deploy can never hold production's permissions.
data "aws_iam_policy_document" "deploy_trust" {
  statement {
    effect  = "Allow"
    actions = ["sts:AssumeRoleWithWebIdentity"]

    principals {
      type        = "Federated"
      identifiers = [local.oidc_provider_arn]
    }

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_org}/${var.github_repo}:ref:refs/heads/${var.branch}"]
    }
  }
}

resource "aws_iam_role" "deploy" {
  name               = "${var.name_prefix}-gha-deploy"
  assume_role_policy = data.aws_iam_policy_document.deploy_trust.json
}

# Permissions kept broad-but-scoped-to-stage-resources here as boilerplate;
# tighten to specific ARNs (this stage's ECR repo, this stage's ECS
# cluster/services, this stage's S3 bucket/CloudFront distribution) once
# those resource ARNs exist -- see environments/{stage}/main.tf, which wires
# this module's `deploy_role_arn` output into every other module.
data "aws_iam_policy_document" "deploy_permissions" {
  statement {
    sid = "ECR"
    actions = [
      "ecr:GetAuthorizationToken",
      "ecr:BatchCheckLayerAvailability",
      "ecr:GetDownloadUrlForLayer",
      "ecr:BatchGetImage",
      "ecr:PutImage",
      "ecr:InitiateLayerUpload",
      "ecr:UploadLayerPart",
      "ecr:CompleteLayerUpload",
    ]
    resources = ["*"]
  }

  statement {
    sid = "ECS"
    actions = [
      "ecs:RegisterTaskDefinition",
      "ecs:DescribeTaskDefinition",
      "ecs:DescribeTasks",
      "ecs:RunTask",
      "ecs:UpdateService",
      "ecs:DescribeServices",
    ]
    resources = ["*"]
  }

  # Required by ECS to launch a task using the execution/task roles those
  # task definitions reference -- ecs-tasks.amazonaws.com must be allowed
  # to pass them, otherwise RunTask/UpdateService fail with
  # AccessDeniedException even though the caller (this role) has ecs:*.
  statement {
    sid       = "PassRoleToECS"
    actions   = ["iam:PassRole"]
    resources = ["*"]

    condition {
      test     = "StringEquals"
      variable = "iam:PassedToService"
      values   = ["ecs-tasks.amazonaws.com"]
    }
  }

  statement {
    sid = "S3Deploy"
    actions = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:DeleteObject",
      "s3:ListBucket",
    ]
    resources = ["*"]
  }

  statement {
    sid       = "CloudFrontInvalidation"
    actions   = ["cloudfront:CreateInvalidation"]
    resources = ["*"]
  }
}

resource "aws_iam_role_policy" "deploy" {
  name   = "${var.name_prefix}-gha-deploy-policy"
  role   = aws_iam_role.deploy.id
  policy = data.aws_iam_policy_document.deploy_permissions.json
}
