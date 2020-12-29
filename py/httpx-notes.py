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
# get (with params)
# ---


async def httpx_get_json_with_query(url, params):
    """
    Make GET request (with query) and return parsed body.
    """
    async with httpx.AsyncClient() as client:
        try:
            # response
            response: httpx.Response = await client.get(url, params=params)
            body: dict = response.json()
            # return body
            return body
        except Exception as e:
            print(e)
            return None


# ---
# get (with headers)
# ---


async def httpx_get_json_with_headers(url, headers):
    """
    Make GET request (with headers) and return parsed body.
    """
    async with httpx.AsyncClient() as client:
        try:
            # response
            response: httpx.Response = await client.get(url, headers=headers)
            body: dict = response.json()
            # return body
            return body
        except Exception as e:
            print(e)
            return None

# ---
# post
# ---


async def httpx_post_json(url, data):
    """
    Make POST request to specified url and return parsed body
    """
    async with httpx.AsyncClient() as client:
        try:
            # response
            response = await client.post(url, data=data)
            body: dict = response.json()
            # return body
            return body
        except Exception as e:
            print(e)
            return None


# ---
# main
# ---

async def main():

    # get
    httpx_get_json_result = await httpx_get_json(
        url="https://jsonplaceholder.typicode.com/users/1"
    )

    # get (query)
    httpx_get_json_with_query_result = await httpx_get_json_with_query(
        url="https://jsonplaceholder.typicode.com/users",
        params={'limit': 5, 'offset': 5}
    )

    # get (headers)
    httpx_get_json_with_headers_result = await httpx_get_json_with_headers(
        url="https://jsonplaceholder.typicode.com/users/1",
        headers={
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Token': '55DF6FCF66DB349E42272C11CD49F701EEF64FD7F842DA431C4CD252211AFD66'
        }
    )

    # post
    httpx_post_json_result = await httpx_post_json(
        url="https://jsonplaceholder.typicode.com/users",
        data={'name': "Hiruzen Sarutobi"}
    )

    # results
    print(
        "httpx_get_json_result", httpx_get_json_result,
        "httpx_get_json_with_query_result", httpx_get_json_with_query_result,
        "httpx_get_json_with_headers_result", httpx_get_json_with_headers_result,
        "httpx_post_json_result", httpx_post_json_result,
        sep="\n"
    )

asyncio.run(main())
