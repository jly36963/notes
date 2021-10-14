from typing import Union, List, Dict, Any
import psycopg2
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

    @staticmethod
    def get_dicts_from_cursor(cursor: psycopg2.extensions.cursor) -> Union[List[Dict[str, Any]], None]:
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
        """
        Executes query in transaction and returns cursor result
        """
        print('Query')
        print(query)
        print('Args')
        print(args)
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
        """
        Executes query in transaction and returns rows
        """
        print('Query')
        print(query)
        print('Args')
        print(args)
        conn = self.conn
        rows = None
        with conn.cursor() as cursor:
            cursor: psycopg2.extensions.cursor
            cursor.execute(query, args) if args else cursor.execute(query)
            rows = self.get_dicts_from_cursor(cursor)
        conn.commit()
        return rows

    # ---
    # ninjas
    # ---

    def create_ninja(self, ninja_new: NinjaNew) -> Union[Ninja, None]:
        """
        Create a ninja and return it
        """
        table = Table(Tables.Ninjas.value)
        args: List[Any] = []
        qb = (
            PostgreSQLQuery
            .into(table)
            .columns(*ninja_new.keys())
            .insert(*[FormatParameter() for _ in ninja_new.keys()])
            .returning('*')
        )
        args += list(ninja_new.values())
        sql = str(qb)
        rows = self.execute_query(sql, args)
        return rows[0] if (rows and len(rows)) else None

    def get_ninja(self, id: str) -> Union[Ninja, None]:
        """
        Get a ninja by id
        """
        table = Table(Tables.Ninjas.value)
        args: List[Any] = []
        qb = (
            PostgreSQLQuery
            .from_(table)
            .select('*')
            .where(table.id == FormatParameter())
        )
        args.append(id)
        sql = str(qb)
        rows = self.execute_query(sql, args)
        return rows[0] if (rows and len(rows)) else None

    def update_ninja(self, id: str, ninja_updates: NinjaUpdates) -> Union[Ninja, None]:
        """
        Update a ninja by id and return it
        """
        table = Table(Tables.Ninjas.value)
        args: List[Any] = []
        qb = (
            PostgreSQLQuery
            .update(table)
            .where(table.id == FormatParameter())
            .returning('*')
        )
        for k, v in ninja_updates.items():
            qb = qb.set(table[k], FormatParameter())
            args.append(v)
        args.append(id)
        sql = str(qb)
        rows = self.execute_query(sql, args)
        return rows[0] if (rows and len(rows)) else None

    def delete_ninja(self, id: str) -> Union[Ninja, None]:
        """
        Delete a ninja and return it
        """
        table = Table(Tables.Ninjas.value)
        args: List[Any] = []
        qb = (
            PostgreSQLQuery
            .from_(table)
            .delete()
            .where(table.id == FormatParameter())
            .returning('*')
        )
        args.append(id)
        sql = str(qb)
        rows = self.execute_query(sql, args)
        return rows[0] if (rows and len(rows)) else None

    # ---
    # jutsus
    # ---

    def create_jutsu(self, jutsu_new: JutsuNew) -> Union[Jutsu, None]:
        """
        Create a jutsu and return it
        """
        table = Table(Tables.Jutsus.value)
        args: List[Any] = []
        qb = (
            PostgreSQLQuery
            .into(table)
            .columns(*jutsu_new.keys())
            .insert(*[FormatParameter() for _ in jutsu_new.keys()])
            .returning('*')
        )
        args += list(jutsu_new.values())
        sql = str(qb)
        rows = self.execute_query(sql, args)
        return rows[0] if (rows and len(rows)) else None

    def get_jutsu(self, id: str) -> Union[Jutsu, None]:
        """
        Get a jutsu by id
        """
        table = Table(Tables.Jutsus.value)
        args: List[Any] = []
        qb = (
            PostgreSQLQuery
            .from_(table)
            .select('*')
            .where(table.id == FormatParameter())
        )
        args.append(id)
        sql = str(qb)
        rows = self.execute_query(sql, args)
        return rows[0] if (rows and len(rows)) else None

    def update_jutsu(self, id: str, jutsu_updates: JutsuUpdates) -> Union[Jutsu, None]:
        """
        Update a ninja by id and return it
        """
        table = Table(Tables.Jutsus.value)
        args: List[Any] = []
        qb = (
            PostgreSQLQuery
            .update(table)
            .where(table.id == FormatParameter())
            .returning('*')
        )
        for k, v in jutsu_updates.items():
            qb = qb.set(table[k], FormatParameter())
            args.append(v)
        args.append(id)
        sql = str(qb)
        rows = self.execute_query(sql, args)
        return rows[0] if (rows and len(rows)) else None

    def delete_jutsu(self, id: str) -> Union[Jutsu, None]:
        """
        Delete a jutsu and return it
        """
        table = Table(Tables.Jutsus.value)
        args: List[Any] = []
        qb = (
            PostgreSQLQuery
            .from_(table)
            .delete()
            .where(table.id == FormatParameter())
            .returning('*')
        )
        args.append(id)
        sql = str(qb)
        rows = self.execute_query(sql, args)
        return rows[0] if (rows and len(rows)) else None

    # ---
    # ninjas_jutsus
    # ---

    # TODO
