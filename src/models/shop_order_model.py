from database.db import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql.functions import func

class Shop_Order(db.Model):
    __tablename__ = 'shop_order'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('user.id'))
    order_total = db.Column(db.Float(2), unique=False, nullable=True)
    order_date = db.Column(db.DateTime(timezone=True))
    status = db.Column(db.String(20), unique=False, nullable=False)

    user = relationship('User', backref=backref("shop_order", cascade="all,delete"))

    def __init__(self, user_id, order_total, order_date, status) -> None:
        self.user_id = user_id
        self.order_total = order_total
        self.order_date = order_date
        self.status = status

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'order_total': self.order_total,
            'order_date': self.order_date,
            'status': self.status,
        }
    