require "db"
require "pg"
require "json"
require "uuid"

# ---
# Todo
# ---

# TODO: replace ? func
# TODO: finish methods
# TODO: type assertions/narrowing in main

# ---
# DAL
# ---

abstract class IPGDAL
  # Ninjas
  abstract def create_ninja(first_name : String, last_name : String, age : Int32) : Ninja?
  abstract def get_ninja(id : UUID) : Ninja?
  abstract def update_ninja(
    id : UUID,
    first_name : String? = nil,
    last_name : String? = nil,
    age : Int32? = nil
  ) : Ninja?
  abstract def delete_ninja(id : UUID) : Ninja?
  # Jutsus
  abstract def create_jutsu(name : String, chakra_nature : String, description : String) : Jutsu?
  abstract def get_jutsu(id : UUID) : Jutsu?
  abstract def update_jutsu(
    id : UUID,
    name : String? = nil,
    chakra_nature : String? = nil,
    description : String? = nil
  ) : Jutsu?
  abstract def delete_jutsu(id : UUID) : Jutsu?
  # Ninjas and jutsus
  abstract def associate_ninja_and_jutsu(ninja_id : UUID, jutsu_id : UUID)
  abstract def dissociate_ninja_and_jutsu(ninja_id : UUID, jutsu_id : UUID)
  abstract def get_ninja_with_jutsus(id : UUID) : Ninja?
end

class PGDAL < IPGDAL
  private property conn_string : String
  private property pool : DB::Database

  def initialize(
    host = "127.0.0.1",
    port = 5432,
    db = "postgres",
    user = "postgres",
    pw = "postgres"
  )
    @conn_string = "postgres://#{user}:#{pw}@#{host}:#{port}/#{db}"
    @pool = DB.open(conn_string)
  end

  def create_ninja(first_name : String, last_name : String, age : Int32) : Ninja?
    ninja = @pool.using_connection do |c|
      c.query_one?(
        "INSERT INTO ninjas (first_name, last_name, age) VALUES ( ?, ?, ? ) RETURNING *;",
        first_name, last_name, age,
        as: Ninja
      )
    end
    ninja
  end

  def get_ninja(id : UUID) : Ninja?
    ninja = @pool.using_connection do |c|
      c.query_one?("SELECT * FROM ninjas WHERE id = ?", id, as: Ninja)
    end
    ninja
  end

  def update_ninja(
    id : UUID,
    first_name : String? = nil,
    last_name : String? = nil,
    age : Int32? = nil
  ) : Ninja?
    # TODO
  end

  def delete_ninja(id : UUID) : Ninja?
    ninja = @pool.using_connection do |c|
      c.query_one?("DELETE FROM ninjas WHERE id = ? RETURNING *;", id, as: Ninja)
    end
    ninja
  end

  def create_jutsu(name : String, chakra_nature : String, description : String) : Jutsu?
    jutsu = @pool.using_connection do |c|
      c.query_one?(
        "INSERT INTO jutsus (name, description, chakra_nature) VALUES ( ?, ?, ? ) RETURNING *;",
        name, description, chakra_nature,
        as: Jutsu
      )
    end
    jutsu
  end

  def get_jutsu(id : UUID) : Jutsu?
    jutsu = @pool.using_connection do |c|
      c.query_one?("SELECT * FROM jutsus WHERE id = ?", id, as: Ninja)
    end
    jutsu
  end

  def update_jutsu(
    id : UUID,
    name : String? = nil,
    chakra_nature : String? = nil,
    description : String? = nil
  ) : Jutsu?
    # TODO
  end

  def delete_jutsu(id : UUID) : Jutsu?
    jutsu = @pool.using_connection do |c|
      c.query_one?("DELETE FROM jutsus WHERE id = ? RETURNING *;", id, as: Ninja)
    end
    jutsu
  end

  def associate_ninja_and_jutsu(ninja_id : UUID, jutsu_id : UUID)
    # TODO
  end

  def dissociate_ninja_and_jutsu(ninja_id : UUID, jutsu_id : UUID)
    # TODO
  end

  def get_ninja_with_jutsus(id : UUID) : Ninja?
    # TODO
  end
end

# ---
# Main
# ---

def main_
  pgdal = PGDAL.new
  puts("pgdal type: #{pgdal.class}")

  ninja = pgdal.create_ninja("Kakashi", "Hatake", 27)
  ninja.nil? && raise("nil")
  puts("Ninja insert result: #{ninja}")

  ninja_id = ninja.id.as(UUID)
  ninja = pgdal.get_ninja(ninja_id).as(Ninja)
  puts("Ninja select result: #{ninja}")

  ninja = pgdal
    .update_ninja(ninja_id, first_name: "Kaka", last_name: "Sensei")
    .as(Ninja)
  puts("Ninja update result: #{ninja}")

  jutsu = pgdal
    .create_jutsu("Chidori", "Lightning", "Plover / a thousand birds")
    .as(Jutsu)
  puts("Jutsu insert result: #{jutsu}")

  jutsu_id = jutsu.id.as(UUID)
  jutsu = pgdal.get_jutsu(jutsu_id).as(Jutsu)
  puts("Jutsu select result: #{jutsu}")

  jutsu = pgdal.update_jutsu(jutsu_id, description: "Lightning blade").as(Jutsu)
  puts("Jutsu select result: #{jutsu}")

  pgdal.associate_ninja_and_jutsu(ninja_id, jutsu_id)
  puts("Associate ninja & jutsu result: ok")

  ninja_with_jutsus = pgdal.get_ninja_with_jutsus(ninja_id).as(Ninja)
  puts("Ninja with jutsus result: #{ninja_with_jutsus}")

  pgdal.dissociate_ninja_and_jutsu(ninja_id, jutsu_id)
  puts("Associate ninja & jutsu result: ok")

  ninja_with_jutsus = pgdal.get_ninja_with_jutsus(ninja_id).as(Ninja)
  puts("Ninja with jutsus result (post dissociation): #{ninja_with_jutsus}")

  ninja = pgdal.delete_ninja(ninja_id).as(Ninja)
  puts("Ninja delete result: #{ninja}")

  jutsu = pgdal.delete_jutsu(jutsu_id).as(Jutsu)
  puts("Jutsu delete result: #{jutsu}")
end

main_()

# ---
# Types
# ---

class Ninja
  include JSON::Serializable

  @[JSON::Field(key: "id")]
  property id : UUID?
  @[JSON::Field(key: "firstName")]
  property first_name : String
  @[JSON::Field(key: "lastName")]
  property last_name : String
  @[JSON::Field(key: "age")]
  property age : Int32
  @[JSON::Field(key: "createdAt")]
  property created_at : Time?
  @[JSON::Field(key: "updatedAt")]
  property updated_at : Time?
  @[JSON::Field(key: "jutsus")]
  property jutsus : Array(Jutsu)?

  def initialize(@first_name, @last_name, @age)
  end

  def to_s
    self.to_json
  end
end

class Jutsu
  include JSON::Serializable

  @[JSON::Field(key: "id")]
  property id : UUID?
  @[JSON::Field(key: "name")]
  property name : String
  @[JSON::Field(key: "chakraNature")]
  property chakra_nature : String
  @[JSON::Field(key: "description")]
  property description : String
  @[JSON::Field(key: "createdAt")]
  property created_at : Time?
  @[JSON::Field(key: "updatedAt")]
  property updated_at : Time?
  @[JSON::Field(key: "ninjas")]
  property ninjas : Array(Ninja)?

  def initialize(@name, @chakra_nature, @description)
  end

  def to_s
    self.to_json
  end
end

# ---
# Notes
# ---

# DB
# http://crystal-lang.github.io/crystal-db/api/0.11.0/DB.html
# open (pool), connect (conn)

# Query methods
# http://crystal-lang.github.io/crystal-db/api/0.11.0/DB/QueryMethods.html
# exec, scalar, query, query_all, query_each, query_one/query_one?,
