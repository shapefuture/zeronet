from fastapi.testclient import TestClient
from main import app
import flatbuffers
from UISnapshot import DOMSnapshot

client = TestClient(app)

def test_render_snapshot_success():
    response = client.post("/render_snapshot", json={"url": "https://example.com"})
    assert response.status_code == 200
    assert response.headers["Content-Type"] == "application/octet-stream"
    data = response.content
    assert len(data) > 0

def test_render_snapshot_error(monkeypatch):
    def fail(*args, **kwargs):
        raise Exception("fail")
    monkeypatch.setattr("main.serialize_dom_snapshot", fail)
    response = client.post("/render_snapshot", json={"url": "bad"})
    assert response.status_code == 400
    assert b"fail" in response.content
