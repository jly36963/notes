import asyncio
from typing import Dict, Any, List, Callable
from .utils import fetch


async def post_person(person: dict) -> dict:
    """Post a person to jsonplaceholder."""
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


async def with_for_loop(people: List[dict]) -> List[dict]:
    """Post people using for loop."""
    results = []

    for person in people:
        response = await post_person(person)
        person = response.get('data', {})
        results.append(person)

    return results


async def with_gather(people: List[dict]) -> List[dict]:
    """Post people using gather (like Promise.all() in js)."""
    tasks = [post_person(p) for p in people]
    responses = await asyncio.gather(*tasks)
    results = [r.get('data', {}) for r in responses]
    return results


async def run_with_semafore(sema: asyncio.BoundedSemaphore, async_func: Callable, *args, **kwargs) -> Any:
    """HOF that runs a function inside of a semaphore context"""
    result: Any = None
    # execute function in sema context
    async with sema:
        result = await async_func(*args, **kwargs)

    return result


async def with_sema(people: List[dict]) -> List[dict]:
    """
    Post people using semafore and gather.
    NOTE: in jupyter, add task to asyncio event loop
    """
    # awaitable tasks
    tasks = []

    # create semaphore
    sema = asyncio.BoundedSemaphore(2)

    for person in people:
        # make request
        task = asyncio.ensure_future(
            run_with_semafore(sema, post_person, person)
        )
        tasks.append(task)
    # schedule awaitable tasks
    responses = await asyncio.gather(*tasks)
    uploaded_people: List[dict] = list(map(
        lambda r: r.get('data', {}),
        responses
    ))
    # execute
    return uploaded_people
