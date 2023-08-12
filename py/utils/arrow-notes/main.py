import json
from typing import Generator, List, Dict
from datetime import datetime, timezone
import arrow

# docs
# https://arrow.readthedocs.io/en/stable/

# detailed api
# https://arrow.readthedocs.io/en/stable/#api-guide

# timezones
# https://github.com/arrow-py/arrow/blob/master/arrow/locales.py

# ---
# Main
# ---


def main() -> None:
    """Basic usage of arrow."""
    print_section_title('basic arrow creation')
    basic_arrow_creation()

    print_section_title('basic arrow format')
    basic_arrow_format()

    print_section_title('basic arrow properties')
    basic_arrow_properties()

    print_section_title('basic arrow mutations')
    basic_arrow_mutations()

    print_section_title('basic arrow timezone')
    basic_arrow_timezone()

    print_section_title('basic arrow generator')
    basic_arrow_generator()


# ---
# Utils
# ---


def print_section_title(string: str) -> None:
    print(f'\n{string.upper()}\n')


def map_res(val):
    """Map type to more print-friendly type"""
    if isinstance(val, datetime):
        return repr(val)
    if isinstance(val, arrow.Arrow):
        return repr(val)
    return val


def pretty_print_result_map(results: dict) -> None:
    """Convert values to more print-friendly types, then print"""
    print(json.dumps({k: map_res(v) for k, v in results.items()}, indent=2))

# ---
# Examples
# ---


def basic_arrow_creation():
    """Create arrow objects"""
    results: Dict[str, arrow.Arrow] = {
        'get': arrow.get(),
        'get_from_datetime': arrow.get(datetime.now(timezone.utc)),
        'utc': arrow.utcnow(),
        'clone': arrow.utcnow().clone(),
    }

    pretty_print_result_map(results)


def basic_arrow_format():
    """Format arrow objects to string"""
    results: Dict[str, str] = {
        'format_default': arrow.utcnow().format(),
        'format': arrow.utcnow().format('YYYY-MM-DD'),
    }

    pretty_print_result_map(results)


def basic_arrow_properties():
    """Use properties of arrow object"""
    results: dict = {
        'arrow_to_timestamp': arrow.utcnow().timestamp(),
        'arrow_to_datetime': arrow.utcnow().datetime,
        'year': arrow.utcnow().year,
        'month': arrow.utcnow().month,
        'day': arrow.utcnow().day,
    }

    pretty_print_result_map(results)


def basic_arrow_mutations():
    """Mutate arrow object"""
    results: Dict[str, arrow.Arrow] = {
        'shift': arrow.utcnow().shift(hours=-1),
        'replace': arrow.utcnow().replace(hour=16),
        'floor': arrow.utcnow().floor('year'),
        'ceil': arrow.utcnow().ceil('year'),
    }

    pretty_print_result_map(results)


def basic_arrow_timezone():
    """arrow timezone logic"""
    results: Dict[str, arrow.Arrow | str] = {
        'timezone_to': arrow.utcnow().to('US/Pacific'),
        'humanize': arrow.utcnow().humanize(),
        'humanize_with_locale': arrow.utcnow().humanize(locale='is'),
    }

    pretty_print_result_map(results)


def basic_arrow_generator():
    '''Example usage of arrow date generator'''
    now: arrow.Arrow = arrow.now()
    first_day_of_week: arrow.Arrow = arrow.now().floor('week')
    dates_generator: Generator[arrow.Arrow, None, None] = arrow.Arrow.range('day', first_day_of_week, now)
    generated_dates: List[str] = []
    for day in dates_generator:  # type: ignore
        generated_dates.append(day.format('YYYY-MM-DD'))  # type: ignore
    print('Generated Dates')
    print(generated_dates)

# ---
# Run
# ---


if __name__ == '__main__':
    main()
