"""create_tables

Revision ID: fea839bd70d3
Revises: 
Create Date: 2021-01-02 13:53:06.585178

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey
from sqlalchemy.sql import func


# revision identifiers, used by Alembic.
revision = 'fea839bd70d3'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ninjas
    op.create_table(
        'ninjas',
        Column('id', Integer, primary_key=True),
        Column('first_name', String),
        Column('last_name', String),
        Column('created_at', DateTime, default=func.now()),
        Column(
            'updated_at', DateTime, default=func.now(), onupdate=func.now()
        ),
        Column('deleted_at', DateTime),
    )

    # jutsus
    op.create_table(
        'jutsus',
        Column('id', Integer, primary_key=True),
        Column('name', String),
        Column('chakra_nature', String),
        Column('description', String),
        Column('created_at', DateTime, default=func.now()),
        Column('updated_at', DateTime, default=func.now(), onupdate=func.now()),
        Column('deleted_at', DateTime),
    )

    # ninjas_jutsus
    op.create_table(
        'ninjas_jutsus',
        Column('id', Integer, primary_key=True),
        Column('ninja_id', Integer, ForeignKey('ninjas.id')),
        Column('jutsu_id', Integer, ForeignKey('jutsus.id')),
        Column('created_at', DateTime, default=func.now()),
        Column('deleted_at', DateTime),
    )


def downgrade():
    # drop tables
    op.drop_table('ninjas_jutsus')
    op.drop_table('jutsus')
    op.drop_table('ninjas')
