from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_render_snapshot():
    response = client.post("/render_snapshot", json={"url": "https://example.com"})
    assert response.status_code == 200
    d = response.json()
    assert "html" in d
    assert d["status"] == "success"