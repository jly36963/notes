from typing import Union, TypedDict, List
import datetime
from uuid import UUID


class NinjaNew(TypedDict):
    first_name: str
    last_name: str
    age: int


class NinjaUpdates(TypedDict, total=False):
    first_name: str
    last_name: str
    age: int


class Ninja(TypedDict):
    id: UUID
    first_name: str
    last_name: str
    age: int
    created_at: datetime.datetime
    updated_at: Union[datetime.datetime, None]
    jutsus: Union[List[dict], None]


class JutsuNew(TypedDict):
    name: str
    description: str
    chakra_nature: str


class JutsuUpdates(TypedDict, total=False):
    name: str
    description: str
    chakra_nature: str


class Jutsu(TypedDict):
    id: UUID
    name: str
    description: str
    chakra_nature: str
    created_at: datetime.datetime
    updated_at: Union[datetime.datetime, None]
