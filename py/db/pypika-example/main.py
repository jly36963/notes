
from pprint import pprint
import psycopg2
from src.db.pg.pgdal import PGDAL


def main():
    # ---
    # setup
    # ---

    # get connection
    conn = psycopg2.connect(
        host="127.0.0.1",
        database="practice",
        user="postgres",
        password="postgres"
    )
    # get dal
    pg = PGDAL(conn)

    # ---
    # ninjas
    # ---

    # create ninja
    ninja = pg.create_ninja({
        'first_name': "Kakashi",
        'last_name': "Hatake",
        'age': 27
    })
    assert isinstance(ninja, dict)
    print("Ninja nsert result")
    pprint(ninja)
    # get ninja
    ninja = pg.get_ninja(ninja['id'])
    assert isinstance(ninja, dict)
    print("Ninja select result")
    pprint(ninja)
    # update ninja
    ninja = pg.update_ninja(ninja['id'], {'first_name': 'Kaka', 'last_name': 'Sensei'})
    assert isinstance(ninja, dict)
    print("Ninja update result")
    pprint(ninja)
    # delete ninja
    ninja = pg.delete_ninja(ninja['id'])
    assert isinstance(ninja, dict)
    print("Ninja delete result")
    pprint(ninja)

    # ---
    # jutsus
    # ---

    # create jutsu
    jutsu = pg.create_jutsu({
        'name': "Chidori",
        'chakra_nature': "Lightning",
        'description': 'Plover / a thousand birds'
    })
    assert isinstance(jutsu, dict)
    print("Jutsu insert result")
    pprint(jutsu)
    # get jutsu
    jutsu = pg.get_jutsu(jutsu['id'])
    assert isinstance(jutsu, dict)
    print("Jutsu select result")
    pprint(jutsu)
    # update jutsu
    jutsu = pg.update_jutsu(jutsu['id'], {'description': 'Lightning blade'})
    assert isinstance(jutsu, dict)
    print("Jutsu update result")
    pprint(jutsu)
    # delete jutsu
    jutsu = pg.delete_jutsu(jutsu['id'])
    assert isinstance(jutsu, dict)
    print("Jutsu delete result")
    pprint(jutsu)


main()
