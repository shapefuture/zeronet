from fastapi import FastAPI
from models.snapshot_request import SnapshotRequest
from models.snapshot_response import SnapshotResponse
from prune_dom import prune_dom

app = FastAPI()

@app.get("/")
def read_root():
    return {"msg": "Ultra-Low Latency Render API"}

@app.post("/render_snapshot", response_model=SnapshotResponse)
def render_snapshot(req: SnapshotRequest):
    html_snapshot = f"<html><body><h1>Snapshot of {req.url}</h1></body></html>"
    pruned = prune_dom(html_snapshot)
    return SnapshotResponse(html=pruned)