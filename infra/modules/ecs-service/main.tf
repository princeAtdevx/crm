# One ECS service (API or worker -- called twice per stage, see
# environments/{stage}/main.tf). Creates the SERVICE and its CloudWatch log
# group only; the TASK DEFINITION is intentionally NOT managed here.
#
# Task definitions are owned by .aws/task-definition.{api,worker}.{stage}.json
# in this repo and registered by GitHub Actions' render + deploy-task-definition
# steps on every push (see .github/workflows/backend-{stage}.yml) -- that is
# what makes a new image tag actually reach the running service. If Terraform
# also tried to own the task definition, every `terraform apply` would fight
# the CI pipeline over which one is authoritative. So this resource is
# created with a PLACEHOLDER task definition (nginx) purely to satisfy ECS's
# requirement that a service reference some task definition at creation
# time; the very first GitHub Actions deploy immediately replaces it with
# the real one, and `lifecycle.ignore_changes` stops Terraform from ever
# trying to revert that.

resource "aws_cloudwatch_log_group" "service" {
  name              = "/ecs/${var.name_prefix}-${var.service_name}"
  retention_in_days = var.log_retention_days
}

resource "aws_ecs_task_definition" "placeholder" {
  family                   = "${var.name_prefix}-${var.service_name}"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.cpu
  memory                   = var.memory
  execution_role_arn       = var.task_execution_role_arn
  task_role_arn            = var.task_role_arn

  container_definitions = jsonencode([
    {
      name      = var.service_name
      image     = "public.ecr.aws/nginx/nginx:latest"
      essential = true
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.service.name
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = var.service_name
        }
      }
    }
  ])

  lifecycle {
    ignore_changes = [container_definitions, cpu, memory]
  }
}

resource "aws_ecs_service" "main" {
  name            = "${var.name_prefix}-${var.service_name}"
  cluster         = var.cluster_arn
  task_definition = aws_ecs_task_definition.placeholder.arn
  desired_count   = var.desired_count
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.private_subnet_ids
    security_groups  = [var.ecs_tasks_security_group_id]
    assign_public_ip = false
  }

  # GitHub Actions' amazon-ecs-deploy-task-definition action registers new
  # revisions and updates `task_definition` directly on this service outside
  # Terraform -- without ignore_changes, the next `terraform apply` would
  # stomp that back to the placeholder above and undeploy whatever's live.
  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }

  tags = {
    Stage = var.stage
  }
}
