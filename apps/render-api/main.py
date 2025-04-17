from otel_trace import tracer

@app.post("/render_snapshot")
def render_snapshot(req: SnapshotRequest, fastapi_res: Response, request: Request = None):
    with tracer.start_as_current_span("render_snapshot"):
        # ...all body as above...
        return Response(
            content=fbs_bytes,
            media_type="application/octet-stream",
            headers=fastapi_res.headers
        )