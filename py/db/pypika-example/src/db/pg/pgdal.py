from typing import Union, List, Dict, Any
import psycopg2
import psycopg2.extensions
from pypika import Table, PostgreSQLQuery
from pypika.terms import FormatParameter
from ...types.types import NinjaNew, NinjaUpdates, Ninja, JutsuNew, JutsuUpdates, Jutsu
from enum import Enum


class Tables(Enum):
    Ninjas = 'ninjas'
    Jutsus = 'jutsus'
    NinjasJutsus = 'ninjas_jutsus'


class PGDAL:
    def __init__(self, conn: psycopg2.extensions.connection):
        self.conn = conn

    # ---
    # Internal
    # ---

    @staticmethod
    def get_dicts_from_cursor(cursor: psycopg2.extensions.cursor) -> Union[List[Dict[str, Any]], None]:
        """Convert cursor data into dict"""
        if not cursor.description:
            return None
        columns = [desc[0] for desc in cursor.description]
        values_list = cursor.fetchall()
        rows = []
        for values in values_list:
            row = dict(zip(columns, values))
            rows.append(row)
        return rows

    def execute_raw(
        self,
        query: str,
        args: Union[list, None]
    ) -> Union[Any, None]:
        """Executes query in transaction and returns cursor result"""
        conn = self.conn
        result = None
        with conn.cursor() as cursor:
            cursor: psycopg2.extensions.cursor
            result = cursor.execute(query, args) if args else cursor.execute(query)
        conn.commit()
        return result

    def execute_query(
        self,
        query: str,
        args: Union[list, None] = None
    ) -> Union[Any, None]:
        """Executes query in transaction and returns rows"""
        conn = self.conn
        rows = None
        with conn.cursor() as cursor:
            cursor: psycopg2.extensions.cursor
            cursor.execute(query, args) if args else cursor.execute(query)
            rows = self.get_dicts_from_cursor(cursor)
        conn.commit()
        return rows

    # ---
    # Ninjas
    # ---

    def create_ninja(self, ninja_new: NinjaNew) -> Union[Ninja, None]:
        """Create a ninja and return it"""
        table = Table(Tables.Ninjas.value)
        args: List[Any] = []
        qb = PostgreSQLQuery\
            .into(table)\
            .columns(*ninja_new.keys())\
            .insert(*[FormatParameter() for _ in ninja_new.keys()])\
            .returning('*')
        args += list(ninja_new.values())
        sql = str(qb)
        rows = self.execute_query(sql, args)
        return rows[0] if (rows and len(rows)) else None

    def get_ninja(self, id_: str) -> Union[Ninja, None]:
        """Get a ninja by id"""
        table = Table(Tables.Ninjas.value)
        args: List[Any] = []
        qb = PostgreSQLQuery\
            .from_(table)\
            .select('*')\
            .where(table.id == FormatParameter())
        args.append(id_)
        sql = str(qb)
        rows = self.execute_query(sql, args)
        return rows[0] if (rows and len(rows)) else None

    def update_ninja(self, id_: str, ninja_updates: NinjaUpdates) -> Union[Ninja, None]:
        """Update a ninja by id and return it"""
        table = Table(Tables.Ninjas.value)
        args: List[Any] = []
        qb = PostgreSQLQuery\
            .update(table)\
            .where(table.id == FormatParameter())\
            .returning('*')\

        for k, v in ninja_updates.items():
            qb = qb.set(table[k], FormatParameter())
            args.append(v)
        args.append(id_)
        sql = str(qb)
        rows = self.execute_query(sql, args)
        return rows[0] if (rows and len(rows)) else None

    def delete_ninja(self, id_: str) -> Union[Ninja, None]:
        """Delete a ninja and return it"""
        table = Table(Tables.Ninjas.value)
        args: List[Any] = []
        qb = PostgreSQLQuery\
            .from_(table)\
            .delete()\
            .where(table.id == FormatParameter())\
            .returning('*')

        args.append(id_)
        sql = str(qb)
        rows = self.execute_query(sql, args)
        return rows[0] if (rows and len(rows)) else None

    # ---
    # Jutsus
    # ---

    def create_jutsu(self, jutsu_new: JutsuNew) -> Union[Jutsu, None]:
        """Create a jutsu and return it"""
        table = Table(Tables.Jutsus.value)
        args: List[Any] = []
        qb = PostgreSQLQuery\
            .into(table)\
            .columns(*jutsu_new.keys())\
            .insert(*[FormatParameter() for _ in jutsu_new.keys()])\
            .returning('*')

        args += list(jutsu_new.values())
        sql = str(qb)
        rows = self.execute_query(sql, args)
        return rows[0] if (rows and len(rows)) else None

    def get_jutsu(self, id_: str) -> Union[Jutsu, None]:
        """Get a jutsu by id"""
        table = Table(Tables.Jutsus.value)
        args: List[Any] = []
        qb = PostgreSQLQuery\
            .from_(table)\
            .select('*')\
            .where(table.id == FormatParameter())

        args.append(id_)
        sql = str(qb)
        rows = self.execute_query(sql, args)
        return rows[0] if (rows and len(rows)) else None

    def update_jutsu(self, id_: str, jutsu_updates: JutsuUpdates) -> Union[Jutsu, None]:
        """Update a ninja by id and return it"""
        table = Table(Tables.Jutsus.value)
        args: List[Any] = []
        qb = PostgreSQLQuery\
            .update(table)\
            .where(table.id == FormatParameter())\
            .returning('*')

        for k, v in jutsu_updates.items():
            qb = qb.set(table[k], FormatParameter())
            args.append(v)
        args.append(id_)
        sql = str(qb)
        rows = self.execute_query(sql, args)
        return rows[0] if (rows and len(rows)) else None

    def delete_jutsu(self, id_: str) -> Union[Jutsu, None]:
        """Delete a jutsu and return it"""
        table = Table(Tables.Jutsus.value)
        args: List[Any] = []
        qb = PostgreSQLQuery\
            .from_(table)\
            .delete()\
            .where(table.id == FormatParameter())\
            .returning('*')

        args.append(id_)
        sql = str(qb)
        rows = self.execute_query(sql, args)
        return rows[0] if (rows and len(rows)) else None

    # ---
    # ninjas_jutsus
    # ---

    def associate_ninja_and_jutsu(self, ninja_id: str, jutsu_id: str) -> None:
        """Associate a ninja and jutsu"""
        table = Table(Tables.NinjasJutsus.value)
        args: List[Any] = []
        qb = PostgreSQLQuery\
            .into(table)\
            .columns([table.ninja_id, table.jutsu_id])\
            .insert(FormatParameter(), FormatParameter())\
            .returning('*')

        args.append(ninja_id)
        args.append(jutsu_id)
        sql = str(qb)
        self.execute_query(sql, args)
        return

    def dissociate_ninja_and_jutsu(self, ninja_id: str, jutsu_id: str) -> None:
        """Dissociate a ninja and jutsu"""
        table = Table(Tables.NinjasJutsus.value)
        args: List[Any] = []
        qb = PostgreSQLQuery\
            .from_(table)\
            .delete()\
            .where(
                (table.ninja_id == FormatParameter()) &
                (table.jutsu_id == FormatParameter())
            )

        args.append(ninja_id)
        args.append(jutsu_id)
        sql = str(qb)
        self.execute_query(sql, args)
        return

    def get_ninja_with_jutsus(self, ninja_id: str) -> Union[Ninja, None]:
        """Get ninja with associated jutsus"""
        ninjas_table = Table(Tables.Ninjas.value)
        jutsus_table = Table(Tables.Jutsus.value)
        ninjas_jutsus_table = Table(Tables.NinjasJutsus.value)

        # Get ninja
        args: List[Any] = []
        qb = (
            PostgreSQLQuery
            .from_(ninjas_table)
            .select("*")
            .where(ninjas_table.id == FormatParameter())
        )
        args.append(ninja_id)
        sql = str(qb)
        rows = self.execute_query(sql, args)
        ninja = rows[0] if (rows and len(rows)) else None

        # Get jutsus
        args: List[Any] = []
        qb = PostgreSQLQuery\
            .from_(jutsus_table)\
            .select("*")\
            .where(jutsus_table.id.isin(
                PostgreSQLQuery
                .from_(ninjas_jutsus_table)
                .select(ninjas_jutsus_table.jutsu_id)
                .where(ninjas_jutsus_table.ninja_id == FormatParameter())
            ))

        args.append(ninja_id)
        sql = str(qb)
        jutsus = self.execute_query(sql, args) or []

        # Result
        if not ninja:
            return None
        ninja['jutsus'] = jutsus
        return ninja
