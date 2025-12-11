from typing import List
import uuid
import arrow
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import ReturnDocument


from ..types import Ninja, NinjaNew, NinjaUpdates, Jutsu, JutsuNew, JutsuUpdates


class MongoDAL():
    def __init__(self, connection_string: str, db_name: str) -> None:
        client = AsyncIOMotorClient(connection_string)
        self.db = client[db_name]

    # ---
    # Ninjas
    # ---

    async def get_ninja(self, _id: str) -> Ninja | None:
        """Get a ninja from the db"""
        ninja: Ninja | None = await self.db.ninjas.find_one({'_id': _id})
        return ninja

    async def get_ninjas(self, conditions: dict) -> List[Ninja]:
        """Get a list of ninjas from the db"""
        cursor = self.db.ninjas.find(conditions)
        ninjas: List[Ninja] = await cursor.to_list(length=None)
        return ninjas

    async def insert_ninja(self, ninja: NinjaNew) -> Ninja | None:
        """Insert a ninja into the db"""
        result = await self.db.ninjas.insert_one({
            '_id': str(uuid.uuid4()),
            **ninja,
            'createdAt': arrow.utcnow().format()
        })
        if result is None:
            return None
        return await self.get_ninja(result.inserted_id)

    async def update_ninja(self, _id: str, updates: NinjaUpdates) -> Ninja | None:
        """Update an existing ninja"""
        ninja: Ninja | None = await self.db.ninjas.find_one_and_update(
            filter={'_id': _id},
            update={'$set': {
                **updates,
                'updatedAt': arrow.utcnow().format()
            }},
            return_document=ReturnDocument.AFTER
        )
        return ninja

    async def delete_ninja(self, _id: str) -> Ninja | None:
        """Delete an existing ninja"""
        ninja: Ninja | None = await self.db.ninjas.find_one_and_delete({'_id': _id})
        return ninja

    # ---
    # Jutsus
    # ---

    async def get_jutsu(self, _id: str) -> Jutsu | None:
        """Get a jutsu from the db"""
        jutsu: Jutsu | None = await self.db.jutsus.find_one({'_id': _id})
        return jutsu

    async def get_jutsus(self, conditions: dict) -> List[Jutsu]:
        """Get a list of jutsus from the db"""
        cursor = self.db.jutsus.find(conditions)
        jutsus: List[Jutsu] = await cursor.to_list(length=None)
        return jutsus

    async def insert_jutsu(self, jutsu: JutsuNew) -> Jutsu | None:
        """Insert a new jutsu into the db"""
        result = await self.db.jutsus.insert_one({
            '_id': str(uuid.uuid4()),
            **jutsu,
            'createdAt': arrow.utcnow().format()
        })
        if result is None:
            return None
        return await self.get_jutsu(result.inserted_id)

    async def update_jutsu(self, _id: str, updates: JutsuUpdates) -> Jutsu | None:
        """Update an existing jutsu in the db"""
        jutsu: Jutsu | None = await self.db.jutsus.find_one_and_update(
            filter={'_id': _id},
            update={'$set': {
                **updates,
                'updatedAt': arrow.utcnow().format()
            }},
            return_document=ReturnDocument.AFTER
        )
        return jutsu

    async def delete_jutsu(self, _id: str) -> Jutsu | None:
        """Delete an existing jutsu in the db"""
        jutsu = await self.db.jutsus.find_one_and_delete({'_id': _id})
        return jutsu

    # ---
    # NinjasJutsus
    # ---

    async def add_known_jutsu(self, ninja_id: str, jutsu_id: str) -> None:
        """Associate a ninja and jutsu"""
        await self.db.ninjasJutsus.insert_one({
            '_id': str(uuid.uuid4()),
            "ninjaId": ninja_id,
            "jutsuId": jutsu_id,
            'createdAt': arrow.utcnow().format()
        })

    async def remove_known_jutsu(self, ninja_id: str, jutsu_id: str) -> None:
        """Dissociate a ninja and jutsu"""
        await self.db.ninjasJutsus.find_one_and_delete({
            "ninjaId": ninja_id,
            "jutsuId": jutsu_id,
        })

    async def get_ninja_with_related_jutsu(self, _id: str) -> Ninja | None:
        """Get a ninja with its associated jutsu"""
        cursor = self.db.ninjas.aggregate([
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

        ninjas = await cursor.to_list(length=None)
        if not (ninjas and len(ninjas)):
            return None
        return ninjas[0]

    async def get_jutsu_with_related_ninja(self, _id: str):
        """Get a jutsu with its associated ninjas"""
        cursor = self.db.jutsus.aggregate([
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
        jutsus = await cursor.to_list(length=None)
        if not (jutsus and len(jutsus)):
            return None
        return jutsus[0]
