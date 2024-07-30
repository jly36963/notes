use crate::types::jutsu::{Jutsu, JutsuNew, JutsuSql, JutsuUpdates};
use crate::types::ninja::{Ninja, NinjaNew, NinjaSql, NinjaUpdates};
use crate::types::ninja_jutsu::{NinjaJutsu, NinjaJutsuSql};
use anyhow;
use async_trait::async_trait;
use sea_query::{Expr, PostgresQueryBuilder, Query, SimpleExpr};
use sea_query_binder::SqlxBinder;
use sqlx::postgres::PgPoolOptions;
use sqlx::{Pool, Postgres};
use uuid::Uuid;

pub async fn get_pg_pool(url: &str) -> Pool<Postgres> {
    PgPoolOptions::new()
        .max_connections(10)
        .connect(url)
        .await
        .expect("Could not create pg pool")
}
pub struct PostgresDAL {
    pub pool: Pool<Postgres>,
}

#[async_trait]
pub trait TPostgresDAL {
    // ninjas
    async fn create_ninja(&self, ninja_new: NinjaNew) -> anyhow::Result<Option<Ninja>>;
    async fn get_ninja(&self, id: Uuid) -> anyhow::Result<Option<Ninja>>;
    async fn update_ninja(
        &self,
        id: Uuid,
        ninja_updates: NinjaUpdates,
    ) -> anyhow::Result<Option<Ninja>>;
    async fn delete_ninja(&self, id: Uuid) -> anyhow::Result<Option<Ninja>>;
    // jutsus
    async fn create_jutsu(&self, jutsu_new: JutsuNew) -> anyhow::Result<Option<Jutsu>>;
    async fn get_jutsu(&self, id: Uuid) -> anyhow::Result<Option<Jutsu>>;
    async fn update_jutsu(
        &self,
        id: Uuid,
        jutsu_updates: JutsuUpdates,
    ) -> anyhow::Result<Option<Jutsu>>;
    async fn delete_jutsu(&self, id: Uuid) -> anyhow::Result<Option<Jutsu>>;
    // ninjas_jutsus
    async fn associate_ninja_and_jutsu(
        &self,
        ninja_id: Uuid,
        jutsu_id: Uuid,
    ) -> anyhow::Result<Option<NinjaJutsu>>;

    async fn dissociate_ninja_and_jutsu(
        &self,
        ninja_id: Uuid,
        jutsu_id: Uuid,
    ) -> anyhow::Result<Option<NinjaJutsu>>;
    async fn get_ninja_jutsus(&self, id: Uuid) -> anyhow::Result<Vec<Jutsu>>;
    async fn get_ninja_and_jutsus(&self, id: Uuid) -> anyhow::Result<Option<(Ninja, Vec<Jutsu>)>>;
}

#[async_trait]
impl TPostgresDAL for PostgresDAL {
    // ninjas
    async fn create_ninja(&self, ninja_new: NinjaNew) -> anyhow::Result<Option<Ninja>> {
        let (sql, values) = Query::insert()
            .into_table(NinjaSql::Table)
            .columns([
                NinjaSql::Id,
                NinjaSql::FirstName,
                NinjaSql::LastName,
                NinjaSql::Age,
            ])
            .values_panic([
                ninja_new.id.into(),
                ninja_new.first_name.into(),
                ninja_new.last_name.into(),
                ninja_new.age.into(),
            ])
            .returning_all()
            .build_sqlx(PostgresQueryBuilder);

        let ninja = sqlx::query_as_with::<_, Ninja, _>(&sql, values)
            .fetch_one(&self.pool)
            .await?;

        Ok(Some(ninja))
    }

    async fn get_ninja(&self, id: Uuid) -> anyhow::Result<Option<Ninja>> {
        let (sql, values) = Query::select()
            .from(NinjaSql::Table)
            .columns([
                NinjaSql::Id,
                NinjaSql::FirstName,
                NinjaSql::LastName,
                NinjaSql::Age,
                NinjaSql::CreatedAt,
                NinjaSql::UpdatedAt,
            ])
            .and_where(Expr::col(NinjaSql::Id).eq(id))
            .build_sqlx(PostgresQueryBuilder);

        let ninja = sqlx::query_as_with::<_, Ninja, _>(&sql, values)
            .fetch_one(&self.pool)
            .await?;

        Ok(Some(ninja))
    }

    async fn update_ninja(
        &self,
        id: Uuid,
        ninja_updates: NinjaUpdates,
    ) -> anyhow::Result<Option<Ninja>> {
        let mut updates: Vec<(NinjaSql, SimpleExpr)> = Vec::new();
        if ninja_updates.first_name.is_some() {
            updates.push((NinjaSql::FirstName, ninja_updates.first_name.into()));
        }
        if ninja_updates.last_name.is_some() {
            updates.push((NinjaSql::LastName, ninja_updates.last_name.into()));
        }
        if ninja_updates.age.is_some() {
            updates.push((NinjaSql::Age, ninja_updates.age.into()));
        }

        let (sql, values) = Query::update()
            .table(NinjaSql::Table)
            .values(updates)
            .and_where(Expr::col(NinjaSql::Id).eq(id))
            .returning_all()
            .build_sqlx(PostgresQueryBuilder);

        let ninja = sqlx::query_as_with::<_, Ninja, _>(&sql, values)
            .fetch_one(&self.pool)
            .await?;

        Ok(Some(ninja))
    }

    async fn delete_ninja(&self, id: Uuid) -> anyhow::Result<Option<Ninja>> {
        let (sql, values) = Query::delete()
            .from_table(NinjaSql::Table)
            .and_where(Expr::col(NinjaSql::Id).eq(id))
            .returning_all()
            .build_sqlx(PostgresQueryBuilder);

        let ninja = sqlx::query_as_with::<_, Ninja, _>(&sql, values)
            .fetch_one(&self.pool)
            .await?;

        Ok(Some(ninja))
    }

    // jutsu
    async fn create_jutsu(&self, jutsu_new: JutsuNew) -> anyhow::Result<Option<Jutsu>> {
        let (sql, values) = Query::insert()
            .into_table(JutsuSql::Table)
            .columns([
                JutsuSql::Id,
                JutsuSql::Name,
                JutsuSql::ChakraNature,
                JutsuSql::Description,
            ])
            .values_panic([
                jutsu_new.id.into(),
                jutsu_new.name.into(),
                jutsu_new.chakra_nature.into(),
                jutsu_new.description.into(),
            ])
            .returning_all()
            .build_sqlx(PostgresQueryBuilder);

        let jutsu = sqlx::query_as_with::<_, Jutsu, _>(&sql, values)
            .fetch_one(&self.pool)
            .await?;

        Ok(Some(jutsu))
    }
    async fn get_jutsu(&self, id: Uuid) -> anyhow::Result<Option<Jutsu>> {
        let (sql, values) = Query::select()
            .from(JutsuSql::Table)
            .columns([
                JutsuSql::Id,
                JutsuSql::Name,
                JutsuSql::ChakraNature,
                JutsuSql::Description,
                JutsuSql::CreatedAt,
                JutsuSql::UpdatedAt,
            ])
            .and_where(Expr::col(JutsuSql::Id).eq(id))
            .build_sqlx(PostgresQueryBuilder);

        let jutsu = sqlx::query_as_with::<_, Jutsu, _>(&sql, values)
            .fetch_one(&self.pool)
            .await?;

        Ok(Some(jutsu))
    }
    async fn update_jutsu(
        &self,
        id: Uuid,
        jutsu_updates: JutsuUpdates,
    ) -> anyhow::Result<Option<Jutsu>> {
        let mut updates: Vec<(JutsuSql, SimpleExpr)> = Vec::new();
        if jutsu_updates.name.is_some() {
            updates.push((JutsuSql::Name, jutsu_updates.name.into()));
        }
        if jutsu_updates.chakra_nature.is_some() {
            updates.push((JutsuSql::ChakraNature, jutsu_updates.chakra_nature.into()));
        }
        if jutsu_updates.description.is_some() {
            updates.push((JutsuSql::Description, jutsu_updates.description.into()));
        }

        let (sql, values) = Query::update()
            .table(JutsuSql::Table)
            .values(updates)
            .and_where(Expr::col(JutsuSql::Id).eq(id))
            .returning_all()
            .build_sqlx(PostgresQueryBuilder);

        let jutsu = sqlx::query_as_with::<_, Jutsu, _>(&sql, values)
            .fetch_one(&self.pool)
            .await?;

        Ok(Some(jutsu))
    }

    async fn delete_jutsu(&self, id: Uuid) -> anyhow::Result<Option<Jutsu>> {
        let (sql, values) = Query::delete()
            .from_table(JutsuSql::Table)
            .and_where(Expr::col(JutsuSql::Id).eq(id))
            .returning_all()
            .build_sqlx(PostgresQueryBuilder);

        let jutsu = sqlx::query_as_with::<_, Jutsu, _>(&sql, values)
            .fetch_one(&self.pool)
            .await?;

        Ok(Some(jutsu))
    }

    // ninjas_jutsus
    async fn associate_ninja_and_jutsu(
        &self,
        ninja_id: Uuid,
        jutsu_id: Uuid,
    ) -> anyhow::Result<Option<NinjaJutsu>> {
        let (sql, values) = Query::insert()
            .into_table(NinjaJutsuSql::Table)
            .columns([
                NinjaJutsuSql::Id,
                NinjaJutsuSql::NinjaId,
                NinjaJutsuSql::JutsuId,
            ])
            .values_panic([Uuid::new_v4().into(), ninja_id.into(), jutsu_id.into()])
            .returning_all()
            .build_sqlx(PostgresQueryBuilder);

        let nj = sqlx::query_as_with::<_, NinjaJutsu, _>(&sql, values)
            .fetch_one(&self.pool)
            .await?;

        Ok(Some(nj))
    }

    async fn dissociate_ninja_and_jutsu(
        &self,
        nid: Uuid,
        jid: Uuid,
    ) -> anyhow::Result<Option<NinjaJutsu>> {
        let (sql, values) = Query::delete()
            .from_table(NinjaJutsuSql::Table)
            .and_where(Expr::col(NinjaJutsuSql::NinjaId).eq(nid))
            .and_where(Expr::col(NinjaJutsuSql::JutsuId).eq(jid))
            .returning_all()
            .build_sqlx(PostgresQueryBuilder);

        let nj = sqlx::query_as_with::<_, NinjaJutsu, _>(&sql, values)
            .fetch_one(&self.pool)
            .await?;

        Ok(Some(nj))
    }

    async fn get_ninja_jutsus(&self, id: Uuid) -> anyhow::Result<Vec<Jutsu>> {
        let (sql, values) = Query::select()
            .from(JutsuSql::Table)
            .columns([
                JutsuSql::Id,
                JutsuSql::Name,
                JutsuSql::ChakraNature,
                JutsuSql::Description,
                JutsuSql::CreatedAt,
                JutsuSql::UpdatedAt,
            ])
            .and_where(
                Expr::col(JutsuSql::Id).in_subquery(
                    Query::select()
                        .from(NinjaJutsuSql::Table)
                        .columns([NinjaJutsuSql::JutsuId])
                        .and_where(Expr::col(NinjaJutsuSql::NinjaId).eq(id))
                        .take(),
                ),
            )
            .build_sqlx(PostgresQueryBuilder);

        let jutsus = sqlx::query_as_with::<_, Jutsu, _>(&sql, values)
            .fetch_all(&self.pool)
            .await?;

        Ok(jutsus)
    }

    async fn get_ninja_and_jutsus(&self, id: Uuid) -> anyhow::Result<Option<(Ninja, Vec<Jutsu>)>> {
        let maybe_ninja = self.get_ninja(id).await?;
        match maybe_ninja {
            Some(ninja) => {
                let jutsus = self.get_ninja_jutsus(id).await?;
                return Ok(Some((ninja, jutsus)));
            }
            None => return Ok(None),
        }
    }
}
