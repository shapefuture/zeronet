from fastapi import Response

def set_microcache_headers(response: Response):
    response.headers["Cache-Control"] = "public, s-maxage=1, stale-while-revalidate=86400"
    response.headers["ETag"] = "mock-etag"  # Replace with real hash if needed