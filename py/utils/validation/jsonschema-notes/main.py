import jsonschema

# Docs: https://python-jsonschema.readthedocs.io/en/stable/
# Ref: https://json-schema.org/understanding-json-schema/


def main():
    """Validate with jsonschema"""
    schema = {
        "type": "object",
        "properties": {
            'first_name': {'type': 'string', },
            'last_name': {'type': 'string'},
            'age': {'type': 'integer'},
        },
        "required": ['first_name', 'last_name', 'age'],
        "additionalProperties": False
    }

    ninja = {
        'first_name': 'Kakashi',
        'last_name': 'Hatake',
        'age': 27,
        'oops': 'extra',
    }

    try:
        jsonschema.validate(instance=ninja, schema=schema)
    except jsonschema.ValidationError as err:
        print(err.message)


if __name__ == '__main__':
    main()
