from flask import jsonify, request
from database.db import db
from models.game_model import Game

def game_controller(id):
    if request.method == 'PATCH':
        try:
            data = request.get_json()
        except Exception as e:
            return f"ERROR: {str(e)}", 400
        
        try:
            game = Game.query.get(id) # Could also cause a 400, but idk

            if not game:
                return f"ERROR: Jogo não existe", 400
            
            game.publisher = data.get('publisher', game.publisher)
            game.developer = data.get('developer', game.developer)
            game.title = data.get('title', game.title)
            game.price = data.get('price', game.price)

            release_date = data.get('release_date') 
            if not release_date:
                release_date = None
            game.release_date = data.get(release_date, game.release_date)
            game.summary = data.get('summary', game.summary)
            game.about = data.get('about', game.about)
            game.game_file = data.get('game_file', game.game_file)
            game.banner_image = data.get('banner_image', game.banner_image)
            game.trailer_1 = data.get('trailer_1', game.trailer_1)
            game.trailer_2 = data.get('trailer_2', game.trailer_2)
            game.trailer_3 = data.get('trailer_3', game.trailer_3)
            game.preview_image_1 = data.get('preview_image_1', game.preview_image_1)
            game.preview_image_2 = data.get('preview_image_2', game.preview_image_2)
            game.preview_image_3 = data.get('preview_image_3', game.preview_image_3)
            game.preview_image_4 = data.get('preview_image_4', game.preview_image_4)
            game.preview_image_5 = data.get('preview_image_5', game.preview_image_5)
            game.preview_image_6 = data.get('preview_image_6', game.preview_image_6)

            db.session.commit()
        except Exception as e:
            return f'ERROR: {str(e)}', 500
        
        return f"Jogo alterado com sucesso", 200
    elif request.method == 'DELETE':
        try:
            game = Game.query.get(id)
            
            if not game:
                return f'ERROR: Jogo não existe', 400
        
            db.session.delete(game)
            db.session.commit()
        except Exception as e:
            return f'ERROR: {str(e)}', 500
        
        return f'Jogo deletado com sucesso', 200

def post_game_controller():
    try:
        data = request.get_json()
        isRepeatedTitle = Game.query.filter(Game.title == data['title']).all()

        if isRepeatedTitle: 
            return f'ERROR: Um jogo com esse nome já existe', 400

    except Exception as e:
        return f'ERROR: {str(e)}', 400
    
    release_date = data.get('release_date') 
    if not release_date:
        release_date = None
    
    game = Game(data['publisher'], data['developer'], data['title'], data['price'], release_date, data['summary'], data['about'], data['game_file'], data['banner_image'], data.get('trailer_1'), data.get('trailer_2'), data.get('trailer_3'), data.get('preview_image_1'), data.get('preview_image_2'), data.get('preview_image_3'), data.get('preview_image_4'), data.get('preview_image_5'), data.get('preview_image_6'))
    
    try:
        db.session.add(game)
        db.session.commit()
    except Exception as e:
        return f"ERROR: {str(e)}", 500

    return "Jogo criado com sucesso", 200
    

def get_games_controller():
    try:
        data = Game.query.all()
        games = [game.to_dict() for game in data]
        print(games)

        return jsonify({"gameList": games})
    except Exception as e:
        return f"ERROR: {str(e)}", 500
        