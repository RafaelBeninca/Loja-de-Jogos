from database.db import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func

class Review(db.Model):
    __tablename__ = 'review'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('user.id'))
    bought_game_id = db.Column(db.Integer, ForeignKey('bought_game.id'))
    rating = db.Column(db.Integer, unique=False, nullable=False)
    comment = db.Column(db.String(1000), unique=False, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    user = relationship('User')
    bought_game = relationship('Bought_Game')

    def __init__(self, user_id, bought_game_id, rating, comment) -> None:
        self.user_id = user_id
        self.bought_game_id = bought_game_id
        self.rating = rating
        self.comment = comment

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'bought_game_id': self.bought_game_id,
            'rating': self.rating,
            'comment': self.comment,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    