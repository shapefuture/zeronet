resource "cloudflare_worker_script" "aggregateUserData" {
  name = "aggregateUserData"
  content = file("edge/aggregateUserData.js")
}

resource "cloudflare_worker_route" "aggregateUserDataRoute" {
  pattern = "/edge/aggregateUserData"
  script_name = cloudflare_worker_script.aggregateUserData.name
}