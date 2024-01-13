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
        "Resource": "${aws_rds_cluster.postgresql-cluster.arn}"
      },
      {
        "Effect": "Allow",
        "Action": "rds:ListTagsForResource",
        "Resource": "${aws_rds_cluster.postgresql-cluster.arn}"
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
        "Resource": aws_rds_cluster.postgresql-cluster.master_user_secret[0].secret_arn
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
        "Resource": aws_rds_cluster.postgresql-cluster.master_user_secret[0].kms_key_id
      }
    ]
  })
}

output "rds_iam_policy_arn" {
  value = aws_iam_policy.rds_iam_policy.arn
}

output "secretmanager_iam_policy_arn" {
  value = aws_iam_policy.secretmanager_iam_policy.arn
}

output "kms_iam_policy_arn" {
  value = aws_iam_policy.kms_iam_policy.arn
}

resource "aws_db_cluster_snapshot" "postgresql-cluster" {
  cluster_identifier      = "postgres-cluster-${terraform.workspace}"
  engine                  = "postgres"
  engine_mode = "provisioned"
  enable_http_endpoint = true
  engine_version = "15.3"
  database_name           = "postgres"
  master_username         = "master"
  manage_master_user_password= true
#  master_user_secret_kms_key_id=aws_secretsmanager_secret.example.kms_key_id
  backup_retention_period = 5
  preferred_backup_window = "07:00-09:00"
  skip_final_snapshot = true
  iam_database_authentication_enabled = true

#  db_cluster_instance_class = aws_rds_cluster_in
  lifecycle {
    ignore_changes = [engine_version,availability_zones]
  }

  serverlessv2_scaling_configuration {
    max_capacity = 1.0
    min_capacity = 0.5
  }
  db_cluster_identifier          = ""
  db_cluster_snapshot_identifier = ""
}

resource "aws_db_instance" "postgres-instance" {
  count = 1
  cluster_identifier = aws_rds_cluster.postgresql-cluster.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.postgresql-cluster.engine
  engine_version     = aws_rds_cluster.postgresql-cluster.engine_version

  lifecycle {
    ignore_changes = [engine_version,availability_zone]
  }
}

output "aws_rds_cluster_data" {
  value = aws_rds_cluster.postgresql-cluster
}
