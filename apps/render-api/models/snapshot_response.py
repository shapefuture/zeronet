from pydantic import BaseModel

class SnapshotResponse(BaseModel):
    html: str
    status: str = "success"