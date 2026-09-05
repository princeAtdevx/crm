# S3 (private, OAC-only access) + CloudFront for apps/web's static build.
# Matches the deploy target .github/workflows/web-{stage}.yml already
# assumes: `aws s3 sync dist/ s3://<bucket>` + `aws cloudfront
# create-invalidation`.
#
# Custom error responses (403/404 -> /index.html, 200) are the fix for the
# SPA direct-URL problem documented in web-{stage}.yml's deploy job comments
# -- a browser hitting /dashboard directly has no matching S3 object; without
# this, CloudFront would pass that 403/404 straight through instead of
# letting React Router handle the route client-side.

resource "aws_s3_bucket" "web" {
  bucket = var.bucket_name

  tags = {
    Stage = var.stage
  }
}

resource "aws_s3_bucket_public_access_block" "web" {
  bucket = aws_s3_bucket.web.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_cloudfront_origin_access_control" "web" {
  name                              = "${var.name_prefix}-web-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

# Bucket policy grants read access ONLY to this specific CloudFront
# distribution (via the AWS:SourceArn condition), not to CloudFront in
# general and not publicly -- the bucket itself stays fully private.
data "aws_iam_policy_document" "web_bucket" {
  statement {
    sid       = "AllowCloudFrontServicePrincipal"
    actions   = ["s3:GetObject"]
    resources = ["${aws_s3_bucket.web.arn}/*"]

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.web.arn]
    }
  }
}

resource "aws_s3_bucket_policy" "web" {
  bucket = aws_s3_bucket.web.id
  policy = data.aws_iam_policy_document.web_bucket.json
}

resource "aws_cloudfront_distribution" "web" {
  enabled             = true
  default_root_object = "index.html"
  price_class         = var.price_class

  origin {
    domain_name              = aws_s3_bucket.web.bucket_regional_domain_name
    origin_id                = "s3-web"
    origin_access_control_id = aws_cloudfront_origin_access_control.web.id
  }

  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD", "OPTIONS"]
    cached_methods         = ["GET", "HEAD"]
    target_origin_id       = "s3-web"
    viewer_protocol_policy = "redirect-to-https"

    # Managed-CachingOptimized. apps/web/dist's hashed assets already carry
    # their own long Cache-Control from the S3 sync step in
    # web-{stage}.yml, so this only governs CloudFront's own edge cache TTL
    # behavior, not what the browser does with the response.
    cache_policy_id = "658327ea-f89d-4fab-a63d-7e88639e58f6"
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
    # REPLACE with an ACM cert (in us-east-1, CloudFront's requirement)
    # + the block below once a custom domain is attached:
    # acm_certificate_arn = "REPLACE_WITH_ACM_CERT_ARN_US_EAST_1"
    # ssl_support_method  = "sni-only"
  }

  tags = {
    Stage = var.stage
  }
}
