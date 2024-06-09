from database.db import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql.functions import func

class Wishlist_Item(db.Model):
    __tablename__ = 'wishlist_item'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('user.id'))
    game_id = db.Column(db.Integer, ForeignKey('game.id'))
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    user = relationship('User', backref=backref("wishlist", cascade="all,delete"))
    game = relationship('Game', backref=backref("wishlist", cascade="all,delete"))

    def __init__(self, user_id, game_id) -> None:
        self.user_id = user_id
        self.game_id = game_id

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'game_id': self.game_id,
            'created_at': self.created_at,
        }
    