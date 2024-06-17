from routes.game_routes import game_routes
from routes.user_routes import user_routes
from routes.cart_routes import cart_routes
from routes.wishlist_routes import wishlist_routes
from routes.review_routes import review_routes
from routes.bought_game_routes import bought_game_routes
from routes.genre_routes import genre_routes

def route_index(app):
    game_routes(app)
    user_routes(app)
    cart_routes(app)
    wishlist_routes(app)
    review_routes(app)
    bought_game_routes(app)
    genre_routes(app)
