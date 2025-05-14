
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.74.0"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "ap-southeast-2"
}

provider "aws" {
  alias   = "acm_certs"
  region  = "us-east-1"
}

# Create s3 bucket using s3-bucket module 
module "s3_bucket" {
  source = "terraform-aws-modules/s3-bucket/aws"

  bucket = "${var.bucket_name}-${var.environment}"

  versioning = {
    enabled = false
  }

  control_object_ownership = true
  object_ownership         = "BucketOwnerPreferred"

  # allow cloudfront access to the bucket
  attach_policy = true
  policy        = data.aws_iam_policy_document.s3_bucket_policy.json

  website = {
    index_document = "index.html"
    error_document = "index.html"
  }
}

# Policy to be attached to the S3 bucket to allow CloudFront access
data "aws_iam_policy_document" "s3_bucket_policy" {
  statement {
    actions   = ["s3:GetObject"]
    resources = ["${module.s3_bucket.s3_bucket_arn}/*"]
    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [module.cloudfront.cloudfront_distribution_arn]
    }
  }
}


data "aws_acm_certificate" "issued_cert" {
  provider    = aws.acm_certs
  domain      = "*.${var.hosted_zone_name}"
  types       = ["AMAZON_ISSUED"]
  most_recent = true
  statuses    = ["ISSUED"]
}


module "cloudfront" {

  source  = "terraform-aws-modules/cloudfront/aws"
  origin = {
    s3 = {
      domain_name             = module.s3_bucket.s3_bucket_bucket_regional_domain_name
      origin_id               = "${var.bucket_name}-${var.environment}"
      origin_access_control   = "s3_${var.environment}"
    }

    public_artifacts = {
      domain_name             = module.s3_bucket.s3_bucket_bucket_domain_name
      origin_id               = module.s3_bucket.s3_bucket_bucket_domain_name
      origin_access_control   = "s3_${var.environment}"
      origin_path             = "/public-artifacts/*"
    } 
  }

  enabled                      = true
  is_ipv6_enabled              = true
  comment                      = "CloudFront Distribution pointing to ${var.bucket_name}-${var.environment}"
  default_root_object          = var.cloudfront_default_root_object
  create_origin_access_control = true

  origin_access_control = {
    "s3_${var.environment}" = {
      description      = "CloudFront access to byte sized eoi client application"
      origin_type      = "s3"
      signing_behavior = "always"
      signing_protocol = "sigv4"
    }
  }

  default_cache_behavior = {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "${var.bucket_name}-${var.environment}"
    forwarded_values = {
      query_string = false
      cookies = {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  viewer_certificate = {
    acm_certificate_arn         = data.aws_acm_certificate.issued_cert.arn
    ssl_support_method          = "sni-only"
    minimum_protocol_version    = "TLSv1.2_2021"
  }

  # domain integration with cloudfront
  aliases = ["${var.web_application_endpoint}"]

}

# Update Route 53 record to point subdomain to CloudFront with SSL
resource "aws_route53_record" "subdomain_record" {
  zone_id = var.hosted_zone_id
  name    = "${var.web_application_endpoint}"
  type    = "A"

  alias {
    name                   = module.cloudfront.cloudfront_distribution_domain_name 
    zone_id                = module.cloudfront.cloudfront_distribution_hosted_zone_id
    evaluate_target_health = false
  }

}

output "subdomain_url" {
  value       = "https://${var.web_application_endpoint}"
  description = "The URL of the subdomain with SSL certificate in Route 53"
}

# Output the S3 bucket domain name
output "s3_bucket_domain_name" {
  value = module.s3_bucket.s3_bucket_bucket_regional_domain_name
}

# Output the CloudFront domain name
output "cloudfront_domain_name" {
  value = module.cloudfront.cloudfront_distribution_domain_name
}

# Output the CloudFront distribution ID
output "cloudfront_distribution_id" {
  value = module.cloudfront.cloudfront_distribution_id
}


# aws s3 cp build s3://byte-sized-eoi-ui --recursive
# aws cloudfront create-invalidation --distribution-id E1G4MOQ6WNC7H2 --paths '/*'