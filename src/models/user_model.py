from database.db import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql.functions import func

class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(200), unique=False, nullable=False)
    email_address = db.Column(db.String(50), unique=True, nullable=False)
    profile_picture = db.Column(db.String(200), unique=False, nullable=True)
    summary = db.Column(db.String(1000), unique=False, nullable=True)
    blob_name_prefix = db.Column(db.String(200), unique=False, nullable=True)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

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
            'blob_name_prefix': self.blob_name_prefix,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    