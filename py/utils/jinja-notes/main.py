from datetime import datetime
import json
from typing import Any, Dict

from babel.support import Translations
from jinja2 import Environment, PackageLoader, select_autoescape

# TODO: macro/call, filter, extends, include


def main():
    env = Environment(
        loader=PackageLoader("main"),
        autoescape=select_autoescape()
    )

    print_section_title("Interpolation")
    basic_interpolation(env)

    print_section_title("Fallback")
    basic_fallback(env)

    print_section_title("Looping")
    basic_looping(env)

    print_section_title("If")
    basic_if(env)

    print_section_title("Ternary")
    basic_ternary(env)

    print_section_title("Filter")
    basic_filter(env)

    print_section_title("Testing")
    basic_testing(env)

    print_section_title("i18n")
    basic_i18n(env)


# ---
# Utils
# ---


def print_section_title(string: str) -> None:
    """Wrap with newlines, convert to uppercase, print"""
    print(f'\n{string.upper()}\n')


def map_res(val: Any) -> Any:
    """Map type to more print-friendly type"""
    # if isinstance(val, DataFrame):
    #     return df_to_records(val)
    return val


def pretty_print_result_map(results: Dict[str, Any]) -> None:
    """Convert values to more print-friendly types, then pretty print"""
    print(json.dumps({k: map_res(v) for k, v in results.items()}, indent=2))


# ---
# Examples
# ---

def basic_get_template(env: Environment) -> None:
    """Get template from file"""
    # Find template at './templates/template.md'
    template = env.get_template("template.md")
    print(template.render(phrase="Finland!"))


INTERPOLATION_TEMPLATE = 'Hello there {{ name }}'


def basic_interpolation(env: Environment) -> None:
    """Interpolation example"""
    template = env.from_string(INTERPOLATION_TEMPLATE)
    print(template.render(name="Kakashi"))


FALLBACK_TEMPLATE = "Hello there {{ name or 'friend' }}"


def basic_fallback(env: Environment) -> None:
    """Fallback example"""
    template = env.from_string(FALLBACK_TEMPLATE)
    print(template.render())


LOOPING_TEMPLATE = '''
Numbers:
{% for number in numbers %}
- {{ number }}
{% endfor %}
'''.strip()


def basic_looping(env: Environment) -> None:
    """Loop example"""
    template = env.from_string(LOOPING_TEMPLATE)
    print(template.render(numbers=[1, 2, 3, 4, 5]))


IF_TEMPLATE = '''
{% if is_morning %}
Have a great morning!
{% else %}
Have a great day!
{% endif %}
'''.strip()


def basic_if(env: Environment) -> None:
    """If example"""
    dt = datetime.now()
    is_morning = dt.hour < 12
    template = env.from_string(IF_TEMPLATE)
    print(template.render(is_morning=is_morning))


TERNARY_TEMPLATE = "Have a great {{ 'morning' if is_morning else 'day' }}!"


def basic_ternary(env: Environment) -> None:
    """Ternary example"""
    dt = datetime.now()
    is_morning = dt.hour < 12
    template = env.from_string(TERNARY_TEMPLATE)
    print(template.render(is_morning=is_morning))


FILTER_TEMPLATE = "Patrick yells: {{ phrase|upper }}!"


def basic_filter(env: Environment) -> None:
    """Filter example"""
    template = env.from_string(FILTER_TEMPLATE)
    print(template.render(phrase="Finland"))


TESTING_TEMPLATE = '''
{% if name is defined %}
Hey there {{ name }}! How are you doing?
{% else %}
Hey! Nice to meet you!
{% endif %}
'''.strip()


def basic_testing(env: Environment) -> None:
    """Filter example"""
    template = env.from_string(TESTING_TEMPLATE)
    print(template.render())


I18N_TEMPLATE = """
{% trans %}
Hey there {{ name }}! How are you?
{% endtrans %}
"""


def basic_i18n(env: Environment) -> None:
    """i18n example"""
    # Add translation extension
    env.add_extension('jinja2.ext.i18n')
    translations = Translations.load(
        dirname='i18n',
        locales=["pt", "en"]
    )
    env.install_gettext_translations(translations)  # type: ignore

    # Not sure how to make this work
    # Babel does not make sense to me
    # I wish python had something simple like 'y18n'
    template = env.from_string(I18N_TEMPLATE)
    print(template.render(name='Kakashi'))


# ---
# Run
# ---

if __name__ == '__main__':
    main()
