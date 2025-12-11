from typing import Union, TypedDict, List
import datetime


class NinjaNew(TypedDict):
    _id: str
    firstName: str
    lastName: str
    age: int


class NinjaUpdates(TypedDict, total=False):
    _id: str
    firstName: str
    lastName: str
    age: int


class Ninja(TypedDict):
    _id: str
    firstName: str
    lastName: str
    age: int
    createdAt: datetime.datetime
    updatedAt: datetime.datetime | None
    jutsus: List["Jutsu"] | None


class JutsuNew(TypedDict):
    _id: str
    name: str
    description: str
    chakraNature: str


class JutsuUpdates(TypedDict, total=False):
    name: str
    description: str
    chakra_nature: str


class Jutsu(TypedDict):
    _id: str
    name: str
    description: str
    chakraNature: str
    createdAt: datetime.datetime
    updatedAt: Union[datetime.datetime, None]
    ninjas: List["Ninja"] | None
