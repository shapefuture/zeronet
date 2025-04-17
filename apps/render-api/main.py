from fastapi import FastAPI, Response
from models.snapshot_request import SnapshotRequest
from models.snapshot_response import SnapshotResponse
from prune_dom import prune_dom
from serialize_snapshot import serialize_dom_snapshot

app = FastAPI()

@app.get("/")
def read_root():
    return {"msg": "Ultra-Low Latency Render API"}

@app.post("/render_snapshot")
def render_snapshot(req: SnapshotRequest):
    html_snapshot = f"<html><body><h1>Snapshot of {req.url}</h1></body></html>"
    pruned = prune_dom(html_snapshot)
    fbs_bytes = serialize_dom_snapshot({"url": req.url, "html": pruned, "metadata": "{}"})
    return Response(
        content=fbs_bytes,
        media_type="application/octet-stream",
        headers={"X-Snapshot-Encoding": "flatbuffers"}
    )