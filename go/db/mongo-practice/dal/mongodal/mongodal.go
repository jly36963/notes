package mongodal

import (
	"context"
	"errors"
	"fmt"
	"log"
	"mongo-practice/types"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

// "gorm-practice/connections/pg/DB"

// ---
// postgres
// ---

// IMongoDAL -- describes DAL methods
type IMongoDAL interface {
	// connection
	GetConnectionString() error
	GetConnection() error
	CloseConnection()
	// ninjas
	GetNinja(id string) (ninja types.Ninja, err error)
	InsertNinja(ninja types.Ninja) (insertedNinja types.Ninja, err error)
	UpdateNinja(id string, updates types.Ninja) (updatedNinja types.Ninja, err error)
	DeleteNinja(id string) (deletedNinja types.Ninja, err error)
	// jutsus
	GetJutsu(id string) (jutsu types.Jutsu, err error)
	InsertJutsu(jutsu types.Jutsu) (insertedJutsu types.Jutsu, err error)
	UpdateJutsu(id string, updates types.Jutsu) (updatedJutsu types.Jutsu, err error)
	DeleteJutsu(id string) (deletedJutsu types.Jutsu, err error)
	// ninjas_jutsus
	AddKnownJutsu(ninjaid string, jutsuid string) (success bool, err error)
	RemoveKnownJutsu(ninjaid string, jutsuid string) (success bool, err error)
	GetNinjaWithRelatedJutsu(id string) (ninjaWithRelatedJutsu types.Ninja, err error)
	GetJutsuWithRelatedNinja(id string) (jutsuWithRelatedNinja types.Jutsu, err error)
}

// MongoDAL -- implementation of IMongoDAL interface
type MongoDAL struct {
	url    string
	client *mongo.Client
	ctx    context.Context
	cancel context.CancelFunc
	ninjas *mongo.Collection
	jutsus *mongo.Collection
}

// ---
// connection
// ---

// // mdb -- database connection
// var mdb *gorm.DB

// GetConnectionString -- load env vars and format into connection string
func (mongodal *MongoDAL) GetConnectionString() (err error) {
	// use env
	user := os.Getenv("MONGO_USER")
	pw := os.Getenv("MONGO_PW")
	host := os.Getenv("MONGO_HOST")
	port := os.Getenv("MONGO_PORT")
	// db := os.Getenv("MONGO_DB")
	for _, part := range []string{user, pw, host, port} {
		if len(part) == 0 {
			err = errors.New("could not format connection string, check environment variables")
			fmt.Println(err)
			return
		}
	}
	// format conn string
	connString := fmt.Sprintf("mongodb://%s:%s@%s:%s/", user, pw, host, port)
	fmt.Println("MongoDB connection string")
	fmt.Println(connString)
	mongodal.url = connString
	return
}

// ---
// connect to db
// ---

// GetConnection -- get connection string and create connection
func (mongodal *MongoDAL) GetConnection() (err error) {
	err = mongodal.GetConnectionString()
	if err != nil {
		return
	}

	// create client and connect
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	// defer cancel()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongodal.url))

	// defer disconnect
	// defer func() {
	// 	if err = client.Disconnect(context.TODO()); err != nil {
	// 		log.Fatal(err)
	// 	}
	// }()

	// ping (test connection)
	if err = client.Ping(context.TODO(), readpref.Primary()); err != nil {
		log.Fatal(err)
	}

	// set mongodal fields
	mongodal.client = client
	mongodal.ctx = ctx
	mongodal.cancel = cancel
	mongodal.ninjas = client.Database("practice").Collection("ninjas")
	mongodal.jutsus = client.Database("practice").Collection("jutsus")
	return
}

// CloseConnection -- close mongodb connection
func (mongodal *MongoDAL) CloseConnection() {
	mongodal.cancel()
}

// ---
// helper
// ---

// ToDoc -- struct -> bson document
func toDoc(x interface{}) (doc *bson.D, err error) {
	data, err := bson.Marshal(x)
	if err != nil {
		fmt.Println("Could not marshal input (ToDoc)")
		return
	}
	err = bson.Unmarshal(data, &doc)
	return
}

func idToFilter(id string) (filter bson.M, err error) {
	_id, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		return
	}
	filter = bson.M{
		"_id": _id,
	}
	return
}

func getTimeUTC() (now time.Time) {
	loc, _ := time.LoadLocation("UTC")
	now = time.Now().In(loc)
	return
}

// ---
// ninja
// ---

// GetNinja -- db method
func (mongodal *MongoDAL) GetNinja(id string) (ninja types.Ninja, err error) {
	// filter
	filter, err := idToFilter(id)
	if err != nil {
		return
	}
	// find
	err = mongodal.ninjas.FindOne(mongodal.ctx, filter).Decode(&ninja)
	if err != nil {
		return
	}
	return
}

// InsertNinja -- db method
func (mongodal *MongoDAL) InsertNinja(ninja types.Ninja) (insertedNinja types.Ninja, err error) {
	// insert ninja
	ninja.CreatedAt = getTimeUTC()
	result, err := mongodal.ninjas.InsertOne(mongodal.ctx, ninja)
	if err != nil {
		return
	}
	insertedNinjaID := result.InsertedID // insertOneResult.InsertedID

	fmt.Println("insertedNinjaID")
	fmt.Println(insertedNinjaID)

	filter := bson.M{
		"_id": insertedNinjaID,
	}
	// return inserted ninja
	err = mongodal.ninjas.FindOne(mongodal.ctx, filter).Decode(&insertedNinja)
	if err != nil {
		return
	}
	return
}

// UpdateNinja -- db method
func (mongodal *MongoDAL) UpdateNinja(id string, updates types.Ninja) (updatedNinja types.Ninja, err error) {
	// filter
	filter, err := idToFilter(id)
	if err != nil {
		return
	}
	// update
	updates.UpdatedAt = getTimeUTC()
	updateSubdoc, err := toDoc(updates)
	updateDoc := bson.M{
		"$set": updateSubdoc,
	}
	// update ninja
	_, err = mongodal.ninjas.UpdateOne(mongodal.ctx, filter, updateDoc)
	if err != nil {
		return
	}
	// get updated ninja
	err = mongodal.ninjas.FindOne(mongodal.ctx, filter).Decode(&updatedNinja)
	if err != nil {
		return
	}
	return
}

// DeleteNinja -- db method
func (mongodal *MongoDAL) DeleteNinja(id string) (deletedNinja types.Ninja, err error) {
	// filter
	filter, err := idToFilter(id)
	if err != nil {
		return
	}
	// get ninja that will be deleted
	err = mongodal.ninjas.FindOne(mongodal.ctx, filter).Decode(&deletedNinja)
	if err != nil {
		return
	}
	// delete ninja
	_, err = mongodal.ninjas.DeleteOne(mongodal.ctx, filter)
	if err != nil {
		deletedNinja = types.Ninja{}
		return
	}
	return
}

// ---
// jutsu
// ---

// GetJutsu -- db method
func (mongodal *MongoDAL) GetJutsu(id string) (jutsu types.Jutsu, err error) {
	// filter
	filter, err := idToFilter(id)
	if err != nil {
		return
	}
	// find
	err = mongodal.jutsus.FindOne(mongodal.ctx, filter).Decode(&jutsu)
	if err != nil {
		return
	}
	return
}

// InsertJutsu -- db method
func (mongodal *MongoDAL) InsertJutsu(jutsu types.Jutsu) (insertedJutsu types.Jutsu, err error) {
	// insert jutsu
	jutsu.CreatedAt = getTimeUTC()
	result, err := mongodal.jutsus.InsertOne(mongodal.ctx, jutsu)
	if err != nil {
		return
	}
	insertedJutsuID := result.InsertedID // insertOneResult.InsertedID

	filter := bson.M{
		"_id": insertedJutsuID,
	}
	// return inserted jutsu
	err = mongodal.jutsus.FindOne(mongodal.ctx, filter).Decode(&insertedJutsu)
	if err != nil {
		return
	}
	return
}

// UpdateJutsu -- db method
func (mongodal *MongoDAL) UpdateJutsu(id string, updates types.Jutsu) (updatedJutsu types.Jutsu, err error) {
	// filter
	filter, err := idToFilter(id)
	if err != nil {
		return
	}
	// update
	updates.UpdatedAt = getTimeUTC()
	updateSubdoc, err := toDoc(updates)
	updateDoc := bson.M{
		"$set": updateSubdoc,
	}
	// update jutsu
	_, err = mongodal.jutsus.UpdateOne(mongodal.ctx, filter, updateDoc)
	if err != nil {
		return
	}
	// get updated jutsu
	err = mongodal.jutsus.FindOne(mongodal.ctx, filter).Decode(&updatedJutsu)
	if err != nil {
		return
	}
	return
}

// DeleteJutsu -- db method
func (mongodal *MongoDAL) DeleteJutsu(id string) (deletedJutsu types.Jutsu, err error) {
	// filter
	filter, err := idToFilter(id)
	if err != nil {
		return
	}
	// get jutsu that will be deleted
	err = mongodal.jutsus.FindOne(mongodal.ctx, filter).Decode(&deletedJutsu)
	if err != nil {
		return
	}
	// delete jutsu
	_, err = mongodal.jutsus.DeleteOne(mongodal.ctx, filter)
	if err != nil {
		deletedJutsu = types.Jutsu{}
		return
	}
	return
}

// ---
// ninjas_jutsus
// ---

// GetNinjaWithRelatedJutsu -- db method
func (mongodal *MongoDAL) GetNinjaWithRelatedJutsu(id string) (ninjaWithRelatedJutsu types.Ninja, err error) {
	_id, _ := primitive.ObjectIDFromHex(id)
	cursor, err := mongodal.ninjas.Aggregate(mongodal.ctx, mongo.Pipeline{
		bson.D{{"$match", bson.D{{"_id", _id}}}},
		bson.D{{"$unwind", "$jutsuIds"}},
		bson.D{{"$lookup", bson.D{
			{"from", "jutsus"},
			{"localField", "jutsuIds"},
			{"foreignField", "_id"},
			{"as", "jutsus"},
		}}},
	})
	if err != nil {
		return
	}
	var thing []bson.M
	err = cursor.All(mongodal.ctx, &thing)
	fmt.Println(thing)
	return
}

// GetJutsuWithRelatedNinja -- db method
func (mongodal *MongoDAL) GetJutsuWithRelatedNinja(id string) (jutsuWithRelatedNinja types.Jutsu, err error) {
	_id, _ := primitive.ObjectIDFromHex(id)
	cursor, err := mongodal.jutsus.Aggregate(mongodal.ctx, mongo.Pipeline{
		bson.D{{"$match", bson.D{{"_id", _id}}}},
		bson.D{{"$unwind", "$ninjaIds"}},
		bson.D{{"$lookup", bson.D{
			{"from", "ninjas"},
			{"localField", "ninjaIds"},
			{"foreignField", "_id"},
			{"as", "ninjas"},
		}}},
	})
	if err != nil {
		return
	}
	err = cursor.All(mongodal.ctx, &jutsuWithRelatedNinja)
	return
}

// AddKnownJutsu -- db method
func (mongodal *MongoDAL) AddKnownJutsu(ninjaID string, jutsuID string) (success bool, err error) {
	// filter
	ninjaFilter, err := idToFilter(ninjaID)
	if err != nil {
		return
	}
	// update doc
	ninjaUpdateDoc := bson.M{
		"$push": bson.M{"jutsuIds": jutsuID},
		"$set":  bson.M{"updatedAt": getTimeUTC()},
	}
	// update ninja
	_, err = mongodal.ninjas.UpdateOne(mongodal.ctx, ninjaFilter, ninjaUpdateDoc)
	if err != nil {
		return
		success = false
	}
	// filter
	jutsuFilter, err := idToFilter(jutsuID)
	if err != nil {
		return
	}
	// update doc
	jutsuUpdateDoc := bson.M{
		"$push": bson.M{"ninjaIds": ninjaID},
		"$set":  bson.M{"updatedAt": getTimeUTC()},
	}
	// update jutsu
	_, err = mongodal.jutsus.UpdateOne(mongodal.ctx, jutsuFilter, jutsuUpdateDoc)
	if err != nil {
		return
		success = false
	}
	success = true
	return
}

// RemoveKnownJutsu -- db method
func (mongodal *MongoDAL) RemoveKnownJutsu(ninjaID string, jutsuID string) (success bool, err error) {
	// filter
	ninjaFilter, err := idToFilter(ninjaID)
	if err != nil {
		return
	}
	// update doc
	ninjaUpdateDoc := bson.M{
		"$pull": bson.M{"jutsuIds": jutsuID},
		"$set":  bson.M{"updatedAt": getTimeUTC()},
	}
	// update ninja
	_, err = mongodal.ninjas.UpdateOne(mongodal.ctx, ninjaFilter, ninjaUpdateDoc)
	if err != nil {
		return
		success = false
	}
	// filter
	jutsuFilter, err := idToFilter(jutsuID)
	if err != nil {
		return
	}
	// update doc
	jutsuUpdateDoc := bson.M{
		"$pull": bson.M{"ninjaIds": ninjaID},
		"$set":  bson.M{"updatedAt": getTimeUTC()},
	}
	// update jutsu
	_, err = mongodal.jutsus.UpdateOne(mongodal.ctx, jutsuFilter, jutsuUpdateDoc)
	if err != nil {
		return
		success = false
	}
	success = true
	return
}
