import asyncio
from typing import Dict, Any, List
from .utils import fetch


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
        if person:
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
