from quart import jsonify, request, Blueprint
from src.lib.hello import hello
from src.middleware.auth import auth
from werkzeug.datastructures import MultiDict

index_routes = Blueprint('index_routes', __name__)


@index_routes.route('/', methods=['GET'])
async def index():
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
async def greet():
    """
    route -- POST /api/greet
    description -- use request body (get_json -- parsed body)(get_data -- raw body)
    access -- public
    """
    try:
        body: dict = await request.get_json()
        name: str = body['name']
        greeting: str = hello(name)
        return jsonify({"message": greeting}), 200
    except Exception as e:
        print(str(e))
        return jsonify({}), 500


@index_routes.route('/search', methods=['GET'])
async def search():
    """
    route -- GET /api/search
    description -- use query string
    access -- public
    """
    try:
        query: dict = request.args.to_dict()  # ImmutableMultiDict -> dict
        return jsonify({'query': query}), 200
    except Exception as e:
        print(str(e))
        return jsonify({}), 500


@index_routes.route('/users/<uid>', methods=['GET'])
async def users(uid):
    """
    route -- GET /api/users/<id>
    description -- use params
    access -- public
    """
    try:
        user: dict = {'uid': uid, 'name': 'Kakashi'}  # pretend db response
        return jsonify({'user': user}), 200
    except Exception as e:
        print(str(e))
        return jsonify({}), 500


@index_routes.route('/save-file', methods=['POST'])
async def save_file():
    """
    route -- POST /api/save-file
    description -- handle file in payload
    access -- public
    """
    try:
        files_immutable_dict: MultiDict = await request.files
        files_dict: dict = files_immutable_dict.to_dict(flat=False)
        fn_list: list = []
        for file_storage_list in files_dict.values():
            for file_storage in file_storage_list:
                fn_list.append(file_storage.filename)  # filename, stream
        return jsonify({'fn_list': fn_list}), 200
    except Exception as e:
        print(str(e))
        return jsonify({}), 500


@index_routes.route('/hello', methods=['GET'])
@auth
async def private_hello():
    """
    route -- /api/hello
    description -- use auth middleware
    access -- private
    """
    try:
        return jsonify({'message': 'Hello world'}), 200
    except Exception as e:
        print(str(e))
        return jsonify({}), 500
