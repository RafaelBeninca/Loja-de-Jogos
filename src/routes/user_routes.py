from controllers.users_controller import users_controller, delete_user_controller, patch_user_controller, get_user_with_pic_link
from auth.auth import auth, token_required
from flask import jsonify

def user_routes(app):
    app.route('/api/users', methods=['GET', 'POST'])(users_controller)

    @app.route('/api/users', methods=['DELETE'])
    @token_required(app)
    def delete_user(user):
        return delete_user_controller(user)

    @app.route('/api/users', methods=['PATCH'])
    @token_required(app)
    def patch_user(user):
        return patch_user_controller(app, user)
    
    @app.route('/api/auth', methods=['POST'])
    def authentication():
        return auth(app)

    @app.route('/api/check_token', methods=['POST'])
    @token_required(app)
    def check_token(user):
        user_dict = get_user_with_pic_link(user)
        return jsonify({'message': 'token válido', 'user': user_dict})