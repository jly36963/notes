# imports
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
# dotenv
load_dotenv(verbose=True)
# connection string vars
dialect = 'postgresql'
driver = 'psycopg2'
host = os.getenv('PG_HOST')
port = os.getenv('PG_PORT')
database = os.getenv('PG_DB')
user = os.getenv('PG_USER')
password = os.getenv('PG_PW')
# connection string
connection_string = f"{dialect}+{driver}://{user}:{password}@{host}:{port}/{database}"
# engine
engine = create_engine(connection_string)
# base (used in models)
Base = declarative_base()
# session (used in queries)
Session = sessionmaker(bind=engine)
