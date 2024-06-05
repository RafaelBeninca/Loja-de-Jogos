"""Changed the foreign key of the Game table to normal string fields

Revision ID: b27b5157bc63
Revises: 88b7f51bfd01
Create Date: 2024-05-18 11:04:48.393082

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'b27b5157bc63'
down_revision = '88b7f51bfd01'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('game', schema=None) as batch_op:
        batch_op.add_column(sa.Column('publisher', sa.String(length=50), nullable=False))
        batch_op.add_column(sa.Column('developer', sa.String(length=50), nullable=False))
        batch_op.drop_constraint('game_ibfk_1', type_='foreignkey')
        batch_op.drop_constraint('game_ibfk_2', type_='foreignkey')
        batch_op.drop_column('developer_id')
        batch_op.drop_column('publisher_id')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('game', schema=None) as batch_op:
        batch_op.add_column(sa.Column('publisher_id', mysql.INTEGER(), autoincrement=False, nullable=True))
        batch_op.add_column(sa.Column('developer_id', mysql.INTEGER(), autoincrement=False, nullable=True))
        batch_op.create_foreign_key('game_ibfk_2', 'user', ['publisher_id'], ['id'])
        batch_op.create_foreign_key('game_ibfk_1', 'user', ['developer_id'], ['id'])
        batch_op.drop_column('developer')
        batch_op.drop_column('publisher')

    # ### end Alembic commands ###