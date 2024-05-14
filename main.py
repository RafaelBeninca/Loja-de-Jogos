from flask import Flask
from flask_cors import CORS
from database.db import db
from routes.route_index import route_index
from dotenv import load_dotenv
from flask_migrate import Migrate
import os

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_CONNECTION")
    db.init_app(app)
    with app.app_context():
        db.create_all()

    Migrate(app, db)
    CORS(app)
    route_index(app)
    return app

app = create_app()
if __name__ == "__main__":
    app.run(port=5000, debug=True, host='localhost')
