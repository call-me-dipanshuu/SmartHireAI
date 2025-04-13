from fastapi import FastAPI, Request
from sentence_transformers import SentenceTransformer
from pydantic import BaseModel
import uvicorn

app = FastAPI()
model = SentenceTransformer('all-MiniLM-L6-v2')

class EmbeddingRequest(BaseModel):
    text: str

@app.post("/embed")
def embed(req: EmbeddingRequest):
    embedding = model.encode(req.text).tolist()
    return {"embedding": embedding}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=5000)
