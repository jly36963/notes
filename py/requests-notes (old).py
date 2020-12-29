# ---------
# requests
# ---------

# pip install requests

# ---
# imports
# ---

import requests

# ---
# basic usage
# ---

# response
# status_code -- status code
# encoding -- encoding
# text -- pretty json string from parsed body
# json() -- dictionary from parsed body
# raise_for_status() -- throw error if status code is 4xx or 5xx


def requests_get_json(url):
    """
    Make GET request to specified url and return parsed body.
    """
    try:
        # response
        response: requests.models.Response = requests.get(url)
        status_code: int = response.status_code
        encoding: str = response.encoding
        b: bytes = response.content
        text: str = response.text
        body: dict = response.json()
        # raise error
        response.raise_for_status()
        # return body
        return body
    except Exception as e:
        print(e)
        return None


requests_get_json_result = requests_get_json(
    url="https://jsonplaceholder.typicode.com/users/1"
)

# ---
# get (with params)
# ---


def requests_get_json_with_query(url, params):
    """
    Make GET request (with query) and return parsed body.
    """
    try:
        # response
        response: requests.models.Response = requests.get(url, params=params)
        response.raise_for_status()
        body: dict = response.json()
        # return body
        return body
    except Exception as e:
        print(e)
        return None


requests_get_json_with_query_result = requests_get_json_with_query(
    url="https://jsonplaceholder.typicode.com/users",
    params={'limit': 5, 'offset': 5}
)


# ---
# get (with headers)
# ---


def requests_get_json_with_headers(url, headers):
    """
    Make GET request (with headers) and return parsed body.
    """
    try:
        # response
        response: requests.models.Response = requests.get(url, headers=headers)
        response.raise_for_status()
        body: dict = response.json()
        # return body
        return body
    except Exception as e:
        print(e)
        return None


requests_get_json_with_headers_result = requests_get_json_with_headers(
    url="https://jsonplaceholder.typicode.com/users/1",
    headers={
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Token': '55DF6FCF66DB349E42272C11CD49F701EEF64FD7F842DA431C4CD252211AFD66'
    }
)

# ---
# post
# ---

# data
# dict will be form-encoded
# string (json.dumps(payload)) will be json-encoded


def requests_post_json(url, payload):
    """
    Make POST request to specified url and return parsed body
    """
    try:
        # response
        response = requests.post(url, data=payload)
        response.raise_for_status()
        body = response.json()
        # return body
        return body
    except Exception as e:
        print(e)
        return None


requests_post_json_result = requests_post_json(
    url="https://jsonplaceholder.typicode.com/users",
    payload={'name': "Hiruzen Sarutobi"}
)


# ---
# results
# ---

print(
    "requests_get_json_result", requests_get_json_result,
    "requests_get_json_with_query_result", requests_get_json_with_query_result,
    "requests_get_json_with_headers_result", requests_get_json_with_headers_result,
    "requests_post_json_result", requests_post_json_result,
    sep="\n"
)

# ---
#
# ---

# ---
#
# ---

# ---
#
# ---

# ---
#
# ---

# ---
#
# ---
