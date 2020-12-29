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

import httpx
import asyncio
import json
from pprint import pprint

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
            encoding: str = response.encoding
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


async def fetch(url, method="GET", headers=None, payload=None, params=None, debug=False, form_encode=False):
    """
    Make request to specified url and return parsed body
    """
    # form encode or json encode
    data = payload if form_encode else json.dumps(payload)
    # make request with httpx
    async with httpx.AsyncClient() as client:
        # request
        response: httpx.Response = await client.request(
            method,
            url,
            headers=headers,
            data=data,
            params=params
        )
        # debug
        if debug:
            print(
                f"status: {response.status_code} {response.reason_phrase}",
                f"headers: {response.headers}",
                f"text: {response.text}",
                f"elapsed: {response.elapsed}",
                sep="\n\n"
            )
        # error
        response.raise_for_status()
        # parse body
        body = response.json()
        # return body
        return body

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
            form_encode=True
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
