from typing import List
import uuid
import arrow
from pymongo import ReturnDocument, MongoClient
from ..types import Ninja, NinjaNew, NinjaUpdates, Jutsu, JutsuNew, JutsuUpdates


class MongoDAL():
    def __init__(self, connection_string: str, db_name: str) -> None:
        client = MongoClient(connection_string)
        self.db = client[db_name]

    # ---
    # Ninjas
    # ---

    def get_ninja(self, _id: str) -> Ninja | None:
        """Get a ninja from the db"""
        ninja: Ninja | None = self.db.ninjas.find_one({'_id': _id})
        return ninja

    def get_ninjas(self, conditions: dict) -> List[Ninja]:
        """Get a list of ninjas from the db"""
        ninjas: List[Ninja] = self.db.ninjas.find(conditions)
        return ninjas

    def insert_ninja(self, ninja: NinjaNew) -> Ninja | None:
        """Insert a ninja into the db"""
        result = self.db.ninjas.insert_one({
            '_id': str(uuid.uuid4()),
            **ninja,
            'createdAt': arrow.utcnow().format()
        })
        if result is None:
            return None
        return self.get_ninja(result.inserted_id)

    def update_ninja(self, _id: str, updates: NinjaUpdates) -> Ninja | None:
        """Update an existing ninja"""
        ninja: Ninja | None = self.db.ninjas.find_one_and_update(
            filter={'_id': _id},
            update={'$set': {
                **updates,
                'updatedAt': arrow.utcnow().format()
            }},
            return_document=ReturnDocument.AFTER
        )
        return ninja

    def delete_ninja(self, _id: str) -> Ninja | None:
        """Delete an existing ninja"""
        ninja: Ninja | None = self.db.ninjas.find_one_and_delete({'_id': _id})
        return ninja

    # ---
    # Jutsus
    # ---

    def get_jutsu(self, _id: str) -> Jutsu | None:
        """Get a jutsu from the db"""
        jutsu: Jutsu | None = self.db.jutsus.find_one({'_id': _id})
        return jutsu

    def get_jutsus(self, conditions: dict) -> List[Jutsu]:
        """Get a list of jutsus from the db"""
        jutsus: List[Jutsu] = self.db.jutsus.find(conditions)
        return jutsus

    def insert_jutsu(self, jutsu: JutsuNew) -> Jutsu | None:
        """Insert a new jutsu into the db"""
        result = self.db.jutsus.insert_one({
            '_id': str(uuid.uuid4()),
            **jutsu,
            'createdAt': arrow.utcnow().format()
        })
        if result is None:
            return None
        return self.get_jutsu(result.inserted_id)

    def update_jutsu(self, _id: str, updates: JutsuUpdates) -> Jutsu | None:
        """Update an existing jutsu in the db"""
        jutsu: Jutsu | None = self.db.jutsus.find_one_and_update(
            filter={'_id': _id},
            update={'$set': {
                **updates,
                'updatedAt': arrow.utcnow().format()
            }},
            return_document=ReturnDocument.AFTER
        )
        return jutsu

    def delete_jutsu(self, _id: str) -> Jutsu | None:
        """Delete an existing jutsu in the db"""
        jutsu = self.db.jutsus.find_one_and_delete({'_id': _id})
        return jutsu

    # ---
    # NinjasJutsus
    # ---

    def add_known_jutsu(self, ninja_id: str, jutsu_id: str) -> None:
        """Associate a ninja and jutsu"""
        self.db.ninjasJutsus.insert_one({
            '_id': str(uuid.uuid4()),
            "ninjaId": ninja_id,
            "jutsuId": jutsu_id,
            'createdAt': arrow.utcnow().format()
        })

    def remove_known_jutsu(self, ninja_id: str, jutsu_id: str) -> None:
        """Dissociate a ninja and jutsu"""
        self.db.ninjasJutsus.find_one_and_delete({
            "ninjaId": ninja_id,
            "jutsuId": jutsu_id,
        })

    def get_ninja_with_related_jutsu(self, _id: str) -> Ninja | None:
        """Get a ninja with its associated jutsu"""
        result = self.db.ninjas.aggregate([
            {"$match": {"_id": _id}},
            {"$lookup": {
                "from": "ninjasJutsus",
                "localField": "_id",
                "foreignField": "ninjaId",
                "as": "ninjasJutsus",
            }},
            {"$lookup": {
                "from": "jutsus",
                "localField": "ninjasJutsus.jutsuId",
                "foreignField": "_id",
                "as": "jutsus",
            }},
            {"$project": {"ninjasJutsus": 0}}
        ])

        ninjas = list(result)
        if not (ninjas and len(ninjas)):
            return None
        return ninjas[0]

    def get_jutsu_with_related_ninja(self, _id: str):
        """Get a jutsu with its associated ninjas"""
        result = self.db.jutsus.aggregate([
            {"$match": {"_id": _id}},
            {"$lookup": {
                "from": "ninjasJutsus",
                "localField": "_id",
                "foreignField": "jutsuId",
                "as": "ninjasJutsus",
            }},
            {"$lookup": {
                "from": "ninjas",
                "localField": "ninjasJutsus.ninjaId",
                "foreignField": "_id",
                "as": "ninjas",
            }},
            {"$project": {"ninjasJutsus": 0}}
        ])
        jutsus = list(result)
        if not (jutsus and len(jutsus)):
            return None
        return jutsus[0]
