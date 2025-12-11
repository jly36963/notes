from schema import Schema, And

# Docs: https://github.com/keleshev/schema


def main():
    """Validate with jsonschema"""
    ninja_schema = Schema({
        'first_name': And(str, len),
        'last_name': And(str, len),
        'age': And(int, lambda a: a >= 0),
    })

    ninja = {
        'first_name': 'Kakashi',
        'last_name': 'Hatake',
        'age': 27,
        # 'oops': 'extra',
    }

    try:
        validated_ninja = ninja_schema.validate(ninja)
        print(validated_ninja)
    except Exception as err:
        print(err)


if __name__ == '__main__':
    main()
