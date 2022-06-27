from typing import List
import typer
from typer.testing import CliRunner

# Testing: https://typer.tiangolo.com/tutorial/testing/


def main():

    print("basic greet (positionals)".upper())
    basic_greet_positionals()

    print("basic greet (options)".upper())
    basic_greet_options()

    print("basic subcommands".upper())
    basic_subcommands()


# ---
# Basic Greet (positionals)
# ---

def basic_greet_positionals():
    runner = CliRunner()
    app = typer.Typer()

    @app.command()
    def greet(name: str) -> None:
        """A simple greet program (using arguments/positionals)"""
        typer.echo(f"Hello {name}")

    result = runner.invoke(app, ['Kakashi'])
    print(result.stdout)


# ---
# Basic Greet (options)
# ---

def basic_greet_options():
    runner = CliRunner()
    app = typer.Typer()

    @app.command()
    def greet(
        # name: str = typer.Option(...), # required
        name: str = typer.Option("friend", "--name", "-n"),
        count: int = typer.Option(1, "--count", "-c")
    ) -> None:
        """A simple greet program (using options)"""
        for _ in range(count):
            typer.echo(f"Hello {name}!")

    result = runner.invoke(app, ['-n', 'Kakashi', '-c', '2'])
    print(result.stdout)

# ---
# Basic subcommands
# ---


def basic_subcommands():
    runner = CliRunner()
    m = typer.Typer()

    @m.command()
    def add(a: int, b: int) -> None:
        result = a + b
        typer.echo(f"{a} + {b} = {result}")

    @m.command()
    def sub(a: int, b: int) -> None:
        result = a - b
        typer.echo(f"{a} - {b} = {result}")

    @m.command()
    def mul(a: int, b: int) -> None:
        result = a * b
        typer.echo(f"{a} * {b} = {result}")

    @m.command()
    def div(a: int, b: int) -> None:
        result = a / b if b else 0
        typer.echo(f"{a} / {b} = {result}")

    @m.command("sum")  # "sum" is a reserved word
    def sum_(numbers: List[int]) -> None:
        l = list(numbers)
        result = sum(l)
        typer.echo(f"sum({l}) = {result}")

    output = ""
    for example_input in [
        ['add', '2', '3'],
        ['sub', '2', '3'],
        ['mul', '2', '3'],
        ['div', '2', '3'],
        ['sum', '1', '2', '3', '4', '5']
    ]:
        result = runner.invoke(m, example_input)
        output += result.stdout

    print(output)

# ---
# Run
# ---


if __name__ == '__main__':
    main()
