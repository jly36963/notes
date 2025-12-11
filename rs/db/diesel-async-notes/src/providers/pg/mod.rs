use crate::types::jutsu::{Jutsu, JutsuNew, JutsuUpdates};
use crate::types::ninja::{Ninja, NinjaNew, NinjaUpdates};
use crate::types::ninja_jutsu::{NinjaJutsu, NinjaJutsuNew};
use anyhow;
use async_trait::async_trait;
use diesel::prelude::*;
use uuid::Uuid;

use diesel_async::pooled_connection::bb8::Pool;
use diesel_async::pooled_connection::bb8::PooledConnection;
use diesel_async::pooled_connection::AsyncDieselConnectionManager;
use diesel_async::AsyncPgConnection;
use diesel_async::RunQueryDsl;

pub async fn get_pg_pool(url: &str) -> Pool<AsyncPgConnection> {
    let config = AsyncDieselConnectionManager::<diesel_async::AsyncPgConnection>::new(url);
    let pool = Pool::builder()
        .build(config)
        .await
        .expect("Could not create pg pool");
    pool
}
pub struct PostgresDAL {
    pub pool: Pool<AsyncPgConnection>,
}

impl PostgresDAL {
    async fn get_conn(&self) -> PooledConnection<AsyncPgConnection> {
        self.pool.get().await.unwrap()
    }
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
    async fn get_ninja_and_jutsus(&self, id: Uuid) -> anyhow::Result<Option<(Ninja, Vec<Jutsu>)>>;
}

#[async_trait]
impl TPostgresDAL for PostgresDAL {
    // ninjas
    async fn create_ninja(&self, ninja_new: NinjaNew) -> anyhow::Result<Option<Ninja>> {
        use crate::types::ninja::ninjas;

        let mut conn = self.get_conn().await;
        let ninja = diesel::insert_into(ninjas::table)
            .values(&ninja_new)
            .returning(Ninja::as_returning())
            .get_result(&mut conn)
            .await?;

        Ok(Some(ninja))
    }

    async fn get_ninja(&self, id: Uuid) -> anyhow::Result<Option<Ninja>> {
        use crate::types::ninja::ninjas;

        let mut conn = self.get_conn().await;

        let maybe_ninja = ninjas::table
            .find(id)
            .first::<Ninja>(&mut conn)
            .await
            .optional()?;

        Ok(maybe_ninja)
    }

    async fn update_ninja(
        &self,
        id: Uuid,
        ninja_updates: NinjaUpdates,
    ) -> anyhow::Result<Option<Ninja>> {
        use crate::types::ninja::ninjas::dsl::ninjas;

        let mut conn = self.get_conn().await;
        let row = diesel::update(ninjas.find(id))
            .set(ninja_updates)
            .returning(Ninja::as_returning())
            .get_result(&mut conn)
            .await?;

        Ok(Some(row))
    }

    async fn delete_ninja(&self, id: Uuid) -> anyhow::Result<Option<Ninja>> {
        use crate::types::ninja::ninjas::dsl::ninjas;

        let mut conn = self.get_conn().await;
        let ninja = diesel::delete(ninjas.find(id))
            .returning(Ninja::as_returning())
            .get_result(&mut conn)
            .await?;

        Ok(Some(ninja))
    }

    // jutsu
    async fn create_jutsu(&self, jutsu_new: JutsuNew) -> anyhow::Result<Option<Jutsu>> {
        use crate::types::jutsu::jutsus;

        let mut conn = self.get_conn().await;
        let jutsu = diesel::insert_into(jutsus::table)
            .values(&jutsu_new)
            .returning(Jutsu::as_returning())
            .get_result(&mut conn)
            .await?;

        Ok(Some(jutsu))
    }
    async fn get_jutsu(&self, id: Uuid) -> anyhow::Result<Option<Jutsu>> {
        use crate::types::jutsu::jutsus;

        let mut conn = self.get_conn().await;
        let maybe_jutsu = jutsus::table
            .find(id)
            .first::<Jutsu>(&mut conn)
            .await
            .optional()?;

        Ok(maybe_jutsu)
    }
    async fn update_jutsu(
        &self,
        id: Uuid,
        jutsu_updates: JutsuUpdates,
    ) -> anyhow::Result<Option<Jutsu>> {
        use crate::types::jutsu::jutsus::dsl::jutsus;

        let mut conn = self.get_conn().await;
        let row = diesel::update(jutsus.find(id))
            .set(jutsu_updates)
            .returning(Jutsu::as_returning())
            .get_result(&mut conn)
            .await?;

        Ok(Some(row))
    }

    async fn delete_jutsu(&self, id: Uuid) -> anyhow::Result<Option<Jutsu>> {
        use crate::types::jutsu::jutsus::dsl::jutsus;

        let mut conn = self.get_conn().await;
        let jutsu = diesel::delete(jutsus.find(id))
            .returning(Jutsu::as_returning())
            .get_result(&mut conn)
            .await?;

        Ok(Some(jutsu))
    }

    // ninjas_jutsus
    async fn associate_ninja_and_jutsu(
        &self,
        ninja_id: Uuid,
        jutsu_id: Uuid,
    ) -> anyhow::Result<Option<NinjaJutsu>> {
        use crate::types::ninja_jutsu::ninjas_jutsus;

        let nj_new = NinjaJutsuNew {
            id: Uuid::new_v4(),
            ninja_id,
            jutsu_id,
        };

        let mut conn = self.get_conn().await;
        let nj = diesel::insert_into(ninjas_jutsus::table)
            .values(&nj_new)
            .returning(NinjaJutsu::as_returning())
            .get_result(&mut conn)
            .await?;

        Ok(Some(nj))
    }

    async fn dissociate_ninja_and_jutsu(
        &self,
        nid: Uuid,
        jid: Uuid,
    ) -> anyhow::Result<Option<NinjaJutsu>> {
        use crate::types::ninja_jutsu::ninjas_jutsus::dsl::{jutsu_id, ninja_id, ninjas_jutsus};

        let mut conn = self.get_conn().await;
        let nj = diesel::delete(ninjas_jutsus.filter(ninja_id.eq(nid).and(jutsu_id.eq(jid))))
            .returning(NinjaJutsu::as_returning())
            .get_result(&mut conn)
            .await?;

        Ok(Some(nj))
    }

    async fn get_ninja_and_jutsus(&self, id: Uuid) -> anyhow::Result<Option<(Ninja, Vec<Jutsu>)>> {
        use crate::types::jutsu::jutsus;
        use crate::types::ninja_jutsu::*;

        let maybe_ninja = self.get_ninja(id).await?;
        match maybe_ninja {
            None => return Ok(None),
            Some(ninja) => {
                let mut conn = self.get_conn().await;
                let jutsus = NinjaJutsu::belonging_to(&ninja)
                    .inner_join(jutsus::table)
                    .select(Jutsu::as_select())
                    .load(&mut conn)
                    .await?;
                return Ok(Some((ninja, jutsus)));
            }
        }
    }
}
