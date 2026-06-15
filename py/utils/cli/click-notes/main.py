from typing import Tuple
import click


def main():
    print("basic greet (positionals)".upper())
    basic_greet_positionals(['Kakashi'], standalone_mode=False)

    print("basic greet (options)".upper())
    basic_greet_options(['-n', 'Kakashi', '-c', '2'], standalone_mode=False)

    print("basic subcommands".upper())
    m(['add', '2', '3'], standalone_mode=False)
    m(['sub', '2', '3'], standalone_mode=False)
    m(['mul', '2', '3'], standalone_mode=False)
    m(['div', '2', '3'], standalone_mode=False)
    m(['sum', '1', '2', '3', '4', '5'], standalone_mode=False)


# ---
# Basic Greet (positionals)
# ---


@click.command()
@click.argument('name', default="friend")
def basic_greet_positionals(name: str) -> None:
    """
    A simple greet program (using arguments/positionals)
    """
    click.echo(f"Hello {name}")

# ---
# Basic Greet (options)
# ---


@click.command()
@click.option('-n', '--name', default='friend', help='The person to greet')
@click.option('-c', '--count', default=1, help='Number of times to greet')
def basic_greet_options(name: str, count: int) -> None:
    """
    A simple greet program (using options)
    """
    for _ in range(count):
        click.echo(f"Hello {name}!")


# ---
# Basic subcommands
# ---


@click.group()
def m():
    pass


@m.command()
@click.argument('a', type=int)
@click.argument('b', type=int)
def add(a: int, b: int) -> None:
    result = a + b
    click.echo(f"{a} + {b} = {result}")


@m.command()
@click.argument('a', type=int)
@click.argument('b', type=int)
def sub(a: int, b: int) -> None:
    result = a - b
    click.echo(f"{a} - {b} = {result}")


@m.command()
@click.argument('a', type=int)
@click.argument('b', type=int)
def mul(a: int, b: int) -> None:
    result = a * b
    click.echo(f"{a} * {b} = {result}")


@m.command()
@click.argument('a', type=int)
@click.argument('b', type=int)
def div(a: int, b: int) -> None:
    result = a / b if b else 0
    click.echo(f"{a} / {b} = {result}")


@m.command("sum")  # "sum" is a reserved word
@click.argument('numbers', nargs=-1, type=int)
def sum_(numbers: Tuple[int]) -> None:
    l = list(numbers)
    result = sum(l)
    click.echo(f"sum({l}) = {result}")

# ---
# Run
# ---


if __name__ == '__main__':
    main()

# ---
# Notes
# ---

# docs -- https://click.palletsprojects.com/en/8.0.x/

# click.command -- decorates a function and makes it a click coomand line tool
# click.echo -- more robust to different environments. Also supports styling.
# click.argument -- positional arguments
# click.option -- options
# option aliases -- when multiple passed, last is converted to snake case and used as var name

# dry running -- call command/group with arguments (List[str]) to invoke command
# standalone_mode -- don't exit after command completes
