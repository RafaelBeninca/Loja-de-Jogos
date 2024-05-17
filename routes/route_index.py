from routes.games_route import games_route
from routes.users_route import users_route

def route_index(app):
    games_route(app)
    users_route(app)
