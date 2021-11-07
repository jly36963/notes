-- ---
-- Triggers
-- ---

-- Drop triggers
DROP TRIGGER IF EXISTS ninjas_created_at
    ON ninjas;
DROP TRIGGER IF EXISTS ninjas_updated_at
    ON ninjas;
DROP TRIGGER IF EXISTS jutsus_created_at
    ON jutsus;
DROP TRIGGER IF EXISTS jutsus_updated_at
    ON jutsus;

-- ---
-- Functions
-- ---

-- Drop functions
DROP FUNCTION IF EXISTS on_create_timestamp();
DROP FUNCTION IF EXISTS on_update_timestamp();


-- ---
-- Tables
-- ---

-- Drop tables
DROP TABLE IF EXISTS ninjas_jutsus;
DROP TABLE IF EXISTS jutsus;
DROP TABLE IF EXISTS ninjas;
