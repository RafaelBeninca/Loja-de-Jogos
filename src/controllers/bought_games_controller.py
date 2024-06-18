from flask import jsonify, request
from database.db import db
from models.bought_game_model import Bought_Game
from models.game_model import Game
from controllers.games_controller import replace_media_links
from controllers.carts_controller import patch_cart_controller, post_cart_controller
from controllers.reviews_controller import get_game_avgs
from controllers.genres_controller import get_game_genres
from datetime import datetime


def get_bought_games_controller():
    try:
        user_id = request.args.get('user_id')
        if not user_id:
            return jsonify({"message": "argumentos de requisição faltando"}), 400
        
        game_id = request.args.get('game_id')
        if game_id:
            bought_game: Bought_Game = Bought_Game.query.filter(Bought_Game.user_id == user_id, Bought_Game.game_id == game_id).all()

            if not bought_game:
                return jsonify({'message': 'o usuário ainda não comprou este jogo'}), 400

            return jsonify({'bought_game': bought_game[0].to_dict()}), 200
        
        data: list[Bought_Game] = Bought_Game.query.filter(Bought_Game.user_id == user_id).all()
        bought_games = [bought_game.to_dict() for bought_game in data]
        games = []
        
        for bought_game in bought_games:
            game: Game = Game.query.filter(Game.id == bought_game['game_id']).one()
            games.append(game.to_dict())

        avgs = []
        game_genres = []
        for game in games:
            replace_media_links(game)
            avgs.append(get_game_avgs(game))
            game_genres.append(get_game_genres(game))

        return jsonify({'bought_games': bought_games, 'games': games, "avgs": avgs, "game_genres": game_genres}), 200
    except Exception as e:
        return jsonify({'message': f'{str(e)}'}), 500

    
def post_bought_games_controller(user_id):
    try:
        data = request.get_json()
        cart_items = data["cart_items"]
        order_total = 0
        cart_id = cart_items[0]['shop_order_id']

        for cart_item in cart_items:
            game_id = cart_item['game_id']

            game: Game = Game.query.get(game_id)
            if not game:
                return jsonify({'message': 'um dos jogos não existe'}), 400
        
            bought_game = Bought_Game.query.filter(Bought_Game.game_id == game_id, Bought_Game.user_id == user_id).all()
            if bought_game:
                return jsonify({'message': 'usuário já comprou um dos jogos'}), 400

            bought_game = Bought_Game(user_id, game_id)
            db.session.add(bought_game)
            order_total += game.price

        db.session.commit()

        result = patch_cart_controller(cart_id, order_total, datetime.now())

        if result:
            raise result

        new_cart = post_cart_controller(user_id)
        if type(new_cart) == Exception:
            raise new_cart
    except Exception as e:
        return jsonify({'message': f'{str(e)}'}), 500
    
    return jsonify({'message': 'jogos comprados com sucesso'}), 200
