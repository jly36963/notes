mod helpers;

use super::super::types;
use anyhow;
use async_trait::async_trait;
use postgres::types::ToSql;
use uuid::Uuid;

pub struct PostgresDAL {
    pub pg_pool: bb8::Pool<bb8_postgres::PostgresConnectionManager<tokio_postgres::NoTls>>,
}

#[async_trait]
pub trait TPostgresDAL {
    // ninjas
    async fn create_ninja(
        &self,
        ninja_new: types::NinjaNew,
    ) -> anyhow::Result<Option<types::Ninja>>;
    async fn get_ninja(&self, id: Uuid) -> anyhow::Result<Option<types::Ninja>>;
    async fn update_ninja(
        &self,
        id: Uuid,
        ninja_updates: types::NinjaUpdates,
    ) -> anyhow::Result<Option<types::Ninja>>;
    async fn delete_ninja(&self, id: Uuid) -> anyhow::Result<Option<types::Ninja>>;
    // jutsus
    async fn create_jutsu(
        &self,
        jutsu_new: types::JutsuNew,
    ) -> anyhow::Result<Option<types::Jutsu>>;
    async fn get_jutsu(&self, id: Uuid) -> anyhow::Result<Option<types::Jutsu>>;
    async fn update_jutsu(
        &self,
        id: Uuid,
        jutsu_updates: types::JutsuUpdates,
    ) -> anyhow::Result<Option<types::Jutsu>>;
    async fn delete_jutsu(&self, id: Uuid) -> anyhow::Result<Option<types::Jutsu>>;
    // ninjas_jutsus
    async fn associate_ninja_and_jutsu(&self, ninja_id: Uuid, jutsu_id: Uuid)
        -> anyhow::Result<()>;
    async fn dissociate_ninja_and_jutsu(
        &self,
        ninja_id: Uuid,
        jutsu_id: Uuid,
    ) -> anyhow::Result<()>;
    async fn get_ninja_jutsus(&self, id: Uuid) -> anyhow::Result<Vec<types::Jutsu>>;
    async fn get_ninja_with_jutsus(&self, id: Uuid) -> anyhow::Result<Option<types::Ninja>>;
}

#[async_trait]
impl TPostgresDAL for PostgresDAL {
    // ninjas
    async fn create_ninja(
        &self,
        ninja_new: types::NinjaNew,
    ) -> anyhow::Result<Option<types::Ninja>> {
        let conn = self.pg_pool.get().await?; // bb8::RunError<postgres::Error>

        let sql = helpers::replace_placeholders(String::from(
            "INSERT INTO ninjas (first_name, last_name, age) VALUES ( ?, ?, ? ) RETURNING *;",
        ));
        let args: Vec<&(dyn ToSql + Sync)> =
            vec![&ninja_new.first_name, &ninja_new.last_name, &ninja_new.age];

        let rows = conn.query(&sql, &args).await?; // postgres::error::Error
        let row = match rows.get(0) {
            Some(r) => r,
            None => return Ok(None),
        };

        Ok(Some(types::Ninja {
            id: row.get(0),
            first_name: row.get(1),
            last_name: row.get(2),
            age: row.get(3),
            created_at: row.get(4),
            updated_at: row.get(5),
            jutsus: None,
        }))
    }

    async fn get_ninja(&self, id: Uuid) -> anyhow::Result<Option<types::Ninja>> {
        let conn = self.pg_pool.get().await.unwrap();

        let sql = helpers::replace_placeholders(String::from("SELECT * FROM ninjas WHERE id = ?"));
        let args: Vec<&(dyn ToSql + Sync)> = vec![&id];

        let rows = conn.query(&sql, &args).await?; // postgres::error::Error
        let row = match rows.get(0) {
            Some(r) => r,
            None => return Ok(None),
        };

        Ok(Some(types::Ninja {
            id: row.get(0),
            first_name: row.get(1),
            last_name: row.get(2),
            age: row.get(3),
            created_at: row.get(4),
            updated_at: row.get(5),
            jutsus: None,
        }))
    }

    async fn update_ninja(
        &self,
        id: Uuid,
        ninja_updates: types::NinjaUpdates,
    ) -> anyhow::Result<Option<types::Ninja>> {
        let conn = self.pg_pool.get().await?; // bb8::RunError<postgres::Error>

        // placeholders and args
        let mut update_clause = String::from("SET ");
        let mut args: Vec<&(dyn ToSql + Sync)> = vec![];
        // update fields
        let first_name = ninja_updates.first_name;
        let last_name = ninja_updates.last_name;
        let age = ninja_updates.age;
        // only include if some
        let mut update_fields: Vec<String> = Vec::new();
        if first_name.is_some() {
            update_fields.push("first_name = ?".to_string());
            args.push(&first_name);
        }
        if last_name.is_some() {
            update_fields.push("last_name = ?".to_string());
            args.push(&last_name);
        }
        if age.is_some() {
            update_fields.push("age = ?".to_string());
            args.push(&age);
        }
        // Check if at least one field is being updated
        if update_fields.len() == 0 {
            // TODO: handle no update fields (no-op)
        }
        args.push(&id);
        update_clause.push_str(&update_fields.join(", "));
        let sql = helpers::replace_placeholders(String::from(format!(
            "UPDATE ninjas {} WHERE id = ? RETURNING *;",
            update_clause
        )));

        let rows = conn.query(&sql, &args).await?; // postgres::error::Error
        let row = match rows.get(0) {
            Some(r) => r,
            None => return Ok(None),
        };
        Ok(Some(types::Ninja {
            id: row.get(0),
            first_name: row.get(1),
            last_name: row.get(2),
            age: row.get(3),
            created_at: row.get(4),
            updated_at: row.get(5),
            jutsus: None,
        }))
    }

    async fn delete_ninja(&self, id: Uuid) -> anyhow::Result<Option<types::Ninja>> {
        let conn = self.pg_pool.get().await?; // bb8::RunError<postgres::Error>

        let sql = helpers::replace_placeholders(String::from(
            "DELETE FROM ninjas WHERE id = ? RETURNING *;",
        ));
        let args: Vec<&(dyn ToSql + Sync)> = vec![&id];

        let rows = conn.query(&sql, &args).await?; // postgres::error::Error
        let row = match rows.get(0) {
            Some(r) => r,
            None => return Ok(None),
        };
        Ok(Some(types::Ninja {
            id: row.get(0),
            first_name: row.get(1),
            last_name: row.get(2),
            age: row.get(3),
            created_at: row.get(4),
            updated_at: row.get(5),
            jutsus: None,
        }))
    }

    // jutsu
    async fn create_jutsu(
        &self,
        jutsu_new: types::JutsuNew,
    ) -> anyhow::Result<Option<types::Jutsu>> {
        let conn = self.pg_pool.get().await?; // bb8::RunError<postgres::Error>

        let sql = helpers::replace_placeholders(String::from(
            "INSERT INTO jutsus (name, description, chakra_nature) VALUES ( ?, ?, ? ) RETURNING *;",
        ));
        let args: Vec<&(dyn ToSql + Sync)> = vec![
            &jutsu_new.name,
            &jutsu_new.description,
            &jutsu_new.chakra_nature,
        ];

        let rows = conn.query(&sql, &args).await?; // postgres::error::Error
        let row = match rows.get(0) {
            Some(r) => r,
            None => return Ok(None),
        };
        Ok(Some(types::Jutsu {
            id: row.get(0),
            name: row.get(1),
            description: row.get(2),
            chakra_nature: row.get(3),
            created_at: row.get(4),
            updated_at: row.get(5),
            ninjas: None,
        }))
    }
    async fn get_jutsu(&self, id: Uuid) -> anyhow::Result<Option<types::Jutsu>> {
        let conn = self.pg_pool.get().await?; // bb8::RunError<postgres::Error>

        let sql = helpers::replace_placeholders(String::from("SELECT * FROM jutsus WHERE id = ?"));
        let args: Vec<&(dyn ToSql + Sync)> = vec![&id];

        let rows = conn.query(&sql, &args).await?; // postgres::error::Error
        let row = match rows.get(0) {
            Some(r) => r,
            None => return Ok(None),
        };
        Ok(Some(types::Jutsu {
            id: row.get(0),
            name: row.get(1),
            description: row.get(2),
            chakra_nature: row.get(3),
            created_at: row.get(4),
            updated_at: row.get(5),
            ninjas: None,
        }))
    }
    async fn update_jutsu(
        &self,
        id: Uuid,
        jutsu_updates: types::JutsuUpdates,
    ) -> anyhow::Result<Option<types::Jutsu>> {
        let conn = self.pg_pool.get().await?; // bb8::RunError<postgres::Error>

        // placeholders and args
        let mut update_clause = String::from("SET ");
        let mut args: Vec<&(dyn ToSql + Sync)> = vec![];
        // update fields
        let name = jutsu_updates.name;
        let description = jutsu_updates.description;
        let chakra_nature = jutsu_updates.chakra_nature;
        // only include if some
        let mut update_fields: Vec<String> = Vec::new();
        if name.is_some() {
            update_fields.push("name = ?".to_string());
            args.push(&name);
        }
        if description.is_some() {
            update_fields.push("description = ?".to_string());
            args.push(&description);
        }
        if chakra_nature.is_some() {
            update_fields.push("chakra_nature = ?".to_string());
            args.push(&chakra_nature);
        }
        // Check if at least one field is being updated
        if update_fields.len() == 0 {
            // TODO: handle no update fields (no-op)
        }
        args.push(&id);
        update_clause.push_str(&update_fields.join(", "));
        let sql = helpers::replace_placeholders(String::from(format!(
            "UPDATE jutsus {} WHERE id = ? RETURNING *;",
            update_clause
        )));

        let rows = conn.query(&sql, &args).await?; // postgres::error::Error
        let row = match rows.get(0) {
            Some(r) => r,
            None => return Ok(None),
        };
        Ok(Some(types::Jutsu {
            id: row.get(0),
            name: row.get(1),
            description: row.get(2),
            chakra_nature: row.get(3),
            created_at: row.get(4),
            updated_at: row.get(5),
            ninjas: None,
        }))
    }

    async fn delete_jutsu(&self, id: Uuid) -> anyhow::Result<Option<types::Jutsu>> {
        let conn = self.pg_pool.get().await?; // bb8::RunError<postgres::Error>

        let sql = helpers::replace_placeholders(String::from(
            "DELETE FROM jutsus WHERE id = ? RETURNING *;",
        ));
        let args: Vec<&(dyn ToSql + Sync)> = vec![&id];

        let rows = conn.query(&sql, &args).await?; // postgres::error::Error
        let row = match rows.get(0) {
            Some(r) => r,
            None => return Ok(None),
        };
        Ok(Some(types::Jutsu {
            id: row.get(0),
            name: row.get(1),
            description: row.get(2),
            chakra_nature: row.get(3),
            created_at: row.get(4),
            updated_at: row.get(5),
            ninjas: None,
        }))
    }

    // ninjas_jutsus
    async fn associate_ninja_and_jutsu(
        &self,
        ninja_id: Uuid,
        jutsu_id: Uuid,
    ) -> anyhow::Result<()> {
        let conn = self.pg_pool.get().await?; // bb8::RunError<postgres::Error>

        let sql = helpers::replace_placeholders(String::from(
            "INSERT INTO ninjas_jutsus (ninja_id, jutsu_id) VALUES ( ?, ? ) RETURNING *;",
        ));
        let args: Vec<&(dyn ToSql + Sync)> = vec![&ninja_id, &jutsu_id];

        conn.execute(&sql, &args).await?; // postgres::error::Error

        Ok(())
    }

    async fn dissociate_ninja_and_jutsu(
        &self,
        ninja_id: Uuid,
        jutsu_id: Uuid,
    ) -> anyhow::Result<()> {
        let conn = self.pg_pool.get().await?; // bb8::RunError<postgres::Error>

        let sql = helpers::replace_placeholders(String::from(
            "DELETE FROM ninjas_jutsus WHERE (ninja_id = ? AND jutsu_id = ?) RETURNING *;",
        ));
        let args: Vec<&(dyn ToSql + Sync)> = vec![&ninja_id, &jutsu_id];

        conn.execute(&sql, &args).await?; // postgres::error::Error

        Ok(())
    }

    async fn get_ninja_jutsus(&self, id: Uuid) -> anyhow::Result<Vec<types::Jutsu>> {
        let conn = self.pg_pool.get().await?; // bb8::RunError<postgres::Error>

        let sql = helpers::replace_placeholders(String::from(
            "SELECT * FROM jutsus WHERE jutsus.id IN (SELECT jutsu_id FROM ninjas_jutsus WHERE ninjas_jutsus.ninja_id = ?);"
        ));
        let args: Vec<&(dyn ToSql + Sync)> = vec![&id];

        let rows = conn.query(&sql, &args).await?; // postgres::error::Error

        let mut jutsus: Vec<types::Jutsu> = Vec::new();
        for row in rows {
            jutsus.push(types::Jutsu {
                id: row.get(0),
                name: row.get(1),
                description: row.get(2),
                chakra_nature: row.get(3),
                created_at: row.get(4),
                updated_at: row.get(5),
                ninjas: None,
            });
        }
        Ok(jutsus)
    }

    async fn get_ninja_with_jutsus(&self, id: Uuid) -> anyhow::Result<Option<types::Ninja>> {
        let mut ninja = match self.get_ninja(id.clone()).await? {
            Some(n) => n,
            None => return Ok(None),
        };
        let jutsus = self.get_ninja_jutsus(id).await?;
        ninja.jutsus = Some(jutsus);
        Ok(Some(ninja))
    }
}
