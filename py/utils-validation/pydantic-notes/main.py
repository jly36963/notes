"""Pydantic examples"""

import json
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional, Type, TypeVar

import humps
from pydantic import (  # type: ignore # pylint: disable=E0611 # ruff: noqa
    BaseModel,
    StrictInt,
    StrictStr,
    validator,
)
from schema import And, Schema

# pylint: disable=C0115,E0213


# ---
# Types
# ---


class Village(Enum):
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
    FIRE = "Fire"
    WATER = "Water"
    WIND = "Wind"
    EARTH = "Earth"
    LIGHTNING = "Lightning"


def to_camel(string: str) -> str:
    """Convert snake to camel."""
    string_split = string.split("_")
    return string_split[0] + "".join(word.capitalize() for word in string_split[1:])


T = TypeVar("T")


def model_from_dict(model: Type[T], value: dict) -> T:
    """Convert dict to pydantic model."""
    snake = humps.decamelize(value)
    return model(**snake)


def model_from_json(model: Type[T], json_string: str) -> T:
    """Convert json to a pydantic model"""
    value = json.loads(json_string)
    return model_from_dict(model, value)


# # Not in v1.10
# from typing import Annotated
# from pydantic import StringConstraints
# StandardString = Annotated[
#     str,
#     StringConstraints(strict=True, min_length=2, max_length=50),
# ]


# # ConstrainedStr doesn't work with mypy/pylance
# class StandardString(ConstrainedStr):
#     """Ninja first and last name type."""

#     strict = True
#     min_length = 2
#     max_length = 50


def validate_standard_string(string: str) -> None:
    """Validate a string."""
    Schema(And(str, lambda s: 2 <= len(s) <= 50)).validate(string)


class Ninja(BaseModel):
    id: StrictStr
    first_name: StrictStr
    last_name: StrictStr
    age: StrictInt
    village: Village
    created_at: StrictStr
    updated_at: Optional[StrictStr] = None

    @validator("first_name")
    def _first_name_validator(cls, v):
        validate_standard_string(v)

    @validator("last_name")
    def _last_name_validator(cls, v):
        validate_standard_string(v)


class Jutsu(BaseModel):
    id: StrictStr
    name: StrictStr
    description: StrictStr
    chakra_nature: ChakraNature
    created_at: StrictStr
    updated_at: Optional[StrictStr] = None

    @validator("name")
    def _name_validator(cls, v):
        validate_standard_string(v)

    @validator("description")
    def _description(cls, v):
        validate_standard_string(v)


class NinjaWithJutsus(Ninja):
    jutsus: Optional[List[Jutsu]] = None


class JutsuWithNinjas(Jutsu):
    ninjas: Optional[List[Ninja]] = None


# ---
# Main
# ---


def main():
    """Pydantic examples."""
    print_section_title("Simple model")
    _simple_model()

    print_section_title("Model to/from dict")
    _model_and_dict()

    print_section_title("Model to/from json")
    _model_and_json()

    print_section_title("Model validations")
    _model_validations()


# ---
# Utils
# ---


def pipe(value, *funcs):
    """Unary piping."""
    for func in funcs:
        value = func(value)
    return value


def print_section_title(string: str) -> None:
    """Convert a string to uppercase, wrap in new lines, then print."""
    print("\n# ---")
    print(f"{string.upper()}")
    print("# ---\n")


def pretty_print_results(results: Dict[str, Any]) -> None:
    """Pretty print each key/value."""
    for k, v in results.items():
        print(k)
        print(type(v))
        print(v)
        print()


# ---
# Examples
# ---


def _simple_model():
    ninja = NinjaWithJutsus(
        id="09b89141-009a-447c-95eb-3d1b3d29c105",
        first_name="Kakashi",
        last_name="Hatake",
        age=27,
        village=Village.LEAF,
        created_at=str(datetime.now()),
        updated_at=None,
        jutsus=[
            Jutsu(
                id="af71a1be-4e21-44d0-a327-6d3ac1acbced",
                name="Chidori",
                description="Lightning blade",
                chakra_nature=ChakraNature.LIGHTNING,
                created_at=str(datetime.now()),
                updated_at=None,
            )
        ],
    )
    print(ninja)


def _model_and_dict():
    """Model to/from dict."""
    ninja = model_from_dict(
        NinjaWithJutsus,
        {
            "id": "09b89141-009a-447c-95eb-3d1b3d29c105",
            "firstName": "Kakashi",
            "lastName": "Hatake",
            "age": 27,
            "village": "Leaf",
            "createdAt": str(datetime.now()),
            "updatedAt": None,
            "jutsus": [
                {
                    "id": "af71a1be-4e21-44d0-a327-6d3ac1acbced",
                    "name": "Chidori",
                    "description": "Lightning blade",
                    "chakraNature": "Lightning",
                    "createdAt": str(datetime.now()),
                    "updatedAt": None,
                }
            ],
        },
    )
    print("ninja model")
    print(ninja)

    ninja2 = ninja.dict()
    print("ninja dict")
    print(ninja2)


def _model_and_json():
    """Model to/from json."""
    ninja_input_json = """
    {
        "id": "09b89141-009a-447c-95eb-3d1b3d29c105",
        "firstName": "Kakashi",
        "lastName": "Hatake",
        "age": 27,
        "village": "Leaf",
        "createdAt": "2024-11-11 11:42:51.620798",
        "updatedAt": null,
        "jutsus": [
            {
                "id": "af71a1be-4e21-44d0-a327-6d3ac1acbced",
                "name": "Chidori",
                "description": "Lightning blade",
                "chakraNature": "Lightning",
                "createdAt": "2024-11-11 11:42:51.620798",
                "updatedAt": null
            }
        ]
    }
    """.strip()
    ninja = model_from_json(NinjaWithJutsus, ninja_input_json)

    print("ninja model")
    print(ninja)

    ninja_output_json = ninja.json()
    print("ninja json")
    print(ninja_output_json)


def _model_validations():
    ninja = Ninja(
        id="09b89141-009a-447c-95eb-3d1b3d29c105",
        first_name="Kakashi",  # Succeeds
        # first_name=25, # Fails strict type
        # first_name="Kakashi" * 25, # Fails validation
        last_name="Hatake",
        age=27,
        village=Village.LEAF,
        created_at=str(datetime.now()),
        updated_at=None,
    )
    print(ninja)


# ---
# Run
# ---

main()

# ---
# Notes
# ---

# from pydantic import TypeAdaptor # v2 feature

# class Ninja(TypedDict):
#     id: str
#     firstName: str
#     lastName: str
#     age: int
#     village: Village
#     createdAt: str
#     updatedAt: NotRequired[str]


# class Jutsu(TypedDict):
#     id: str
#     name: str
#     description: str
#     chakraNature: str
#     createdAt: str
#     updatedAt: NotRequired[str]


# class NinjaWithJutsus(Ninja):
#     jutsus: List[Jutsu]


# class JutsuWithNinjas(Jutsu):
#     ninjas: List[Ninja]
