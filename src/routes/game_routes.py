from controllers.games_controller import get_games_controller, game_controller
from auth.auth import token_required

def game_routes(app):
    @app.route('/api/games', methods=['GET'])
    def get_games():
        return get_games_controller()
    
    @app.route('/api/games', methods=['POST', 'PATCH', 'DELETE'])
    @token_required(app)
    def alter_games(user):
        return game_controller(user.id)
    