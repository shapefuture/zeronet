from fastapi.testclient import TestClient
from main import app
import logging

client = TestClient(app)
logger = logging.getLogger("test.render-api")

def test_render_snapshot_success():
    logger.debug("Testing valid render_snapshot")
    response = client.post("/render_snapshot", json={"url": "https://example.com"})
    assert response.status_code == 200
    assert response.headers["Content-Type"] == "application/octet-stream"
    data = response.content
    assert len(data) > 0

def test_render_snapshot_error(monkeypatch):
    logger.debug("Testing error case in render_snapshot")
    def fail(*args, **kwargs):
        raise Exception("fail")
    monkeypatch.setattr("main.serialize_dom_snapshot", fail)
    response = client.post("/render_snapshot", json={"url": "bad"})
    assert response.status_code == 400
    assert b"fail" in response.content
