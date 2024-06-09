from controllers.reviews_controller import get_reviews_controller, review_controller
from auth.auth import token_required

def review_routes(app):
    @app.route('/api/reviews', methods=['GET'])
    def get_reviews():
        return get_reviews_controller()

    @app.route('/api/reviews', methods=['POST', 'DELETE', 'PATCH'])
    @token_required(app)
    def review(user):
        return review_controller(user.id)