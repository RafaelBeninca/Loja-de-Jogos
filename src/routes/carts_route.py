from controllers.carts_controller import post_cart_item_controller, delete_cart_item_controller, get_cart_id_controller, get_cart_controller
from auth.auth import auth, token_required
from flask import jsonify

def carts_route(app):
    # Get all the items in the cart
    @app.route('/api/carts/<cart_id>', methods=['GET'])
    @token_required(app)
    def get_cart(user, cart_id):
        return get_cart_controller(cart_id)

    @app.route('/api/cart-item', methods=['POST'])
    @token_required(app)
    def post_cart_item(user):
        return post_cart_item_controller()
    
    @app.route('/api/cart-item/<cart_item_id>', methods=['DELETE'])
    @token_required(app)
    def delete_cart_item(user, cart_item_id):
        return delete_cart_item_controller(cart_item_id)

    # Get cart_id of the user
    @app.route('/api/cart-id/<user_id>', methods=['GET'])
    @token_required(app)
    def get_cart_id(user, user_id):
        return get_cart_id_controller(user_id)