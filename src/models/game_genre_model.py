from database.db import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql.functions import func

class Game_Genre(db.Model):
    __tablename__ = 'game_genre'

    id = db.Column(db.Integer, primary_key=True)
    game_id = db.Column(db.Integer, ForeignKey('game.id'))
    genre_id = db.Column(db.Integer, ForeignKey('genre.id'))
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    game = relationship('Game', backref=backref("game_genre", cascade="all,delete"))
    genre = relationship('Genre', backref=backref("game_genre", cascade="all,delete"))

    def __init__(self, game_id, genre_id) -> None:
        self.game_id = game_id
        self.genre_id = genre_id

    def to_dict(self):
        return {
            'id': self.id,
            'game_id': self.game_id,
            'genre_id': self.genre_id,
            'created_at': self.created_at,
        }
    