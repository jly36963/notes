# ---
# types
# ---

# imports
from typing import List, Dict, Set, Tuple, Optional
from datetime import datetime, date
from pydantic import BaseModel

# ---
# types
# ---

# simple types
str
int
float
bool
bytes

# generic types
dict
list
set
tuple

# ---
# simple type (example)
# ---

# without types


def get_full_name(a, b):
    return f"{a.title()} {b.title()}"


# with types
def gfn(a: str, b: str) -> str:
    return f"{a.title()} {b.title()}"


# ---
# container type (example)
# ---

# list
def double_sum(integers: List[int]) -> int:
    return sum(integers) * 2


# dict
def print_dict(names: Dict[str, str]) -> None:
    for fn, ln in names.items():
        print(fn, ln)


# optional (default params)
def greet(name: Optional[str] = "friend") -> str:
    return f"Hello {name}!"


# tuple
Tuple[int, int, str]  # specify types for each

# set
Set[bytes]  # type for all

# ---
# classes
# ---

# class


class Person:
    def __init__(self, name: str):
        self.name = name


# class as param
def get_person_name(one_person: Person):
    return one_person.name


# ---
# pydantic (type validation) (example 1)
# ---


class User(BaseModel):
    id: int
    name = "John Doe"
    signup_ts: Optional[datetime] = None
    friends: List[int] = []


external_data = {
    "id": "123",
    "signup_ts": "2017-06-01 12:22",
    "friends": [1, "2", b"3"],
}
user = User(**external_data)
print(user)
# > User id=123 name='John Doe' signup_ts=datetime.datetime(2017, 6, 1, 12, 22) friends=[1, 2, 3]
print(user.id)
# > 123

# ---
# pydantic (type validation) (example 2)
# ---


def main(user_id: str):
    return user_id


class Account(BaseModel):
    id: int
    name: str
    joined: date


my_account: Account = Account(id=3, name="John Doe", joined="2018-07-19")

second_account_data = {
    "id": 4,
    "name": "Mary",
    "joined": "2018-11-30",
}

my_second_account: Account = Account(**second_account_data)

