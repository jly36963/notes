import requests
from typing import Union
from urllib3.util.retry import Retry
from requests.adapters import HTTPAdapter


def fetch(
    url: str,
    method: str = 'GET',
    headers: Union[dict, None] = None,
    payload: Union[dict, list, None] = None,
    params: Union[dict, None] = None,
    retries: int = 3
) -> dict:
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

    with requests.Session() as r:
        if retries:
            max_retries = Retry(
                total=retries,
                backoff_factor=2,  # factor * (2 ** (num_of_retries - 1))
                status_forcelist=[500, 502, 503, 504]
            )
            r.mount('http://', HTTPAdapter(max_retries=max_retries))  # type: ignore
            r.mount('https://', HTTPAdapter(max_retries=max_retries))  # type: ignore

        response = r.request(
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
