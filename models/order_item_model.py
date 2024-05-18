from database.db import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func

class Order_Item(db.Model):
    __tablename__ = 'order_item'

    id = db.Column(db.Integer, primary_key=True)
    shop_order_id = db.Column(db.Integer, ForeignKey('shop_order.id'))
    game_id = db.Column(db.Integer, ForeignKey('game.id'))
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    def __init__(self, shop_order_id, game_id) -> None:
        self.shop_order_id = shop_order_id
        self.game_id = game_id

    def to_dict(self):
        return {
            'id': self.id,
            'shop_order_id': self.shop_order_id,
            'game_id': self.game_id,
            'created_at': self.created_at,
        }
    