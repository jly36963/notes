package main

import (
	"github.com/go-pg/migrations/v8"
)

func init() {
	migrations.MustRegisterTx(up, down)
}

// up logic
func up(db migrations.DB) error {
	var err error
	// create ninjas
	_, err = db.Exec(`
	CREATE TABLE IF NOT EXISTS ninjas (
		id SERIAL PRIMARY KEY,
		first_name varchar(255) NOT NULL,
		last_name varchar(255) NOT NULL,
		created_at timestamp,
		updated_at timestamp,
		deleted_at timestamp
	);`)
	// create jutsus
	_, err = db.Exec(`
	CREATE TABLE IF NOT EXISTS jutsus (
		id SERIAL PRIMARY KEY,
		name varchar(255) NOT NULL,
		chakra_nature varchar(255) NOT NULL,
		description varchar(255) NOT NULL,
		created_at timestamp,
		updated_at timestamp,
		deleted_at timestamp
	);`)
	// create ninjas_jutsus
	_, err = db.Exec(`
	CREATE TABLE IF NOT EXISTS ninjas_jutsus (
		id SERIAL PRIMARY KEY,
		ninja_id INT NOT NULL,
		jutsu_id INT NOT NULL,
		created_at timestamp,
		updated_at timestamp,
		deleted_at timestamp,
		FOREIGN KEY (ninja_id) REFERENCES ninjas(id),
		FOREIGN KEY (jutsu_id) REFERENCES jutsus(id)
	);`)

	return err
}

// down logic
func down(db migrations.DB) error {
	var err error
	_, err = db.Exec(`
	DROP TABLE IF EXISTS ninjas_jutsus;
	`)
	_, err = db.Exec(`
	DROP TABLE IF EXISTS jutsus;
	`)
	_, err = db.Exec(`
	DROP TABLE IF EXISTS ninjas;
	`)
	return err
}
