# ---
# httpx
# ---

# install
# pip install httpx

# httpx
# https://www.python-httpx.org/

# asyncio
# https://docs.python.org/3/library/asyncio.html


import asyncio
import json
from src.utils import fetch

# ---
# Main
# ---


async def main():
    # Get (plain)
    get_result = await fetch(url="https://jsonplaceholder.typicode.com/users/1",)

    # get (with query)
    get_with_query_result = await fetch(
        url="https://jsonplaceholder.typicode.com/users",
        params={"limit": 5, "offset": 5}
    )

    # get (with headers)
    get_with_headers_result = await fetch(
        url="https://jsonplaceholder.typicode.com/users/1",
        headers={
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Token": "55DF6FCF66DB349E42272C11CD49F701EEF64FD7F842DA431C4CD252211AFD66"
        }
    )

    # post
    post_result = await fetch(
        method="POST",
        url="https://jsonplaceholder.typicode.com/users",
        payload={"name": "Hiruzen Sarutobi"},
    )

    print(json.dumps({
        "get_result": get_result,
        "get_with_query_result": get_with_query_result,
        "get_with_headers_result": get_with_headers_result,
        "post_result": post_result
    }, indent=2, default=str))

# ---
# Run
# ---

if __name__ == "__main__":
    asyncio.run(main())
