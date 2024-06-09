from controllers.bought_games_controller import get_bought_games_controller, post_bought_games_controller
from auth.auth import token_required

def bought_game_routes(app):    
    @app.route('/api/bought_games', methods=['POST'])
    @token_required(app)
    def bought_games(user):
        return post_bought_games_controller(user.id)
    
    app.route('/api/bought_games', methods=['GET'])(get_bought_games_controller)
