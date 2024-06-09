from controllers.carts_controller import post_cart_item_controller, delete_cart_item_controller, get_cart_controller
from auth.auth import token_required
from flask import jsonify

def cart_routes(app):
    # Get all the items in the cart
    @app.route('/api/carts', methods=['GET'])
    @token_required(app)
    def get_cart(user):
        return get_cart_controller(user.id)

    @app.route('/api/cart-item', methods=['POST'])
    @token_required(app)
    def post_cart_item(user):
        return post_cart_item_controller(user.id)
    
    @app.route('/api/cart-item', methods=['DELETE'])
    @token_required(app)
    def delete_cart_item(user):
        return delete_cart_item_controller()