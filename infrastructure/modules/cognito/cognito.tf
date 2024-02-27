
resource "aws_cognito_user_pool" "property-hub-be-pool" {
  name = "property-hub-be-pool-${terraform.workspace}"
}

resource "aws_cognito_user_pool_client" "property-hub-be-cognito-client" {
  name = "property-hub-be-client-${terraform.workspace}"

  user_pool_id = aws_cognito_user_pool.property-hub-be-pool.id
}

output "cognito_user_pool" {
  value = aws_cognito_user_pool.property-hub-be-pool.id
}

output "cognito_pool_app_client" {
  value = aws_cognito_user_pool_client.property-hub-be-cognito-client.id
}
