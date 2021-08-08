# ---
# mongodb (python)
# ---

from mongoengine import *
from pymongo import MongoClient
import pymongo
import datetime

# ---
# docker
# ---

# persisting data
# - windows and OSX can't mount local volumes
# - use named volume

'''
docker volume create mongodata
'''

# docker-compose

'''
services:
  mongo:
    image: mongo
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: example
    ports:
      - "27017:27017"  
    volumes:
      - mongodata:/data/db

volumes:
  mongodata:
    external: true
'''

# ---
# pymongo
# ---

# inserted documents will (by default) have a generated '_id'.
# - to find a document by its id, use the 'find()' method
# -- when doing this, the _id given must be the ObjectId, not a string version
# -- https://api.mongodb.com/python/current/tutorial.html#querying-by-objectid

# import
# connection
client = MongoClient('localhost', 27017)  # host, port args
client = MongoClient('mongodb://localhost:27017/')  # connection string
# access db
db = client.db1  # attribute style
db = client['db1']  # dictionary style (supports more options)
# access collection (collection (mongodb) is similar to tables (sql))
collection = db.collection1
collection = db['collection1']
# document
post = {
    "author": "Mike",
    "text": "My first blog post!",
    "tags": ["mongodb", "python", "pymongo"],
    "date": datetime.datetime.utcnow()
}
# insert document ('_id' is automatically added if document doesn't already have one.)
posts = db.posts  # get collection
result = posts.insert_one(post)  # insert document
post_id = result.inserted_id  # get _id attribute
print(post_id)  # ObjectId('...')
# insert many
posts = db.posts
result = posts.insert_many([
    {'author': 'Mike', 'text': 'bla1', 'tags': ['bla', 'bla'], 'date': datetime.datetime.utcnow()},
    {'author': 'Mike', 'text': 'bla2', 'tags': ['bla', 'bla'], 'date': datetime.datetime.utcnow()},
    {'author': 'Mike', 'text': 'bla3', 'tags': ['bla', 'bla'], 'date': datetime.datetime.utcnow()}
])
post_ids = result.inserted_ids
print(post_ids)
# find_one
db.posts.find_one({'_id': post_id})  # find post in collection (use object, not string)
# find
db.posts.find({'author': 'Mike'})  # find all posts with author Mike
for post in posts:
    print(post)
# replace
db.posts.find_one_and_replace(
    filter={'_id': post_id},
    replacement={
        'author': 'Mike',
        'text': 'First blog post',
        'tags': ['mongodb', 'python'],
        'date': datetime.datetime.utcnow()
    }
)
# update
db.posts.find_one_and_update(
    filter={'_id': post_id},
    replacement={
        'author': 'Mike',
        'text': 'First blog post',
        'tags': ['mongodb', 'python'],
        'date': datetime.datetime.utcnow()
    }
)
# count
posts.count_documents({})  # count all documents in posts
posts.cound_documents({'author': 'Mike'})  # count all documents that match filter
# delete one
db.posts.find_one_and_delete({'_id': post_id})  # find post in collection, delete it
# delete many
db.posts.delete_many({'author': 'Mike'})  # delete all posts with author 'Mike'

# indexing
# https://api.mongodb.com/python/current/tutorial.html#indexing

# ---
# mongoengine
# ---

# API reference
# - http://docs.mongoengine.org/apireference.html#module-mongoengine.queryset


# document IDs are automatic
# - once saved, each document has an 'id' attribute (automatically generated)
# - it is used as a primary key (you can specify your own -- 'primary_key=True')

# imports
# connect
connect('project1')  # connect to db 'project1'. this assumes host (localhost) and port (27017)
connect('project1', host='192.168.1.35', port=7531)  # specify db, host, port
connect(
    'project1',
    host='192.168.1.35',
    port=7531,
    username='webapp',
    password='pwd123',
    authentication_source='admin'
)
connect(db='project1', host='mongodb://admin:qwerty@localhost/production')  # connection string

# user class/collection


class User(Document):
    email = StringField(required=True)
    first_name = StringField(max_length=50)
    last_name = StringField(max_length=50)

# post class/collection


class Post(Document):
    title = StringField(max_length=120, required=True)  # string
    author = ReferenceField(User, reverse_delete_rule=CASCADE)  # reference (similar to foreign key)
    tags = ListField(StringField(max_length=30))  # list
    comments = ListField(EmbeddedDocumentField(Comment))  # list of embedded docs
    meta = {'allow_inheritance': True}


class TextPost(Post):
    content = StringField()


class ImagePost(Post):
    image_path = StringField()


class LinkPost(Post):
    link_url = StringField()


class Comment(EmbeddedDocument):
    content = StringField()
    name = StringField(max_length=120)


# CRUD

# create
mike = User(email='Mike@example.com', first_name='Mike', last_name='S').save()  # create user
post1 = Post(title='Mongodb', author=mike, content='hello!', tags=['mongodb']).save()  # create post
# read
User.objects  # return list of all documents in collection
User.objects(name='Mike')  # return list of documents matching condition
User.objects(name__first='Mike')  # nested document property (name.first)
User.objects[:5]  # first 5 documents
User.objects[5:]  # all after first 5 documents
User.objects.first()  # return first document in collection
User.objects.count()  # return count of documents in collection
User.objects.to_json()  # return QuerySet as json
User.objects.average("age")  # return average age of all documents in collection
User.objects.age("missions_completed")  # return sum (of field values) for QuerySet
User.objects.distinct("age")  # return distinct list of ages
User.objects.exclude("age")  # return list of all documents, remove 'age' field
User.objects.only("name", "age")  # return list of all documents, only specified fields
User.objects.order_by("name")  # return list of all documents, order_by field
User.objects.order_by("name", "-age")  # order by name (asc), then age (desc)
User.objects.limit(5)  # return n documents (list)
# query operators
# ne, lt, lte, gt, gte, not, in, nin, mod, all, exists)
User.objects(name__ne='Mike')  # not equal
User.objects(age__gte=30)  # greater than or equal
User.objects(age__not__lt=30)  # not less than
User.objects(name__in=['Kakashi', 'Konohamaru', 'Iruka'])
# modify
User.objects(name='Mike').modify(new=True, {"name": "Michael"})  # update, return new (or null)
# update
#- QuerySet -- update_one, update, modify
#- Document -- modify() & save()
# update document
user = User.objects(id=user_id)  # get user (user_id not defined here)
user.name = 'Michael'  # update value
user.save()  # save
# update queryset
# - http://docs.mongoengine.org/guide/querying.html#atomic-updates
# - '$set' is default.
User.objects(name="Mike").update(name="Michael")  # set ($set modifier assumed)
User.objects(id=user_id).update_one(name="Mike")  # set ($set modifier assumed)
User.objects(name="Mike").update(set__name="Michael")  # set (modifier used)
User.objects(id=user_id).update_one(set__name="Mike")  # set (modifier used)
User.objects(id=user_id).update_one(inc__age=1)  # increment (modifier used)
# delete
User.objects(name='Mike').delete()  # delete all documents matching condition

# iterate through documents
for user in User.objects:
    print(user.email)
for post in Post.objects:
    print(post.title, post.author)

# api reference
# - http://docs.mongoengine.org/apireference.html

# ---
# mongoengine (connect to multiple databases)
# ---

# connect to multiple databases
connect(alias='user-db-alias', db='user-db')
connect(alias='book-db-alias', db='book-db')
connect(alias='users-books-db-alias', db='users-books-db')


class User(Document):
    name = StringField()
    meta = {'db_alias': 'user-db-alias'}


class Book(Document):
    name = StringField()
    meta = {'db_alias': 'book-db-alias'}


class AuthorBooks(Document):
    author = ReferenceField(User)
    book = ReferenceField(Book)
    meta = {'db_alias': 'users-books-db-alias'}


# ---
#
# ---


# ---
#
# ---


# ---
#
# ---


# ---
#
# ---


# ---
#
# ---


# ---
#
# ---


# ---
#
# ---


# ---
#
# ---


# ---
#
# ---


# ---
#
# ---


# ---
#
# ---


# ---
#
# ---


# ---
#
# ---


# ---
#
# ---


# ---
#
# ---


# ---
#
# ---


# ---
#
# ---
