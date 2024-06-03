from database.db import db
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship, backref
from sqlalchemy.sql.functions import func

class Game(db.Model):
    __tablename__ = 'game'

    id = db.Column(db.Integer, primary_key=True)
    creator_id = db.Column(db.Integer, ForeignKey('user.id'))
    publisher = db.Column(db.String(50), unique=False, nullable=False)
    developer = db.Column(db.String(50), unique=False, nullable=False)
    title = db.Column(db.String(100), unique=True, nullable=False)
    price = db.Column(db.Float(2), unique=False, nullable=False)
    release_date = db.Column(db.DateTime(timezone=True), nullable=True)
    summary = db.Column(db.String(500), unique=False, nullable=False)
    about = db.Column(db.String(10000), unique=False, nullable=True)
    game_file = db.Column(db.String(200), unique=False, nullable=False)
    banner_image = db.Column(db.String(200), unique=False, nullable=False)
    trailer_1 = db.Column(db.String(200), unique=False, nullable=True)
    trailer_2 = db.Column(db.String(200), unique=False, nullable=True)
    trailer_3 = db.Column(db.String(200), unique=False, nullable=True)
    preview_image_1 = db.Column(db.String(200), unique=False, nullable=True)
    preview_image_2 = db.Column(db.String(200), unique=False, nullable=True)
    preview_image_3 = db.Column(db.String(200), unique=False, nullable=True)
    preview_image_4 = db.Column(db.String(200), unique=False, nullable=True)
    preview_image_5 = db.Column(db.String(200), unique=False, nullable=True)
    preview_image_6 = db.Column(db.String(200), unique=False, nullable=True)
    blob_name_prefix = db.Column(db.String(200), unique=False, nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(db.DateTime(timezone=True), onupdate=func.now())

    creator = relationship('User')

    def __init__(self, creator_id, publisher, developer, title, price, release_date, summary, about, game_file, banner_image, trailer_1, trailer_2, trailer_3, preview_image_1, preview_image_2, preview_image_3, preview_image_4, preview_image_5, preview_image_6, blob_name_prefix) -> None:
        self.creator_id = creator_id
        self.publisher = publisher
        self.developer = developer
        self.title = title
        self.price = price
        self.release_date = release_date
        self.summary = summary
        self.about = about
        self.game_file = game_file
        self.banner_image = banner_image
        self.trailer_1 = trailer_1
        self.trailer_2 = trailer_2
        self.trailer_3 = trailer_3
        self.preview_image_1 = preview_image_1
        self.preview_image_2 = preview_image_2
        self.preview_image_3 = preview_image_3
        self.preview_image_4 = preview_image_4
        self.preview_image_5 = preview_image_5
        self.preview_image_6 = preview_image_6
        self.blob_name_prefix = blob_name_prefix
        
        # self.media_links = {
        #     "trailer_1_link": "",
        #     "trailer_2_link": "",
        #     "trailer_3_link": "",
        #     "preview_image_1_link": "",
        #     "preview_image_2_link": "",
        #     "preview_image_3_link": "",
        #     "preview_image_4_link": "",
        #     "preview_image_5_link": "",
        #     "preview_image_6_link": ""
        # }

    def to_dict(self):
        return {
            'id': self.id,
            'creator_id': self.creator_id,
            'publisher': self.publisher,
            'developer': self.developer,
            'title': self.title,
            'price': self.price,
            'release_date': self.release_date,
            'summary': self.summary,
            'about': self.about,
            'game_file': self.game_file,
            'banner_image': self.banner_image,
            'trailer_1': self.trailer_1,
            'trailer_2': self.trailer_2,
            'trailer_3': self.trailer_3,
            'preview_image_1': self.preview_image_1,
            'preview_image_2': self.preview_image_2,
            'preview_image_3': self.preview_image_3,
            'preview_image_4': self.preview_image_4,
            'preview_image_5': self.preview_image_5,
            'preview_image_6': self.preview_image_6,
            'blob_name_prefix': self.blob_name_prefix,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }
    