import json
import asyncio
from typing import Union, List, Dict, Any
import httpx


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


async def post_person(person: Dict[str, Any]) -> Dict[str, Any]:
    """
    Post a person to jsonplaceholder.
    """
    url: str = "https://jsonplaceholder.typicode.com/users"
    headers: Dict[str, str] = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Token": "55DF6FCF66DB349E42272C11CD49F701EEF64FD7F842DA431C4CD252211AFD66"
    }
    response = await fetch(
        url=url,
        method='POST',
        headers=headers,
        payload=person,
    )
    await asyncio.sleep(1)  # wait after request
    return response


async def with_for_loop(people: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Post people using for loop.
    """
    uploaded_people = []

    for person in people:
        response = await post_person(person)
        person = response.get('data')
        uploaded_people.append(person)

    return uploaded_people


async def with_gather(people: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Post people using gather (like Promise.al() in js).
    """
    # tasks (promises)
    tasks = list(map(
        lambda person: post_person(person),
        people
    ))
    # gather (Promise.all)
    responses = await asyncio.gather(*tasks)
    # responses -> people
    uploaded_people = list(map(
        lambda r: r.get('data', {}),
        responses
    ))
    return uploaded_people


async def bs_async_func(sema, async_func, args) -> Any:
    """
    HOF that runs a function inside of a semaphore context
    """
    # ensure sema
    if not sema:
        raise Exception("sema required for async execution")

    result: Any = None

    # execute function in sema context
    async with sema:
        result = await async_func(*args)

    return result


async def with_sema(people: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Post people using semafore and gather

    NOTE: in jupyter, add task to asyncio event loop
    """
    # awaitable tasks
    tasks = []

    # create semaphore
    sema = asyncio.BoundedSemaphore(2)

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
    responses = await asyncio.gather(*tasks)
    uploaded_people: List[Dict[str, Any]] = list(map(
        lambda r: r.get('data', {}),
        responses
    ))
    # execute
    return uploaded_people


async def main() -> None:
    """
    Basic usage of httpx
    """
    # people to be posted
    people: List[Dict[str, Any]] = [
        {'name': 'hiruzen'},
        {'name': 'kakashi'},
        {'name': 'yamato'},
        {'name': 'iruka'},
        {'name': 'hashirama'},
        {'name': 'itachi'},
        {'name': 'shisui'},
    ]

    # for loop (await one request at at time)
    for_loop_responses = await with_for_loop(people)

    # gather (await multiple requests)
    gather_responses = await with_gather(people)

    # sema (limits number of concurrent requests)
    sema_responses = await with_sema(people)

    # print results
    results = {
        'for_loop_responses': for_loop_responses,
        'gather_responses': gather_responses,
        'sema_responses': sema_responses
    }

    print(json.dumps(
        results,
        default=str,
        indent=2
    ))

# run main function
asyncio.run(main())
