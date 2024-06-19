from flask import jsonify, request
from database.db import db
from models.game_model import Game
from models.user_model import User
from models.genre_model import Genre
from models.game_genre_model import Game_Genre
from werkzeug.utils import secure_filename
from gcloud.buckets.fgs_data_bucket.game_data_upload import upload_blob_from_memory
from gcloud.buckets.fgs_data_bucket.game_data_download import generate_download_signed_url_v4
from gcloud.buckets.fgs_data_bucket.game_data_delete import delete_storage_folder, delete_blob
from controllers.genres_controller import post_genres_controller, alter_genres_controller
from datetime import datetime
import json
import os

attributes = [
    ('game_file', 'game_file_link'),
    ('banner_image', 'banner_image_link'),
    ('trailer_1', 'trailer_1_link'),
    ('trailer_2', 'trailer_2_link'),
    ('trailer_3', 'trailer_3_link'),
    ('preview_image_1', 'preview_image_1_link'),
    ('preview_image_2', 'preview_image_2_link'),
    ('preview_image_3', 'preview_image_3_link'),
    ('preview_image_4', 'preview_image_4_link'),
    ('preview_image_5', 'preview_image_5_link'),
    ('preview_image_6', 'preview_image_6_link')
]

def game_controller(user_id):
    if request.method == 'POST':
        try:
            isRepeatedTitle = Game.query.filter(Game.title == request.form['title']).all()

            if isRepeatedTitle: 
                return jsonify({"message": "um jogo com esse nome já existe", "reason": "existing_name"}), 400

        except Exception as e:
            return jsonify({"message": f"{str(e)}"}), 400
        
        release_date = request.form.get('release_date')
        if not release_date:
            release_date = None
        
        try:
            files = request.files

            now = datetime.now()
            now_str = now.strftime("%d-%m-%Y_%H-%M-%S")

            media = {}

            for i, (field_name, file) in enumerate(files.items()):
                sec_filename = secure_filename(file.filename)

                if field_name != "game_file":
                    filename_sep, ext = os.path.splitext(sec_filename)
                    filename_sep += '-' + now_str + "-" + str(i)

                    filename = filename_sep + ext
                else:
                    filename = sec_filename

                print(file, filename)

                blob_name = f"games/{now_str}/{filename}" 
                upload_blob_from_memory("fgs-data", file.read(), blob_name)

                media[field_name] = f"games/{now_str}/{filename}"

            print(media)
        except Exception as e:
            return jsonify({"message": f"{str(e)}"}), 400
        
        try:
            new_game = Game(request.form.get('creator_id'), request.form.get('publisher'), request.form.get('developer'), request.form.get('title'), request.form.get('price'), release_date, request.form.get('summary'), request.form.get('about'), media.get('game_file'), media.get('banner_image'), media.get('trailer_1'), media.get('trailer_2'), media.get('trailer_3'), media.get('preview_image_1'), media.get('preview_image_2'), media.get('preview_image_3'), media.get('preview_image_4'), media.get('preview_image_5'), media.get('preview_image_6'), f"games/{now_str}/")
            
            db.session.add(new_game)
            db.session.commit()

            game = Game.query.filter(Game.title == request.form.get('title')).one()

            tags_str = request.form.get("genres")
            tags = json.loads(tags_str)
            tag_result = post_genres_controller(tags, game.id)
            if isinstance(tag_result, Exception):
                raise Exception(tag_result)
            
            set_media_links(game)

        except Exception as e:
            return jsonify({"message": f"{str(e)}"}), 500

        return jsonify({"message": "jogo criado com sucesso"}), 200
    elif request.method == 'PATCH':
        try:
            game_id = request.args.get('game_id')
            if not game_id:
                return jsonify({"message": "argumentos de requisição faltando"}), 400
            
            game: Game = Game.query.get(game_id)
            games_with_same_title: list[Game] = Game.query.filter(Game.title == request.form['title']).all()

            if not game:
                raise Exception("este jogo não existe")
            
            if game.creator_id != user_id:
                return jsonify({"message": "usuário não tem permissão para excluir este jogo"}), 403

            if games_with_same_title and game.id != games_with_same_title[0].id: 
                raise Exception("um jogo com este nome já existe")
        except Exception as e:
            return jsonify({"message": f"{str(e)}"}), 400
        
        try:
            files = request.files

            now = datetime.now()
            now_str = now.strftime("%d-%m-%Y_%H-%M-%S")

            media = {}

            for i, (field_name, file) in enumerate(files.items()):
                sec_filename = secure_filename(file.filename)

                if field_name != "game_file":
                    filename_sep, ext = os.path.splitext(sec_filename)
                    filename_sep += '-' + now_str + "-" + str(i)

                    filename = filename_sep + ext
                else:
                    filename = sec_filename

                print(file, filename)

                print(getattr(game, field_name))
                if getattr(game, field_name):
                    delete_blob('fgs-data', getattr(game, field_name))
                    

                blob_name = f"{game.blob_name_prefix}{filename}"
                upload_blob_from_memory("fgs-data", file.read(), blob_name)

                media[field_name] = blob_name
                setattr(game, field_name, blob_name)

            print(media)

            game.creator_id = request.form.get('creator_id', game.creator_id)
            game.publisher = request.form.get('publisher', game.publisher)
            game.developer = request.form.get('developer', game.developer)
            game.title = request.form.get('title', game.title)
            game.price = request.form.get('price', game.price)

            release_date = request.form.get('release_date') 
            if not release_date:
                release_date = game.release_date

            game.release_date = release_date
            game.summary = request.form.get('summary', game.summary)
            game.about = request.form.get('about', game.about)

            db.session.commit()

            tags_str = request.form.get("genres")
            tags = json.loads(tags_str)

            tag_result = alter_genres_controller(tags, game_id)
            if isinstance(tag_result, Exception):
                raise Exception(tag_result)
            
            set_media_links(game)
            
        except Exception as e:
            return jsonify({"message": f"{str(e)}"}), 500
        
        return jsonify({"message": "jogo alterado com sucesso"}), 200
    elif request.method == 'DELETE':
        try:
            game_id = request.args.get('game_id')
            if not game_id:
                return jsonify({"message": "argumentos de requisição faltando"}), 400
            
            game: Game = Game.query.get(game_id)
            
            if not game:
                return jsonify({"message": "jogo não existe"}), 400
            
            if game.creator_id != user_id:
                return jsonify({"message": "usuário não tem permissão para excluir esse jogo"}), 403

            delete_storage_folder('fgs-data', game.blob_name_prefix)

            db.session.delete(game)
            db.session.commit()
        except Exception as e:
            return jsonify({"message": f"{str(e)}"}), 500
        
        return jsonify({"message": "jogo deletado com sucesso"}), 200


def get_games_controller():
    try:
        game_title = request.args.get('game_title')
        field_name = request.args.get('field_name')
        if game_title and field_name:
            test: Game = Game.query.filter(Game.title == game_title).one()
            
            if not getattr(test, field_name):
                return jsonify({"message": "imagem não existe"}), 400
            
            url = generate_download_signed_url_v4("fgs-data", getattr(test, field_name))
            setattr(test, field_name + "_link", url)

            db.session.commit()

            return jsonify({"url": url}), 200

        if game_title:
            game: dict[str, any] = Game.query.filter(Game.title == game_title).one().to_dict()
            replace_media_links(game)

            creator_id = game['creator_id']
            creator = User.query.get(creator_id).to_dict()

            genre_data: list[Game_Genre] = Game_Genre.query.filter(Game_Genre.game_id == game['id']).all()
            genres = [Genre.query.get(game_genre.genre_id).to_dict() for game_genre in genre_data]
            return jsonify({"game": game, "creator": creator, "genres": genres}), 200
        
        creator_id = request.args.get('creator_id')
        if creator_id:
            data: list[Game] = Game.query.filter(Game.creator_id == creator_id).all()
            games = [game.to_dict() for game in data]

            for game in games:
                replace_media_links(game)
            
            creator = User.query.get(creator_id).to_dict()

            return jsonify({"gameList": games, "creator": creator}), 200

        data: list[Game] = Game.query.all()
        games = [game.to_dict() for game in data]

        for game in games:
            replace_media_links(game)
        
        return jsonify({"gameList": games}), 200
    except Exception as e:
        return jsonify({"message": f"{str(e)}"}), 500
    

def set_media_links(game: Game):
    for attr, link_attr in attributes:
        blob_name = getattr(game, attr, None)
        if blob_name:
            setattr(game, link_attr, generate_download_signed_url_v4('fgs-data', blob_name))

    db.session.commit()

    
def replace_media_links(game: dict[str, any]):
    for attr, link_attr in attributes:
        game[attr] = game[link_attr]

    for _, link_attr in attributes:
        del game[link_attr]