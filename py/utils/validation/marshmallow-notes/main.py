import datetime
import json
from typing import List, NotRequired, TypedDict

from marshmallow import Schema, fields

# ---
# Docs
# ---

# https://github.com/marshmallow-code/marshmallow
# https://marshmallow.readthedocs.io/en/latest/

# ---
# Types
# ---


class Ninja(TypedDict):
    id: str
    firstName: str
    lastName: str
    age: int
    createdAt: str
    updatedAt: NotRequired[str]


class Jutsu(TypedDict):
    id: str
    name: str
    description: str
    chakraNature: str
    createdAt: str
    updatedAt: NotRequired[str]


class NinjaWithJutsus(Ninja):
    jutsus: List[Jutsu]


class JutsuWithNinjas(Jutsu):
    ninjas: List[Ninja]


# ---
# Schemas
# ---


class JutsuSchema(Schema):
    id = fields.UUID(required=True)
    name = fields.Str(required=True)
    description = fields.Str(required=True)
    chakra_nature = fields.Str(data_key="chakraNature", required=True)
    created_at = fields.DateTime(data_key="createdAt", required=True)
    updated_at = fields.DateTime(data_key="updatedAt")


class NinjaSchema(Schema):
    id = fields.UUID(required=True)
    first_name = fields.Str(data_key="firstName", required=True)
    last_name = fields.Str(data_key="lastName", required=True)
    age = fields.Int(required=True)
    created_at = fields.DateTime(data_key="createdAt", required=True)
    updated_at = fields.DateTime(data_key="updatedAt")


class NinjaWithJutsusSchema(NinjaSchema):
    jutsus = fields.Nested(JutsuSchema(many=True))


# ---
# Notes
# ---

# Useful schema params:
# many: List[dict] as input for dump/load/etc
# only: limit fields (during dump/deserialization)
# partial: partial fields (during load/serialization)
# unknown: define behavior for handling unanticipated fields

# DateTime and UUID fields require string values, are then loaded into type

# Union types not supported
# Transforms during load/dump not supported
# Custom Field, Function, or serialize/deserialize behavior instead
# Field: https://marshmallow.readthedocs.io/en/stable/marshmallow.fields.html#marshmallow.fields.Field
# Function: https://marshmallow.readthedocs.io/en/stable/marshmallow.fields.html#marshmallow.fields.Function


# ---
# Main
# ---


def main():
    """Examples of marshmallow usage"""
    ninja = NinjaWithJutsus(
        id="09b89141-009a-447c-95eb-3d1b3d29c105",
        firstName="Kakashi",
        lastName="Hatake",
        age=27,
        createdAt=str(datetime.datetime.now()),
        jutsus=[
            Jutsu(
                id="af71a1be-4e21-44d0-a327-6d3ac1acbced",
                name="Chidori",
                description="Lightning blade",
                chakraNature="Lightning",
                createdAt=str(datetime.datetime.now()),
            )
        ],
    )
    # ninja: NinjaWithJutsus = {
    #     'id': '09b89141-009a-447c-95eb-3d1b3d29c105',
    #     'firstName': 'Kakashi',
    #     'lastName': 'Hatake',
    #     'age': 27,
    #     'createdAt': str(datetime.datetime.now()),
    #     'jutsus': [{
    #         'id': 'af71a1be-4e21-44d0-a327-6d3ac1acbced',
    #         'name': 'Chidori',
    #         'description': 'Lightning blade',
    #         'chakraNature': 'Lightning',
    #         'createdAt': str(datetime.datetime.now()),
    #     }]
    # }

    # dump (Eg: dict -> dict) (no validation during serialization)
    dump_res: dict = NinjaWithJutsusSchema().dump(ninja)
    print("dump:", dump_res)

    # dumps (Eg: dict -> json string) (no validation during serialization)
    dumps_res: str = NinjaWithJutsusSchema().dumps(ninja)
    print("dumps:", dumps_res)

    # load (eg: dict -> dict) (validates and deserializes)
    load_res: dict = NinjaWithJutsusSchema().load(ninja)
    print("load:", load_res)

    # loads (eg: json string -> dict) (validates and deserializes)
    loads_res: dict = NinjaWithJutsusSchema().loads(json.dumps(ninja))
    print("loads:", loads_res)

    # Validate (validate without deserialization)
    NinjaWithJutsusSchema().validate(ninja)


if __name__ == "__main__":
    main()
