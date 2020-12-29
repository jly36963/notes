# imports


import sys, os, json
import arrow

# arrow basics

now = arrow.now()
first_day_of_year = arrow.now().floor('year')
dates_generator = arrow.Arrow.range('day', first_day_of_year, now)
dates = list(map(
    lambda x: x.format('YYYY-MM-DD'),
    list(dates_generator)
))

print(
    f"now: {now}",
    f"formatted_now: {formatted_now}",
    f"first_day_of_year: {first_day_of_year}",
    # f"dates: {dates}",
    sep="\n"
)

# arrow generator basics

now = arrow.now()
first_day_of_year = arrow.now().floor('year')
dates_generator = arrow.Arrow.range('day', first_day_of_year, now)
for day in dates_generator:
    print(day.format('YYYY-MM-DD'))