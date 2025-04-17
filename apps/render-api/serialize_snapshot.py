import flatbuffers
import time
from UISnapshot import DOMSnapshot

class SnapshotDataError(Exception):
    pass

def serialize_dom_snapshot(data: dict) -> bytes:
    # Validate types
    if not isinstance(data, dict):
        raise SnapshotDataError("Snapshot data must be a dict")
    for k in ("url", "html", "metadata"):
        if not isinstance(data.get(k, ''), str):
            raise SnapshotDataError(f"Snapshot '{k}' must be a string")
    url, html, metadata = data["url"], data["html"], data["metadata"]
    timestamp = int(time.time())
    builder = flatbuffers.Builder(1024)
    url_off = builder.CreateString(url)
    html_off = builder.CreateString(html)
    metadata_off = builder.CreateString(metadata)
    DOMSnapshot.DOMSnapshotStart(builder)
    DOMSnapshot.DOMSnapshotAddUrl(builder, url_off)
    DOMSnapshot.DOMSnapshotAddHtml(builder, html_off)
    DOMSnapshot.DOMSnapshotAddTimestamp(builder, timestamp)
    DOMSnapshot.DOMSnapshotAddMetadata(builder, metadata_off)
    snap = DOMSnapshot.DOMSnapshotEnd(builder)
    builder.Finish(snap)
    return bytes(builder.Output())