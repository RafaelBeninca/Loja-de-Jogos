from flask import jsonify, request
from database.db import db
from models.user_model import User
from werkzeug.security import generate_password_hash
from werkzeug.utils import secure_filename
from gcloud.buckets.fgs_data_bucket.game_data_delete import delete_blob, delete_storage_folder
from gcloud.buckets.fgs_data_bucket.game_data_upload import upload_blob_from_memory
from gcloud.buckets.fgs_data_bucket.game_data_download import generate_download_signed_url_v4
from controllers.carts_controller import post_cart_controller
from datetime import datetime, timedelta
import jwt

def get_user_controller(user_id):
    if request.method == 'GET':
        try:
            data = User.query.get(user_id)
            user: User = data.to_dict()

            if user.profile_picture:
                user.profile_picture = generate_download_signed_url_v4('fgs-data', user.profile_picture)

            return jsonify({"user": user})
        except Exception as e:
            return jsonify({"message": f"{str(e)}"}), 500
    
def patch_user_controller(app, user: User):
    try:
        isRepeatedUsername: list[User] = User.query.filter(User.username == request.form.get('username', '')).all()
        isRepeatedEmail: list[User] = User.query.filter(User.email_address == request.form.get('email_address', '')).all()

        if isRepeatedUsername and isRepeatedUsername[0].id != user.id or isRepeatedEmail and isRepeatedEmail[0].id != user.id:
            return jsonify({'message': 'informações já existem'}), 400

        if request.files:
            profile_pic = request.files['profile_picture']

            now = datetime.now()
            now_str = now.strftime("%d-%m-%Y_%H-%M-%S")

            filename = secure_filename(profile_pic.filename)

            print(profile_pic, filename)

            if user.profile_picture:
                delete_blob('fgs-data', user.profile_picture)
                
                blob_name = f"{user.blob_name_prefix}{filename}"
            else:
                blob_name = f"users/{now_str}/{filename}"
                user.blob_name_prefix = f"users/{now_str}/"
                
            upload_blob_from_memory("fgs-data", profile_pic.read(), blob_name)
            user.profile_picture = blob_name

        user.username = request.form.get('username', user.username)
        
        password = request.form.get('password')
        if password:
            user.password = generate_password_hash(password)
        
        user.email_address = request.form.get('email_address', user.email_address)
        user.summary = request.form.get('summary', user.summary)

        token = jwt.encode({'email_address': user.email_address, 'exp': datetime.now() + timedelta(hours=12)}, 
                           app.config['JWT_SECRET_KEY'])

        db.session.commit()
    except Exception as e:
        return jsonify({'message': f'{str(e)}'}), 500
    
    return jsonify({'message': "usuário alterado com sucesso", 'user': user.to_dict(), 'token': token}), 200
    
def delete_user_controller(user: User):
    try:
        delete_storage_folder('fgs-data', user.blob_name_prefix)

        db.session.delete(user)
        db.session.commit()
    except Exception as e:
        return jsonify({'message': f'{str(e)}'}), 500
    
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
        
            password_hash = generate_password_hash(data['password'])
            user = User(data['username'], password_hash, data['email_address'], data.get('profile_picture'), data.get('summary'))
        
            db.session.add(user)
            db.session.commit()
        except Exception as e:
            return jsonify({'message': f'{str(e)}'}), 500

        cart = post_cart_controller(user.id)
        if not cart:
            delete_user_controller(user)
            return jsonify({'message': 'erro ao criar o carrinho'}), 500

        return jsonify({'message': 'usuário criado com sucesso', 'user': user.to_dict(), 'cart': cart.to_dict()}), 200

def get_user_with_pic_link(user):
    try:
        user_dict = user.to_dict()
        if user_dict['profile_picture']:
            user_dict['profile_picture'] = generate_download_signed_url_v4('fgs-data', user_dict['profile_picture'])
        
        return user_dict
    except Exception as e:
        print(str(e))
        return None