#resource "aws_kms_key" "rds_secret_key" {
#  description = "Example KMS Key"
#}
#
#resource "aws_secretsmanager_secret" "example" {
#  name = "example"
#  kms_key_id = aws_kms_key.rds_secret_key.key_id
#
#}
resource "aws_rds_cluster" "postgresql" {
  cluster_identifier      = "aurora-cluster-${terraform.workspace}"
  engine                  = "aurora-postgresql"
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
}

resource "aws_rds_cluster_instance" "aurora-instance" {
  count = 1
  cluster_identifier = aws_rds_cluster.postgresql.id
  instance_class     = "db.serverless"
  engine             = aws_rds_cluster.postgresql.engine
  engine_version     = aws_rds_cluster.postgresql.engine_version

  lifecycle {
    ignore_changes = [engine_version,availability_zone]
  }
}
