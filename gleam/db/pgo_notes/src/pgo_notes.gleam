import gleam/function
import gleam/io
import gleam/json
import gleam/option.{None, Some}
import gleam/string.{inspect}
import pg_utils
import snag_utils.{snag_try}
import types.{
  Jutsu, JutsuUpdates, Ninja, NinjaUpdates, jutsu_json_encode, ninja_json_decode,
  ninja_json_encode,
}
import youid/uuid

// import envoy

// ---
// Main
// ---

pub fn main() {
  print_section_title("Basic json")
  basic_json()

  print_section_title("Basic pgo")
  basic_pgo()
}

// ---
// Utils
// ---

/// Convert a string to upper-case, wrap with newlines, print
fn print_section_title(s: String) -> Nil {
  io.println("\n" <> string.uppercase(s) <> "\n")
}

// ---
// Examples
// ---

fn basic_json() {
  // Create ninja record
  Ninja(
    id: uuid.v4_string(),
    first_name: "Kakashi",
    last_name: "Hatake",
    age: 27,
    jutsus: Some([
      Jutsu(
        id: uuid.v4_string(),
        name: "Chidori",
        chakra_nature: "Lightning",
        description: "Lightning blade",
        created_at: None,
        updated_at: None,
      ),
    ]),
    created_at: None,
    updated_at: None,
  )
  // Log
  |> function.tap(io.debug)
  // Convert to json string
  |> ninja_json_encode
  |> json.to_string
  // Log
  |> function.tap(io.debug)
  // Convert back to record
  |> ninja_json_decode
  // Log
  |> inspect
  |> io.println
}

fn basic_pgo() {
  let db =
    pg_utils.get_client(
      host: "localhost",
      port: 5432,
      database: "practice",
      user: "postgres",
      password: "postgres",
    )

  // Create ninja
  use ninja_new <- snag_try(
    pg_utils.ninja_insert(
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
  use ninja <- snag_try(
    pg_utils.ninja_get(db, ninja_new.id),
    "Failed to get ninja",
  )
  io.println("ninja: " <> ninja |> ninja_json_encode |> json.to_string)

  // Update ninja
  use ninja_updated <- snag_try(
    pg_utils.ninja_update(
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
  io.println(
    "ninja_updated: " <> ninja_updated |> ninja_json_encode |> json.to_string,
  )

  // Create jutsu
  use jutsu_new <- snag_try(
    pg_utils.jutsu_insert(
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
  io.println("jutsu_new: " <> jutsu_new |> jutsu_json_encode |> json.to_string)

  // Get jutsu
  use jutsu <- snag_try(
    pg_utils.jutsu_get(db, jutsu_new.id),
    "Failed to get jutsu",
  )
  io.println("jutsu: " <> jutsu |> jutsu_json_encode |> json.to_string)

  // Update jutsu
  use jutsu_updated <- snag_try(
    pg_utils.jutsu_update(
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
  io.println(
    "jutsu_updated: " <> jutsu_updated |> jutsu_json_encode |> json.to_string,
  )

  // Associate ninja/jutsu
  use _ <- snag_try(
    pg_utils.ninja_add_jutsu(db, ninja.id, jutsu.id),
    "Failed to add ninja/jutsu",
  )
  io.println("ninja_add_jutsu result: Success")

  // Get ninja with jutsus
  use ninja_with_jutsus <- snag_try(
    pg_utils.ninja_get_with_jutsus(db, ninja.id),
    "Failed to get ninja with jutsus",
  )

  io.println(
    "ninja_with_jutsus (after association): "
    <> ninja_with_jutsus |> ninja_json_encode |> json.to_string,
  )

  // Dissociate ninja/jutsu
  use _ <- snag_try(
    pg_utils.ninja_remove_jutsu(db, ninja.id, jutsu.id),
    "Failed to remove ninja/jutsu",
  )
  io.println("ninja_remove_jutsu result: Success")

  // Get ninja with jutsus
  use ninja_with_jutsus <- snag_try(
    pg_utils.ninja_get_with_jutsus(db, ninja.id),
    "Failed to get ninja with jutsus",
  )
  io.println(
    "ninja_with_jutsus (after dissociation): "
    <> ninja_with_jutsus |> ninja_json_encode |> json.to_string,
  )

  // Get jutsu
  use jutsu_deleted <- snag_try(
    pg_utils.jutsu_delete(db, jutsu_new.id),
    "Failed to get jutsu",
  )
  io.println(
    "jutsu_deleted: " <> jutsu_deleted |> jutsu_json_encode |> json.to_string,
  )

  // Get ninja
  use ninja_deleted <- snag_try(
    pg_utils.ninja_delete(db, ninja_new.id),
    "Failed to get ninja",
  )
  io.println(
    "ninja_deleted: " <> ninja_deleted |> ninja_json_encode |> json.to_string,
  )

  Ok(Nil)
}
