# Cloudflare CDN + TLS + Tiered Edge Caching

provider "cloudflare" {
  # auth from env
}

resource "cloudflare_zone_settings_override" "ultra_edge_settings" {
  zone_id     = var.cloudflare_zone_id
  settings {
    http3               = "on"
    tls_1_3             = "on"
    tiered_caching      = "on"
    # zero_rtt      = "off"
  }
}

resource "cloudflare_page_rule" "api_caching" {
  zone_id = var.cloudflare_zone_id
  target  = "*/api/*"
  actions {
    cache_level = "cache_everything"
    edge_cache_ttl = 60
    origin_cache_control = "on"
  }
}

output "cdn_http3" {
  value = cloudflare_zone_settings_override.ultra_edge_settings.settings.http3
}