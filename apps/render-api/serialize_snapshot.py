import flatbuffers
import time
from UISnapshot import DOMSnapshot

def serialize_dom_snapshot(data):
    url = data.get("url", "")
    html = data.get("html", "")
    metadata = data.get("metadata", "")
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