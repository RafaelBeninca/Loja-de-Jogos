from flask import jsonify, request
from database.db import db
from models.game_model import Game
from models.user_model import User
from werkzeug.utils import secure_filename
from gcloud.buckets.fgs_data_bucket.game_data_upload import upload_directory_with_transfer_manager, upload_blob_from_memory
from gcloud.buckets.fgs_data_bucket.game_data_download import generate_download_signed_url_v4
from gcloud.buckets.fgs_data_bucket.game_data_delete import delete_storage_folder, delete_blob
from datetime import datetime
import os

def game_controller(user_id):
    if request.method == 'POST':
        try:
            isRepeatedTitle = Game.query.filter(Game.title == request.form['title']).all()

            if isRepeatedTitle: 
                return jsonify({"message": "um jogo com esse nome já existe"}), 400

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
            game = Game(request.form.get('creator_id'), request.form.get('publisher'), request.form.get('developer'), request.form.get('title'), request.form.get('price'), release_date, request.form.get('summary'), request.form.get('about'), media.get('game_file'), media.get('banner_image'), media.get('trailer_1'), media.get('trailer_2'), media.get('trailer_3'), media.get('preview_image_1'), media.get('preview_image_2'), media.get('preview_image_3'), media.get('preview_image_4'), media.get('preview_image_5'), media.get('preview_image_6'), f"games/{now_str}/")
            
            db.session.add(game)
            db.session.commit()
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
                return jsonify({"message": "usuário não tem permissão para deletar este jogo"}), 403

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
            print(release_date)
            if not release_date:
                release_date = game.release_date

            game.release_date = release_date
            game.summary = request.form.get('summary', game.summary)
            game.about = request.form.get('about', game.about)

            db.session.commit()
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
                return jsonify({"message": "usuário não tem permissão para deletar esse jogo"}), 403

            delete_storage_folder('fgs-data', game.blob_name_prefix)

            db.session.delete(game)
            db.session.commit()
        except Exception as e:
            return jsonify({"message": f"{str(e)}"}), 500
        
        return jsonify({"message": "jogo deletado com sucesso"}), 200


def get_games_controller():
    try:
        game_title = request.args.get('game_title')
        if game_title:
            game: dict[str, any] = Game.query.filter(Game.title == game_title).one().to_dict()
            creator_id = game['creator_id']
            creator = User.query.get(creator_id).to_dict()
            game = set_game_data_link_values([game])[0]

            return jsonify({"game": game, "creator": creator}), 200
        
        creator_id = request.args.get('creator_id')
        if creator_id:
            data: list[Game] = Game.query.filter(Game.creator_id == creator_id).all()
            games = [game.to_dict() for game in data]
            creator = User.query.get(creator_id).to_dict()

            games = set_game_data_link_values(games)
            return jsonify({"gameList": games, "creator": creator}), 200

        data: list[Game] = Game.query.all()
        games = [game.to_dict() for game in data]

        games = set_game_data_link_values(games)

        return jsonify({"gameList": games}), 200
    except Exception as e:
        return jsonify({"message": f"{str(e)}"}), 500

    
def set_game_data_link_values(games: list[dict[str, any]]):
    for game in games:
            for field_name in game.keys():
                if ("trailer" in field_name or "image" in field_name or "file" in field_name) and game[field_name]:
                    game[field_name] = generate_download_signed_url_v4("fgs-data", game[field_name])

    return games