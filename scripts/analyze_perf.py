import requests
import json
import os

def fetch_rum_data():
    # In practice, query hosted RUM backend; here, simulate with open file/endpoint:
    try:
        return requests.get(os.environ.get("RUM_ENDPOINT", "")).json()
    except Exception:
        return {"slowest_routes": ["/about"], "high_inp_pages": ["/"], "recent_regressions": ["/home"]}

def ask_llm_for_suggestions(data):
    resp = requests.post(os.environ.get("LLM_API", ""), json={
        "prompt": f"Analyze data: {json.dumps(data)}. Give 2 suggestions: JSON array."
    })
    try:
        arr = resp.json()
        return arr if isinstance(arr, list) else []
    except:
        return []

def create_github_issue(suggestion):
    response = requests.post(
      "https://api.github.com/repos/myorg/myrepo/issues",
      headers={
        "Authorization": f"token {os.environ['GITHUB_TOKEN']}",
        "Accept": "application/vnd.github.v3+json",
      },
      json={
        "title": f"Perf Bottleneck: {suggestion.get('component', 'unknown')}",
        "body": suggestion.get("suggestion", ""),
        "labels": ["performance", "ai-suggestion"]
      }
    )
    assert response.status_code in (200, 201), "GitHub issue creation failed: " + str(response.text)

data = fetch_rum_data()
suggestions = ask_llm_for_suggestions(data)
for sug in suggestions:
    create_github_issue(sug)