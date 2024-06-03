from controllers.games_controller import get_games_controller, post_game_controller, game_controller, get_partner_games_controller
from auth.auth import token_required

def game_routes(app):
    @app.route('/api/games')
    def get_games():
        return get_games_controller()
    
    @app.route('/api/partner-games')
    @token_required(app)
    def get_user_games(user):
        return get_partner_games_controller(user.id)
    
    @app.route('/api/games', methods=['POST'])
    @token_required(app)
    def post_game(user):
        return post_game_controller()
    
    @app.route('/api/games/<game_id>', methods=['PATCH', 'DELETE'])
    @token_required(app)
    def games_id(user, game_id):
        return game_controller(game_id, user.id)