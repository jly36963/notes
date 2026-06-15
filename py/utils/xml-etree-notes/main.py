"""XML notes."""

import xml.etree.ElementTree as et

import lxml.etree as le
from lxml import objectify
from pydantic_xml import BaseXmlModel, attr, element

# ---
# Types
# ---


class Address(BaseXmlModel):
    """TODO."""

    street: str = element()
    city: str | None = element(default=None)
    state: str = element()
    zip: str = element()


class Customer(BaseXmlModel):
    """TODO."""

    id: str = attr()
    name: str = element()
    address: list[Address] = element()


class Customers(BaseXmlModel, tag="customers"):
    """TODO."""

    customer: list[Customer] = element()


# ---
# Constants
# ---

CUSTOMERS = """
<?xml version="1.0"?>
<customers>
   <customer id="55000">
      <name>Charter Group</name>
      <address>
         <street>100 Main</street>
         <city>Framingham</city>
         <state>MA</state>
         <zip>01701</zip>
      </address>
      <address>
         <street>720 Prospect</street>
         <city>Framingham</city>
         <state>MA</state>
         <zip>01701</zip>
      </address>
      <address>
         <street>120 Ridge</street>
         <state>MA</state>
         <zip>01760</zip>
      </address>
   </customer>
</customers>
"""


def _get_customers_xml() -> str:
    return CUSTOMERS.strip()


# ---
# Main
# ---


def main():
    """Run examples."""
    examples = {
        "simple-std": _simple_std,
        "simple-intro": _simple_intro,
        "simple-objectify": _simple_objectify,
        "simple-pydantic": _simple_pydantic,
    }

    for title, example_fn in examples.items():
        print_section_title(title)
        example_fn()


# ---
# Utils
# ---


def print_section_title(string: str) -> None:
    """Convert a string to uppercase, wrap in new lines, then print."""
    print(f"\n# ---\n# {string.upper()}\n# ---\n")


# ---
# Examples
# ---


def _simple_std():
    cust_xml = _get_customers_xml()
    customers = et.fromstring(cust_xml)  # noqa: S314
    results = {
        "name": customers.findall("customer")[0].find("name").text,  # type: ignore
        "names": [n.text for n in customers.findall("customer//name")],
        "zips": [z.text for z in customers.findall("customer//address//zip")],
    }
    print(results)


def _simple_intro():
    cust_xml = _get_customers_xml()
    customers = le.fromstring(cust_xml)
    results = {
        "name": customers.findall("customer")[0].find("name").text,  # type: ignore
        "names": [n.text for n in customers.findall("customer//name")],
        "zips": [z.text for z in customers.findall("customer//address//zip")],
    }
    print(results)


def _simple_objectify():
    cust_xml = _get_customers_xml()
    customers = objectify.fromstring(cust_xml)

    results = {
        "name": customers.customer[0].name,  # type: ignore
        "zip": customers.customer.address[0].zip,  # type: ignore
        "names": [n.text for n in customers.findall("customer//name")],
        "zips": [a.text for a in customers.findall("customer//address//zip")],
    }
    print(results)


def _simple_pydantic():
    cust_xml = _get_customers_xml()
    customers = Customers.from_xml(cust_xml)

    results = {
        "name": customers.customer[0].name,
        "names": [n.name for n in customers.customer],
        "zips": [a.zip for c in customers.customer for a in c.address],
    }
    print(results)


# ---
# Run
# ---

main()
