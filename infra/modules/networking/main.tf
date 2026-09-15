# VPC + subnets + security groups for one stage. Private subnets host ECS
# tasks and RDS; a NAT gateway gives those private subnets outbound internet
# access (ECR image pulls, etc.) without accepting any inbound traffic.
# Public subnets exist only for the NAT gateway itself and (if used) an ALB.
#
# Sized for "low staging traffic" per prior decisions in this repo's
# GitHub Actions workflows -- 2 AZs, not 3, to keep NAT gateway cost down
# (one NAT gateway per AZ is the standard HA pattern; this uses one NAT
# total, in the first public subnet, which is a single point of failure
# acceptable for staging but worth revisiting for production).

data "aws_availability_zones" "available" {
  state = "available"
}

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name  = "${var.name_prefix}-vpc"
    Stage = var.stage
  }
}

resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name  = "${var.name_prefix}-igw"
    Stage = var.stage
  }
}

resource "aws_subnet" "public" {
  count = length(var.public_subnet_cidrs)

  vpc_id                  = aws_vpc.main.id
  cidr_block              = var.public_subnet_cidrs[count.index]
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true

  tags = {
    Name  = "${var.name_prefix}-public-${count.index}"
    Stage = var.stage
  }
}

resource "aws_subnet" "private" {
  count = length(var.private_subnet_cidrs)

  vpc_id            = aws_vpc.main.id
  cidr_block        = var.private_subnet_cidrs[count.index]
  availability_zone = data.aws_availability_zones.available.names[count.index]

  tags = {
    Name  = "${var.name_prefix}-private-${count.index}"
    Stage = var.stage
  }
}

resource "aws_eip" "nat" {
  domain = "vpc"

  tags = {
    Name  = "${var.name_prefix}-nat-eip"
    Stage = var.stage
  }
}

# Single NAT gateway (not one per AZ) -- see file header. Sits in the first
# public subnet; every private subnet's route table below points at it.
resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id

  tags = {
    Name  = "${var.name_prefix}-nat"
    Stage = var.stage
  }

  depends_on = [aws_internet_gateway.main]
}

resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name  = "${var.name_prefix}-public-rt"
    Stage = var.stage
  }
}

resource "aws_route_table_association" "public" {
  count = length(aws_subnet.public)

  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main.id
  }

  tags = {
    Name  = "${var.name_prefix}-private-rt"
    Stage = var.stage
  }
}

resource "aws_route_table_association" "private" {
  count = length(aws_subnet.private)

  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}

# ECS tasks (API, worker, migrate) -- outbound open (image pulls, Secrets
# Manager, RDS), inbound restricted to what's explicitly needed. No inbound
# rule for the API's own port here; that's added by whatever fronts it
# (ALB security group, if/when one exists) via a separate
# aws_security_group_rule, not baked into this module.
resource "aws_security_group" "ecs_tasks" {
  name_prefix = "${var.name_prefix}-ecs-tasks-"
  description = "ECS tasks (API, worker, migrate) for ${var.stage}"
  vpc_id      = aws_vpc.main.id

  egress {
    description = "All outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name  = "${var.name_prefix}-ecs-tasks-sg"
    Stage = var.stage
  }

  lifecycle {
    create_before_destroy = true
  }
}

# RDS -- inbound 5432 ONLY from the ECS tasks security group. RDS is never
# reachable from the internet, and not even from other security groups in
# this VPC unless explicitly added.
resource "aws_security_group" "rds" {
  name_prefix = "${var.name_prefix}-rds-"
  description = "RDS Postgres for ${var.stage}"
  vpc_id      = aws_vpc.main.id

  ingress {
    description     = "Postgres from ECS tasks"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs_tasks.id]
  }

  egress {
    description = "All outbound"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name  = "${var.name_prefix}-rds-sg"
    Stage = var.stage
  }

  lifecycle {
    create_before_destroy = true
  }
}
