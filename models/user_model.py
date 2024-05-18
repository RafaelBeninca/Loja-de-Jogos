from database.db import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(200), unique=False, nullable=False)
    email_address = db.Column(db.String(50), unique=True, nullable=False)
    profile_picture = db.Column(db.String(200), unique=False, nullable=True)
    summary = db.Column(db.String(1000), unique=False, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    shop_order = relationship('Shop_Order', backref='user')
    bought_game = relationship('Bought_Game', backref='user')
    review = relationship('Review', backref='user')
    wishlist_item = relationship('Wishlist_Item', backref='user')
    partner_subscription_user = relationship('Partner_Subscription', backref='user')
    partner_subscription_partner = relationship('Partner_Subscription', backref='partner')
    game_publisher = relationship('Game', backref='publisher')
    game_developer = relationship('Game', backref='developer')

    def __init__(self, username, password, email_address, profile_picture, summary) -> None:
        self.username = username
        self.password = password
        self.email_address = email_address
        self.profile_picture = profile_picture
        self.summary = summary

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'password': self.password,
            'email_address': self.email_address,
            'profile_picture': self.profile_picture,
            'summary': self.summary,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    