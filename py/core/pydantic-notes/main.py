# ---
# types
# ---

# imports
from typing import List, Optional
from datetime import datetime, date
from pydantic import BaseModel


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
