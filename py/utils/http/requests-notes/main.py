import json
from typing import List
from src.utils import fetch


def main():
    """
    Example usage of fetch. Uses 'requests' library
    """
    results: List[dict] = []

    # Use fetch function (get)
    result: dict = fetch(url="https://jsonplaceholder.typicode.com/users/1")
    results.append(result)

    # Use fetch function (post)
    result: dict = fetch(
        url="https://jsonplaceholder.typicode.com/users",
        method='POST',
        payload={'name': "Hiruzen Sarutobi"},
        headers={
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Token': '7dda3fda-ce14-4ee4-bf8d-c04fd2571a4c'
        },
    )
    results.append(result)

    print(json.dumps(
        results,
        indent=2,
        default=str,
    ))


if __name__ == '__main__':
    main()
