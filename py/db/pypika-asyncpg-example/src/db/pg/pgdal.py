from typing import Union, List, Any
import asyncpg
from pypika import Table, PostgreSQLQuery
from pypika.terms import QmarkParameter
from ...types.types import NinjaNew, NinjaUpdates, Ninja, JutsuNew, JutsuUpdates, Jutsu
from enum import Enum
from uuid import UUID


class Tables(Enum):
    Ninjas = 'ninjas'
    Jutsus = 'jutsus'
    NinjasJutsus = 'ninjas_jutsus'


class PGDAL:
    def __init__(self, conn: asyncpg.connection.Connection):
        self.conn = conn

    # ---
    # Internal
    # ---

    @staticmethod
    def replace_placeholder(sql: str) -> str:
        """
        Replace ? with $1, $2, etc
        NOTE: This is based on the golang query building library "squirrel"
        """
        output = ""
        i: int = 0
        while True:
            idx = sql.find("?")
            # break if no more "?"
            if idx == -1:
                break
            # escape ?? -> ?
            if len(sql[idx:]) > 1 and sql[idx:idx+2] == "??":
                output += sql[:idx]
                output += "?"
                if len(sql[idx:]) == 1:
                    break
                sql = sql[idx+2:]
            # Replace ? with $i
            else:
                i += 1
                output += sql[:idx]
                output += f"${i}"
                sql = sql[idx+1:]
        output += sql
        return output

    async def execute_query(
        self,
        query: str,
        args: list = []
    ) -> Union[Any, None]:
        """Executes query in transaction and returns rows"""
        query = self.replace_placeholder(query)
        conn = self.conn
        records = []
        async with conn.transaction():
            async for record in conn.cursor(query, *args):
                records.append(dict(record))
        return records

    # ---
    # Ninjas
    # ---

    async def create_ninja(self, ninja_new: NinjaNew) -> Union[Ninja, None]:
        """Create a ninja and return it"""
        table = Table(Tables.Ninjas.value)
        args: List[Any] = []
        qb = (
            PostgreSQLQuery
            .into(table)
            .columns(*ninja_new.keys())
            .insert(*[QmarkParameter() for _ in ninja_new.keys()])
            .returning('*')
        )
        args += list(ninja_new.values())
        sql = str(qb)
        rows = await self.execute_query(sql, args)
        return rows[0] if (rows and len(rows)) else None

    async def get_ninja(self, id_: UUID) -> Union[Ninja, None]:
        """Get a ninja by id"""
        table = Table(Tables.Ninjas.value)
        args: List[Any] = []
        qb = (
            PostgreSQLQuery
            .from_(table)
            .select('*')
            .where(table.id == QmarkParameter())
        )
        args.append(id_)
        sql = str(qb)
        rows = await self.execute_query(sql, args)
        return rows[0] if (rows and len(rows)) else None

    async def update_ninja(self, id_: UUID, ninja_updates: NinjaUpdates) -> Union[Ninja, None]:
        """Update a ninja by id and return it"""
        table = Table(Tables.Ninjas.value)
        args: List[Any] = []
        qb = (
            PostgreSQLQuery
            .update(table)
            .where(table.id == QmarkParameter())
            .returning('*')
        )
        for k, v in ninja_updates.items():
            qb = qb.set(table[k], QmarkParameter())
            args.append(v)
        args.append(id_)
        sql = str(qb)
        rows = await self.execute_query(sql, args)
        return rows[0] if (rows and len(rows)) else None

    async def delete_ninja(self, id_: UUID) -> Union[Ninja, None]:
        """Delete a ninja and return it"""
        table = Table(Tables.Ninjas.value)
        args: List[Any] = []
        qb = (
            PostgreSQLQuery
            .from_(table)
            .delete()
            .where(table.id == QmarkParameter())
            .returning('*')
        )
        args.append(id_)
        sql = str(qb)
        rows = await self.execute_query(sql, args)
        return rows[0] if (rows and len(rows)) else None

    # ---
    # Jutsus
    # ---

    async def create_jutsu(self, jutsu_new: JutsuNew) -> Union[Jutsu, None]:
        """Create a jutsu and return it"""
        table = Table(Tables.Jutsus.value)
        args: List[Any] = []
        qb = (
            PostgreSQLQuery
            .into(table)
            .columns(*jutsu_new.keys())
            .insert(*[QmarkParameter() for _ in jutsu_new.keys()])
            .returning('*')
        )
        args += list(jutsu_new.values())
        sql = str(qb)
        rows = await self.execute_query(sql, args)
        return rows[0] if (rows and len(rows)) else None

    async def get_jutsu(self, id_: UUID) -> Union[Jutsu, None]:
        """Get a jutsu by id"""
        table = Table(Tables.Jutsus.value)
        args: List[Any] = []
        qb = (
            PostgreSQLQuery
            .from_(table)
            .select('*')
            .where(table.id == QmarkParameter())
        )
        args.append(id_)
        sql = str(qb)
        rows = await self.execute_query(sql, args)
        return rows[0] if (rows and len(rows)) else None

    async def update_jutsu(self, id_: UUID, jutsu_updates: JutsuUpdates) -> Union[Jutsu, None]:
        """Update a ninja by id and return it"""
        table = Table(Tables.Jutsus.value)
        args: List[Any] = []
        qb = (
            PostgreSQLQuery
            .update(table)
            .where(table.id == QmarkParameter())
            .returning('*')
        )
        for k, v in jutsu_updates.items():
            qb = qb.set(table[k], QmarkParameter())
            args.append(v)
        args.append(id_)
        sql = str(qb)
        rows = await self.execute_query(sql, args)
        return rows[0] if (rows and len(rows)) else None

    async def delete_jutsu(self, id_: UUID) -> Union[Jutsu, None]:
        """Delete a jutsu and return it"""
        table = Table(Tables.Jutsus.value)
        args: List[Any] = []
        qb = (
            PostgreSQLQuery
            .from_(table)
            .delete()
            .where(table.id == QmarkParameter())
            .returning('*')
        )
        args.append(id_)
        sql = str(qb)
        rows = await self.execute_query(sql, args)
        return rows[0] if (rows and len(rows)) else None

    # ---
    # Ninjas_jutsus
    # ---

    async def associate_ninja_and_jutsu(self, ninja_id: UUID, jutsu_id: UUID) -> None:
        """Associate a ninja and jutsu"""
        table = Table(Tables.NinjasJutsus.value)
        args: List[Any] = []
        qb = (
            PostgreSQLQuery
            .into(table)
            .columns([table.ninja_id, table.jutsu_id])
            .insert(QmarkParameter(), QmarkParameter())
            .returning('*')
        )
        args.append(ninja_id)
        args.append(jutsu_id)
        sql = str(qb)
        await self.execute_query(sql, args)

    async def dissociate_ninja_and_jutsu(self, ninja_id: UUID, jutsu_id: UUID) -> None:
        """Dissociate a ninja and jutsu"""
        table = Table(Tables.NinjasJutsus.value)
        args: List[Any] = []
        qb = (
            PostgreSQLQuery
            .from_(table)
            .delete()
            .where(
                (table.ninja_id == QmarkParameter()) &
                (table.jutsu_id == QmarkParameter())
            )
        )
        args.append(ninja_id)
        args.append(jutsu_id)
        sql = str(qb)
        await self.execute_query(sql, args)

    async def get_ninja_with_jutsus(self, ninja_id: UUID) -> Union[Ninja, None]:
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
            .where(ninjas_table.id == QmarkParameter())
        )
        args.append(ninja_id)
        sql = str(qb)
        rows = await self.execute_query(sql, args)
        ninja = rows[0] if (rows and len(rows)) else None

        # Get jutsus
        args: List[Any] = []
        qb = (
            PostgreSQLQuery
            .from_(jutsus_table)
            .select("*")
            .where(jutsus_table.id.isin(
                PostgreSQLQuery
                .from_(ninjas_jutsus_table)
                .select(ninjas_jutsus_table.jutsu_id)
                .where(ninjas_jutsus_table.ninja_id == QmarkParameter())
            ))
        )
        args.append(ninja_id)
        sql = str(qb)
        jutsus = await self.execute_query(sql, args) or []

        # result
        if not ninja:
            return None
        ninja['jutsus'] = jutsus
        return ninja
