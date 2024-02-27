# defines an IAM role that allows Lambda to access resources in the AWS account. We need one role for each lambda function.
resource "aws_iam_role" "property_hub_backend_iam_role" {
  name = "property_hub-role-${var.key}-${terraform.workspace}"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# attaches the IAM policy to the IAM role.
resource "aws_iam_role_policy_attachment" "property_hub_backend_iam_role_policy_attachment" {
  policy_arn = var.aws_iam_policy_arn
  role       = aws_iam_role.property_hub_backend_iam_role.name
}


# defines a Lambda function that uses the Java runtime and points to our handler.
resource "aws_lambda_function" "property_hub_backend_lambda" {
  function_name    = var.function_name
  filename         = var.lambda_payload_filename
  source_code_hash = filebase64sha256(var.lambda_payload_filename)
  handler          = var.handler
  role             = aws_iam_role.property_hub_backend_iam_role.arn
  runtime          = "nodejs18.x"
  architectures    = ["x86_64"]
  timeout          = 30
  environment { variables = {
    WORKSPACE : terraform.workspace ,
    AWS_DATABASE_NAME: var.db_name,
    AWS_DATABASE_HOST:var.db_host,
    AWS_DATABASE_PORT:var.db_port,
    AWS_DATABASE_USERNAME:var.db_username,
    AWS_DATABASE_PASSWORD:var.db_password,
    AWS_AUTH_USER_POOL:var.user_pool,
    AWS_AUTH_CLIENT_ID:var.client_id,
    AWS_AUTH_AUTHORITY: "https://cognito-idp.${var.aws_region}.amazonaws.com/${var.user_pool}"
  } }

  publish     = true
  memory_size = var.memory_size
}

# defines an alias for the Lambda function. The alias points to the latest version of the function.
resource "aws_lambda_alias" "property_hub_backend_lambda_snap_start_alias" {
  name             = "property_hub-alias-${var.key}-${terraform.workspace}"
  description      = "Alias for '${var.key}' lambda function"
  function_name    = aws_lambda_function.property_hub_backend_lambda.function_name
  function_version = aws_lambda_function.property_hub_backend_lambda.version
}

# configures the API Gateway to use the Lambda functions.
resource "aws_apigatewayv2_integration" "property_hub_backend_api_gateway_integration" {
  api_id = var.aws_apigatewayv2_api_id

  integration_uri        = aws_lambda_alias.property_hub_backend_lambda_snap_start_alias.invoke_arn
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  payload_format_version = "2.0"
}

# defines a permission that allows API Gateway to invoke the Lambda function.
resource "aws_lambda_permission" "property_hub_backend_api_gateway_permission" {

  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.property_hub_backend_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  qualifier     = aws_lambda_alias.property_hub_backend_lambda_snap_start_alias.name
  source_arn    = "${var.aws_apigatewayv2_api_execution_arn}/*/*"
}

# Maps an HTTP request to a target, in this case the Lambda function. The route_key matches any GET request matching the path given path.
resource "aws_apigatewayv2_route" "property_hub_backend_route" {
  api_id = var.aws_apigatewayv2_api_id

  route_key = var.route_key
  target    = "integrations/${aws_apigatewayv2_integration.property_hub_backend_api_gateway_integration.id}"
}
