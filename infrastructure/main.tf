resource "aws_iam_policy" "property_hub_backend_iam_policy" {
  # defines an IAM policy that allows Lambda to write logs to CloudWatch Logs.
  name = "property_hub-logs-${terraform.workspace}"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = ["arn:aws:logs:*:*:*"]
      }
    ]
  })
}


module "database" {
  source = "./modules/database"
}

module "lambda" {
  for_each = local.lambdas
  source   = "./modules/lambda"

  key                     = each.key
  function_name           = "property_hub-${each.value.function_name}-${terraform.workspace}"
  handler                 = each.value.handler
  route_key               = each.value.route_key
  lambda_payload_filename = var.lambda_payload_filename
  memory_size             = var.memory_size

  aws_apigatewayv2_api_execution_arn = aws_apigatewayv2_api.property_hub_backend_api_gateway.execution_arn
  aws_apigatewayv2_api_id            = aws_apigatewayv2_api.property_hub_backend_api_gateway.id
  aws_iam_policy_arn                 = aws_iam_policy.property_hub_backend_iam_policy.arn
  aws_rds_policy_arn                = module.database.rds_iam_policy_arn
  aws_secretmanager_policy_arn      = module.database.secretmanager_iam_policy_arn
  aws_kms_policy_arn                = module.database.kms_iam_policy_arn

  aurora_resource_arn               = module.database.aws_rds_cluster_data.arn
  aurora_secret_manager_arn         = module.database.aws_rds_cluster_data.master_user_secret[0].secret_arn
  aurora_database_name              = module.database.aws_rds_cluster_data.database_name
}
#
#data "aws_rds_cluster" "mydbcluster" {
#  cluster_identifier = aws_rds_cluster.postgresql.cluster_identifier
#}
#
#output "cluster_output" {
#  value = data.aws_rds_cluster.mydbcluster.master_user_secret[0].secret_arn
#}


# defines an API Gateway API that routes requests to the Lambda functions.
resource "aws_apigatewayv2_api" "property_hub_backend_api_gateway" {
  name          = "property_hub-api-gateway-${terraform.workspace}"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_headers = ["*"]
    allow_methods = ["*"]
  }
}

resource "aws_apigatewayv2_stage" "stage" {
  # Sets up application stages for the API Gateway - such as "Test", "Staging", and "Production".
  api_id = aws_apigatewayv2_api.property_hub_backend_api_gateway.id

  name        = terraform.workspace
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.property_hub_backend_api_gateway_log_group.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
    }
    )
  }
}

# defines a log group to store access logs for the API Gateway stage.
resource "aws_cloudwatch_log_group" "property_hub_backend_api_gateway_log_group" {
  name              = "/aws/api_gw/${aws_apigatewayv2_api.property_hub_backend_api_gateway.name}"
  retention_in_days = 30
}
