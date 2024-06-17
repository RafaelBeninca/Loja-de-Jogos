from flask import jsonify, request
from database.db import db
from models.genre_model import Genre
from models.game_genre_model import Game_Genre
from models.game_model import Game

def get_genres_controller():
    try:
        game_id = request.args.get('game_id')
        if game_id:
            data: list[Game_Genre] = Game_Genre.query.filter(Game_Genre.game_id == game_id).all()

            genres = [Genre.query.get(game_genre.genre_id).to_dict() for game_genre in data]

            return jsonify({"genres": genres}), 200
        
        creator_id = request.args.get("creator_id")
        if creator_id:
            creator_game_genres = []
            games: list[Game] = Game.query.filter(Game.creator_id == creator_id)
            for game in games:
                game_genres: list[Game_Genre] = Game_Genre.query.filter(Game_Genre.game_id == game.id).all()
                
                genres = [Genre.query.get(game_genre.genre_id).to_dict() for game_genre in game_genres]
                creator_game_genres.append({"title": game.title, "genres": genres})
            
            return jsonify({"game_genres": creator_game_genres}), 200
        
        with_games = request.args.get("with_games")
        if with_games:
            all_game_genres = []
            games: list[Game] = Game.query.all()
            for game in games:
                game_genres: list[Game_Genre] = Game_Genre.query.filter(Game_Genre.game_id == game.id).all()

                genres = [Genre.query.get(game_genre.genre_id).to_dict() for game_genre in game_genres]
                all_game_genres.append({"title": game.title, "genres": genres})

            return jsonify({"game_genres": all_game_genres}), 200
        
        data = Genre.query.all()
        genres = [genre.to_dict() for genre in data]
        return jsonify({"genres": genres}), 200
    except Exception as e:
        return jsonify({"message": f"{str(e)}"}), 500


def post_genres_controller(tags, game_id):
    try:
        for tag in tags:
            isRepeatedTag = Genre.query.filter(Genre.name == tag).all()

            if not isRepeatedTag:
                tag = Genre(tag)
            
                db.session.add(tag)

        db.session.commit()

        for tag in tags:
            tag = Genre.query.filter(Genre.name == tag).one()
            game_tag = Game_Genre(game_id, tag.id)

            db.session.add(game_tag)
        
        db.session.commit()
    except Exception as e:
        return e
    

def alter_genres_controller(updated_tags, game_id):
    try:
        game_genre_tags = Game_Genre.query.filter(Game_Genre.game_id == game_id).all()
        game_tags_id = [Genre.query.get(game_genre_tag.genre_id).id for game_genre_tag in game_genre_tags]

        updated_tags_id = [Genre.query.filter(Genre.name == updated_tag).one().id for updated_tag in updated_tags]

        new_tags_id = list(set(updated_tags_id).difference(set(game_tags_id)))
        deleted_tags_id = list(set(game_tags_id).difference(set(updated_tags_id)))

        for new_tag_id in new_tags_id:
            new_tag = Game_Genre(game_id, new_tag_id)
            
            db.session.add(new_tag)
        
        for deleted_tag_id in deleted_tags_id:
            deleted_tag = Game_Genre.query.filter(Game_Genre.game_id == game_id, Game_Genre.genre_id == deleted_tag_id).one()
            db.session.delete(deleted_tag)
        
        db.session.commit()
    except Exception as e:
        return e
    