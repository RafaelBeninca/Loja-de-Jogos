from flask import jsonify, request
from database.db import db
from models.bought_game_model import Bought_Game
from models.game_model import Game

def get_bought_game_controller(user_id, game_id):
    try:
        if not user_id or not game_id:
            return jsonify({'message': 'id de usuário e/ou id de jogo não especificado(s)'}), 400
        
        bought_game: Bought_Game = Bought_Game.query.filter(Bought_Game.user_id == user_id, Bought_Game.game_id == game_id).one()

        if not bought_game:
            return jsonify({'message': 'o usuário ainda não comprou este jogo'}), 400
        
        return jsonify({'bought_game': bought_game.to_dict()}), 200
        
    except Exception as e:
        return jsonify({f'{str(e)}'}), 500
    
def get_bought_games_controller(user_id):
    try:
        data: list[Bought_Game] = Bought_Game.query.filter(Bought_Game.user_id == user_id).all()
        bought_games = [bought_game.to_dict() for bought_game in data]
        games = []
        
        for bought_game in bought_games:
            game: Game = Game.query.filter(Game.id == bought_game['game_id']).one()
            games.append(game.to_dict())

        return jsonify({'bought_games': bought_games, 'games': games}), 200
    except Exception as e:
        return jsonify({f'{str(e)}'}), 500
    
def post_bought_game_controller(user_id):
    try:
        data = request.get_json()
        game_id = data["game_id"]

        game = Game.query.get(game_id)

        if not game:
            return jsonify({'message': 'jogo não existe'}), 400

        bought_game = Bought_Game(user_id, game_id)
        db.session.add(bought_game)
        db.session.commit()
    except Exception as e:
        return jsonify({f'{str(e)}'}), 500
    
    return jsonify({'message': 'jogo comprado com sucesso', 'bought_game': bought_game.to_dict()}), 200