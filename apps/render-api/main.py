from fastapi import FastAPI, Response, Request, HTTPException
from models.snapshot_request import SnapshotRequest
from tracer import tracer
from prune_dom import prune_dom
from serialize_snapshot import serialize_dom_snapshot
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger("zeronet.render-api")

app = FastAPI()

@app.post("/render_snapshot")
def render_snapshot(req: SnapshotRequest, request: Request, fastapi_res: Response):
    with tracer.start_as_current_span("render_snapshot"):
        try:
            logger.info("Received render_snapshot for url=%s", req.url)
            html_snapshot = f"<html><body><h1>Snapshot of {req.url}</h1></body></html>"
            pruned = prune_dom(html_snapshot)
            fbs_bytes = serialize_dom_snapshot({"url": req.url, "html": pruned, "metadata": "{}"})
            fastapi_res.headers["X-Service"] = "render-api"
            logger.debug("Returning FlatBuffers snapshot of size %d bytes", len(fbs_bytes))
            return Response(
                content=fbs_bytes,
                media_type="application/octet-stream",
                headers=fastapi_res.headers
            )
        except Exception as e:
            logger.error("render_snapshot error: %s", e, exc_info=True)
            raise HTTPException(status_code=400, detail=str(e))
