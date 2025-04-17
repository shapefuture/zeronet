from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def read_root():
    return {"msg": "Ultra-Low Latency Render API"}

# Placeholder: Rust/Steel integration planned in later phases.