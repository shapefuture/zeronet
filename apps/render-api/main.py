from fastapi import FastAPI, Response, Request
# ...rest of imports...
from set_headers import set_microcache_headers

app = FastAPI()

@app.get("/")
def read_root():
    return {"msg": "Ultra-Low Latency Render API"}

@app.post("/render_snapshot")
def render_snapshot(req: SnapshotRequest, fastapi_res: Response, request: Request = None):
    html_snapshot = f"<html><body><h1>Snapshot of {req.url}</h1></body></html>"
    pruned = prune_dom(html_snapshot)
    fbs_bytes = serialize_dom_snapshot({"url": req.url, "html": pruned, "metadata": "{}"})
    set_microcache_headers(fastapi_res)
    if fastapi_res:
        # Early Hints (103): Not natively supported in FastAPI, but demonstration:
        fastapi_res.headers["Link"] = '</fonts/optimized.woff2>; rel=preload; as=font; crossorigin, </styles/globals.css>; rel=preload; as=style'
        fastapi_res.status_code = 103  # status 103 for Early Hints
    return Response(
        content=fbs_bytes,
        media_type="application/octet-stream",
        headers=fastapi_res.headers
    )