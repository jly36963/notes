"""Types."""

import datetime
from typing import TypedDict
from uuid import UUID


class NinjaNew(TypedDict):
    """Create ninja input."""

    first_name: str
    last_name: str
    age: int


class NinjaUpdates(TypedDict, total=False):
    """Update ninja input."""

    first_name: str
    last_name: str
    age: int


class Ninja(TypedDict):
    """A ninja."""

    id: UUID
    first_name: str
    last_name: str
    age: int
    created_at: datetime.datetime
    updated_at: datetime.datetime | None
    jutsus: list["Jutsu"] | None


class JutsuNew(TypedDict):
    """Create jutsu input."""

    name: str
    description: str
    chakra_nature: str


class JutsuUpdates(TypedDict, total=False):
    """Update jutsu input."""

    name: str
    description: str
    chakra_nature: str


class Jutsu(TypedDict):
    """A jutsu."""

    id: UUID
    name: str
    description: str
    chakra_nature: str
    created_at: datetime.datetime
    updated_at: datetime.datetime | None
