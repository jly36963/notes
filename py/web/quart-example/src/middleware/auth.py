from quart import jsonify
from functools import wraps


def auth(f):
    @wraps(f)
    async def wrapper(*args, **kwargs):
        # do some auth logic
        valid_token = True
        # return response (failed)
        if not valid_token:
            return jsonify({'data': None, 'error': "Improper auth state."}), 401
        # return function with args (success)
        return await f(*args, **kwargs)
    # return wrapper
    return wrapper
