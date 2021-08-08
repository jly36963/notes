# ----------------
# sqlalchemy // postgres
# ----------------


from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import sqlalchemy
from sqlalchemy import create_engine

# ----------------
# docker
# ----------------

# persisting data
# windows and OSX can't mount local volumes
# use named volume

# docker-compose
'''
services:
  pg:
    container_name: pg
    build:
      context: ./postgres
      dockerfile: Dockerfile
    ports: 
      - "5432:5432"
    environment:
      POSTGRES_USER: 'postgres'
      POSTGRES_PASSWORD: 'postgres'
      POSTGRES_DB: 'excalnet'
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  pgdata:
    external: true

'''

# -----------------
# basics
# -----------------


# connection string (dialect+driver://username:password@host:port/db)
engine = create_engine('postgresql+psycopg2://scott:tiger@localhost:5432/mydatabase')
conn = engine.connect()

# -----------------
# class / table
# -----------------


class Product(Base):
    __tablename__ = 'products'
    id = Column(Integer, primary_key=True)
    title = Column('title', String(32))
    in_stock = Column('in_stock', Boolean)
    quantity = Column('quantity', Integer)
    price = Column('price', Numeric)

# -----------------
# one to many
# -----------------


class Article(Base):
    __tablename__ = 'articles'
    id = Column(Integer, primary_key=True)
    comments = relationship("Comment")


class Comment(Base):
    __tablename__ = 'comments'
    id = Column(Integer, primary_key=True)
    article_id = Column(Integer, ForeignKey('articles.id'))

# one to many (2)


class Parent(Base):
    __tablename__ = 'parent'
    id = Column(Integer, primary_key=True)
    children = relationship("Child")


class Child(Base):
    __tablename__ = 'child'
    id = Column(Integer, primary_key=True)
    parent_id = Column(Integer, ForeignKey('parent.id'))

# one to many (bi-directional)


class Parent(Base):
    __tablename__ = 'parent'
    id = Column(Integer, primary_key=True)
    children = relationship("Child", back_populates="parent")


class Child(Base):
    __tablename__ = 'child'
    id = Column(Integer, primary_key=True)
    parent_id = Column(Integer, ForeignKey('parent.id'))
    parent = relationship("Parent", back_populates="children")

# -----------------
# many to one
# -----------------


class Tire(Base):
    __tablename__ = 'tires'
    id = Column(Integer, primary_key=True)
    car_id = Column(Integer, ForeignKey('cars.id'))
    car = relationship("Car")


class Car(Base):
    __tablename__ = 'cars'
    id = Column(Integer, primary_key=True)

# many to one (example 2)


class Parent(Base):
    __tablename__ = 'parent'
    id = Column(Integer, primary_key=True)
    child_id = Column(Integer, ForeignKey('child.id'))
    child = relationship("Child")


class Child(Base):
    __tablename__ = 'child'
    id = Column(Integer, primary_key=True)

# many to one (bi-directional)


class Parent(Base):
    __tablename__ = 'parent'
    id = Column(Integer, primary_key=True)
    child_id = Column(Integer, ForeignKey('child.id'))
    child = relationship("Child", back_populates="parents")


class Child(Base):
    __tablename__ = 'child'
    id = Column(Integer, primary_key=True)
    parents = relationship("Parent", back_populates="child")


# -----------------
# one to one
# -----------------

class Person(Base):
    __tablename__ = 'people'
    id = Column(Integer, primary_key=True)
    mobile_phone = relationship("MobilePhone", uselist=False, back_populates="person")


class MobilePhone(Base):
    __tablename__ = 'mobile_phones'
    id = Column(Integer, primary_key=True)
    person_id = Column(Integer, ForeignKey('people.id'))
    person = relationship("Person", back_populates="mobile_phone")

# one to one (example 2)


class Parent(Base):
    __tablename__ = 'parent'
    id = Column(Integer, primary_key=True)
    child = relationship("Child", uselist=False, back_populates="parent")


class Child(Base):
    __tablename__ = 'child'
    id = Column(Integer, primary_key=True)
    parent_id = Column(Integer, ForeignKey('parent.id'))
    parent = relationship("Parent", back_populates="child")

# -----------------
# many to many
# -----------------


students_classes_association = Table('students_classes', Base.metadata,
                                     Column('student_id', Integer, ForeignKey('students.id')),
                                     Column('class_id', Integer, ForeignKey('classes.id'))
                                     )


class Student(Base):
    __tablename__ = 'students'
    id = Column(Integer, primary_key=True)
    classes = relationship("Class", secondary=students_classes_association)


class Class(Base):
    __tablename__ = 'classes'
    id = Column(Integer, primary_key=True)


# many to many (example 2)
association_table = Table('association', Base.metadata,
                          Column('left_id', Integer, ForeignKey('left.id')),
                          Column('right_id', Integer, ForeignKey('right.id'))
                          )


class Parent(Base):
    __tablename__ = 'left'
    id = Column(Integer, primary_key=True)
    children = relationship("Child", secondary=association_table)


class Child(Base):
    __tablename__ = 'right'
    id = Column(Integer, primary_key=True)


# many to many (bi-directional)
association_table = Table('association', Base.metadata,
                          Column('left_id', Integer, ForeignKey('left.id')),
                          Column('right_id', Integer, ForeignKey('right.id'))
                          )


class Parent(Base):
    __tablename__ = 'left'
    id = Column(Integer, primary_key=True)
    children = relationship(
        "Child",
        secondary=association_table,
        back_populates="parents")


class Child(Base):
    __tablename__ = 'right'
    id = Column(Integer, primary_key=True)
    parents = relationship(
        "Parent",
        secondary=association_table,
        back_populates="children"
    )

# -----------------
# sessions
# -----------------


# create an engine
engine = create_engine('postgresql://usr:pass@localhost:5432/sqlalchemy')

# create a configured "Session" class
Session = sessionmaker(bind=engine)

# create a Session
session = Session()


# -----------------
# declarative base
# -----------------


engine = create_engine('postgresql://usr:pass@localhost:5432/sqlalchemy')
Session = sessionmaker(bind=engine)

Base = declarative_base()


# -----------------
# code examples
# -----------------

# https://auth0.com/blog/sqlalchemy-orm-tutorial-for-python-developers/


# -----------------
# CRUD
# -----------------

# create Film class

# Create
doctor_strange = Film(title="Doctor Strange", director="Scott Derrickson", year="2016")
session.add(doctor_strange)
session.commit()

# Read
films = session.query(Film)
for film in films:
    print(film.title)

# Update
doctor_strange.title = "Some2016Film"
session.commit()

# Delete
session.delete(doctor_strange)
session.commit()
