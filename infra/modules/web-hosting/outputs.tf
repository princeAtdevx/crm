output "bucket_name" {
  value       = aws_s3_bucket.web.id
  description = "Feeds AWS_S3_BUCKET in GitHub Environment variables."
}

output "distribution_id" {
  value       = aws_cloudfront_distribution.web.id
  description = "Feeds AWS_CLOUDFRONT_DISTRIBUTION_ID in GitHub Environment variables."
}

output "distribution_domain_name" {
  value = aws_cloudfront_distribution.web.domain_name
}
