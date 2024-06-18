from flask import jsonify, request
from database.db import db
from models.wishlist_item_model import Wishlist_Item
from models.game_model import Game
from controllers.games_controller import replace_media_links
from controllers.reviews_controller import get_game_avgs
from controllers.genres_controller import get_game_genres

def wishlist_controller(user_id):
    try:
        game_id = request.args.get('game_id')
        if game_id:
            hasItem = Wishlist_Item.query.filter(Wishlist_Item.user_id == user_id, Wishlist_Item.game_id == game_id).all()

            if not hasItem:
                return jsonify({'message': 'usuário não tem este jogo na wishlist'}), 400
            
            item = hasItem[0].to_dict()

            return jsonify({"item": item})

        data: list[Wishlist_Item] = Wishlist_Item.query.filter(Wishlist_Item.user_id == user_id).all()

        wishlist_items = [wishlist_item.to_dict() for wishlist_item in data]
        games = []

        for wishlist_item in wishlist_items:
            game: Game = Game.query.filter(Game.id == wishlist_item['game_id']).one()
            games.append(game.to_dict())
        
        avgs = []
        game_genres = []
        for game in games:
            replace_media_links(game)
            avgs.append(get_game_avgs(game))
            game_genres.append(get_game_genres(game))
            

        return jsonify({"items": wishlist_items, "games": games, "avgs": avgs, "game_genres": game_genres}), 200
    except Exception as e:
        return jsonify({"message": f"{str(e)}"}), 500

def wishlist_item_controller(user_id):
    if request.method == 'POST':
        try:
            data = request.get_json()
            game_id = data["game_id"]
        except Exception as e:
            return jsonify({'message': f'{str(e)}'}), 400

        try:
            wishlist_item = Wishlist_Item(user_id, game_id)
            db.session.add(wishlist_item)
            db.session.commit()
        except Exception as e:
            return jsonify({'message': f'{str(e)}'}), 500

        return jsonify({'message': 'item de wishlist adicionado com sucesso', 'wishlist_item': wishlist_item.to_dict()}), 200
    elif request.method == 'DELETE':
        try:
            wishlist_item_id = request.args.get('wishlist_item_id')
            if not wishlist_item_id:
                return jsonify({"message": "argumentos de requisição faltando"}), 400
            
            wishlist_item = Wishlist_Item.query.get(wishlist_item_id)
            
            if not wishlist_item:
                return jsonify({'message': 'item não existe'}), 400
        
            db.session.delete(wishlist_item)
            db.session.commit()
        except Exception as e:
            return jsonify({'message': f'{str(e)}'}), 500
        
        return jsonify({'message': 'item de wishlist deletado com sucesso'}), 200