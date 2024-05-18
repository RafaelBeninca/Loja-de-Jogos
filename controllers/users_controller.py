from flask import jsonify, request
from database.db import db
from models.user_model import User
from werkzeug.security import generate_password_hash

def user_controller(id):
    if request.method == 'GET':
        try:
            data = User.query.get(id)

            return jsonify({"data": data.to_dict()})
        except Exception as e:
            return jsonify({"message": f"{str(e)}"}), 500
    elif request.method == 'PATCH':
        try:
            data = request.get_json()
        except Exception as e:
            return f"ERROR: {str(e)}", 400
        
        try:
            user = User.query.get(id) # Could also cause a 400, but idk

            if not user:
                return jsonify({'message': 'usuário não existe'}), 400
            
            isRepeatedUsername = User.query.filter(User.username == data.get('username', '')).all()
            isRepeatedEmail = User.query.filter(User.email_address == data.get('email_address', '')).all()

            if isRepeatedUsername or isRepeatedEmail:
                return jsonify({'message': 'informações já existem'}), 400

            user.username = data.get('username', user.username)
            
            password = data.get('password', '')
            if password:
                user.password = generate_password_hash(password)
            
            user.email_address = data.get('email_address', user.email_address)
            user.profile_picture = data.get('profile_picture', user.profile_picture)
            user.summary = data.get('summary', user.summary)

            db.session.commit()
        except Exception as e:
            return jsonify({'message': f'{str(e)}'}), 500
        
        return jsonify({'message': "usuário alterado com sucesso", 'data': user.to_dict()}), 200
    elif request.method == 'DELETE':
        try:
            user = User.query.get(id)
            
            if not user:
                return jsonify({'message': 'usuário não existe'}), 400
        
            db.session.delete(user)
            db.session.commit()
        except Exception as e:
            return f'ERROR: {str(e)}', 500
        
        return jsonify({'message': 'usuário deletado com sucesso'}), 200

def users_controller():
    if request.method == 'GET':
        try:
            data = User.query.all()
            users = [user.to_dict() for user in data]
            print(users)

            return jsonify({"userList": users})
        except Exception as e:
            return jsonify({"message": f"{str(e)}"}), 500
    elif request.method == 'POST':
        try:
            data = request.get_json()
            isRepeatedUsername = User.query.filter(User.username == data['username']).all()
            isRepeatedEmail = User.query.filter(User.email_address == data['email_address']).all()

            if isRepeatedUsername or isRepeatedEmail:
                return jsonify({'message': 'informações já existem'}), 400
        except Exception as e:
            return jsonify({'message': f'{str(e)}'}), 400
        
        password_hash = generate_password_hash(data['password'])
        user = User(data['username'], password_hash, data['email_address'], data.get('profile_picture'), data.get('summary'))
        
        try:
            db.session.add(user)
            db.session.commit()
        except Exception as e:
            return jsonify({'message': f'{str(e)}'}), 500

        return jsonify({'message': 'usuário criado com sucesso', 'data': user.to_dict()}), 200
