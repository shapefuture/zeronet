from pydantic import BaseModel

class SnapshotRequest(BaseModel):
    url: str
    params: dict = {}