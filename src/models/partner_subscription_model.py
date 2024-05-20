from database.db import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func

class Partner_Subscription(db.Model):
    __tablename__ = 'partner_subscription'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, ForeignKey('user.id'))
    partner_id = db.Column(db.Integer, ForeignKey('user.id'))
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())

    user = relationship('User', foreign_keys=[user_id])
    partner = relationship('User', foreign_keys=[partner_id])

    def __init__(self, user_id, partner_id) -> None:
        self.user_id = user_id
        self.partner_id = partner_id

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'partner_id': self.partner_id,
            'created_at': self.created_at,
        }
    