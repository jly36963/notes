import gleam/io
import gleam/json
import gleam/option.{None, Some}
import pg_utils/helpers as pg_helpers
import pg_utils/jutsus as pg_jutsus
import pg_utils/ninjas as pg_ninjas
import pg_utils/ninjas_jutsus as pg_ninjas_jutsus
import snag_utils.{snag_try}
import types/jutsu.{Jutsu, JutsuUpdates, jutsu_json_encode}
import types/ninja.{Ninja, NinjaUpdates, ninja_json_encode}
import youid/uuid

// import envoy

// ---
// Main
// ---

pub fn main() {
  let db =
    pg_helpers.get_client(
      host: "localhost",
      port: 5432,
      database: "practice",
      user: "postgres",
      password: "postgres",
    )

  // Create ninja
  use ninja_new <- snag_try(
    pg_ninjas.insert(
      db,
      Ninja(
        id: uuid.v4_string(),
        first_name: "Kakashi",
        last_name: "Hatake",
        age: 27,
        jutsus: None,
        created_at: None,
        updated_at: None,
      ),
    ),
    "Failed to insert ninja",
  )
  io.println("ninja_new: " <> ninja_new |> ninja_json_encode |> json.to_string)

  // Get ninja
  use ninja <- snag_try(pg_ninjas.get(db, ninja_new.id), "Failed to get ninja")
  io.println("\n")
  io.println("ninja: " <> ninja |> ninja_json_encode |> json.to_string)

  // Update ninja
  use ninja_updated <- snag_try(
    pg_ninjas.update(
      db,
      ninja.id,
      NinjaUpdates(
        first_name: Some("Kaka"),
        last_name: Some("Sensei"),
        age: None,
      ),
    ),
    "Failed to update ninja",
  )
  io.println("\n")
  io.println(
    "ninja_updated: " <> ninja_updated |> ninja_json_encode |> json.to_string,
  )

  // Create jutsu
  use jutsu_new <- snag_try(
    pg_jutsus.insert(
      db,
      Jutsu(
        id: uuid.v4_string(),
        name: "Chidori",
        chakra_nature: "Lightning",
        description: "Plover / One thousand birds",
        created_at: None,
        updated_at: None,
      ),
    ),
    "Failed to insert jutsu",
  )
  io.println("\n")
  io.println("jutsu_new: " <> jutsu_new |> jutsu_json_encode |> json.to_string)

  // Get jutsu
  use jutsu <- snag_try(pg_jutsus.get(db, jutsu_new.id), "Failed to get jutsu")
  io.println("\n")
  io.println("jutsu: " <> jutsu |> jutsu_json_encode |> json.to_string)

  // Update jutsu
  use jutsu_updated <- snag_try(
    pg_jutsus.update(
      db,
      jutsu.id,
      JutsuUpdates(
        name: None,
        chakra_nature: None,
        description: Some("Lightning blade"),
      ),
    ),
    "Failed to update jutsu",
  )
  io.println("\n")
  io.println(
    "jutsu_updated: " <> jutsu_updated |> jutsu_json_encode |> json.to_string,
  )

  // Associate ninja/jutsu
  use _ <- snag_try(
    pg_ninjas_jutsus.associate_ninja_jutsu(db, ninja.id, jutsu.id),
    "Failed to add ninja/jutsu",
  )
  io.println("\n")
  io.println("ninja_add_jutsu result: Success")

  // Get ninja with jutsus
  use ninja_with_jutsus <- snag_try(
    pg_ninjas_jutsus.ninja_get_with_jutsus(db, ninja.id),
    "Failed to get ninja with jutsus",
  )

  io.println("\n")
  io.println(
    "ninja_with_jutsus (after association): "
    <> ninja_with_jutsus |> ninja_json_encode |> json.to_string,
  )

  // Dissociate ninja/jutsu
  use _ <- snag_try(
    pg_ninjas_jutsus.dissociate_ninja_jutsu(db, ninja.id, jutsu.id),
    "Failed to remove ninja/jutsu",
  )
  io.println("\n")
  io.println("ninja_remove_jutsu result: Success")

  // Get ninja with jutsus
  use ninja_with_jutsus <- snag_try(
    pg_ninjas_jutsus.ninja_get_with_jutsus(db, ninja.id),
    "Failed to get ninja with jutsus",
  )
  io.println("\n")
  io.println(
    "ninja_with_jutsus (after dissociation): "
    <> ninja_with_jutsus |> ninja_json_encode |> json.to_string,
  )

  // Get jutsu
  use jutsu_deleted <- snag_try(
    pg_jutsus.delete(db, jutsu_new.id),
    "Failed to get jutsu",
  )
  io.println("\n")
  io.println(
    "jutsu_deleted: " <> jutsu_deleted |> jutsu_json_encode |> json.to_string,
  )

  // Get ninja
  use ninja_deleted <- snag_try(
    pg_ninjas.delete(db, ninja_new.id),
    "Failed to get ninja",
  )
  io.println("\n")
  io.println(
    "ninja_deleted: " <> ninja_deleted |> ninja_json_encode |> json.to_string,
  )

  Ok(Nil)
}
