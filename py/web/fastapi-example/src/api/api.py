from io import BufferedReader
from typing import Optional
from fastapi import Response, File, UploadFile, APIRouter
from fastapi.responses import HTMLResponse, RedirectResponse, StreamingResponse, FileResponse
from src.lib.hello import hello
from src.models.post import Post


router = APIRouter()


@router.get("/", status_code=200)
async def root():
    """
    route -- GET /api
    description -- hello world
    access -- public
    """
    greeting: str = "Hello World"
    return {"data": greeting, "error": None}


@router.get("/hello", status_code=200)
async def say_hello(response: Response):
    """
    route -- GET /api/hello
    description -- use auth middleware
    access -- public
    """
    try:
        greeting: str = hello()
        return {"data": greeting, "error": None}
    except Exception as e:
        response.status_code = 500
        return {"data": None, "error": str(e)}


@router.get("/users/{user_id}", status_code=200)
async def read_item(user_id: int, response: Response):
    """
    route -- GET /api/users/{user_id}
    description -- use path params
    access -- public
    """
    try:
        user: dict = {"id": user_id, "name": "Kakashi"}
        return {"data": user, "error": None}
    except Exception as e:
        response.status_code = 500
        return {"data": None, "error": str(e)}


@router.get("/store", status_code=200)
async def store_search(
    # response
    response: Response,
    # query
    q: str,
    limit: Optional[int] = 10,
    offset: Optional[int] = 0,
):
    """
    route -- GET /api/store
    description -- use query params
    access -- public
    """
    try:
        query: dict = {"q": q, "limit": limit, "offset": offset}
        return {"data": query, "error": None}
    except Exception as e:
        response.status_code = 500
        return {"data": None, "error": str(e)}


@router.post("/posts")
async def save_post(response: Response, post: Post):
    """
    route -- POST /api/posts
    description -- use type model, print post and return it
    access -- public
    """
    try:
        print(post)
        return {"data": post, "error": None}
    except Exception as e:
        return {"data": None, "error": str(e)}


@router.post("/simple-file")
async def simple_handle_file(response: Response, file: bytes = File(...)):
    """
    route -- POST /api/simple-file
    description -- handle file (received as bytes) (all in memory)
    access -- public
    """
    try:
        print(file)
        return {"data": len(file), "error": None}
    except Exception as e:
        return {"data": None, "error": str(e)}


@router.post("/file")
async def handle_file(response: Response, file: UploadFile = File(...)):
    """
    route -- POST /api/file
    description -- handle file (file with metadata)(better for larger files)
    access -- public
    """
    try:
        print(file.filename)  # filename, content_type, file
        return {"data": file.filename, "error": None}
    except Exception as e:
        return {"data": None, "error": str(e)}


@router.get("/html", response_class=HTMLResponse, status_code=200)
async def send_html():
    """
    route -- GET /api/html
    description -- send html
    access -- public
    """
    html_content: str = "<html><body><p>Hello World!</p></body></html>"
    return html_content


@router.get("/html2")
async def send_html2():
    """
    route -- GET /api/html
    description -- send html (use HTMLResponse directly)
    access -- public
    """
    html_content: str = "<html><body><p>Hello World!</p></body></html>"
    return HTMLResponse(content=html_content, status_code=200)


@router.get("/hi")
async def redirect_hello():
    """
    route -- GET /api/hi
    description -- redirect
    access -- public
    """
    return RedirectResponse("/hello")


@router.get("/file-stream")
async def file_stream():
    """
    route -- GET /api/video-stream
    description -- stream response
    access -- public
    """
    fp: str = 'app.py'
    file_like: BufferedReader = open(fp, mode="rb")
    return StreamingResponse(file_like)


@router.get("/send-file")
async def send_file():
    """
    route -- GET /api/send-file
    description -- send file (requires aiofiles)
    access -- public
    """
    fp: str = 'app.py'
    return FileResponse(fp)
