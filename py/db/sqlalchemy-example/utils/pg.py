# standard library
from contextlib import contextmanager

# package
import arrow

# connection
from connections.pg import Session

# marshmallow
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema
from marshmallow_sqlalchemy.fields import Nested
from models.join_tables.ninjas_jutsus import NinjaJutsu
from models.jutsu import Jutsu

# models
from models.ninja import Ninja
from sqlalchemy import inspect
from sqlalchemy.orm import noload

# marshmallow schemas


class SmartNested(Nested):
    def serialize(self, attr, obj, accessor=None):
        if attr not in obj.__dict__:
            return {"id": int(getattr(obj, attr + "_id"))}
        return super(SmartNested, self).serialize(attr, obj, accessor)


class NinjaSchema(SQLAlchemyAutoSchema):
    jutsus = Nested("NinjaJutsuSchema", exclude=("jutsu", "ninja"), many=True)

    class Meta:
        model = Ninja
        include_relationships = True


class JutsuSchema(SQLAlchemyAutoSchema):
    ninjas = Nested("NinjaJutsuSchema", exclude=("ninja", "jutsu"), many=True)

    class Meta:
        model = Jutsu
        include_relationships = True


class NinjaJutsuSchema(SQLAlchemyAutoSchema):
    jutsu = Nested("JutsuSchema")
    ninja = Nested("NinjaSchema")

    class Meta:
        model = NinjaJutsu
        include_relationships = True


ninja_schema = NinjaSchema()
jutsu_schema = JutsuSchema()
ninja_jutsu_schema = NinjaJutsuSchema()

# DAL class


class PostgresDAL:
    @staticmethod
    @contextmanager
    def get_session():
        session = Session()
        try:
            yield session
            session.commit()
        except:
            session.rollback()
            raise
        finally:
            session.close()

    @staticmethod
    def row_to_dict(row):
        return {c.key: getattr(row, c.key) for c in inspect(row).mapper.column_attrs}

    # ---
    # ninjas
    # ---

    def get_ninja(self, ninja_id):
        with self.get_session() as session:
            ninja = (
                session.query(Ninja)
                .options(noload("jutsus"))
                .filter(Ninja.id == ninja_id)
                .filter(Ninja.deleted_at == None)
                .first()
            )
            row = ninja_schema.dump(ninja)
            return row

    def insert_ninja(self, ninja):
        # prepare record
        ninja_record = Ninja(**ninja)
        # insert record
        with self.get_session() as session:
            session.add(ninja_record)
            return

    def update_ninja(self, ninja_id, updates):
        with self.get_session() as session:
            (
                session.query(Ninja)
                .filter(Ninja.id == ninja_id)
                .filter(Ninja.deleted_at == None)
                .update(updates)
            )
            return

    def delete_ninja(self, ninja_id):
        now = arrow.utcnow().format()
        with self.get_session() as session:
            (
                session.query(Ninja)
                .filter(Ninja.id == ninja_id)
                .filter(Ninja.deleted_at == None)
                .update({"deleted_at", now})
            )
            return

    # ---
    # jutsus
    # ---

    def get_jutsu(self, jutsu_id):
        with self.get_session() as session:
            jutsu = (
                session.query(Jutsu)
                .options(noload("ninjas"))
                .filter(Jutsu.id == jutsu_id)
                .filter(Jutsu.deleted_at == None)
                .first()
            )
            row = jutsu_schema.dump(jutsu)
            return row

    def insert_jutsu(self, jutsu):
        # prepare record
        jutsu_record = Jutsu(**jutsu)
        # insert record
        with self.get_session() as session:
            session.add(jutsu_record)
            return

    def update_jutsu(self, jutsu_id, updates):
        with self.get_session() as session:
            (
                session.query(Jutsu)
                .filter(Jutsu.id == jutsu_id)
                .filter(Jutsu.deleted_at == None)
                .update(updates)
            )
            return

    def delete_jutsu(self, jutsu_id):
        now = arrow.utcnow().format()
        with self.get_session() as session:
            (
                session.query(Jutsu)
                .filter(Jutsu.id == jutsu_id)
                .filter(Jutsu.deleted_at == None)
                .update({"deleted_at", now})
            )
            return

    # ---
    # ninjas_jutsus
    # ---

    def get_ninja_with_related_jutsu(self, ninja_id):
        with self.get_session() as session:
            ninja = (
                session.query(Ninja)
                .filter(Ninja.id == ninja_id)
                .filter(Ninja.deleted_at == None)
                .first()
            )
            row = ninja_schema.dump(ninja)
            return row

    def get_jutsu_with_related_ninja(self, jutsu_id):
        with self.get_session() as session:
            jutsu = (
                session.query(Jutsu)
                .filter(Jutsu.id == jutsu_id)
                .filter(Jutsu.deleted_at == None)
                .first()
            )
            row = jutsu_schema.dump(jutsu)
            return row

    def add_known_jutsu(self, ninja_id, jutsu_id):
        # prepare record
        join_record = NinjaJutsu(ninja_id=ninja_id, jutsu_id=jutsu_id)
        # insert record
        with self.get_session() as session:
            session.add(join_record)
            return

    def remove_known_jutsu(self, ninja_id, jutsu_id):
        pass
