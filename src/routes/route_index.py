from routes.game_routes import game_routes
from routes.user_routes import user_routes
from routes.cart_routes import cart_routes
from routes.wishlist_routes import wishlist_routes

def route_index(app):
    game_routes(app)
    user_routes(app)
    cart_routes(app)
    wishlist_routes(app)