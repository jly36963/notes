
from flask import jsonify, request, Blueprint
from src.lib.hello import hello
from src.middleware.auth import auth

index_routes = Blueprint('index_routes', __name__)


@index_routes.route('/', methods=['GET'])
def index():
    '''
    route -- GET /api
    description -- basic response
    access -- public
    '''
    try:
        return jsonify({"message": "Hello world!"}), 200
    except Exception as e:
        print(str(e))
        return jsonify({}), 500


@index_routes.route('/greet', methods=['POST'])
def greet():
    """
    route -- POST /api/greet
    description -- use request body
    access -- public
    """
    try:
        body = request.get_json(silent=True)
        name = body['name']
        greeting = hello(name)
        return jsonify({'greeting': greeting, }), 200
    except Exception as e:
        print(str(e))
        return jsonify({}), 500


@index_routes.route('/search', methods=['GET'])
def search():
    """
    route -- GET /api/search
    description -- use query string
    access -- public
    """
    try:
        query = request.args
        return jsonify({'query': query}), 200
    except Exception as e:
        print(str(e))
        return jsonify({}), 500


@index_routes.route('/users/<uid>', methods=['GET'])
def users(uid):
    """
    route -- GET /api/users/<id>
    description -- use params
    access -- public
    """
    try:
        user = {'uid': uid, 'name': 'Kakashi'}  # pretend db response
        return jsonify({'user': user}), 200
    except Exception as e:
        print(str(e))
        return jsonify({}), 500


@index_routes.route('/save-file', methods=['POST'])
def save_file():
    """
    route -- POST /api/save-file
    description -- handle file in payload
    access -- public
    """
    try:
        files_immutable_dict = request.files
        files_dictionary = files_immutable_dict.to_dict(flat=False)
        filenames = []
        for file_array in files_dictionary.values():
            for file_storage in file_array:
                filenames.append(file_storage.filename)  # filename, stream
        return jsonify({'filenames': filenames}), 200
    except Exception as e:
        print(str(e))
        return jsonify({}), 500


@index_routes.route('/hello', methods=['GET'])
@auth
def private_hello():
    """
    route -- /api/hello
    description -- use auth middleware
    access -- private
    """
    try:
        return jsonify({'message': 'Hello'}), 200
    except Exception as e:
        print(str(e))
        return jsonify({}), 500
