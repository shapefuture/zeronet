from fastapi.testclient import TestClient
from main import app
import flatbuffers
from UISnapshot import DOMSnapshot

client = TestClient(app)

def test_render_snapshot():
    response = client.post("/render_snapshot", json={"url": "https://example.com"})
    assert response.status_code == 200
    assert response.headers["Content-Type"] == "application/octet-stream"
    data = response.content
    bb = flatbuffers.Builder(0)
    bb.Bytes = bytearray(data)
    snap = DOMSnapshot.DOMSnapshot.GetRootAsDOMSnapshot(bb.Bytes, 0)
    html = snap.Html()
    assert b"Snapshot" in html