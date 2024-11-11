import json
from typing import Dict
from datetime import datetime, timezone
import pendulum
from pendulum.tz import timezones
from pendulum.datetime import DateTime

# docs
# https://github.com/sdispater/pendulum
# https://pendulum.eustace.io/

# ---
# Main
# ---


def main() -> None:
    """Basic usage of pendulum"""
    print_section_title('basic pendulum creation')
    basic_pendulum_creation()

    print_section_title('basic pendulum parsing')
    basic_pendulum_parsing()

    print_section_title('basic pendulum format')
    basic_pendulum_format()

    print_section_title('basic pendulum properties')
    basic_pendulum_properties()

    print_section_title('basic pendulum mutations')
    basic_pendulum_mutations()


# ---
# Examples
# ---

def basic_pendulum_creation():
    """Create pendulum objects"""

    timezones_br = [t for t in timezones if 'brazil' in t.lower()]
    print('Brazil timezones', timezones_br)

    results: Dict[str, DateTime] = {
        'now': pendulum.now(),
        'now (timezone)': pendulum.now('Brazil/East'),
        'now (utc)': pendulum.now().in_tz('UTC'),
        'yesterday': pendulum.yesterday(),
        'today': pendulum.today(),
        'tomorrow': pendulum.tomorrow(),
        'instance': pendulum.instance(datetime.now(timezone.utc)),
        # TODO: clone
    }

    pretty_print_result_map(results)


def basic_pendulum_parsing():
    print('TODO')
    # TODO: from_format, parse,


def basic_pendulum_format():
    """Format pendulum objects to string"""
    now = pendulum.now()

    results: Dict[str, str] = {
        'format': now.format('YYYY-MM-DD'),
        'format (locale)': now.format('dddd DD MMMM YYYY', locale='pt_BR'),
        'to_iso8601_string': now.to_iso8601_string(),
        'to_datetime_string': now.to_datetime_string(),
        'to_atom_string': now.to_atom_string(),
        'to_cookie_string': now.to_cookie_string(),
    }

    pretty_print_result_map(results)


def basic_pendulum_properties():
    """Use properties of pendulum object"""
    now = pendulum.now()

    results: dict = {
        'year': now.year,
        'month': now.month,
        'day': now.day,
        'day_of_week': now.day_of_week,
        'days_in_month': now.days_in_month,
        'age': now.age,
        'timezone_name': now.timezone_name,
        'timestamp': now.timestamp(),  # Also: float_timestamp, int_timestamp
    }

    pretty_print_result_map(results)
    # Also: day_of_year, week_of_month, week_of_year,


def basic_pendulum_mutations():
    """Mutate pendulum DateTime object"""
    now = pendulum.now()
    results: Dict[str, DateTime] = {
        'add': now.add(hours=-1),
        'set': now.set(hour=16),
        'start_of': now.start_of('year'),
        'end_of': now.end_of('year'),
        'next': now.next(6),
        'previous': now.previous(6),
    }

    pretty_print_result_map(results)


# ---
# Utils
# ---


def print_section_title(string: str) -> None:
    print(f'\n{string.upper()}\n')


def map_res(val):
    """Map type to more print-friendly type"""
    if isinstance(val, DateTime):
        return val.to_iso8601_string()
    if isinstance(val, datetime):
        return repr(val)
    return val


def pretty_print_result_map(results: dict) -> None:
    """Convert values to more print-friendly types, then print"""
    mapped = {k: map_res(v) for k, v in results.items()}
    print(json.dumps(mapped, indent=2, ensure_ascii=False))


# ---
# Run
# ---


if __name__ == '__main__':
    main()
