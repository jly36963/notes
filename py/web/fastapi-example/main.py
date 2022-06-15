import os
from fastapi import FastAPI
import uvicorn
from src.api import api

dev = os.getenv('PYTHON_ENV') != 'production'

# app
app = FastAPI()
app.include_router(
    api.router,
    prefix="/api",
)

# listen
if __name__ == "__main__":
    uvicorn.run('main:app', host="127.0.0.1", port=8000, reload=dev)
