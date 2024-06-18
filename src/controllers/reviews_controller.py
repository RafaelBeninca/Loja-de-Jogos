from flask import jsonify, request
from database.db import db
from models.review_model import Review
from models.game_model import Game
from controllers.users_controller import get_users


def get_game_avgs(game: dict[str, any]) -> dict[str, any]:
    reviews: list[Review] = Review.query.filter(Review.game_id == game['id']).all()

    sum = 0
    for review in reviews:
        sum += review.rating

    return {"title": game['title'], "avg": (sum / len(reviews)) if reviews else 0, 'num_of_reviews': len(reviews)}


def get_reviews_controller():
    try:
        game_id = request.args.get('game_id')
        if game_id:
            data: list[Review] = Review.query.filter(Review.game_id == game_id).all()

            reviews = [review.to_dict() for review in data]
            users = [get_users(review['user_id']) for review in reviews]

            sum = 0
            for review in reviews:
                sum += review['rating']

            avg = 0
            if reviews:
                avg = sum / len(reviews)

            return jsonify({"reviews": reviews, 'users': users, "avg": avg}), 200

        creator_id = request.args.get('creator_id')
        if creator_id:
            avgs = []
            data: list[Game] = Game.query.filter(Game.creator_id == creator_id).all()

            games: dict[str, any] = [game.to_dict() for game in data]
            for game in games:
                avgs.append(get_game_avgs(game))

            return jsonify({"avgs": avgs}), 200
    except Exception as e:
        return jsonify({"message": f"{str(e)}"}), 500
    

def review_controller(user_id):
    if request.method == 'POST':
        try:
            data = request.get_json()
            game_id = data['game_id']
            rating = data["rating"]
            comment = data.get('comment')

            hasMadeReview = Review.query.filter(Review.user_id == user_id, Review.game_id == game_id).all()

            if hasMadeReview:
                return jsonify({'message': 'usuário já fez uma review deste jogo'}), 400

            review = Review(user_id, game_id, rating, comment)
            db.session.add(review)
            db.session.commit()
        except Exception as e:
            return jsonify({'message': f'{str(e)}'}), 500

        return jsonify({'message': 'review adicionada com sucesso', 'review': review.to_dict()}), 200
    elif request.method == 'PATCH':
        try:
            review_id = request.args.get('review_id')
            if not review_id:
                return jsonify({"message": "argumentos de requisição faltando"}), 400
            
            data = request.get_json()
            review: Review = Review.query.get(review_id)

            if not review:
                return jsonify({'message': 'review não existe'}), 400
            
            review.comment = data.get('comment', review.comment)
            review.rating = data.get('rating', review.rating)

            db.session.commit()
        except Exception as e:
            return jsonify({'message': f'{str(e)}'}), 500
        
        return jsonify({'message': 'review alterada com sucesso'}), 200
    elif request.method == 'DELETE':
        try:
            review_id = request.args.get('review_id')
            if not review_id:
                return jsonify({"message": "argumentos de requisição faltando"}), 400
            
            review = Review.query.get(review_id)
            
            if not review:
                return jsonify({'message': 'review não existe'}), 400
        
            db.session.delete(review)
            db.session.commit()
        except Exception as e:
            return jsonify({'message': f'{str(e)}'}), 500
        
        return jsonify({'message': 'review deletada com sucesso'}), 200