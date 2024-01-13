variable "provider_region" {
  type        = string
  description = "The AWS region."
  default     = "eu-central-1"
}

variable "memory_size" {
  type        = number
  description = "The amount of memory in MB your Lambda Function can use at runtime."
  default     = 512
}

variable "lambda_payload_filename" {
  type        = string
  description = "The filename of the lambda payload."
}
