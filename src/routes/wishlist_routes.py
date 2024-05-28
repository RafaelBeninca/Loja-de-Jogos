from controllers.wishlist_controller import wishlist_controller, delete_wishlist_item_controller
from auth.auth import token_required
from flask import jsonify

def wishlist_routes(app):
    # Get all the items in the wishlist
    @app.route('/api/wishlist', methods=['GET', 'POST'])
    @token_required(app)
    def wishlist(user):
        return wishlist_controller(user.id)

    @app.route('/api/wishlist-item/<wishlist_item_id>', methods=['DELETE'])
    @token_required(app)
    def delete_wishlist_item(user, wishlist_item_id):
        return delete_wishlist_item_controller(wishlist_item_id)