from flask import jsonify, request
from database.db import db
from models.shop_order_model import Shop_Order
from models.order_item_model import Order_Item
from models.game_model import Game
from models.bought_game_model import Bought_Game
from controllers.games_controller import replace_media_links


def get_cart_controller(user_id):
    try:
        from controllers.reviews_controller import get_game_avgs
        from controllers.genres_controller import get_game_genres

        cart: Shop_Order = Shop_Order.query.filter(Shop_Order.user_id == user_id, Shop_Order.status == "pending").one()

        game_id = request.args.get('game_id')
        if game_id:
            hasItem = Order_Item.query.filter(Order_Item.game_id == game_id, Order_Item.shop_order_id == cart.id).all()

            if not hasItem:
                return jsonify({'message': 'usuário não tem este jogo no carrinho'}), 400
            
            item = hasItem[0].to_dict()

            return jsonify({"item": item})
        
        data: list[Order_Item] = Order_Item.query.filter(Order_Item.shop_order_id == cart.id).all()

        cart_items = [cart_item.to_dict() for cart_item in data]
        games = []

        for cart_item in cart_items:
            game: Game = Game.query.filter(Game.id == cart_item['game_id']).one()
            games.append(game.to_dict())
        
        avgs = []
        game_genres = []
        for game in games:
            replace_media_links(game)
            avgs.append(get_game_avgs(game))
            game_genres.append(get_game_genres(game))

        return jsonify({"items": cart_items, "games": games, "avgs": avgs, "game_genres": game_genres})
    except Exception as e:
        return jsonify({"message": f"{str(e)}"}), 500
        

def post_cart_item_controller(user_id):
    try:
        data = request.get_json()
        game_id = data['game_id']
        cart: Shop_Order = Shop_Order.query.filter(Shop_Order.user_id == user_id, Shop_Order.status == "pending").one()

        isRepeatedItem = Order_Item.query.filter(Order_Item.shop_order_id == cart.id, Order_Item.game_id == game_id).all()
        hasBeenBought = Bought_Game.query.filter(Bought_Game.game_id == game_id, Bought_Game.user_id == user_id).all()

        if isRepeatedItem:
            return jsonify({'message': 'este item já está no carrinho'}), 409

        if hasBeenBought:
            return jsonify({'message': 'este jogo já foi comprado pelo usuário'}), 409

    except Exception as e:
        return jsonify({'message': f'{str(e)}'}), 400
    
    try:
        cart_item = Order_Item(cart.id, game_id)
        db.session.add(cart_item)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': f'{str(e)}'}), 500

    return jsonify({'message': 'item de carrinho adicionado com sucesso', 'cart_item': cart_item.to_dict()}), 200


def delete_cart_item_controller():
    try:
        cart_item_id = request.args.get('cart_item_id')
        cart_item = Order_Item.query.get(cart_item_id)
        
        if not cart_item:
            return jsonify({'message': 'item não existe'}), 400
    
        db.session.delete(cart_item)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': f'{str(e)}'}), 500
    
    return jsonify({'message': 'item de carrinho deletado com sucesso'}), 200


def post_cart_controller(user_id):
    try:
        cart = Shop_Order(user_id, None, None, 'pending')
        db.session.add(cart)
        db.session.commit()
    except Exception as e:
        return e
    
    return cart


def patch_cart_controller(cart_id, order_total, order_date):
    try:
        cart: Shop_Order = Shop_Order.query.get(cart_id)

        cart.order_total = order_total
        cart.order_date = order_date
        cart.status = 'finished'

        db.session.commit()
    except Exception as e:
        return e

    return None