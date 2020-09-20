# -------------
# flask notes
# -------------

# ----------
# request
# ----------

# https://stackoverflow.com/a/16664376/8508220

# data -- incoming request data as string
# args -- key/value pairs from query string
# form -- key/value pairs from body or html post form
# files -- files in the body (must use enctype=multipart/form-data)
# values -- args and form (args prioritized if collision)
# json -- parsed json data (must have 'application/json')

# ----------
# werkzeug
# ----------

# https://werkzeug.palletsprojects.com/en/1.0.x/datastructures/

# FileStorage
# attributes -- stream, filename, name, headers
# methods -- save(dst, buffer_size=16384), close()

# ImmutableMultiDict
# methods -- add(key,value), clear(), copy(), deepcopy(), get(key), to_dict(flat=False)

# install
# pip install flask

# -------------
# imports
# -------------

from flask import Flask, json, jsonify, request, Blueprint
from gevent.pywsgi import WSGIServer
import os
import sys
from middleware.auth import auth

# -------------
# hello world
# -------------

# create app
app = Flask(__name__)

@app.route('/', methods=['GET'])
def index():
    return { "message": "Hello, world!" }

if __name__ == '__main__':
    dev = True
    if dev:
        app.run(debug=True, host='0.0.0.0', port=8080)
    else:
        http_server = WSGIServer(('', 8080), app)
        http_server.serve_forever()

# -------------
# examples
# -------------

# body
@app.route('/users/posts', methods=['POST'])
def add_post():
    body = request.get_json(silent=True)
    user_id = body['user_id']  # get property of body
    post_content = body['post_content']
    return jsonify({"user_id": user_id, "post_content", post_content}), 200

# query
@app.route('/search', methods=['GET'])
def search():
    query = request.args  # parsed query string
    return jsonify({ "query": query }), 200

# route params
@app.route('/users/<uid>')
def users(uid):
    return jsonify({"uid": uid}), 200

# middleware
@app.route('/hello', methods=['GET'])
@auth
def private_hello():
    return jsonify({ "message": "Hello World"}), 200

# files
@app.route('/save-file', methods=['POST'])
def save_file():
    files_immutable_dict = request.files
    files_dictionary = files_immutable_dict.to_dict(flat=False)
    file_names = []
    for file_array in files_dictionary.values():
        for file_storage in file_array:
            file_names.append(file_storage.filename)  # filename, stream
    return jsonify({'file_names': filenames}), 200


# -------------
# 
# -------------



