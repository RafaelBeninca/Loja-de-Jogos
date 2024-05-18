from database.db import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func

class Shop_Order(db.Model):
    __tablename__ = 'shop_order'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('user.id'))
    order_total = db.Column(db.Float(2), unique=False, nullable=True)
    order_date = db.Column(db.DateTime(timezone=True))

    order_item = relationship('Order_Item', backref='shop_order')

    def __init__(self, user_id, order_total) -> None:
        self.user_id = user_id
        self.order_total = order_total

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'order_total': self.order_total,
            'created_at': self.created_at,
        }
    