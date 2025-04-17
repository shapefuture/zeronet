# Cloudflare CDN + TLS config for ultra-low-latency delivery

provider "cloudflare" {
  # authentication automatically sourced from environment vars
}

resource "cloudflare_zone_settings_override" "ultra_edge_settings" {
  zone_id     = var.cloudflare_zone_id
  settings {
    http3               = "on"
    tls_1_3             = "on"
    # 0-RTT optionally enabled; flagged as risky
    # zero_rtt     = "on"
  }
}

output "cdn_http3" {
  value = cloudflare_zone_settings_override.ultra_edge_settings.settings.http3
}