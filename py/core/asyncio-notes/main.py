"""Async examples."""

import asyncio
import json
import urllib.request
from collections.abc import Callable
from typing import ParamSpec, TypeVar

# Docs: https://docs.python.org/3/library/asyncio.html
# Awaitables: can use "await" expression. (Eg: coroutines, tasks, futures)
# Future: eventual result of an async operation. Not thread-safe. (don't expose to user APIs)
# Coroutine: subroutine-like, declared with async/await syntax, runs once awaited.
# Task: future-like, object that runs a coroutine. Not thread-safe.
# Task Group: async context manager, convenient way to wait on related tasks

# ---
# Main
# ---


async def main():
    """Run async examples."""
    print_section_title("async sleep")
    await _basic_sleep()

    print_section_title("sync as async (1)")
    await _basic_sync_as_async1()

    print_section_title("sync as async (2)")
    await _basic_sync_as_async2()

    print_section_title("gather async tasks")
    await _basic_gather_async()


# ---
# Examples
# ---


async def _basic_sleep():
    await asyncio.sleep(1)
    print("done sleeping")


async def _basic_sync_as_async1():
    url = "https://jsonplaceholder.typicode.com/users/1"
    data = await run_async(_http_get, url)
    person = json.loads(data.decode("utf-8"))
    print(person)


async def _basic_sync_as_async2():
    url = "https://jsonplaceholder.typicode.com/users/1"
    data = await run_async2(_http_get, url)
    person = json.loads(data.decode("utf-8"))
    print(person)


async def _basic_gather_async():
    urls = [f"https://jsonplaceholder.typicode.com/users/{i}" for i in range(1, 4)]
    tasks = [run_async(_http_get, url) for url in urls]
    responses = await asyncio.gather(*tasks)
    data: list[dict] = [json.loads(r.decode("utf-8")) for r in responses]
    print(data)


# ---
# Utils
# ---


def _http_get(url: str) -> bytes:
    if not url.startswith(("http:", "https:")):
        raise ValueError("URL must start with 'http:' or 'https:'")
    with urllib.request.urlopen(url) as res:  # noqa: S310
        data = res.read()
        return data


def print_section_title(string: str) -> None:
    """Uppercase a string, wrap with new lines, print."""
    print(f"\n{string.upper()}\n")


# ---
# Utils (async)
# ---


Param = ParamSpec("Param")
Return = TypeVar("Return")


async def run_async(func: Callable[Param, Return], *args, **kwargs) -> Return:
    """Run a sync function as async (to_thread)."""
    # Runs a blocking func in a thread and returns a coroutine
    result = await asyncio.to_thread(func, *args, **kwargs)
    return result


async def run_async2(func: Callable[Param, Return], *args, **kwargs) -> Return:
    """Run a sync function as async (run_in_executor)."""
    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(None, func, *args, **kwargs)
    return result


# ---
# Run
# ---

if __name__ == "__main__":
    asyncio.run(main())
