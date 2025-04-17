resource "cloudflare_d1_database" "main" {
  account_id = var.cloudflare_account_id
  name       = "ultra_low_latency_db"
  # Additional config as needed
}

output "database_url" {
  value = cloudflare_d1_database.main.dsn
}