# -------------
# notes
# -------------

# install
# pip install fastapi

# tools used
# starlette -- web parts
# pydantic -- data parts
# uvicorn -- ASGI server

# route structure
# decorator -- app (app), get (http method), "/" (endpoint)
# path operation function -- async def root()
# return -- can use dict, list, or singular values (str, int, etc)

# params
# If the parameter is also declared in the path, it will be used as a path parameter.
# If the parameter is of a singular type(like int, float, str, bool, etc) it will be interpreted as a query parameter.
# If the parameter is declared to be of the type of a Pydantic model, it will be interpreted as a request body.

# -------------
# imports
# -------------

# imports
from fastapi import FastAPI
from typing import Optional
from pydantic import BaseModel
from enum import Enum
import uvicorn

# -------------
# types
# -------------

# simple types
str
int
float
bool
bytes

# generic types
dict  # Dict[str, str]
list  # List[str]
set  # Set[str]
tuple  # Tuple[str]

# other supported types
# https://fastapi.tiangolo.com/tutorial/extra-data-types/

# -------------
# hello world
# -------------

# start (main.py)
# uvicorn main:app --reload

app = FastAPI()


@app.get("/")
async def root():
    return {"data": "Hello World", "error": None}


# -------------
# start with uvicorn
# -------------

app = FastAPI()

@app.get("/")
async def root():
    return {"data": "Hello World", "error": None}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

# -------------
# path params (attempts to parse as correct type, return error if not)
# -------------


@app.get("/items/{item_id}")
async def read_item(item_id: int):
    return {"data": item_id, "error": None}


# -------------
# qs (query params) (function params that aren't path params get interpreted as query params)
# -------------

# http://127.0.0.1:8000/items/?skip=0&limit=10

@app.get("/items/")
async def read_item(offset: int = 0, limit: int = 10):
    query_params = {"limit": limit, "offset": offset}
    return {"data": query_params, "error": None}


# -------------
# request body
# -------------

class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    tax: Optional[float] = None


@app.post("/items/")
async def create_item(item: Item):
    print(item)
    return {"data": item, "error": None}


# -------------
# optional query params
# -------------

@app.get("/items/{item_id}")
async def read_item(item_id: str, q: Optional[str] = None):
    data = {"item_id": item_id}
    if q:
        data["q"] = q
    return {"data": data, "error": None}

# -------------
# body (multiple params)
# -------------

# https://fastapi.tiangolo.com/tutorial/body-multiple-params/

# -------------
# status code
# -------------

# default
# https://fastapi.tiangolo.com/tutorial/response-status-code/

# change status code
# https://fastapi.tiangolo.com/advanced/response-change-status-code/

# -------------
# routers
# -------------

# https://fastapi.tiangolo.com/tutorial/bigger-applications/

# -------------
# middlewre
# -------------

# middleware
# https://fastapi.tiangolo.com/tutorial/middleware/

# advanced middleware
# https://fastapi.tiangolo.com/advanced/middleware/

# middleware for certain routes
# https://github.com/tiangolo/fastapi/issues/1174

# -------------
# background tasks
# -------------

# https://fastapi.tiangolo.com/tutorial/background-tasks/

# -------------
# static file server
# -------------

# https://fastapi.tiangolo.com/tutorial/static-files/

# dependencies
# pip install aiofiles

# -------------
# testing
# -------------

# https://fastapi.tiangolo.com/tutorial/testing/

# -------------
# advanced
# -------------

# https://fastapi.tiangolo.com/advanced/

# -------------
# -------------
# -------------
# -------------
# -------------

# -------------
# order / specificity (put routes with params last)
# -------------

# specify routes with path params last
# ie -- "/users/me", "/users/{user_id}"

# -------------
# enum (specify possible params options)
# -------------

# https://fastapi.tiangolo.com/tutorial/path-params/#create-an-enum-class

# -------------
# async / await
# -------------

# https://fastapi.tiangolo.com/async/

# -------------
# field
# -------------

# https://fastapi.tiangolo.com/tutorial/body-fields/

# -------------
# nesting (Pydantic)
# -------------

# nexted models
# https://fastapi.tiangolo.com/tutorial/body-nested-models/#nested-models

# deeply nested models
# https://fastapi.tiangolo.com/tutorial/body-nested-models/#deeply-nested-models

# -------------
# special types (Pydantic)
# -------------

# https://fastapi.tiangolo.com/tutorial/body-nested-models/#special-types-and-validation

# -------------
# validation
# -------------

# query params and strings
# https://fastapi.tiangolo.com/tutorial/query-params-str-validations/

# path params and numerics
# https://fastapi.tiangolo.com/tutorial/path-params-numeric-validations/

# -------------
# body (field)
# -------------

# https://fastapi.tiangolo.com/tutorial/body-fields/

# -------------
# cookie parameters
# -------------

# https://fastapi.tiangolo.com/tutorial/cookie-params/

# -------------
# header parameters
# -------------

# https://fastapi.tiangolo.com/tutorial/header-params/

# -------------
# response model
# -------------

# pre-define the shape of the response
# https://fastapi.tiangolo.com/tutorial/response-model/

# response_model_exclude_unset
# https://fastapi.tiangolo.com/tutorial/response-model/#use-the-response_model_exclude_unset-parameter

# -------------
# security (oauth2)
# -------------

# https://fastapi.tiangolo.com/tutorial/security/first-steps/

# -------------
# cors
# -------------

# https://fastapi.tiangolo.com/tutorial/cors/

# -------------
# orm
# -------------

# https://fastapi.tiangolo.com/tutorial/sql-databases/

# -------------
# metadata (name, description, version, etc)
# -------------

# https://fastapi.tiangolo.com/tutorial/metadata/

# -------------
#
# -------------


# -------------
#
# -------------


# -------------
#
# -------------
