from typing import Union
from cerberus import Validator

# Docs: https://docs.python-cerberus.org/en/stable/


def main():
    """Validate with cerberus"""
    ninja_validator = Validator({
        'first_name': {'type': 'string'},
        'last_name': {'type': 'string'},
        'age': {'type': 'integer'},
    }, require_all=True)

    validated_ninja: Union[dict, None] = ninja_validator.validated({
        'first_name': 'Kakashi',
        'last_name': 'Hatake',
        'age': 27
    })

    if not validated_ninja:
        raise TypeError('Invalid ninja')

    print('result:', validated_ninja)


if __name__ == '__main__':
    main()
