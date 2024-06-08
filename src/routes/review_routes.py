from controllers.reviews_controller import get_reviews_controller, post_review_controller, review_controller
from auth.auth import token_required

def review_routes(app):
    @app.route('/api/reviews/<game_id>', methods=['GET'])
    def get_reviews(game_id):
        return get_reviews_controller(game_id)

    @app.route('/api/reviews', methods=['POST'])
    @token_required(app)
    def post_review(user):
        return post_review_controller(user.id)

    @app.route('/api/review/<review_id>', methods=['DELETE', 'PATCH'])
    @token_required(app)
    def review(user, review_id):
        return review_controller(review_id)