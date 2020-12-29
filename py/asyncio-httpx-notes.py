# standard imports
import sys
import os
import json
import asyncio
# package imports
import httpx

# ---
# functions
# ---


async def fetch(url, method="GET", headers=None, payload=None, params=None, debug=False, form_encode=False, timeout=None):
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
            params=params,
            timeout=timeout
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


async def post_person(person):
    response = await fetch(
        url="https://jsonplaceholder.typicode.com/users",
        method='POST',
        headers=headers,
        payload=person,
        debug=False
    )
    print(response)
    await asyncio.sleep(2)  # wait after request
    return response


async def bs_async_func(sema, async_func, args):
    """
    HOF that runs a function inside of a semaphore context
    """
    # ensure sema
    if not sema:
        raise Exception("sema required for async execution")

    # execute function in sema context
    async with sema:
        await async_func(*args)


async def post_people(sema, people):
    # awaitable tasks
    tasks = []

    for person in people:
        # make request
        task = asyncio.ensure_future(
            bs_async_func(
                sema=sema,
                async_func=post_person,
                args=[person]
            )
        )
        tasks.append(task)
    # schedule awaitable tasks
    responses = asyncio.gather(*tasks)
    # execute
    await responses

# ---
# data
# ---

# people to be posted
people = [
    {'name': 'hiruzen'},
    {'name': 'kakashi'},
    {'name': 'yamato'},
    {'name': 'iruka'},
    {'name': 'hashirama'},
    {'name': 'itachi'},
    {'name': 'shisui'},
]

# headers used in fetch
headers: dict = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Token": "55DF6FCF66DB349E42272C11CD49F701EEF64FD7F842DA431C4CD252211AFD66"
}

# ---
# prepare
# ---

# create semaphore
sema = asyncio.BoundedSemaphore(2)

# async execution
loop = asyncio.get_event_loop()

# ---
# execute
# ---

# python
future = asyncio.ensure_future(post_people(sema, people))
loop.run_until_complete(future)

# jupyter (old) (runaway process)
# loop.create_task(post_people(sema, people))

# jupyter
# future = asyncio.ensure_future(post_people(sema, people))
# await future
