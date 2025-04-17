import flatbuffers
import time
from UISnapshot.DOMSnapshot import DOMSnapshot

def serialize_dom_snapshot(data):
    # Expects data dict: {'url':..., 'html':..., 'metadata':...}
    url = data.get("url", "")
    html = data.get("html", "")
    metadata = data.get("metadata", "")
    timestamp = int(time.time())

    builder = flatbuffers.Builder(1024)
    url_off = builder.CreateString(url)
    html_off = builder.CreateString(html)
    metadata_off = builder.CreateString(metadata)
    # Create the object
    DOMSnapshotStart = builder.StartObject(4)
    builder.PrependUOffsetTRelativeSlot(0, url_off, 0)
    builder.PrependUOffsetTRelativeSlot(1, html_off, 0)
    builder.PrependUint64Slot(2, timestamp, 0)
    builder.PrependUOffsetTRelativeSlot(3, metadata_off, 0)
    snap = builder.EndObject()
    builder.Finish(snap)
    return bytes(builder.Output())