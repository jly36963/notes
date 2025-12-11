BEGIN;

-- ---
-- Tables
-- ---

-- Create ninjas table
CREATE TABLE IF NOT EXISTS ninjas (
    id uuid DEFAULT gen_random_uuid(),
    first_name varchar(255) NOT NULL,
    last_name varchar(255) NOT NULL,
    age int NOT NULL,
    created_at timestamp,
    updated_at timestamp,
    PRIMARY KEY (id)
);
-- Create jutsus table
CREATE TABLE IF NOT EXISTS jutsus (
    id uuid DEFAULT gen_random_uuid(),
    name varchar(255) NOT NULL,
    chakra_nature varchar(255) NOT NULL,
    description varchar(255) NOT NULL,
    created_at timestamp,
    updated_at timestamp,
    PRIMARY KEY (id)
);
-- Create ninjas_jutsus (lookup) table
CREATE TABLE IF NOT EXISTS ninjas_jutsus (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    ninja_id uuid NOT NULL,
    jutsu_id uuid NOT NULL,
    FOREIGN KEY (ninja_id) REFERENCES ninjas(id),
    FOREIGN KEY (jutsu_id) REFERENCES jutsus(id)
);

-- uuid-v4
-- gen_random_uuid is available in pg 13
-- uuid-ossp and pgcrypto also exist

-- ---
-- Functions
-- ---

-- Create created_at function
CREATE OR REPLACE FUNCTION on_create_timestamp()
  RETURNS trigger AS $$
  BEGIN
    NEW.created_at = now();
    RETURN NEW;
  END;
  $$ language 'plpgsql';
-- Create updated_at function
CREATE OR REPLACE FUNCTION on_update_timestamp()
  RETURNS trigger AS $$
  BEGIN
    NEW.updated_at = now();
    RETURN NEW;
  END;
  $$ language 'plpgsql';

-- ---
-- Triggers
-- ---

-- Drop old triggers
DROP TRIGGER IF EXISTS ninjas_created_at
    ON ninjas;
DROP TRIGGER IF EXISTS ninjas_updated_at
    ON ninjas;
DROP TRIGGER IF EXISTS jutsus_created_at
    ON jutsus;
DROP TRIGGER IF EXISTS jutsus_updated_at
    ON jutsus;

-- Create created_at trigger (ninjas)
CREATE TRIGGER ninjas_created_at
    BEFORE INSERT ON ninjas
    FOR EACH ROW
    EXECUTE PROCEDURE on_create_timestamp();
-- Create updated_at trigger (ninjas)
CREATE TRIGGER ninjas_updated_at
    BEFORE UPDATE ON ninjas
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
-- Create created_at trigger (jutsus)
CREATE TRIGGER jutsus_created_at
    BEFORE INSERT ON jutsus
    FOR EACH ROW
    EXECUTE PROCEDURE on_create_timestamp();
-- Create updated_at trigger (jutsus)
CREATE TRIGGER jutsus_updated_at
    BEFORE UPDATE ON jutsus
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();

COMMIT;