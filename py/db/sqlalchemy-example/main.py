# ---
# imports
# ---

# standard library
import sys
import os
# package imports
from dotenv import load_dotenv
# pg
from utils.pg import PostgresDAL


# ---
# dotenv
# ---

load_dotenv(verbose=True)
dev = os.getenv('PYTHON_ENV') != 'production'

# ---
# pg
# ---

pg_dal = PostgresDAL()


def main():
    # insert ninja
    pg_dal.insert_ninja(ninja={
        'first_name': 'Kakashi',
        'last_name': 'Hatake'
    })
    # select ninja
    ninja = pg_dal.get_ninja(id=1)
    # update ninja
    updated_ninja = pg_dal.update_ninja(id=1, updates={
        'first_name': 'Kaka',
        'last_name': 'Sensei',
    })
    # create jutsu
    pg_dal.insert_jutsu(jutsu={
        'name': 'Chidori',
        'chakra_nature': 'Lightning',
        'description': 'Lightning blade'
    })
    # select jutsu
    jutsu = pg_dal.get_jutsu(id=1)
    # update jutsu
    updated_jutsu = pg_dal.update_jutsu(id=1, updates={
        'description': 'A thousand birds'
    })
    # add association
    pg_dal.add_known_jutsu(ninja_id=1, jutsu_id=1)
    # get ninja with jutsu
    ninja_with_related_jutsu = pg_dal.get_ninja_with_related_jutsu(id=1)
    # get jutsu with ninjas
    jutsu_with_related_ninja = pg_dal.get_jutsu_with_related_ninja(id=1)

    print(
        "ninja", ninja,
        "jutsu", jutsu,
        "ninja_with_related_jutsu", ninja_with_related_jutsu,
        "jutsu_with_related_ninja", jutsu_with_related_ninja,
        sep='\n\n'
    )


main()
