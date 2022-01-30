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
from src.utils import fetch

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
            indent=2,
            default=str  # timedelta is not json serializable
        ),
        "get_with_query_result", json.dumps(
            get_with_query_result,
            indent=2,
            default=str
        ),
        "get_with_headers_result", json.dumps(
            get_with_headers_result,
            indent=2,
            default=str
        ),
        "post_result", json.dumps(
            post_result,
            indent=2,
            default=str
        ),
        sep="\n"
    )

asyncio.run(main())
