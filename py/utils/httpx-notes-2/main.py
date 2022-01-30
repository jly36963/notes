import asyncio
import json
from typing import List, Dict, Any
from src.examples import with_for_loop, with_gather, with_sema


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
