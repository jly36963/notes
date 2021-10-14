from sqlalchemy import Column, Integer, String, DateTime, Column
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from connections.pg import Base
from models.join_tables.ninjas_jutsus import NinjaJutsu


class Ninja(Base):
    # table name
    __tablename__ = 'ninjas'

    # columns
    id = Column(Integer, primary_key=True)
    first_name = Column(String)
    last_name = Column(String)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime)

    # repr
    def __repr__(self):
        return f"id: {self.id}, first_name: {self.first_name}, last_name: {self.last_name}"

    # relationships
    jutsus = relationship('NinjaJutsu', back_populates='ninja')


# class Ninja(Base):
#     # table name
#     __tablename__ = 'ninjas'

#     # columns
#     id = Column(Integer, primary_key=True)
#     first_name = Column(String)
#     last_name = Column(String)
#     created_at = Column(DateTime, default=func.now())
#     updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
#     deleted_at = Column(DateTime)

#     # repr
#     def __repr__(self):
#         return f"id: {self.id}, first_name: {self.first_name}, last_name: {self.last_name}"

#     # # init (optional)
#     # def __init__(self, first_name, last_name):
#     #     self.first_name = first_name
#     #     self.last_name = last_name

#     # relationships (traditional, without association object)
#     jutsus = relationship(
#         'Jutsu',
#         secondary=ninjas_jutsus,
#         back_populates='ninjas'
#     )
