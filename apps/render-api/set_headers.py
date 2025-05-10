from fastapi import Response
import hashlib

def set_microcache_headers(response: Response, body: bytes = b''):
    response.headers["Cache-Control"] = "public, s-maxage=1, stale-while-revalidate=86400"
    etag = hashlib.sha256(body).hexdigest() if body else "mock-etag"
    response.headers["ETag"] = etag