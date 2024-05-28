from flask import jsonify, request
from database.db import db
from models.shop_order_model import Shop_Order
from models.order_item_model import Order_Item

def get_cart_controller(cart_id):
    if request.method == 'GET':
        try:
            data = Order_Item.query.filter(Order_Item.shop_order_id == cart_id).all()

            cart_items = [cart_item.to_dict() for cart_item in data]

            return jsonify({"items": cart_items})
        except Exception as e:
            return jsonify({"message": f"{str(e)}"}), 500
        
def post_cart_item_controller():
    try:
        data = request.get_json()
        shop_order_id = data['shop_order_id']
        game_id = data['game_id']
        isRepeatedItem = Order_Item.query.filter(Order_Item.shop_order_id == shop_order_id, Order_Item.game_id == game_id).all()

        if isRepeatedItem:
            return jsonify({'message': 'esse item já está no carrinho'}), 400
    except Exception as e:
        return jsonify({'message': f'{str(e)}'}), 400
    
    try:
        cart_item = Order_Item(shop_order_id, game_id)
        db.session.add(cart_item)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': f'{str(e)}'}), 500

    return jsonify({'message': 'item de carrinho adicionado com sucesso', 'cart_item': cart_item.to_dict()}), 200

def delete_cart_item_controller(cart_item_id):
    try:
        cart_item = Order_Item.query.get(cart_item_id)
        
        if not cart_item:
            return jsonify({'message': 'item não existe'}), 400
    
        db.session.delete(cart_item)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': f'{str(e)}'}), 500
    
    return jsonify({'message': 'item de carrinho deletado com sucesso'}), 200

def post_cart_controller(id):
    try:
        cart = Shop_Order(id, None, None, 'pending')
        db.session.add(cart)
        db.session.commit()
    except Exception as e:
        print(e)
        return None
    
    return cart

def get_cart_id_controller(user_id):
    try:
        cart = Shop_Order.query.filter(Shop_Order.user_id == user_id and Shop_Order.status == "pending").one()

        return jsonify({'cart_id': cart.id}), 200
    except Exception as e:
        return jsonify({'message': f'{str(e)}'}), 500
