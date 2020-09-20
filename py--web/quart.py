
# -------------
# quart notes
# -------------

# pip install quart

# -------------
# imports
# -------------

from quart import Quart, request, url_for, jsonify
import uvicorn

# -------------
# hello world
# -------------

app = Quart(__name__)


@app.route('/', methods=['GET'])
async def hello():
    return jsonify({"message": "Hello world!"})

if __name__ == '__main__':
    dev = True
    if dev:
        app.run(debug=True, host='0.0.0.0', port=8000)
    else:
        uvicorn.run(app, host="0.0.0.0", port=8000)


# -------------
#
# -------------


# -------------
#
# -------------


# -------------
#
# -------------


# -------------
#
# -------------
