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

resource "aws_iam_policy" "rds_iam_policy" {
  # defines an IAM policy that allows Lambda to interact with rds
  name = "property_hub-rds-${terraform.workspace}"
  policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "rds-data:BeginTransaction",
          "rds-data:ExecuteStatement",
          "rds-data:CommitTransaction",
          "rds-data:RollbackTransaction"
        ],
        "Resource": "${aws_rds_cluster.postgresql.arn}"
      },
      {
        "Effect": "Allow",
        "Action": "rds:ListTagsForResource",
        "Resource": "${aws_rds_cluster.postgresql.arn}"
      }
    ]
  }
  )
}

resource "aws_iam_policy" "secretmanager_iam_policy" {
  # defines an IAM policy that allows Lambda to interact with rds
  name = "property_hub-secretmanager-${terraform.workspace}"
  policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": "secretsmanager:GetSecretValue",
        "Resource": aws_rds_cluster.postgresql.master_user_secret[0].secret_arn
      }
    ]
  }

  )
}

resource "aws_iam_policy" "kms_iam_policy" {
  # defines an IAM policy that allows Lambda to interact with rds
  name = "property_hub-rds-kms-${terraform.workspace}"
  policy = jsonencode({
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Action": [
          "kms:Decrypt",
          "kms:Encrypt"
        ],
        "Resource": aws_rds_cluster.postgresql.master_user_secret[0].kms_key_id
      }
    ]
  })
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
  aws_rds_policy_arn                =aws_iam_policy.rds_iam_policy.arn
  aws_secretmanager_policy_arn      =aws_iam_policy.secretmanager_iam_policy.arn
  aws_kms_policy_arn                =aws_iam_policy.kms_iam_policy.arn

  aurora_resource_arn               = aws_rds_cluster.postgresql.arn
  aurora_secret_manager_arn         = aws_rds_cluster.postgresql.master_user_secret[0].secret_arn
  aurora_database_name              = aws_rds_cluster.postgresql.database_name
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
