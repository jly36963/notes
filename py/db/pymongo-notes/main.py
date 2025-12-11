import json
import os
import uuid
from dotenv import load_dotenv
from src.dal.mongo import MongoDAL


def main():
    load_dotenv(verbose=True)
    _dev = os.getenv('PYTHON_ENV') != 'production'

    # Get client
    client = 'mongodb'
    host = os.environ['MONGO_HOST']
    port = os.environ['MONGO_PORT']
    user = os.environ['MONGO_USER']
    pw = os.environ['MONGO_PW']
    db_name = os.environ['MONGO_DB']
    connection_string = f"{client}://{user}:{pw}@{host}:{port}"
    mongo_dal = MongoDAL(connection_string, db_name)

    # Insert ninja
    insert_ninja_result = mongo_dal.insert_ninja({
        '_id': str(uuid.uuid4()),
        'firstName': 'Kakashi',
        'lastName': 'Hatake',
        'age': 27
    })
    assert insert_ninja_result
    ninja_id: str = insert_ninja_result['_id']
    print("insert_ninja_result", json.dumps(insert_ninja_result, indent=2))

    # Select ninja
    get_ninja_result = mongo_dal.get_ninja(ninja_id)

    print("get_ninja_result", json.dumps(get_ninja_result, indent=2))

    # Update ninja
    update_ninja_result = mongo_dal.update_ninja(ninja_id, {
        'firstName': 'Kaka',
        'lastName': 'Sensei',
    })
    print("update_ninja_result", json.dumps(update_ninja_result, indent=2))

    # Create jutsu
    insert_jutsu_result = mongo_dal.insert_jutsu({
        '_id': str(uuid.uuid4()),
        'name': 'Chidori',
        'chakraNature': 'Lightning',
        'description': 'Lightning blade'
    })
    assert insert_jutsu_result
    jutsu_id: str = insert_jutsu_result['_id']
    print("insert_jutsu_result", json.dumps(insert_jutsu_result, indent=2))

    # Select jutsu
    get_jutsu_result = mongo_dal.get_jutsu(insert_jutsu_result['_id'])

    print("get_jutsu_result", json.dumps(get_jutsu_result, indent=2))

    # Update jutsu
    update_jutsu_result = mongo_dal.update_jutsu(jutsu_id, {
        'description': 'A thousand birds'
    })
    print("update_jutsu_result", json.dumps(update_jutsu_result, indent=2))

    # Add association
    mongo_dal.add_known_jutsu(ninja_id, jutsu_id)
    print("add_known_jutsu_result: ok")

    # Get ninja with jutsu
    ninja_with_related_jutsu_result = mongo_dal.get_ninja_with_related_jutsu(ninja_id)
    print("ninja_with_related_jutsu_result", json.dumps(ninja_with_related_jutsu_result, indent=2))

    # Get jutsu with ninjas
    jutsu_with_related_ninja_result = mongo_dal.get_jutsu_with_related_ninja(jutsu_id)
    print("jutsu_with_related_ninja_result", json.dumps(jutsu_with_related_ninja_result, indent=2))

    # Remove association
    mongo_dal.remove_known_jutsu(ninja_id, jutsu_id)
    print("remove_known_jutsu_result: ok")

    # Get ninja with jutsu (post association)
    ninja_with_related_jutsu_result = mongo_dal.get_ninja_with_related_jutsu(ninja_id)
    print("ninja_with_related_jutsu_result", json.dumps(ninja_with_related_jutsu_result, indent=2))

    # Get jutsu with ninjas (post association)
    jutsu_with_related_ninja_result = mongo_dal.get_jutsu_with_related_ninja(jutsu_id)
    print("jutsu_with_related_ninja_result", json.dumps(jutsu_with_related_ninja_result, indent=2))


main()
