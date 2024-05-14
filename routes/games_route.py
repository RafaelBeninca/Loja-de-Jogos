from controllers.games_controller import games_controller, game_controller

def games_route(app):
    app.route('/games', methods=['GET', 'POST'])(games_controller)
    app.route('/game/<id>', methods=['PATCH', 'DELETE'])(game_controller)