mod helpers;

use super::super::types;
use anyhow;
use async_trait::async_trait;
use sqlx;

pub struct PostgresDAL {
    pub pg_pool: sqlx::Pool<sqlx::Postgres>,
}

#[async_trait]
pub trait TPostgresDAL {
    // ninjas
    async fn create_ninja(
        &self,
        ninja_new: types::NinjaNew,
    ) -> anyhow::Result<Option<types::Ninja>>;
    async fn get_ninja(&self, id: String) -> anyhow::Result<Option<types::Ninja>>;
    async fn update_ninja(
        &self,
        id: String,
        ninja_updates: types::NinjaUpdates,
    ) -> anyhow::Result<Option<types::Ninja>>;
    async fn delete_ninja(&self, id: String) -> anyhow::Result<Option<types::Ninja>>;
    // jutsus
    async fn create_jutsu(
        &self,
        jutsu_new: types::JutsuNew,
    ) -> anyhow::Result<Option<types::Jutsu>>;
    async fn get_jutsu(&self, id: String) -> anyhow::Result<Option<types::Jutsu>>;
    async fn update_jutsu(
        &self,
        id: String,
        jutsu_updates: types::JutsuUpdates,
    ) -> anyhow::Result<Option<types::Jutsu>>;
    async fn delete_jutsu(&self, id: String) -> anyhow::Result<Option<types::Jutsu>>;
    // ninjas_jutsus
    async fn associate_ninja_and_jutsu(
        &self,
        ninja_id: String,
        jutsu_id: String,
    ) -> anyhow::Result<()>;
    async fn dissociate_ninja_and_jutsu(
        &self,
        ninja_id: String,
        jutsu_id: String,
    ) -> anyhow::Result<()>;
    async fn get_ninja_jutsus(&self, id: String) -> anyhow::Result<Vec<types::Jutsu>>;
    async fn get_ninja_with_jutsus(&self, id: String) -> anyhow::Result<Option<types::Ninja>>;
}

#[async_trait]
impl TPostgresDAL for PostgresDAL {
    // ninjas
    async fn create_ninja(
        &self,
        ninja_new: types::NinjaNew,
    ) -> anyhow::Result<Option<types::Ninja>> {
        let sql = helpers::replace_placeholders(String::from(
            "INSERT INTO ninjas (first_name, last_name, age) VALUES ( ?, ?, ? ) RETURNING *;",
        ));

        let row = match sqlx::query_as::<_, types::NinjaSqlx>(&sql)
            .bind(ninja_new.first_name)
            .bind(ninja_new.last_name)
            .bind(ninja_new.age)
            .fetch_optional(&self.pg_pool)
            .await? // sqlx::Error
        {
            Some(r) => r,
            None => return Ok(None),
        };

        Ok(Some(types::Ninja {
            id: row.id.to_string(),
            first_name: row.first_name,
            last_name: row.last_name,
            age: row.age,
            created_at: row.created_at,
            updated_at: row.updated_at,
            jutsus: None,
        }))
    }

    async fn get_ninja(&self, id: String) -> anyhow::Result<Option<types::Ninja>> {
        let uuid = sqlx::types::Uuid::parse_str(&id)?;
        let sql = helpers::replace_placeholders(String::from("SELECT * FROM ninjas WHERE id = ?"));

        let row = match sqlx::query_as::<_, types::NinjaSqlx>(&sql)
            .bind(uuid)
            .fetch_optional(&self.pg_pool)
            .await? // sqlx::Error
        {
            Some(r) => r,
            None => return Ok(None),
        };

        Ok(Some(types::Ninja {
            id: row.id.to_string(),
            first_name: row.first_name,
            last_name: row.last_name,
            age: row.age,
            created_at: row.created_at,
            updated_at: row.updated_at,
            jutsus: None,
        }))
    }

    async fn update_ninja(
        &self,
        id: String,
        ninja_updates: types::NinjaUpdates,
    ) -> anyhow::Result<Option<types::Ninja>> {
        let uuid = sqlx::types::Uuid::parse_str(&id)?;
        let mut update_clause = String::from("SET ");
        // get fields
        let first_name = ninja_updates.first_name;
        let last_name = ninja_updates.last_name;
        let age = ninja_updates.age;
        // determine which fields have updates
        let mut update_fields: Vec<String> = Vec::new();
        if first_name.is_some() {
            update_fields.push("first_name = ?".to_string());
        }
        if last_name.is_some() {
            update_fields.push("last_name = ?".to_string());
        }
        if age.is_some() {
            update_fields.push("age = ?".to_string());
        }
        // Check if at least one field is being updated
        if update_fields.len() == 0 {
            // TODO: handle no update fields (no-op)
        }
        // get querybuilder
        update_clause.push_str(&update_fields.join(", "));
        let sql = helpers::replace_placeholders(String::from(format!(
            "UPDATE ninjas {} WHERE id = ? RETURNING *;",
            update_clause
        )));
        let mut qb = sqlx::query_as::<_, types::NinjaSqlx>(&sql);
        // bind params
        if first_name.is_some() {
            qb = qb.bind(first_name.unwrap());
        }
        if last_name.is_some() {
            qb = qb.bind(last_name.clone().unwrap());
        }
        if age.is_some() {
            qb = qb.bind(age.clone().unwrap());
        }
        qb = qb.bind(uuid);
        // fetch row
        let row = match qb.fetch_optional(&self.pg_pool).await? {
            Some(r) => r,
            None => return Ok(None),
        };
        // return ninja
        Ok(Some(types::Ninja {
            id: row.id.to_string(),
            first_name: row.first_name,
            last_name: row.last_name,
            age: row.age,
            created_at: row.created_at,
            updated_at: row.updated_at,
            jutsus: None,
        }))
    }

    async fn delete_ninja(&self, id: String) -> anyhow::Result<Option<types::Ninja>> {
        let uuid = sqlx::types::Uuid::parse_str(&id)?;
        let sql = helpers::replace_placeholders(String::from(
            "DELETE FROM ninjas WHERE id = ? RETURNING *;",
        ));

        let row = match sqlx::query_as::<_, types::NinjaSqlx>(&sql)
            .bind(uuid)
            .fetch_optional(&self.pg_pool)
            .await?
        {
            Some(r) => r,
            None => return Ok(None),
        };

        Ok(Some(types::Ninja {
            id: row.id.to_string(),
            first_name: row.first_name,
            last_name: row.last_name,
            age: row.age,
            created_at: row.created_at,
            updated_at: row.updated_at,
            jutsus: None,
        }))
    }

    // jutsu
    async fn create_jutsu(
        &self,
        jutsu_new: types::JutsuNew,
    ) -> anyhow::Result<Option<types::Jutsu>> {
        let sql = helpers::replace_placeholders(String::from(
            "INSERT INTO jutsus (name, description, chakra_nature) VALUES ( ?, ?, ? ) RETURNING *;",
        ));

        let row = match sqlx::query_as::<_, types::JutsuSqlx>(&sql)
            .bind(jutsu_new.name)
            .bind(jutsu_new.description)
            .bind(jutsu_new.chakra_nature)
            .fetch_optional(&self.pg_pool)
            .await? // sqlx::Error
        {
            Some(r) => r,
            None => return Ok(None),
        };

        Ok(Some(types::Jutsu {
            id: row.id.to_string(),
            name: row.name,
            description: row.description,
            chakra_nature: row.chakra_nature,
            created_at: row.created_at,
            updated_at: row.updated_at,
            ninjas: None,
        }))
    }
    async fn get_jutsu(&self, id: String) -> anyhow::Result<Option<types::Jutsu>> {
        let uuid = sqlx::types::Uuid::parse_str(&id)?;
        let sql = helpers::replace_placeholders(String::from("SELECT * FROM jutsus WHERE id = ?"));

        let row = match sqlx::query_as::<_, types::JutsuSqlx>(&sql)
            .bind(uuid)
            .fetch_optional(&self.pg_pool)
            .await? // sqlx::Error
        {
            Some(r) => r,
            None => return Ok(None),
        };

        Ok(Some(types::Jutsu {
            id: row.id.to_string(),
            name: row.name,
            description: row.description,
            chakra_nature: row.chakra_nature,
            created_at: row.created_at,
            updated_at: row.updated_at,
            ninjas: None,
        }))
    }
    async fn update_jutsu(
        &self,
        id: String,
        jutsu_updates: types::JutsuUpdates,
    ) -> anyhow::Result<Option<types::Jutsu>> {
        let uuid = sqlx::types::Uuid::parse_str(&id)?;
        let mut update_clause = String::from("SET ");
        // get fields
        let name = jutsu_updates.name;
        let description = jutsu_updates.description;
        let chakra_nature = jutsu_updates.chakra_nature;
        // determine which fields have updates
        let mut update_fields: Vec<String> = Vec::new();
        if name.is_some() {
            update_fields.push("name = ?".to_string());
        }
        if description.is_some() {
            update_fields.push("description = ?".to_string());
        }
        if chakra_nature.is_some() {
            update_fields.push("chakra_nature = ?".to_string());
        }
        // Check if at least one field is being updated
        if update_fields.len() == 0 {
            // TODO: handle no update fields (no-op)
        }
        // get querybuilder
        update_clause.push_str(&update_fields.join(", "));
        let sql = helpers::replace_placeholders(String::from(format!(
            "UPDATE jutsus {} WHERE id = ? RETURNING *;",
            update_clause
        )));
        let mut qb = sqlx::query_as::<_, types::JutsuSqlx>(&sql);
        // bind params
        if name.is_some() {
            qb = qb.bind(name.unwrap());
        }
        if description.is_some() {
            qb = qb.bind(description.clone().unwrap());
        }
        if chakra_nature.is_some() {
            qb = qb.bind(chakra_nature.clone().unwrap());
        }
        qb = qb.bind(uuid);
        // fetch row
        let row = match qb.fetch_optional(&self.pg_pool).await? {
            Some(r) => r,
            None => return Ok(None),
        };
        // return ninja
        Ok(Some(types::Jutsu {
            id: row.id.to_string(),
            name: row.name,
            description: row.description,
            chakra_nature: row.chakra_nature,
            created_at: row.created_at,
            updated_at: row.updated_at,
            ninjas: None,
        }))
    }

    async fn delete_jutsu(&self, id: String) -> anyhow::Result<Option<types::Jutsu>> {
        let uuid = sqlx::types::Uuid::parse_str(&id)?; // sqlx::types::uuid::Error
        let sql = helpers::replace_placeholders(String::from(
            "DELETE FROM jutsus WHERE id = ? RETURNING *;",
        ));

        let row = match sqlx::query_as::<_, types::JutsuSqlx>(&sql)
            .bind(uuid)
            .fetch_optional(&self.pg_pool)
            .await? // sqlx::Error
        {
            Some(r) => r,
            None => return Ok(None),
        };

        Ok(Some(types::Jutsu {
            id: row.id.to_string(),
            name: row.name,
            description: row.description,
            chakra_nature: row.chakra_nature,
            created_at: row.created_at,
            updated_at: row.updated_at,
            ninjas: None,
        }))
    }

    // ninjas_jutsus
    async fn associate_ninja_and_jutsu(
        &self,
        ninja_id: String,
        jutsu_id: String,
    ) -> anyhow::Result<()> {
        let ninja_uuid = sqlx::types::Uuid::parse_str(&ninja_id).unwrap(); // sqlx::types::uuid::Error
        let jutsu_uuid = sqlx::types::Uuid::parse_str(&jutsu_id).unwrap();
        let sql = helpers::replace_placeholders(String::from(
            "INSERT INTO ninjas_jutsus (ninja_id, jutsu_id) VALUES ( ?, ? ) RETURNING *;",
        ));

        let _ = sqlx::query(&sql)
            .bind(ninja_uuid)
            .bind(jutsu_uuid)
            .execute(&self.pg_pool)
            .await;

        Ok(())
    }

    async fn dissociate_ninja_and_jutsu(
        &self,
        ninja_id: String,
        jutsu_id: String,
    ) -> anyhow::Result<()> {
        let ninja_uuid = sqlx::types::Uuid::parse_str(&ninja_id).unwrap(); // sqlx::types::uuid::Error
        let jutsu_uuid = sqlx::types::Uuid::parse_str(&jutsu_id).unwrap();
        let sql = helpers::replace_placeholders(String::from(
            "DELETE FROM ninjas_jutsus WHERE (ninja_id = ? AND jutsu_id = ?) RETURNING *;",
        ));

        let _ = sqlx::query(&sql)
            .bind(ninja_uuid)
            .bind(jutsu_uuid)
            .execute(&self.pg_pool)
            .await;

        Ok(())
    }

    async fn get_ninja_jutsus(&self, id: String) -> anyhow::Result<Vec<types::Jutsu>> {
        let uuid = sqlx::types::Uuid::parse_str(&id)?; // sqlx::types::uuid::Error
        let sql = helpers::replace_placeholders(String::from(
            "SELECT * FROM jutsus WHERE jutsus.id IN (SELECT jutsu_id FROM ninjas_jutsus WHERE ninjas_jutsus.ninja_id = ?);"
        ));
        let rows = sqlx::query_as::<_, types::JutsuSqlx>(&sql)
            .bind(uuid)
            .fetch_all(&self.pg_pool)
            .await?;
        let mut jutsus: Vec<types::Jutsu> = Vec::new();
        for row in rows {
            jutsus.push(types::Jutsu {
                id: row.id.to_string(),
                name: row.name,
                description: row.description,
                chakra_nature: row.chakra_nature,
                created_at: row.created_at,
                updated_at: row.updated_at,
                ninjas: None,
            });
        }
        Ok(jutsus)
    }

    async fn get_ninja_with_jutsus(&self, id: String) -> anyhow::Result<Option<types::Ninja>> {
        let mut ninja = match self.get_ninja(id.clone()).await? {
            Some(n) => n,
            None => return Ok(None),
        };
        let jutsus = self.get_ninja_jutsus(id).await.unwrap();
        ninja.jutsus = Some(jutsus);
        Ok(Some(ninja))
    }
}
