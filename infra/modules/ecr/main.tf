# One ECR repository per stage. The backend workflows push one image here,
# tagged by commit SHA + "latest" (see .github/workflows/backend-*.yml,
# `push-image` job) -- API, worker, and migrate task definitions all
# reference this same image, differing only in `command`.

resource "aws_ecr_repository" "backend" {
  name                 = "${var.name_prefix}-backend"
  image_tag_mutability = "MUTABLE" # "latest" must be re-taggable on every push

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Stage = var.stage
  }
}

# Keeps the repo from growing unbounded -- untagged images (left behind once
# a newer push replaces the "latest" tag pointer) are the ones worth
# pruning; SHA tags stay untouched since they're each a specific deploy's
# audit trail.
resource "aws_ecr_lifecycle_policy" "backend" {
  repository = aws_ecr_repository.backend.name

  policy = jsonencode({
    rules = [
      {
        rulePriority = 1
        description  = "Expire untagged images after 14 days"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = 14
        }
        action = { type = "expire" }
      }
    ]
  })
}
