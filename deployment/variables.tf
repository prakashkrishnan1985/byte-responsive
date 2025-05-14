variable "bucket_name" {
  default = "byte-sized-eoi-ui"
  type    = string
}

variable "cloudfront_price_class" {
  description = "The price class for the CloudFront distribution"
  type        = string
  default     = "PriceClass_All"
}

variable "cloudfront_default_root_object" {
  description = "The default root object for the CloudFront distribution"
  type        = string
  default     = "index.html"
}

variable "hosted_zone_name" {
  default   = "bytesized.com.au"
  description = "Route 53 Hosted Zone Name for the domain"
  type        = string
}

variable "hosted_zone_id" {
  default   = "Z09615531S1FJYBDVQQ1F"
  description = "Route 53 Hosted Zone ID for the domain"
  type        = string
}

variable "web_application_endpoint" {
  description = "Route for the hosted web application"
  type        = string
}

variable "environment" {
  type        = string
}