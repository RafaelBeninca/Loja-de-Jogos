"""Created status column on Shop_Order table

Revision ID: 856d95ba1d52
Revises: 65fa1f13f7a4
Create Date: 2024-05-19 01:23:09.849280

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '856d95ba1d52'
down_revision = '65fa1f13f7a4'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('shop_order', schema=None) as batch_op:
        batch_op.add_column(sa.Column('status', sa.String(length=20), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('shop_order', schema=None) as batch_op:
        batch_op.drop_column('status')

    # ### end Alembic commands ###