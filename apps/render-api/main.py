from fastapi import FastAPI, Response, Request, HTTPException
from models.snapshot_request import SnapshotRequest
from tracer import tracer
from prune_dom import prune_dom
from serialize_snapshot import serialize_dom_snapshot
from logging_utils import setup_logging, log_exception
import logging

setup_logging()
logger = logging.getLogger("zeronet.render-api")

app = FastAPI()

@app.post("/render_snapshot")
def render_snapshot(req: SnapshotRequest, request: Request, fastapi_res: Response):
    with tracer.start_as_current_span("render_snapshot"):
        try:
            logger.debug(f"Received render_snapshot request: {req}")
            html_snapshot = f"<html><body><h1>Snapshot of {req.url}</h1></body></html>"
            pruned = prune_dom(html_snapshot)
            logger.debug(f"DOM pruned for {req.url}: {pruned[:80]}")
            fbs_bytes = serialize_dom_snapshot({"url": req.url, "html": pruned, "metadata": "{}"})
            logger.info(f"Serialized snapshot for {req.url} ({len(fbs_bytes)} bytes)")
            fastapi_res.headers["X-Service"] = "render-api"
            return Response(
                content=fbs_bytes,
                media_type="application/octet-stream",
                headers=fastapi_res.headers
            )
        except Exception as e:
            log_exception(logger, "Failed to render snapshot", e)
            raise HTTPException(status_code=400, detail=f"Render error: {e}")
