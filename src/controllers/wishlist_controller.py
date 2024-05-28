from flask import jsonify, request
from database.db import db
from models.wishlist_item_model import Wishlist_Item

def wishlist_controller(user_id):
    if request.method == 'GET':
        try:
            data = Wishlist_Item.query.filter(Wishlist_Item.user_id == user_id).all()

            wishlist_items = [wishlist_item.to_dict() for wishlist_item in data]

            return jsonify({"items": wishlist_items}), 200
        except Exception as e:
            return jsonify({"message": f"{str(e)}"}), 500
    elif request.method == 'POST':
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

def delete_wishlist_item_controller(wishlist_item_id):
    try:
        wishlist_item = Wishlist_Item.query.get(wishlist_item_id)
        
        if not wishlist_item:
            return jsonify({'message': 'item não existe'}), 400
    
        db.session.delete(wishlist_item)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': f'{str(e)}'}), 500
    
    return jsonify({'message': 'item de wishlist deletado com sucesso'}), 200