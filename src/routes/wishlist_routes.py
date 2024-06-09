from controllers.wishlist_controller import wishlist_controller, wishlist_item_controller
from auth.auth import token_required

def wishlist_routes(app):
    @app.route('/api/wishlist', methods=['GET'])
    @token_required(app)
    def wishlist(user):
        return wishlist_controller(user.id)

    @app.route('/api/wishlist-item', methods=['POST', 'DELETE'])
    @token_required(app)
    def wishlist_item(user):
        return wishlist_item_controller(user.id)