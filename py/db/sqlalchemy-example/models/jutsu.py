from sqlalchemy import Column, Integer, String, DateTime, Column
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from connections.pg import Base
from models.join_tables.ninjas_jutsus import NinjaJutsu


class Jutsu(Base):
    # table name
    __tablename__ = 'jutsus'

    # columns
    id = Column(Integer, primary_key=True)
    name = Column(String)
    chakra_nature = Column(String)
    description = Column(String)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    deleted_at = Column(DateTime)

    # repr
    def __repr__(self):
        return f"id: {self.id}, name: {self.name}, chakra_nature: {self.chakra_nature}, description: {self.description}"

    # relationship
    ninjas = relationship('NinjaJutsu', back_populates='jutsu')


# class Jutsu(Base):
#     # table name
#     __tablename__ = 'jutsus'

#     # columns
#     id = Column(Integer, primary_key=True)
#     name = Column(String)
#     chakra_nature = Column(String)
#     description = Column(String)
#     created_at = Column(DateTime, default=func.now())
#     updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
#     deleted_at = Column(DateTime)

#     # repr
#     def __repr__(self):
#         return f"id: {self.id}, name: {self.name}, chakra_nature: {self.chakra_nature}, description: {self.description}"

#     # # init (optional)
#     # def __init__(self, name, chakra_nature, description):
#     #     self.name = name
#     #     self.chakra_nature = chakra_nature
#     #     self.description = description

#     # relationships (traditional, without association object)
#     ninjas = relationship(
#         'Ninja',
#         secondary=ninjas_jutsus,
#         back_populates='jutsus'
#     )
