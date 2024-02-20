
resource "aws_cognito_user_pool" "property-hub-pool" {
  name = "property-hub-pool-${terraform.workspace}"
}
