from sqlalchemy import Table, Text, Integer, ForeignKey, DateTime, Column
from sqlalchemy.sql import func
from connections.pg import Base
from sqlalchemy.orm import relationship


class NinjaJutsu(Base):
    # table name
    __tablename__ = 'ninjas_jutsus'

    # columns
    id = Column(Integer, primary_key=True)
    ninja_id = Column(Integer, ForeignKey('ninjas.id'))
    jutsu_id = Column(Integer, ForeignKey('jutsus.id'))
    created_at = Column(DateTime, default=func.now())
    deleted_at = Column(DateTime)

    # associations
    ninja = relationship('Ninja', back_populates='jutsus')
    jutsu = relationship('Jutsu', back_populates='ninjas')

    # repr
    def __repr__(self):
        return f"id: {self.id}, ninja_id: {self.ninja_id}, jutsu_id: {self.jutsu_id}"


# # association table (traditional, without association object)
# ninjas_jutsus = Table(
#     # table name
#     'ninjas_jutsus',
#     # metadata
#     Base.metadata,
#     # columns
#     Column('ninja_id', Integer, ForeignKey('ninjas.id'), primary_key=True),
#     Column('jutsu_id', Integer, ForeignKey('jutsus.id'), primary_key=True),
#     Column('created_at', DateTime, default=func.now()),
#     Column('deleted_at', DateTime)
# )
