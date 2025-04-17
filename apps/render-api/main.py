from fastapi import FastAPI, Response, Request
from models.snapshot_request import SnapshotRequest
from models.snapshot_response import SnapshotResponse
from prune_dom import prune_dom
from serialize_snapshot import serialize_dom_snapshot
from set_headers import set_microcache_headers
from otel_trace import tracer

app = FastAPI()

@app.get("/")
def read_root():
    return {"msg": "Ultra-Low Latency Render API"}

@app.post("/render_snapshot")
def render_snapshot(req: SnapshotRequest, response: Response, request: Request = None):
    with tracer.start_as_current_span("render_snapshot"):
        # Compose snapshot HTML
        html_snapshot = f"<html><body><h1>Snapshot of {req.url}</h1></body></html>"
        pruned_html = prune_dom(html_snapshot)
        # FlatBuffers-encode the DOM snapshot
        fbs_bytes = serialize_dom_snapshot({
            "url": req.url,
            "html": pruned_html,
            "metadata": "{}"
        })
        # Set cache headers and ETag
        set_microcache_headers(response, fbs_bytes)
        # Early Hints/Link header if supported
        response.headers["Link"] = (
            '</fonts/optimized.woff2>; rel=preload; as=font; crossorigin, '
            '</styles/globals.css>; rel=preload; as=style'
        )
        return Response(
            content=fbs_bytes,
            media_type="application/octet-stream",
            headers=response.headers
        )