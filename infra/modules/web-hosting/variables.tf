variable "name_prefix" {
  type = string
}

variable "stage" {
  type = string
}

variable "bucket_name" {
  description = "Globally unique S3 bucket name. REPLACE_WITH_UNIQUE_NAME before applying."
  type        = string
}

variable "price_class" {
  description = "PriceClass_100 (NA/EU only) is cheapest and matches a primarily India-based user base being served from the origin region anyway; widen if global edge latency becomes a concern."
  type        = string
  default     = "PriceClass_100"
}
