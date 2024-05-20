from routes.games_route import games_route
from routes.users_route import users_route
from routes.carts_route import carts_route

def route_index(app):
    games_route(app)
    users_route(app)
    carts_route(app)
