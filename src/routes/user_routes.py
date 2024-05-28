from controllers.users_controller import users_controller, user_controller, delete_user_controller
from auth.auth import auth, token_required
from flask import jsonify

def user_routes(app):
    app.route('/api/users', methods=['GET', 'POST'])(users_controller)
    app.route('/api/users/<id>', methods=['GET', 'PATCH'])(user_controller)
    app.route('/api/users/<id>', methods=['DELETE'])(delete_user_controller)
    
    @app.route('/api/auth', methods=['POST'])
    def authentication():
        return auth(app)

    @app.route('/api/check_token', methods=['POST'])
    @token_required(app)
    def check_token(user):
        return jsonify({'message': 'token válido', 'user': user.to_dict()})