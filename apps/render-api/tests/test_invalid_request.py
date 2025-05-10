from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_invalid_request_data():
    # Send a request missing url property
    response = client.post("/render_snapshot", json={})
    assert response.status_code == 422 or response.status_code == 400
