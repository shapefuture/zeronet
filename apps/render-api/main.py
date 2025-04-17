from fastapi import FastAPI, Response, Request
from models.snapshot_request import SnapshotRequest
from models.snapshot_response import SnapshotResponse
from prune_dom import prune_dom
from serialize_snapshot import serialize_dom_snapshot
from set_headers import set_microcache_headers
from otel_trace import tracer

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "OK"}

@app.get("/")
def read_root():
    return {"msg": "Ultra-Low Latency Render API"}

@app.post("/render_snapshot")
def render_snapshot(req: SnapshotRequest, fastapi_res: Response, request: Request = None):
    with tracer.start_as_current_span("render_snapshot"):
        html_snapshot = f"<html><body><h1>Snapshot of {req.url}</h1></body></html>"
        pruned = prune_dom(html_snapshot)
        fbs_bytes = serialize_dom_snapshot({"url": req.url, "html": pruned, "metadata": "{}"})
        set_microcache_headers(fastapi_res, fbs_bytes)
        # Early hints and advanced cache/headers
        fastapi_res.headers["Link"] = '</fonts/optimized.woff2>; rel=preload; as=font; crossorigin, </styles/globals.css>; rel=preload; as=style'
        fastapi_res.status_code = 200
        return Response(
            content=fbs_bytes,
            media_type="application/octet-stream",
            headers=fastapi_res.headers
        )