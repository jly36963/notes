# ---
# imports
# ---

# standard library
import sys
import os
# package imports
from dotenv import load_dotenv
# pg
from utils.mongo import MongoDAL


# ---
# dotenv
# ---

load_dotenv(verbose=True)
dev = os.getenv('PYTHON_ENV') != 'production'

# ---
# mongo
# ---

mongo_dal = MongoDAL()

# ---
# main
# ---


def main():
    # insert ninja
    inserted_ninja = mongo_dal.insert_ninja(
        ninja={
            'firstName': 'Kakashi',
            'lastName': 'Hatake'
        }
    )
    # select ninja
    ninja = mongo_dal.get_ninja(_id=inserted_ninja['_id'])
    # update ninja
    updated_ninja = mongo_dal.update_ninja(
        _id=ninja['_id'],
        updates={
            'firstName': 'Kaka',
            'lastName': 'Sensei',
        }
    )
    # create jutsu
    inserted_jutsu = mongo_dal.insert_jutsu(
        jutsu={
            'name': 'Chidori',
            'chakraNature': 'Lightning',
            'description': 'Lightning blade'
        }
    )
    # select jutsu
    jutsu = mongo_dal.get_jutsu(_id=inserted_jutsu['_id'])
    # update jutsu
    updated_jutsu = mongo_dal.update_jutsu(
        _id=jutsu['_id'],
        updates={'description': 'A thousand birds'}
    )
    # add association
    mongo_dal.add_known_jutsu(
        ninja_id=ninja['_id'],
        jutsu_id=jutsu['_id']
    )
    # get ninja with jutsu
    ninja_with_related_jutsu = (
        mongo_dal.get_ninja_with_related_jutsu(_id=ninja['_id'])
    )
    # get jutsu with ninjas
    jutsu_with_related_ninja = (
        mongo_dal.get_jutsu_with_related_ninja(_id=jutsu['_id'])
    )

    print(
        "ninja", ninja,
        "jutsu", jutsu,
        "ninja_with_related_jutsu", ninja_with_related_jutsu,
        "jutsu_with_related_ninja", jutsu_with_related_ninja,
        sep='\n\n'
    )


main()
