import os
from gevent.pywsgi import WSGIServer
from dotenv import load_dotenv  # python-dotenv
from flask import Flask, jsonify
from src.api.index import index_routes

# dotenv
load_dotenv()

# app
app = Flask(__name__)

# routes
app.register_blueprint(
    index_routes,
    url_prefix='/api'
)


@app.errorhandler(404)
def page_not_found(e):
    return jsonify({'data': None, 'error': 'Page not found'}), 404


if __name__ == '__main__':
    dev = os.getenv('PYTHON_ENV') != 'production'

    if dev:
        # development server
        print('Starting development server.')
        app.run(debug=True, host='0.0.0.0', port=8080)
    else:
        # production WSGI server (gevent)
        print('Starting WSGI server.')
        http_server = WSGIServer(('', 8080), app)
        http_server.serve_forever()
