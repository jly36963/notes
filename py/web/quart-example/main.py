import os

import uvicorn
from dotenv import load_dotenv  # python-dotenv
from quart import Quart, jsonify

from src.api.index import index_routes

# dotenv
load_dotenv()

# app
app = Quart(__name__)

# routes
app.register_blueprint(index_routes, url_prefix="/api")


@app.errorhandler(404)
def page_not_found(e):
    """
    route -- *
    description -- 404
    access -- public
    """
    return jsonify({"message": "Page not found"}), 404


if __name__ == "__main__":
    dev = os.getenv("PYTHON_ENV") != "production"
    host = "127.0.0.1"
    port = 8000

    if dev:
        app.run(debug=True, host=host, port=port)
    else:
        uvicorn.run("main:app", host=host, port=port)
