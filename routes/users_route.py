from controllers.users_controller import users_controller, user_controller
from auth.auth import auth, token_required
from flask import jsonify

def users_route(app):
    app.route('/users', methods=['GET', 'POST'])(users_controller)
    app.route('/users/<id>', methods=['GET', 'PATCH', 'DELETE'])(user_controller)
    app.route('/auth', methods=['POST'])(auth)

    @app.route('/check_token', methods=['POST'])
    @token_required(app)
    def check_token(user):
        return jsonify({'message': 'token válido', 'user': user.to_dict()})