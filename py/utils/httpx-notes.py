# ---------
# httpx
# ---------

# install
# pip install httpx

# httpx
# https://www.python-httpx.org/

# asyncio
# https://docs.python.org/3/library/asyncio.html

# trio (asyncio alternative)
# https://trio.readthedocs.io/en/stable/

# ---
# imports
# ---

import asyncio
import json
from typing import Union, Dict, Any
import httpx

# ---
# basic usage
# ---

# response
# status_code -- status code
# encoding -- encoding
# content -- body as bytes
# text -- pretty json string from parsed body
# json() -- dictionary from parsed body


async def httpx_get_json(url):
    """
    Make GET request to specified url and return parsed body.
    """
    async with httpx.AsyncClient() as client:
        try:
            # response
            response: httpx.Response = await client.get(url)
            status_code: int = response.status_code
            encoding: Union[str, None] = response.encoding
            b: bytes = response.content
            text: str = response.text
            body: dict = response.json()
            # return body
            return body
        except Exception as e:
            print(e)
            return None


# ---
# fetch
# ---


async def fetch(
    url: str,
    method: str = 'GET',
    headers: Union[dict, None] = None,
    payload: Union[dict, list, None] = None,
    params: Union[dict, None] = None,
) -> Dict[str, Any]:
    """
    Make request to specified url and return result

    Parameters:
    -------
    url
        url to make request to
    method
        HTTP method (GET, POST, PUT, DELETE, etc)
    headers
        request headers object
    payload
        body to be sent as json
    params
        query params
    retries
        number of retries

    Returns
    -------
    response object
        {
            "data": Union[dict,list,None],
            "text": Union[str,None],
            "status": int,
            "headers": dict,
            "elapsed": datetime.timedelta,
        }
    """
    if not isinstance(url, str):
        raise Exception('Argument "url" must be a string')

    # TODO: retries

    async with httpx.AsyncClient() as client:
        response = await client.request(
            method,
            url,
            headers=headers,
            json=payload,
            params=params
        )

        response.raise_for_status()

        try:
            data = response.json()
        except Exception:
            print('Could not parse response json for %s request to %s', method, url)
            data = None

        return {
            "data": data,
            "text": response.text,
            "status":  response.status_code,
            "headers":  response.headers,
            "elapsed":  response.elapsed,
        }

# ---
# main
# ---


async def main():

    # get
    get_result = None
    try:
        get_result = await fetch(
            url="https://jsonplaceholder.typicode.com/users/1",
        )
    except Exception as e:
        print(e)

    # get (query)
    get_with_query_result = None
    try:
        get_with_query_result = await fetch(
            url="https://jsonplaceholder.typicode.com/users",
            params={"limit": 5, "offset": 5}
        )
    except Exception as e:
        print(e)

    # get (headers)
    get_with_headers_result = None
    try:
        get_with_headers_result = await fetch(
            url="https://jsonplaceholder.typicode.com/users/1",
            headers={
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Token": "55DF6FCF66DB349E42272C11CD49F701EEF64FD7F842DA431C4CD252211AFD66"
            }
        )
    except Exception as e:
        print(e)

    # post
    post_result = None
    try:
        post_result = await fetch(
            method="POST",
            url="https://jsonplaceholder.typicode.com/users",
            payload={"name": "Hiruzen Sarutobi"},
        )
    except Exception as e:
        print(e)

    # results
    print(
        "get_result", json.dumps(
            get_result,
            indent=2
        ),
        "get_with_query_result", json.dumps(
            get_with_query_result,
            indent=2
        ),
        "get_with_headers_result", json.dumps(
            get_with_headers_result,
            indent=2
        ),
        "post_result", json.dumps(
            post_result,
            indent=2
        ),
        sep="\n"
    )

asyncio.run(main())
