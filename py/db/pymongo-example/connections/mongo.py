# imports
import os
from pymongo import MongoClient

# connection string
client = 'mongodb'
host = os.getenv('MONGO_HOST')
port = os.getenv('MONGO_PORT')
user = os.getenv('MONGO_USER')
pw = os.getenv('MONGO_PW')


connection_string = f"{client}://{user}:{pw}@{host}:{port}"

# client
client = MongoClient(connection_string)

# db
db_name = os.getenv('MONGO_DB')
db = client[db_name]
