import jwt
from datetime import datetime, timedelta
from werkzeug.security import check_password_hash
from flask import request, jsonify
from functools import wraps
from models.user_model import User

def get_user_by_email(email):
    try:
        return User.query.filter(User.email_address == email).one()
    except Exception as e:
        return None

def auth(app):
    auth = request.get_json()
    if not auth or not auth.get('email_address') or not auth.get('password'):
        return jsonify({'message': 'não foi possível verificar', 'WWW-Authenticate': 'Basic auth="Login required"'}), 401
    
    user = get_user_by_email(auth['email_address'])

    if not user:
        return jsonify({'message': 'usuário não encontrado', 'data': {}}), 401
    
    if check_password_hash(user.password, auth['password']):
        token = jwt.encode({'email_address': user.email_address, 'exp': datetime.now() + timedelta(hours=12)}, 
                           app.config['JWT_SECRET_KEY'])
        print(token)
        return jsonify({'message': 'validado com sucesso', 'token': token,
                        'exp': datetime.now() + timedelta(hours=12), 'user': user.to_dict()}), 200

    return jsonify({'message': 'senha incorreta', 'WWW-Authenticate': 'Basic auth="Login required"'}), 401

def token_required(app):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            auth = request.headers.get('Authorization')
            if not auth:
                return jsonify({'message': 'token está faltando', 'data': {}}), 401
            try:
                token = auth.split(' ')[1]
                print(token)
                data = jwt.decode(token, app.config['JWT_SECRET_KEY'], ['HS256'])
                current_user = get_user_by_email(data['email_address'])
            except Exception as e:
                print(str(e))
                return jsonify({'message': 'token é inválido ou expirou', 'data': {}}), 401
            return f(current_user, *args, **kwargs)
        return wrapper
    return decorator