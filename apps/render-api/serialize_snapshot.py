import flatbuffers
import time
from UISnapshot import DOMSnapshot
from logging_utils import logging

def serialize_dom_snapshot(data: dict) -> bytes:
    logging.debug(f"Serializing snapshot data: {data}")
    if not isinstance(data, dict):
        logging.error("Snapshot data must be a dict")
        raise ValueError("Snapshot data must be a dict")
    for k in ("url", "html", "metadata"):
        if not isinstance(data.get(k, ''), str):
            logging.error(f"Snapshot '{k}' must be a string")
            raise ValueError(f"Snapshot '{k}' must be a string")
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
    logging.info(f"Snapshot serialized, size={builder.Output().__len__()} bytes, url={url}")
    return bytes(builder.Output())
