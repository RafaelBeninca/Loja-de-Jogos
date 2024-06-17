from controllers.genres_controller import get_genres_controller
from auth.auth import token_required

def genre_routes(app):
    @app.route('/api/genres', methods=['GET'])
    def get_genres():
        return get_genres_controller()

    # @app.route('/api/genres', methods=['POST', 'DELETE'])
    # @token_required(app)
    # def review(user):
    #     return genre_controller(user.id)