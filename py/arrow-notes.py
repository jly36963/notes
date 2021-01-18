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

import arrow
import json
from datetime import datetime, timezone

# ---
# arrow basics
# ---

examples = {
    # generate
    'get': arrow.get(),
    'get_from_datetime': arrow.get(datetime.now(timezone.utc)),
    'utc': arrow.utcnow(),
    'clone': arrow.utcnow().clone()
    # format
    'format_default': arrow.utcnow().format(),
    'format': arrow.utcnow().format('YYYY-MM-DD'),
    # properties
    'timestamp': arrow.utcnow().timestamp,
    'datetime': arrow.utcnow().datetime,
    'year': arrow.utcnow().year,
    'month': arrow.utcnow().month,
    'day': arrow.utcnow().day,
    # mutate
    'shift': arrow.utcnow().shift(hours=-1),
    'replace': arrow.utcnow().replace(hour=16),
    'floor': arrow.utcnow().floor('year'),
    'ceil': arrow.utcnow().ceil('year'),
    # timezones
    'to': arrow.utcnow().to('US/Pacific'),
    'humanize': arrow.utcnow().humanize(),
    'humanize_with_locale': arrow.utcnow().humanize(locale='is'),
}

print(
    'basic examples',
    json.dumps(examples, default=str, indent=2),
    sep='\n'
)


# ---
# arrow generator basics (range)
# ---

now = arrow.now()
first_day_of_year = arrow.now().floor('week')
dates_generator = arrow.Arrow.range('day', first_day_of_year, now)
print('generated dates')
for day in dates_generator:
    print(day.format('YYYY-MM-DD'))
