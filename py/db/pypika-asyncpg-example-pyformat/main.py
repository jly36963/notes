"""Pypika/asyncpg examples."""

import asyncio

import asyncpg

from src.db.pg.pgdal import PgDal
from src.types import JutsuNew, NinjaNew


async def main():
    """Run pypika examples."""
    conn: asyncpg.connection.Connection = await asyncpg.connect(
        host="127.0.0.1",
        database="practice",
        user="postgres",
        password="postgres",  # noqa: S106
    )
    pg = PgDal(conn)

    # Create ninja
    ninja_input = NinjaNew(
        first_name="Kakashi",
        last_name="Hatake",
        age=27,
    )
    ninja = await pg.create_ninja(ninja_input)
    if not isinstance(ninja, dict):
        raise RuntimeError()
    print("Ninja insert result:", ninja)

    # Get ninja
    ninja = await pg.get_ninja(ninja["id"])
    if not isinstance(ninja, dict):
        raise RuntimeError()
    print("Ninja select result:", ninja)

    # Update ninja
    ninja = await pg.update_ninja(
        ninja["id"], {"first_name": "Kaka", "last_name": "Sensei"}
    )
    if not isinstance(ninja, dict):
        raise RuntimeError()
    print("Ninja update result:", ninja)

    # Create jutsu
    jutsu_input = JutsuNew(
        name="Chidori",
        chakra_nature="Lightning",
        description="Plover / a thousand birds",
    )
    jutsu = await pg.create_jutsu(jutsu_input)
    if not isinstance(jutsu, dict):
        raise RuntimeError()
    print("Jutsu insert result:", jutsu)

    # Get jutsu
    jutsu = await pg.get_jutsu(jutsu["id"])
    if not isinstance(jutsu, dict):
        raise RuntimeError()
    print("Jutsu select result:", jutsu)

    # Update jutsu
    jutsu = await pg.update_jutsu(jutsu["id"], {"description": "Lightning blade"})
    if not isinstance(jutsu, dict):
        raise RuntimeError()
    print("Jutsu update result:", jutsu)

    # Associate ninja & jutsu
    await pg.associate_ninja_and_jutsu(ninja["id"], jutsu["id"])
    print("Associate ninja & jutsu result: ok")

    # Get ninja with jutsus
    ninja_with_jutsus = await pg.get_ninja_with_jutsus(ninja["id"])
    if not isinstance(ninja, dict):
        raise RuntimeError()
    print("Ninja with jutsus result:", ninja_with_jutsus)

    # Dissociate ninja & jutsu
    await pg.dissociate_ninja_and_jutsu(ninja["id"], jutsu["id"])
    print("Associate ninja & jutsu result: ok")

    # Get ninja with jutsus (post dissociation)
    ninja_with_jutsus = await pg.get_ninja_with_jutsus(ninja["id"])
    if not isinstance(ninja, dict):
        raise RuntimeError()
    print("Ninja with jutsus result (post dissociation):", ninja_with_jutsus)

    # Delete ninja
    ninja = await pg.delete_ninja(ninja["id"])
    if not isinstance(ninja, dict):
        raise RuntimeError()
    print("Ninja delete result:", ninja)

    # Delete jutsu
    jutsu = await pg.delete_jutsu(jutsu["id"])
    if not isinstance(jutsu, dict):
        raise RuntimeError()
    print("Jutsu delete result:", jutsu)


asyncio.run(main())
