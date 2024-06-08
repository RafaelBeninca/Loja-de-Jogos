from controllers.bought_games_controller import get_bought_game_controller, post_bought_game_controller, get_bought_games_controller
from auth.auth import token_required

def bought_game_routes(app):
    @app.route('/api/bought_game/<game_id>', methods=['GET'])
    @token_required(app)
    def is_game_bought(user, game_id):
        return get_bought_game_controller(user.id, game_id)
    
    @app.route('/api/bought_games', methods=['GET'])
    @token_required(app)
    def get_bought_games(user):
        return get_bought_games_controller(user.id)

    @app.route('/api/bought_games', methods=['POST'])
    @token_required(app)
    def post_bought_game(user):
        return post_bought_game_controller(user.id)
