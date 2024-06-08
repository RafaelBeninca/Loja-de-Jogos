from flask import Flask
from flask_cors import CORS
from database.db import db
from routes.route_index import route_index
from flask_migrate import Migrate
from gcloud.buckets.fgs_data_bucket.game_data_delete import delete_blob, delete_storage_folder
from gcloud.buckets.fgs_data_bucket.game_data_download import generate_download_signed_url_v4
import os

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get("DATABASE_CONNECTION")
    app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')
    app.config['GOOGLE_APPLICATION_CREDENTIALS'] = os.environ.get('GOOGLE_APPLICATION_CREDENTIALS')
    app.config['MAX_CONTENT_LENGTH'] = 1024 * 1024 * 1024
    db.init_app(app)
    with app.app_context():
        db.create_all()

    migrate = Migrate(app, db)
    migrate.init_app(app, db)
    CORS(app)
    route_index(app)
    return app

app = create_app()
if __name__ == "__main__":
    app.run(port=int(os.getenv('FLASK_RUN_PORT', 5000)), debug=os.getenv('FLASK_DEBUG', True), host='localhost')
