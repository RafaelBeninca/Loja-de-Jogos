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
            
            game.title = data.get('title', game.title)
            game.price = data.get('price', game.price)

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
    
    game = Game(data['title'], data['price'])
    
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
        