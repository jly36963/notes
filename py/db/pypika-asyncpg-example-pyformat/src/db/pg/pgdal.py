"""Postgres DAL."""

import itertools
from collections import defaultdict
from typing import Any, Mapping, cast  # noqa: UP035
from uuid import UUID

import asyncpg
from pypika import PostgreSQLQuery, PyformatParameter, Table

from ...types import Jutsu, JutsuNew, JutsuUpdates, Ninja, NinjaNew, NinjaUpdates
from ...utils import first

# ---
# Utils
# ---


def pyformat2psql(query: str, named_args: Mapping[str, Any]) -> tuple[str, list[Any]]:
    """Convert query/args from pyformat to psql."""
    positional_generator = itertools.count(1)
    positional_map = defaultdict(lambda: f"${next(positional_generator)}")
    formatted_query = query % positional_map
    positional_items = sorted(
        positional_map.items(),
        key=lambda item: int(item[1].replace("$", "")),
    )
    positional_args = [named_args[named_arg] for named_arg, _ in positional_items]
    return formatted_query, positional_args


# ---
# Tables
# ---

NINJAS_TABLE = Table("ninjas")
JUTSUS_TABLE = Table("jutsus")
NINJAS_JUTSUS_TABLE = Table("ninjas_jutsus")


# ---
# DAL
# ---


class PgDal:
    """Posgres data access layer."""

    conn: asyncpg.connection.Connection

    def __init__(self, conn: asyncpg.connection.Connection):
        """Create PgDal instance."""
        self.conn = conn

    # ---
    # Internal
    # ---

    async def execute_query(
        self,
        query: str,
        named_args: Mapping[str, Any],
    ) -> list[dict]:
        """Execute query in transaction and returns rows."""
        sql, args = pyformat2psql(query, named_args)
        conn = self.conn
        records = []
        async with conn.transaction():
            async for record in conn.cursor(sql, *args):
                records.append(dict(record))  # noqa: PERF401
        return records

    # ---
    # Ninjas
    # ---

    async def create_ninja(self, ninja_new: NinjaNew) -> Ninja | None:
        """Create a ninja and return it."""
        qb = (
            PostgreSQLQuery.into(NINJAS_TABLE)
            .columns(*ninja_new.keys())
            .insert(*[PyformatParameter(k) for k in ninja_new])
            .returning("*")
        )
        sql = str(qb)
        rows = await self.execute_query(sql, ninja_new)
        return first(cast(list[Ninja], rows))

    async def get_ninja(self, ninja_id: UUID) -> Ninja | None:
        """Get a ninja by id."""
        qb = (
            PostgreSQLQuery.from_(NINJAS_TABLE)
            .select("*")
            .where(NINJAS_TABLE.id == PyformatParameter("id"))
        )
        sql = str(qb)
        rows = await self.execute_query(sql, {"id": ninja_id})
        return first(cast(list[Ninja], rows))

    async def update_ninja(
        self,
        ninja_id: UUID,
        ninja_updates: NinjaUpdates,
    ) -> Ninja | None:
        """Update a ninja by id and return it."""
        qb = (
            PostgreSQLQuery.update(NINJAS_TABLE)
            .where(NINJAS_TABLE.id == PyformatParameter("id"))
            .returning("*")
        )
        for k in ninja_updates:
            qb = qb.set(NINJAS_TABLE[k], PyformatParameter(k))
        sql = str(qb)
        args = {"id": ninja_id, **ninja_updates}
        rows = await self.execute_query(sql, args)
        return first(cast(list[Ninja], rows))

    async def delete_ninja(self, ninja_id: UUID) -> Ninja | None:
        """Delete a ninja and return it."""
        qb = (
            PostgreSQLQuery.from_(NINJAS_TABLE)
            .delete()
            .where(NINJAS_TABLE.id == PyformatParameter("id"))
            .returning("*")
        )
        sql = str(qb)
        args = {"id": ninja_id}
        rows = await self.execute_query(sql, args)
        return first(cast(list[Ninja], rows))

    # ---
    # Jutsus
    # ---

    async def create_jutsu(self, jutsu_new: JutsuNew) -> Jutsu | None:
        """Create a jutsu and return it."""
        qb = (
            PostgreSQLQuery.into(JUTSUS_TABLE)
            .columns(*jutsu_new.keys())
            .insert(*[PyformatParameter(k) for k in jutsu_new])
            .returning("*")
        )
        sql = str(qb)
        rows = await self.execute_query(sql, jutsu_new)
        return first(cast(list[Jutsu], rows))

    async def get_jutsu(self, jutsu_id: UUID) -> Jutsu | None:
        """Get a jutsu by id."""
        qb = (
            PostgreSQLQuery.from_(JUTSUS_TABLE)
            .select("*")
            .where(JUTSUS_TABLE.id == PyformatParameter("id"))
        )
        sql = str(qb)
        args = {"id": jutsu_id}
        rows = await self.execute_query(sql, args)
        return first(cast(list[Jutsu], rows))

    async def update_jutsu(
        self,
        jutsu_id: UUID,
        jutsu_updates: JutsuUpdates,
    ) -> Jutsu | None:
        """Update a jutsu by id and return it."""
        qb = (
            PostgreSQLQuery.update(JUTSUS_TABLE)
            .where(JUTSUS_TABLE.id == PyformatParameter("id"))
            .returning("*")
        )
        for k in jutsu_updates:
            qb = qb.set(JUTSUS_TABLE[k], PyformatParameter(k))
        sql = str(qb)
        args = {"id": jutsu_id, **jutsu_updates}
        rows = await self.execute_query(sql, args)
        return first(cast(list[Jutsu], rows))

    async def delete_jutsu(self, jutsu_id: UUID) -> Jutsu | None:
        """Delete a jutsu and return it."""
        qb = (
            PostgreSQLQuery.from_(JUTSUS_TABLE)
            .delete()
            .where(JUTSUS_TABLE.id == PyformatParameter("id"))
            .returning("*")
        )
        args = {"id": jutsu_id}
        sql = str(qb)
        rows = await self.execute_query(sql, args)
        return first(cast(list[Jutsu], rows))

    # ---
    # Ninjas_jutsus
    # ---

    async def associate_ninja_and_jutsu(self, ninja_id: UUID, jutsu_id: UUID) -> None:
        """Associate a ninja and jutsu."""
        qb = (
            PostgreSQLQuery.into(NINJAS_JUTSUS_TABLE)
            .columns([NINJAS_JUTSUS_TABLE.ninja_id, NINJAS_JUTSUS_TABLE.jutsu_id])
            .insert(PyformatParameter("ninja_id"), PyformatParameter("jutsu_id"))
            .returning("*")
        )
        sql = str(qb)
        args = {"ninja_id": ninja_id, "jutsu_id": jutsu_id}
        await self.execute_query(sql, args)

    async def dissociate_ninja_and_jutsu(self, ninja_id: UUID, jutsu_id: UUID) -> None:
        """Dissociate a ninja and jutsu."""
        qb = (
            PostgreSQLQuery.from_(NINJAS_JUTSUS_TABLE)
            .delete()
            .where(
                (NINJAS_JUTSUS_TABLE.ninja_id == PyformatParameter("ninja_id"))
                & (NINJAS_JUTSUS_TABLE.jutsu_id == PyformatParameter("jutsu_id"))
            )
        )
        sql = str(qb)
        args = {"ninja_id": ninja_id, "jutsu_id": jutsu_id}
        await self.execute_query(sql, args)

    async def get_ninja_with_jutsus(self, ninja_id: UUID) -> Ninja | None:
        """Get ninja with associated jutsus."""
        # Get ninja
        qb = (
            PostgreSQLQuery.from_(NINJAS_TABLE)
            .select("*")
            .where(NINJAS_TABLE.id == PyformatParameter("id"))
        )
        args = {"id": ninja_id}
        sql = str(qb)
        rows = await self.execute_query(sql, args)
        ninja = first(cast(list[Ninja], rows))
        if not ninja:
            return None
        # Get jutsus
        qb = (
            PostgreSQLQuery.from_(JUTSUS_TABLE)
            .select("*")
            .where(
                JUTSUS_TABLE.id.isin(
                    PostgreSQLQuery.from_(NINJAS_JUTSUS_TABLE)
                    .select(NINJAS_JUTSUS_TABLE.jutsu_id)
                    .where(NINJAS_JUTSUS_TABLE.ninja_id == PyformatParameter("id"))
                )
            )
        )
        sql = str(qb)
        args = {"id": ninja_id}
        jutsus = await self.execute_query(sql, args)
        # Join
        ninja["jutsus"] = cast(list[Jutsu], jutsus)
        return ninja
