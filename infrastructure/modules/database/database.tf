resource "aws_security_group" "postgres_security_group" {
  name        = "postgres-security-group-${terraform.workspace}"
  description = "Security group for Postgres database"

  ingress {
    protocol    = "tcp"
    from_port   = 5432
    to_port     = 5432
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    protocol    = -1
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_db_instance" "postgres_instance" {
  allocated_storage    = 5
  storage_type         = "standard"
  instance_class       = "db.t3.micro"
  identifier           = "db-${terraform.workspace}"
  engine               = "postgres"
  engine_version       = "15.5"
  parameter_group_name = "default.postgres15"

  db_name  = "postgres"
  username = "postgres"
  password = "postgres"

  vpc_security_group_ids = [aws_security_group.postgres_security_group.id]
  publicly_accessible    = true # Only for testing!
  skip_final_snapshot    = true

}

output "db_instance" {
  value = aws_db_instance.postgres_instance
}
