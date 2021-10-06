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

// ---
// postgres
// ---

// IMongoDAL -- describes DAL methods
type IMongoDAL interface {
	// connection
	GetConnectionString() error
	GetConnection() error
	// ninjas
	GetNinja(_id primitive.ObjectID) (ninja types.Ninja, err error)
	InsertNinja(ninja types.Ninja) (insertedNinja types.Ninja, err error)
	UpdateNinja(_id primitive.ObjectID, updates types.Ninja) (updatedNinja types.Ninja, err error)
	DeleteNinja(_id primitive.ObjectID) (deletedNinja types.Ninja, err error)
	// jutsus
	GetJutsu(_id primitive.ObjectID) (jutsu types.Jutsu, err error)
	InsertJutsu(jutsu types.Jutsu) (insertedJutsu types.Jutsu, err error)
	UpdateJutsu(_id primitive.ObjectID, updates types.Jutsu) (updatedJutsu types.Jutsu, err error)
	DeleteJutsu(_id primitive.ObjectID) (deletedJutsu types.Jutsu, err error)
	// ninjas_jutsus
	AddKnownJutsu(ninjaID primitive.ObjectID, jutsuID primitive.ObjectID) (success bool, err error)
	RemoveKnownJutsu(ninjaID primitive.ObjectID, jutsuID primitive.ObjectID) (success bool, err error)
	GetNinjaWithRelatedJutsu(_id primitive.ObjectID) (ninjaWithRelatedJutsu types.Ninja, err error)
	GetJutsuWithRelatedNinja(_id primitive.ObjectID) (jutsuWithRelatedNinja types.Jutsu, err error)
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
func (mongodal *MongoDAL) GetConnection() (err error) {
	err = mongodal.GetConnectionString()
	if err != nil {
		return
	}

	// connect
	ctx := context.TODO()
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongodal.url))

	// ping (test connection)
	if err = client.Ping(ctx, readpref.Primary()); err != nil {
		log.Fatal(err)
	}

	// set mongodal fields
	mongodal.client = client
	mongodal.ctx = ctx
	mongodal.ninjas = client.Database("practice").Collection("ninjas")
	mongodal.jutsus = client.Database("practice").Collection("jutsus")
	return

	// // create client and connect
	// ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	// // defer cancel()
	// client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongodal.url))

	// // ping (test connection)
	// if err = client.Ping(context.TODO(), readpref.Primary()); err != nil {
	// 	log.Fatal(err)
	// }

	// // set mongodal fields
	// mongodal.client = client
	// mongodal.ctx = ctx
	// mongodal.cancel = cancel
	// mongodal.ninjas = client.Database("practice").Collection("ninjas")
	// mongodal.jutsus = client.Database("practice").Collection("jutsus")
	// return
}

// CloseConnection -- close mongodb connection
// func (mongodal *MongoDAL) CloseConnection() {
// 	mongodal.cancel()
// }

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

func idToFilter(_id primitive.ObjectID) (filter bson.M, err error) {
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
func (mongodal *MongoDAL) GetNinja(_id primitive.ObjectID) (ninja types.Ninja, err error) {
	// filter
	filter, err := idToFilter(_id)
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
func (mongodal *MongoDAL) UpdateNinja(_id primitive.ObjectID, updates types.Ninja) (updatedNinja types.Ninja, err error) {
	// filter
	filter, err := idToFilter(_id)
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
func (mongodal *MongoDAL) DeleteNinja(_id primitive.ObjectID) (deletedNinja types.Ninja, err error) {
	// filter
	filter, err := idToFilter(_id)
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
func (mongodal *MongoDAL) GetJutsu(_id primitive.ObjectID) (jutsu types.Jutsu, err error) {
	// filter
	filter, err := idToFilter(_id)
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
func (mongodal *MongoDAL) UpdateJutsu(_id primitive.ObjectID, updates types.Jutsu) (updatedJutsu types.Jutsu, err error) {
	// filter
	filter, err := idToFilter(_id)
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
func (mongodal *MongoDAL) DeleteJutsu(_id primitive.ObjectID) (deletedJutsu types.Jutsu, err error) {
	// filter
	filter, err := idToFilter(_id)
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
func (mongodal *MongoDAL) GetNinjaWithRelatedJutsu(_id primitive.ObjectID) (ninjaWithRelatedJutsu types.Ninja, err error) {
	// aggregate
	cursor, err := mongodal.ninjas.Aggregate(mongodal.ctx, mongo.Pipeline{
		bson.D{{"$match", bson.D{{"_id", _id}}}},
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
	// cursor -> []bson.M -> bson.M -> bytes -> struct
	var result []bson.M
	err = cursor.All(mongodal.ctx, &result)
	ninjaMap := result[0]
	ninjaBytes, err := bson.Marshal(ninjaMap)
	if err != nil {
		fmt.Println(err)
		return
	}
	err = bson.Unmarshal(ninjaBytes, &ninjaWithRelatedJutsu)
	if err != nil {
		fmt.Println(err)
		return
	}
	return
}

// GetJutsuWithRelatedNinja -- db method
func (mongodal *MongoDAL) GetJutsuWithRelatedNinja(_id primitive.ObjectID) (jutsuWithRelatedNinja types.Jutsu, err error) {
	// aggregate
	cursor, err := mongodal.ninjas.Aggregate(mongodal.ctx, mongo.Pipeline{
		bson.D{{"$match", bson.D{{"_id", _id}}}},
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
	// cursor -> []bson.M -> bson.M -> bytes -> struct
	var result []bson.M
	err = cursor.All(mongodal.ctx, &result)
	jutsuMap := result[0]
	jutsuBytes, err := bson.Marshal(jutsuMap)
	if err != nil {
		fmt.Println(err)
		return
	}
	err = bson.Unmarshal(jutsuBytes, &jutsuWithRelatedNinja)
	if err != nil {
		fmt.Println(err)
		return
	}
	return
}

// AddKnownJutsu -- db method
func (mongodal *MongoDAL) AddKnownJutsu(ninjaID primitive.ObjectID, jutsuID primitive.ObjectID) (success bool, err error) {
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
		success = false
		return
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
		success = false
		return
	}
	success = true
	return
}

// RemoveKnownJutsu -- db method
func (mongodal *MongoDAL) RemoveKnownJutsu(ninjaID primitive.ObjectID, jutsuID primitive.ObjectID) (success bool, err error) {
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
		success = false
		return
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
		success = false
		return
	}
	success = true
	return
}
