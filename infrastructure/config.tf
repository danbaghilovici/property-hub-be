provider "aws" {
  region = "eu-central-1"
  default_tags {
    tags = {
      Environment = terraform.workspace
      Owner       = "property-hub-be"
    }
  }
}

terraform {
  backend "s3" {
    bucket         = "tf-state-property-hub-be"
    key            = "property-hub-be/terraform.tfstate"
    region         = "eu-central-1"
    dynamodb_table = "tf-state-property-hub-be"
  }

}
