# ---
# arrow
# ---

# install
# pip install arrow

# docs
# https://arrow.readthedocs.io/en/stable/

# detailed api
# https://arrow.readthedocs.io/en/stable/#api-guide

# timezones
# https://github.com/arrow-py/arrow/blob/master/arrow/locales.py


# ---
# imports
# ---

import json
from typing import Dict, Any, Generator, List
from datetime import datetime, timezone
import arrow


def main() -> None:
    """
    Basic usage of arrow.
    """
    # ---
    # arrow basics
    # ---

    get: arrow.Arrow = arrow.get()
    get_from_datetime: arrow.Arrow = arrow.get(datetime.now(timezone.utc))
    utc: arrow.Arrow = arrow.utcnow()
    clone: arrow.Arrow = arrow.utcnow().clone()
    format_default: str = arrow.utcnow().format()
    format_yyyy_mm_dd: str = arrow.utcnow().format('YYYY-MM-DD')
    arrow_to_timestamp: float = arrow.utcnow().timestamp()
    arrow_to_datetime: datetime = arrow.utcnow().datetime
    year: int = arrow.utcnow().year
    month: int = arrow.utcnow().month
    day: int = arrow.utcnow().day
    shift: arrow.Arrow = arrow.utcnow().shift(hours=-1)
    replace: arrow.Arrow = arrow.utcnow().replace(hour=16)
    floor: arrow.Arrow = arrow.utcnow().floor('year')
    ceil: arrow.Arrow = arrow.utcnow().ceil('year')
    timezone_to: arrow.Arrow = arrow.utcnow().to('US/Pacific')
    humanize: str = arrow.utcnow().humanize()
    humanize_with_locale: str = arrow.utcnow().humanize(locale='is')

    examples: Dict[str, Any] = {
        # generate
        'get': get,
        'get_from_datetime': get_from_datetime,
        'utc': utc,
        'clone': clone,
        # format
        'format_default': format_default,
        'format': format_yyyy_mm_dd,
        # properties
        'arrow_to_timestamp': arrow_to_timestamp,
        'arrow_to_datetime': arrow_to_datetime,
        'year': year,
        'month': month,
        'day': day,
        # mutate
        'shift': shift,
        'replace': replace,
        'floor': floor,
        'ceil': ceil,
        # timezones
        'timezone_to': timezone_to,
        'humanize': humanize,
        'humanize_with_locale': humanize_with_locale,
    }

    basics_output: str = json.dumps(examples, default=str, indent=2)

    print(
        'Basic Usage:',
        basics_output,
        sep='\n'
    )

    # ---
    # arrow generator basics (range)
    # ---

    now: arrow.Arrow = arrow.now()
    first_day_of_week: arrow.Arrow = arrow.now().floor('week')
    dates_generator: Generator[arrow.Arrow, None, None] = arrow.Arrow.range('day', first_day_of_week, now)
    generated_dates: List[str] = []
    for day in dates_generator:  # type: ignore
        generated_dates.append(day.format('YYYY-MM-DD'))  # type: ignore
    print('Generated Dates')
    print(generated_dates)


if __name__ == '__main__':
    main()
