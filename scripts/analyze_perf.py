import requests
import json

def fetch_rum_data():
    # Simulated - in practice, query real RUM/CI backend
    return {"slowest_routes": ["/about"], "high_inp_pages": ["/"], "recent_regressions": ["/home"]}

def ask_llm_for_suggestions(data):
    # Use openrouter or local endpoint (simulate for now)
    # Real: requests.post(LLM_API, json={"prompt": ...})
    return [
        {"component": "/about", "suggestion": "Optimize API call parallelism."},
        {"component": "/", "suggestion": "Reduce JS payload size."}
    ]

def create_github_issue(suggestions):
    for sug in suggestions:
        requests.post(
            "https://api.github.com/repos/myorg/myrepo/issues",
            headers={"Authorization": f"token YOUR_GITHUB_TOKEN"},
            json={"title": f"Perf Bottleneck: {sug['component']}",
                  "body": sug["suggestion"],
                  "labels": ["performance","ai-suggestion"]}
        )

data = fetch_rum_data()
suggestions = ask_llm_for_suggestions(data)
create_github_issue(suggestions)