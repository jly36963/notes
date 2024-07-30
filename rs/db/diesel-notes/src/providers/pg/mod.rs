use crate::types::jutsu::{Jutsu, JutsuNew, JutsuUpdates};
use crate::types::ninja::{Ninja, NinjaNew, NinjaUpdates};
use crate::types::ninja_jutsu::{NinjaJutsu, NinjaJutsuNew};
use anyhow;
use diesel::pg::PgConnection;
use diesel::prelude::*;
use diesel::r2d2::{ConnectionManager, Pool, PooledConnection};
use uuid::Uuid;

pub fn get_pg_pool(url: &str) -> Pool<ConnectionManager<PgConnection>> {
    let manager = ConnectionManager::<PgConnection>::new(url);
    Pool::builder()
        .test_on_check_out(true)
        .build(manager)
        .expect("Could not build pg connection pool")
}
pub struct PostgresDAL {
    pub pool: Pool<ConnectionManager<PgConnection>>,
}

impl PostgresDAL {
    fn get_conn(&self) -> PooledConnection<ConnectionManager<PgConnection>> {
        return self.pool.clone().get().unwrap();
    }
}

// #[async_trait]
pub trait TPostgresDAL {
    // ninjas
    fn create_ninja(&self, ninja_new: NinjaNew) -> anyhow::Result<Option<Ninja>>;
    fn get_ninja(&self, id: Uuid) -> anyhow::Result<Option<Ninja>>;
    fn update_ninja(&self, id: Uuid, ninja_updates: NinjaUpdates) -> anyhow::Result<Option<Ninja>>;
    fn delete_ninja(&self, id: Uuid) -> anyhow::Result<Option<Ninja>>;
    // jutsus
    fn create_jutsu(&self, jutsu_new: JutsuNew) -> anyhow::Result<Option<Jutsu>>;
    fn get_jutsu(&self, id: Uuid) -> anyhow::Result<Option<Jutsu>>;
    fn update_jutsu(&self, id: Uuid, jutsu_updates: JutsuUpdates) -> anyhow::Result<Option<Jutsu>>;
    fn delete_jutsu(&self, id: Uuid) -> anyhow::Result<Option<Jutsu>>;
    // ninjas_jutsus
    fn associate_ninja_and_jutsu(
        &self,
        ninja_id: Uuid,
        jutsu_id: Uuid,
    ) -> anyhow::Result<Option<NinjaJutsu>>;
    fn dissociate_ninja_and_jutsu(
        &self,
        ninja_id: Uuid,
        jutsu_id: Uuid,
    ) -> anyhow::Result<Option<NinjaJutsu>>;
    fn get_ninja_and_jutsus(&self, id: Uuid) -> anyhow::Result<Option<(Ninja, Vec<Jutsu>)>>;
}

// #[async_trait]
impl TPostgresDAL for PostgresDAL {
    // ninjas
    fn create_ninja(&self, ninja_new: NinjaNew) -> anyhow::Result<Option<Ninja>> {
        use crate::types::ninja::ninjas;

        let mut conn = self.get_conn();
        let ninja = diesel::insert_into(ninjas::table)
            .values(&ninja_new)
            .returning(Ninja::as_returning())
            .get_result(&mut conn)?;

        Ok(Some(ninja))
    }

    fn get_ninja(&self, id: Uuid) -> anyhow::Result<Option<Ninja>> {
        use crate::types::ninja::ninjas::dsl::ninjas;

        let mut conn = self.get_conn();
        let row = ninjas
            .find(id)
            .select(Ninja::as_select())
            .first(&mut conn)
            .optional()?;

        Ok(row)
    }

    fn update_ninja(&self, id: Uuid, ninja_updates: NinjaUpdates) -> anyhow::Result<Option<Ninja>> {
        use crate::types::ninja::ninjas::dsl::ninjas;

        let mut conn = self.get_conn();
        let row = diesel::update(ninjas.find(id))
            .set(ninja_updates)
            .returning(Ninja::as_returning())
            .get_result(&mut conn)?;

        Ok(Some(row))
    }

    fn delete_ninja(&self, id: Uuid) -> anyhow::Result<Option<Ninja>> {
        use crate::types::ninja::ninjas::dsl::ninjas;

        let mut conn = self.get_conn();
        let ninja = diesel::delete(ninjas.find(id))
            .returning(Ninja::as_returning())
            .get_result(&mut conn)?;

        Ok(Some(ninja))
    }

    // jutsu
    fn create_jutsu(&self, jutsu_new: JutsuNew) -> anyhow::Result<Option<Jutsu>> {
        use crate::types::jutsu::jutsus;

        let mut conn = self.get_conn();
        let jutsu = diesel::insert_into(jutsus::table)
            .values(&jutsu_new)
            .returning(Jutsu::as_returning())
            .get_result(&mut conn)?;

        Ok(Some(jutsu))
    }
    fn get_jutsu(&self, id: Uuid) -> anyhow::Result<Option<Jutsu>> {
        use crate::types::jutsu::jutsus::dsl::jutsus;

        let mut conn = self.get_conn();
        let row = jutsus
            .find(id)
            .select(Jutsu::as_select())
            .first(&mut conn)
            .optional()?;

        Ok(row)
    }
    fn update_jutsu(&self, id: Uuid, jutsu_updates: JutsuUpdates) -> anyhow::Result<Option<Jutsu>> {
        use crate::types::jutsu::jutsus::dsl::jutsus;

        let mut conn = self.get_conn();
        let row = diesel::update(jutsus.find(id))
            .set(jutsu_updates)
            .returning(Jutsu::as_returning())
            .get_result(&mut conn)?;

        Ok(Some(row))
    }

    fn delete_jutsu(&self, id: Uuid) -> anyhow::Result<Option<Jutsu>> {
        use crate::types::jutsu::jutsus::dsl::jutsus;

        let mut conn = self.get_conn();
        let jutsu = diesel::delete(jutsus.find(id))
            .returning(Jutsu::as_returning())
            .get_result(&mut conn)?;

        Ok(Some(jutsu))
    }

    // ninjas_jutsus
    fn associate_ninja_and_jutsu(
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

        let mut conn = self.get_conn();
        let nj = diesel::insert_into(ninjas_jutsus::table)
            .values(&nj_new)
            .returning(NinjaJutsu::as_returning())
            .get_result(&mut conn)?;

        Ok(Some(nj))
    }

    fn dissociate_ninja_and_jutsu(
        &self,
        nid: Uuid,
        jid: Uuid,
    ) -> anyhow::Result<Option<NinjaJutsu>> {
        use crate::types::ninja_jutsu::ninjas_jutsus::dsl::{jutsu_id, ninja_id, ninjas_jutsus};

        let mut conn = self.get_conn();
        let nj = diesel::delete(ninjas_jutsus.filter(ninja_id.eq(nid).and(jutsu_id.eq(jid))))
            .returning(NinjaJutsu::as_returning())
            .get_result(&mut conn)?;

        Ok(Some(nj))
    }

    fn get_ninja_and_jutsus(&self, id: Uuid) -> anyhow::Result<Option<(Ninja, Vec<Jutsu>)>> {
        use crate::types::jutsu::jutsus;
        use crate::types::ninja_jutsu::*;

        let maybe_ninja = self.get_ninja(id)?;
        match maybe_ninja {
            None => return Ok(None),
            Some(ninja) => {
                let mut conn = self.get_conn();
                let jutsus = NinjaJutsu::belonging_to(&ninja)
                    .inner_join(jutsus::table)
                    .select(Jutsu::as_select())
                    .load(&mut conn)?;
                return Ok(Some((ninja, jutsus)));
            }
        }
    }
}
