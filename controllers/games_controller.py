from flask import jsonify, request
from database.db import db
from models.game_model import Games

def game_controller(id):
    if request.method == 'PATCH':
        try:
            data = request.get_json()
        except Exception as a:
            return f"ERROR: {str(e)}", 400
        
        try:
            game = Games.query.get(id) # Could also cause a 400, but idk

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
            game = Games.query.get(id)
            
            if not game:
                return f'ERROR: Jogo não existe', 400
        
            db.session.delete(game)
            db.session.commit()
        except Exception as e:
            return f'ERROR: {str(e)}', 500
        
        return f'Jogo deletado com sucesso', 200

def games_controller():
    if request.method == 'GET':
        try:
            data = Games.query.all()
            games = [game.to_dict() for game in data]
            print(games)

            return jsonify({"gameList": games})
        except Exception as e:
            return f"ERROR: {str(e)}", 500
    elif request.method == 'POST':
        try:
            data = request.get_json()
            isRepeatedTitle = Games.query.filter(Games.title == data['title']).all()

            if isRepeatedTitle: 
                return f'ERROR: Um jogo com esse nome já existe', 400

        except Exception as e:
            return f'ERROR: {str(e)}', 400
        
        game = Games(data['title'], data['price'])
        
        try:
            db.session.add(game)
            db.session.commit()
        except Exception as e:
            return f"ERROR: {str(e)}", 500

        return "Jogo criado com sucesso", 200
    