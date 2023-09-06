import time
import random
import requests
from tenacity import retry, stop_after_attempt, stop_after_delay, wait_exponential, retry_if_exception_type

TIMEOUT = (1, 1)  # connect, read # Use small floats to force timeout
TIMEOUT_ERROR_TYPES = (
    requests.exceptions.ConnectTimeout,
    requests.exceptions.ReadTimeout
)


def main():
    print_section_title("basic_example")
    basic_example()

# ---
# Utils
# ---


def create_user(user_input: dict) -> None:
    """Pretent to create a user"""
    response = requests.request(
        'POST',
        "https://jsonplaceholder.typicode.com/users",
        json=user_input,
        timeout=TIMEOUT,
    )
    response.raise_for_status()


def random_sleep(max_seconds: int) -> None:
    """Sleep for a random number of seconds between 1 and max_seconds"""
    if max_seconds <= 1:
        raise ValueError("max_seconds must be greater than 1")
    seconds = random.randint(1, max_seconds)
    time.sleep(seconds)


def print_section_title(string: str) -> None:
    """Wrap with newlines, convert to uppercase, print"""
    print(f'\n{string.upper()}\n')


# ---
# Examples
# ---

@retry(
    # Exit condition (exit on whichever condition is met first)
    stop=(stop_after_attempt(2) | stop_after_delay(10)),
    # Wait between retries (exponential backoff)
    wait=wait_exponential(multiplier=1, min=2, max=10),
    # Re-raise original error (instead of tenacity.RetryError)
    reraise=True,
    # Only retry for certain types of errors
    retry=retry_if_exception_type(TIMEOUT_ERROR_TYPES),
)
def basic_example() -> None:
    """Basic example of tenacity decorator on a function"""
    # Will fail _without_ retry if 4xx or 5xx error
    # Will retry if connect/read timeout
    user = {
        "name": "Kakashi Hatake",
        "age": 27,
    }
    random_sleep(3)
    create_user(user)


if __name__ == "__main__":
    main()
