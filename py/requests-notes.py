import requests
import pydash as _
import json
from pprint import pprint

# fetch function (uses requests)

def fetch(url, method='GET', headers=None, payload=None, params=None, debug=False):
    """
    Make request to specified url and return parsed body
    """
    # request
    response = requests.request(
        method, 
        url, 
        headers=headers, 
        data=json.dumps(payload), 
        params=params
    )
    # debug
    if debug:
        print(
            f"status: {response.status_code} {response.reason}",
            f"headers: {response.headers}",
            f"text: {response.text}",
            f"elapsed: {response.elapsed}",
            sep='\n\n'
        )
    # error
    response.raise_for_status()
    # parse body
    body = response.json()
    return body

# use fetch function (get)

result = fetch(url="https://jsonplaceholder.typicode.com/users/1", debug=False)
pprint(result)


# use fetch function (post)

result = fetch(
    url="https://jsonplaceholder.typicode.com/users",
    method='POST',
    payload={'name': "Hiruzen Sarutobi"},
    headers={
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Token': '55DF6FCF66DB349E42272C11CD49F701EEF64FD7F842DA431C4CD252211AFD66'
    },
)

pprint(result)