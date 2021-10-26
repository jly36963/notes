
from pprint import pprint
import asyncio
import asyncpg
from src.db.pg.pgdal import PGDAL


async def main():
    # get connection
    conn: asyncpg.connection.Connection = await asyncpg.connect(
        host="127.0.0.1",
        database="practice",
        user="postgres",
        password="postgres"
    )
    # get dal
    pg = PGDAL(conn)

    # create ninja
    ninja = await pg.create_ninja({
        'first_name': "Kakashi",
        'last_name': "Hatake",
        'age': 27
    })
    print(type(ninja))
    assert isinstance(ninja, dict)
    print("Ninja insert result")
    pprint(ninja)

    # get ninja
    ninja = await pg.get_ninja(ninja['id'])
    assert isinstance(ninja, dict)
    print("Ninja select result")
    pprint(ninja)

    # update ninja
    ninja = await pg.update_ninja(ninja['id'], {'first_name': 'Kaka', 'last_name': 'Sensei'})
    assert isinstance(ninja, dict)
    print("Ninja update result")
    pprint(ninja)

    # create jutsu
    jutsu = await pg.create_jutsu({
        'name': "Chidori",
        'chakra_nature': "Lightning",
        'description': 'Plover / a thousand birds'
    })
    assert isinstance(jutsu, dict)
    print("Jutsu insert result")
    pprint(jutsu)

    # get jutsu
    jutsu = await pg.get_jutsu(jutsu['id'])
    assert isinstance(jutsu, dict)
    print("Jutsu select result")
    pprint(jutsu)

    # update jutsu
    jutsu = await pg.update_jutsu(jutsu['id'], {'description': 'Lightning blade'})
    assert isinstance(jutsu, dict)
    print("Jutsu update result")
    pprint(jutsu)

    # associate ninja & jutsu
    await pg.associate_ninja_and_jutsu(ninja['id'], jutsu['id'])
    print("Associate ninja & jutsu result: ok")

    # get ninja with jutsus
    ninja_with_jutsus = await pg.get_ninja_with_jutsus(ninja['id'])
    assert isinstance(ninja, dict)
    print("Ninja with jutsus result")
    pprint(ninja_with_jutsus)

    # dissociate ninja & jutsu
    await pg.dissociate_ninja_and_jutsu(ninja['id'], jutsu['id'])
    print("Associate ninja & jutsu result: ok")

    # get ninja with jutsus (post dissociation)
    ninja_with_jutsus = await pg.get_ninja_with_jutsus(ninja['id'])
    assert isinstance(ninja, dict)
    print("Ninja with jutsus result (post dissociation)")
    pprint(ninja_with_jutsus)

    # delete ninja
    ninja = await pg.delete_ninja(ninja['id'])
    assert isinstance(ninja, dict)
    print("Ninja delete result")
    pprint(ninja)

    # delete jutsu
    jutsu = await pg.delete_jutsu(jutsu['id'])
    assert isinstance(jutsu, dict)
    print("Jutsu delete result")
    pprint(jutsu)


asyncio.run(main())
