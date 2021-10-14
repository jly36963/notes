# pymongo
from pymongo import ReturnDocument
# connection
from connections.mongo import db
# standard library
from contextlib import contextmanager
# package
import arrow

# collections

ninjas = db.ninjas
jutsus = db.jutsus

# DAL class


class MongoDAL():

    @staticmethod
    def get_document_from_result(result):
        document = result.ops[0]
        return document

    # ---
    # ninjas
    # ---

    def get_ninja(self, _id):
        ninja = ninjas.find_one({'_id': _id})
        return ninja

    def get_ninjas(self, conditions):
        ninjas = ninjas.find(conditions)
        return ninjas

    def insert_ninja(self, ninja):
        now = arrow.utcnow().format()
        result = ninjas.insert_one({
            **ninja,
            'createdAt': now
        })
        inserted_ninja = ninjas.find_one({'_id': result.inserted_id})
        return inserted_ninja

    def update_ninja(self, _id, updates):
        now = arrow.utcnow().format()
        updated_ninja = ninjas.find_one_and_update(
            filter={'_id': _id},
            update={'$set': {**updates, 'updatedAt': now}},
            return_document=ReturnDocument.AFTER
        )
        return updated_ninja

    def delete_ninja(self, _id):
        deleted_ninja = find_one_and_delete({'_id': _id})
        return deleted_ninja

    # ---
    # jutsus
    # ---

    def get_jutsu(self, _id):
        jutsu = jutsus.find_one({'_id': _id})
        return jutsu

    def get_jutsus(self, conditions):
        jutsus = jutsus.find(conditions)
        return jutsus

    def insert_jutsu(self, jutsu):
        now = arrow.utcnow().format()
        result = jutsus.insert_one({
            **jutsu,
            'createdAt': now
        })
        inserted_jutsu = jutsus.find_one({'_id': result.inserted_id})
        return inserted_jutsu

    def update_jutsu(self, _id, updates):
        now = arrow.utcnow().format()
        updated_jutsu = jutsus.find_one_and_update(
            filter={'_id': _id},
            update={'$set': {**updates, 'updatedAt': now}},
            return_document=ReturnDocument.AFTER
        )
        return updated_jutsu

    def delete_jutsu(self, _id):
        deleted_jutsu = find_one_and_delete({'_id': _id})
        return deleted_jutsu

    # ---
    # ninjas_jutsus
    # ---

    # query many-to-many
    # https://stackoverflow.com/a/39476690

    def get_ninja_with_related_jutsu(self, _id):
        ninja_with_related_jutsu = ninjas.aggregate([
            # condition
            {"$match": {'_id': _id}},
            # with related
            {'$lookup': {
                'from': 'jutsus',
                'localField': 'jutsuIds',
                'foreignField': '_id',
                'as': 'jutsus'
            }}
        ])
        return list(ninja_with_related_jutsu)

    def get_jutsu_with_related_ninja(self, _id):
        jutsu_with_related_ninja = jutsus.aggregate([
            # condition
            {"$match": {'_id': _id}},
            # with related
            {'$lookup': {
                'from': 'ninjas',
                'localField': 'ninjaIds',
                'foreignField': '_id',
                'as': 'ninjas'
            }}
        ])
        return list(jutsu_with_related_ninja)

    def add_known_jutsu(self, ninja_id, jutsu_id):
        now = arrow.utcnow().format()
        ninjas.find_one_and_update(
            {'_id': ninja_id},
            {'$push': {'jutsuIds': jutsu_id}, '$set': {'updatedAt': now}},
        )
        jutsus.find_one_and_update(
            {'_id': jutsu_id},
            {'$push': {'ninjaIds': ninja_id}, '$set': {'updatedAt': now}},
        )

    def remove_known_jutsu(self, ninja_id, jutsu_id):
        now = arrow.utcnow().format()
        ninjas.find_one_and_update(
            {'_id': ninja_id},
            {'$pull': {'jutsuIds': jutsu_id}, '$set': {'updatedAt': now}},
        )
        jutsus.find_one_and_update(
            {'_id': jutsu_id},
            {'$pull': {'ninjaIds': ninja_id}, '$set': {'updatedAt': now}},
        )
