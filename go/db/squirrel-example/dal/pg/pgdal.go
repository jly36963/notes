package pg

import (
	"context"
	"database/sql"
	"errors"
	"squirrel-example/types"
	"time"

	sq "github.com/Masterminds/squirrel"
	pgx "github.com/jackc/pgx/v4"
	"github.com/jackc/pgx/v4/pgxpool"
)

// ---
// dal
// ---

type IPostgresDAL interface {
	GetClient(s string)
	// ninjas
	CreateNinja(ninjaNew types.NinjaNew) (types.Ninja, error)
	GetNinja(id string) (types.Ninja, error)
	UpdateNinja(id string, ninjaUpdates types.NinjaNew) (types.Ninja, error)
	DeleteNinja(id string) (types.Ninja, error)
	// jutsus
	CreateJutsu(jutsuNew types.JutsuNew) (types.Jutsu, error)
	GetJutsu(id string) (types.Jutsu, error)
	UpdateJutsu(id string, jutsuUpdates types.JutsuNew) (types.Jutsu, error)
	DeleteJutsu(id string) (types.Jutsu, error)
	// ninjas_jutsus
	AssociateNinjaJutsu(ninjaID, jutsuID string) (bool, error)
	DissociateNinjaJutsu(ninjaID string, jutsuID string) (bool, error)
	GetNinjaWithJutsus(id string) (types.Ninja, error)
}

type PostgresDAL struct {
	client *pgxpool.Pool
}

// GetClient gets a client to the postgres database
func (dal *PostgresDAL) GetClient(connString string) {
	pool, err := pgxpool.Connect(context.Background(), connString)
	if err != nil {
		panic("Could not connect to postgres database")
	}
	dal.client = pool
}

// getQB gets a squirrel query builder (statement builder)
func (dal *PostgresDAL) getQB() sq.StatementBuilderType {
	return sq.StatementBuilder
}

// Subquery ...
func SubQuery(sb sq.SelectBuilder) sq.Sqlizer {
	sql, params, _ := sb.ToSql()
	return sq.Expr("("+sql+")", params)
}

// excuteRaw takes raw sql, args and returns the result of execution. (Replaces ? with $i)
func (dal *PostgresDAL) executeRaw(sql string, args ...interface{}) (pgx.Rows, error) {
	sql, err := sq.Dollar.ReplacePlaceholders(sql)
	if err != nil {
		return nil, err
	}
	return dal.client.Query(context.Background(), sql, args...)
}

// // executeSelectMany takes a select statement query builder and executes it
// func (dal *PostgresDAL) executeSelectMany(selectBuilder sq.SelectBuilder) (pgx.Rows, error) {
// 	// convert ? to $1 (postgres specific)
// 	selectBuilder = selectBuilder.PlaceholderFormat(sq.Dollar)
// 	// get query and args from query builder
// 	query, args, err := selectBuilder.ToSql()
// 	if err != nil {
// 		return nil, err
// 	}
// 	// execute query
// 	return dal.client.Query(context.Background(), query, args...)
// }

// executeSelect takes a select statement query builder and executes it
func (dal *PostgresDAL) executeSelect(selectBuilder sq.SelectBuilder) (pgx.Row, error) {
	// convert ? to $1 (postgres specific)
	selectBuilder = selectBuilder.PlaceholderFormat(sq.Dollar)
	// get query and args from query builder
	query, args, err := selectBuilder.ToSql()
	if err != nil {
		return nil, err
	}
	// execute query
	return dal.client.QueryRow(context.Background(), query, args...), nil
}

// executeInsert takes an insert statement query builder and executes it
func (dal *PostgresDAL) executeInsert(insertBuilder sq.InsertBuilder) (pgx.Row, error) {
	// convert ? to $1 (postgres specific)
	insertBuilder = insertBuilder.PlaceholderFormat(sq.Dollar)
	// get query and args from query builder
	query, args, err := insertBuilder.ToSql()
	if err != nil {
		return nil, err
	}
	// execute query
	return dal.client.QueryRow(context.Background(), query, args...), nil
}

// executeUpdate takes an update statement query builder and executes it
func (dal *PostgresDAL) executeUpdate(updateBuilder sq.UpdateBuilder) (pgx.Row, error) {
	// convert ? to $1 (postgres specific)
	updateBuilder = updateBuilder.PlaceholderFormat(sq.Dollar)
	// get query and args from query builder
	query, args, err := updateBuilder.ToSql()
	if err != nil {
		return nil, err
	}
	// execute query
	return dal.client.QueryRow(context.Background(), query, args...), nil
}

// executeDelete takes a delete statement query builder and executes it
func (dal *PostgresDAL) executeDelete(deleteBuilder sq.DeleteBuilder) (pgx.Row, error) {
	// convert ? to $1 (postgres specific)
	deleteBuilder = deleteBuilder.PlaceholderFormat(sq.Dollar)
	// get query and args from query builder
	query, args, err := deleteBuilder.ToSql()
	if err != nil {
		return nil, err
	}
	// execute query
	return dal.client.QueryRow(context.Background(), query, args...), nil
}

// ---
// convert
// ---

func (dal *PostgresDAL) rowToNinja(row pgx.Row) (types.Ninja, error) {
	var id string
	var firstName string
	var lastName string
	var age int64
	var createdAt time.Time
	var updatedAt sql.NullTime

	if err := row.Scan(&id, &firstName, &lastName, &age, &createdAt, &updatedAt); err != nil {
		return types.Ninja{}, err
	}

	ninja := types.Ninja{
		ID:        id,
		FirstName: firstName,
		LastName:  lastName,
		Age:       age,
		CreatedAt: createdAt,
	}

	if updatedAt.Valid {
		ninja.UpdatedAt = updatedAt.Time
	}

	return ninja, nil
}

func (dal *PostgresDAL) rowToJutsu(row pgx.Row) (types.Jutsu, error) {
	var id string
	var name string
	var chakraNature string
	var description string
	var createdAt time.Time
	var updatedAt sql.NullTime

	if err := row.Scan(&id, &name, &chakraNature, &description, &createdAt, &updatedAt); err != nil {
		return types.Jutsu{}, err
	}

	jutsu := types.Jutsu{
		ID:           id,
		Name:         name,
		ChakraNature: chakraNature,
		Description:  description,
		CreatedAt:    createdAt,
	}

	if updatedAt.Valid {
		jutsu.UpdatedAt = updatedAt.Time
	}

	return jutsu, nil
}

// ---
// ninjas
// ---

func (dal *PostgresDAL) CreateNinja(ninjaNew types.NinjaNew) (types.Ninja, error) {
	// get query builder
	qb := dal.getQB()
	insertBuilder := qb.
		Insert("ninjas").
		Columns("first_name", "last_name", "age").
		Values(ninjaNew.FirstName, ninjaNew.LastName, ninjaNew.Age).
		Suffix("RETURNING *")

	// execute query
	row, err := dal.executeInsert(insertBuilder)
	if err != nil {
		return types.Ninja{}, err
	}

	// convert to struct
	ninja, err := dal.rowToNinja(row)
	if err != nil {
		return types.Ninja{}, err
	}

	return ninja, nil
}

func (dal *PostgresDAL) GetNinja(id string) (types.Ninja, error) {
	// get query builder
	qb := dal.getQB()
	selectBuilder := qb.
		Select("*").
		From("ninjas").
		Where(sq.Eq{"id": id})

	// execute query
	row, err := dal.executeSelect(selectBuilder)
	if err != nil {
		return types.Ninja{}, err
	}

	// convert to struct
	ninja, err := dal.rowToNinja(row)
	if err != nil {
		return types.Ninja{}, err
	}

	return ninja, nil
}

func (dal *PostgresDAL) UpdateNinja(id string, ninjaUpdates types.NinjaNew) (types.Ninja, error) {
	// get query builder
	qb := dal.getQB()
	updateBuilder := qb.
		Update("ninjas").
		Where(sq.Eq{"id": id}).
		Suffix("Returning *")

	// dynamically add updates, determine if update should happen
	shouldUpdate := false
	if ninjaUpdates.FirstName != "" {
		updateBuilder = updateBuilder.Set("first_name", ninjaUpdates.FirstName)
		shouldUpdate = true
	}
	if ninjaUpdates.LastName != "" {
		updateBuilder = updateBuilder.Set("last_name", ninjaUpdates.LastName)
		shouldUpdate = true
	}
	if ninjaUpdates.Age != 0 {
		updateBuilder = updateBuilder.Set("age", ninjaUpdates.Age)
		shouldUpdate = true
	}
	if !shouldUpdate {
		return types.Ninja{}, errors.New("no fields to update")
	}

	// execute query
	row, err := dal.executeUpdate(updateBuilder)
	if err != nil {
		return types.Ninja{}, err
	}

	// convert to struct
	ninja, err := dal.rowToNinja(row)
	if err != nil {
		return types.Ninja{}, err
	}

	return ninja, nil
}

func (dal *PostgresDAL) DeleteNinja(id string) (types.Ninja, error) {
	// get query builder
	qb := dal.getQB()
	deleteBuilder := qb.
		Delete("ninjas").
		Where(sq.Eq{"id": id}).
		Suffix("Returning *")

	// execute query
	row, err := dal.executeDelete(deleteBuilder)
	if err != nil {
		return types.Ninja{}, err
	}

	// convert to struct
	ninja, err := dal.rowToNinja(row)
	if err != nil {
		return types.Ninja{}, err
	}

	return ninja, nil
}

// ---
// jutsus
// ---

func (dal *PostgresDAL) CreateJutsu(jutsuNew types.JutsuNew) (types.Jutsu, error) {
	// get query builder
	qb := dal.getQB()
	insertBuilder := qb.
		Insert("jutsus").
		Columns("name", "chakra_nature", "description").
		Values(jutsuNew.Name, jutsuNew.ChakraNature, jutsuNew.Description).
		Suffix("RETURNING *")

	// execute query
	row, err := dal.executeInsert(insertBuilder)
	if err != nil {
		return types.Jutsu{}, err
	}

	// convert to struct
	jutsu, err := dal.rowToJutsu(row)
	if err != nil {
		return types.Jutsu{}, err
	}

	return jutsu, nil
}

func (dal *PostgresDAL) GetJutsu(id string) (types.Jutsu, error) {
	// get query builder
	qb := dal.getQB()
	selectBuilder := qb.
		Select("*").
		From("jutsus").
		Where(sq.Eq{"id": id})

	// execute query
	row, err := dal.executeSelect(selectBuilder)
	if err != nil {
		return types.Jutsu{}, err
	}

	// convert to struct
	jutsu, err := dal.rowToJutsu(row)
	if err != nil {
		return types.Jutsu{}, err
	}

	return jutsu, nil
}

func (dal *PostgresDAL) UpdateJutsu(id string, jutsuUpdates types.JutsuNew) (types.Jutsu, error) {
	// get query builder
	qb := dal.getQB()
	updateBuilder := qb.
		Update("jutsus").
		Where(sq.Eq{"id": id}).
		Suffix("Returning *")

	// dynamically add updates, determine if update should happen
	shouldUpdate := false
	if jutsuUpdates.Name != "" {
		updateBuilder = updateBuilder.Set("name", jutsuUpdates.Name)
		shouldUpdate = true
	}
	if jutsuUpdates.ChakraNature != "" {
		updateBuilder = updateBuilder.Set("chakra_nature", jutsuUpdates.ChakraNature)
		shouldUpdate = true
	}
	if jutsuUpdates.Description != "" {
		updateBuilder = updateBuilder.Set("description", jutsuUpdates.Description)
		shouldUpdate = true
	}
	if !shouldUpdate {
		return types.Jutsu{}, errors.New("no fields to update")
	}

	// execute query
	row, err := dal.executeUpdate(updateBuilder)
	if err != nil {
		return types.Jutsu{}, err
	}

	// convert to struct
	jutsu, err := dal.rowToJutsu(row)
	if err != nil {
		return types.Jutsu{}, err
	}

	return jutsu, nil
}

func (dal *PostgresDAL) DeleteJutsu(id string) (types.Jutsu, error) {
	// get query builder
	qb := dal.getQB()
	deleteBuilder := qb.
		Delete("jutsus").
		Where(sq.Eq{"id": id}).
		Suffix("Returning *")

	// execute query
	row, err := dal.executeDelete(deleteBuilder)
	if err != nil {
		return types.Jutsu{}, err
	}

	// convert to struct
	jutsu, err := dal.rowToJutsu(row)
	if err != nil {
		return types.Jutsu{}, err
	}

	return jutsu, nil
}

// ---
// ninjas_jutsus
// ---

func (dal *PostgresDAL) AssociateNinjaJutsu(ninjaID, jutsuID string) (bool, error) {
	// get query builder
	qb := dal.getQB()
	insertBuilder := qb.
		Insert("ninjas_jutsus").
		Columns("ninja_id", "jutsu_id").
		Values(ninjaID, jutsuID).
		Suffix("RETURNING *")

	// execute query
	_, err := dal.executeInsert(insertBuilder)
	if err != nil {
		return false, err
	}

	return true, nil
}

func (dal *PostgresDAL) DissociateNinjaJutsu(ninjaID string, jutsuID string) (bool, error) {
	// get query builder
	qb := dal.getQB()
	deleteBuilder := qb.
		Delete("ninjas_jutsus").
		Where(sq.Eq{"ninja_id": ninjaID}).
		Where(sq.Eq{"jutsu_id": jutsuID}).
		Suffix("Returning *")

	// execute query
	_, err := dal.executeDelete(deleteBuilder)
	if err != nil {
		return false, err
	}

	return true, nil
}

func (dal *PostgresDAL) getNinjaJutsus(id string) ([]types.Jutsu, error) {
	sql := `
	SELECT * 
	FROM jutsus 
	WHERE jutsus.id IN (
		SELECT jutsu_id 
		FROM ninjas_jutsus 
		WHERE ninjas_jutsus.ninja_id = ?
	)`
	args := make([]interface{}, 0)
	args = append(args, id)
	rows, err := dal.executeRaw(sql, args...)
	if err != nil {
		return nil, err
	}

	// convert to struct
	jutsus := make([]types.Jutsu, 0)
	for rows.Next() {
		jutsu, err := dal.rowToJutsu(rows)
		if err != nil {
			return nil, err
		}
		jutsus = append(jutsus, jutsu)
	}

	return jutsus, nil
}

func (dal *PostgresDAL) GetNinjaWithJutsus(id string) (types.Ninja, error) {
	// get ninja
	ninja, err := dal.GetNinja(id)
	if err != nil {
		return types.Ninja{}, err
	}
	// get jutsus
	jutsus, err := dal.getNinjaJutsus(id)
	if err != nil {
		return types.Ninja{}, err
	}
	ninja.Jutsus = jutsus
	return ninja, nil
}
