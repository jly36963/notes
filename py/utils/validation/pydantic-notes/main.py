"""Pydantic v1 examples."""

import json
from dataclasses import asdict, is_dataclass
from datetime import date, datetime
from enum import Enum
from typing import Any, TypeVar
from uuid import UUID

from pydantic import BaseModel, Field, PositiveInt, StrictStr  # pylint: disable=E0611;

# ---
# Types
# ---


class Village(Enum):
    """TODO."""

    LEAF = "Leaf"
    SAND = "Sand"
    MIST = "Mist"
    CLOUD = "Cloud"
    STONE = "Stone"
    GRASS = "Grass"
    WATERFALLS = "Waterfalls"
    RAIN = "Rain"
    SNOW = "Snow"
    STAR = "Star"


class ChakraNature(Enum):
    """TODO."""

    FIRE = "Fire"
    WATER = "Water"
    WIND = "Wind"
    EARTH = "Earth"
    LIGHTNING = "Lightning"


class Ninja(BaseModel):
    """TODO."""

    id: UUID
    first_name: StrictStr = Field(
        default=...,
        min_length=2,
        max_length=50,
        alias="firstName",
    )
    last_name: StrictStr = Field(
        default=...,
        min_length=2,
        max_length=50,
        alias="lastName",
    )
    birthday: date
    age: PositiveInt
    village: Village
    created_at: datetime = Field(default=..., alias="createdAt")
    updated_at: datetime | None = Field(default=None, alias="updatedAt")

    class Config:
        """Pydantic models (v1) config."""

        allow_population_by_field_name = True


class Jutsu(BaseModel):
    """TODO."""

    id: UUID
    name: StrictStr = Field(default=..., min_length=2, max_length=50)
    description: StrictStr = Field(default=..., min_length=2, max_length=50)
    difficulty: int = Field(default=..., ge=1, le=5)
    chakra_nature: ChakraNature = Field(default=..., alias="chakraNature")
    created_at: datetime = Field(default=..., alias="createdAt")
    updated_at: datetime | None = Field(default=None, alias="updatedAt")

    class Config:
        """Pydantic models (v1) config."""

        allow_population_by_field_name = True


class NinjaWithJutsus(Ninja):
    """TODO."""

    jutsus: list[Jutsu] | None = None

    class Config:
        """Pydantic models (v1) config."""

        allow_population_by_field_name = True


# ---
# Utils
# ---


M = TypeVar("M", bound=BaseModel)


def model_from_json(model: type[M], json_string: str) -> M:
    """Convert json to a pydantic model."""
    return model.parse_obj(json.loads(json_string))


def model_to_dict(model: BaseModel) -> dict:
    """Convert a pydantic model instance to a dict."""
    return model.dict(by_alias=True, exclude_none=True)


def safe_json_dumps(obj, **kwargs) -> str:
    """Safely handle special objects during serialization."""
    return json.dumps(obj, cls=SafeJSONEncoder, **kwargs)


class SafeJSONEncoder(json.JSONEncoder):
    """JSON encoder for dataclasses."""

    def default(self, o: Any):  # noqa: PLR0911
        """Return asdict if obj is a dataclass."""
        if is_dataclass(o) and not isinstance(o, type):
            return asdict(o)
        if isinstance(o, BaseModel):
            return model_to_dict(o)
        if isinstance(o, Enum):
            return o.value
        if isinstance(o, datetime):
            return o.isoformat()
        if isinstance(o, date):
            return o.isoformat()
        if isinstance(o, UUID):
            return str(o)
        return super().default(o)


def main():
    """Pydantic serde examples."""
    # Inputs
    ninja_input_dict = {
        "id": "09b89141-009a-447c-95eb-3d1b3d29c105",
        "firstName": "Kakashi",
        "lastName": "Hatake",
        "birthday": "1997-09-15",
        "age": 27,
        "village": "Leaf",
        "createdAt": str(datetime.now()),
        "updatedAt": None,
        "jutsus": [
            {
                "id": "af71a1be-4e21-44d0-a327-6d3ac1acbced",
                "name": "Chidori",
                "difficulty": 3,
                "description": "Lightning blade",
                "chakraNature": "Lightning",
                "createdAt": str(datetime.now()),
                "updatedAt": None,
            }
        ],
    }

    # Deserialize
    ninja = NinjaWithJutsus.parse_obj(ninja_input_dict)

    # Serialize
    ninja_dict = ninja.dict(exclude_none=True)  # Still snake case
    print(f"ninja_dict: {ninja_dict}")
    ninja_dict = model_to_dict(ninja)  # Camel case
    print(f"ninja_dict: {ninja_dict}")
    ninja_json = safe_json_dumps(ninja_dict)  # Camel case
    print(f"ninja_json: {ninja_json}")
    ninja_json = ninja.json(by_alias=True, exclude_none=True)  # Camel case
    print(f"ninja_json: {ninja_json}")


main()
