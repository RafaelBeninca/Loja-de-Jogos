import { useNavigate, useParams } from "react-router-dom"
import axiosInstance from "../utils/axiosInstance";
import React, { useContext, useEffect, useState } from "react";
import { OriginalGame, Review } from "../types/types";
import UserContext from "../contexts/UserContext";
import ReviewForm from "../components/ReviewForm";

export default function Game() {
    const [game, setGame] = useState<OriginalGame>();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [userReview, setUserReview] = useState<Review | null>(null);
    const [isUpdatingReview, setIsUpdatingReview] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isBoughtGame, setIsBoughtGame] = useState(false);
    const { getUser, loginUser, logoutUser, user } = useContext(UserContext);
    const params = useParams();
    const navigate = useNavigate();

    const loginIfToken = () => {
        getUser().then(({ user, token }) => {
            if (token) {
                loginUser(token, user)
                setIsLoggedIn(true)
            }
            else {
                logoutUser()
            }
        });
    }
    
    const getReviews = () => {
        if (!game) return

        axiosInstance.get(`/api/reviews/${game.id}`).then(response => {
            console.log(response);
            setReviews(response.data.reviews)
            setUserReview(null)
        }).catch(error => {
            console.error(error);
        })
    }

    const getGameWithTitle = () => {
        axiosInstance.get(`/api/game/${params.title}`).then(response => {
            console.log(response);
            setGame(response.data.game)
        }).catch(error => {
            console.error(error);
            navigate('/error')
        })
    }

    const getBoughtGame = () => {
        if (!game) return

        const config = {
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
            }
        }

        axiosInstance.get(`/api/bought_game/${game.id}`, config).then(response => {
            console.log(response)
            setIsBoughtGame(true)
        }).catch(error => {
            console.error(error)
        })
    }

    const handlePurchase = () => {
        if (!isLoggedIn) navigate('/login')

        if (!game) return

        const config = {
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
            }
        }

        axiosInstance.post('/api/bought_games', {
            game_id: game.id
        }, config).then(response => {
            console.log(response)
            setIsBoughtGame(true)
            alert("Compra realizada com sucesso!")
        }).catch(error => {
            console.error(error)
            if (error.response.status === 401) {
                navigate('/logout');
            }
            else {
                alert(`Erro. \n\nTente novamente.`);
            }
        })
    }

    const handleOnDeleteReview = (reviewId: number) => {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
            }
        }

        axiosInstance.delete(`/api/review/${reviewId}`, config).then(response => {
            console.log(response)
            alert("Review excluída com sucesso!")
            getReviews()
        }).catch(error => {
            console.error(error)
            if (error.response.status === 401) {
                navigate('/logout');
            }
            else {
                alert(`Erro. \n\nTente novamente.`);
            }
        })
    }

    useEffect(loginIfToken, [])
    useEffect(getGameWithTitle, [])
    useEffect(getReviews, [game])
    useEffect(getBoughtGame, [game])

    console.log(userReview)

    return (
        <>
        {!game ?
        <p><b>Carregando...</b></p> :
        <div>
            <h1>{params.title}</h1>
            <img src={game?.banner_image} alt="" style={{width: "30rem"}} />
            <br /><br />

            {isBoughtGame ? 
            <a href={game?.game_file}>Download</a> :
            <button onClick={handlePurchase}>Comprar</button>
            }
            <br /><br />

            <h2>Reviews</h2>
            {isBoughtGame && !userReview &&
            <ReviewForm game={game} getReviews={getReviews} />
            }
            {isBoughtGame && userReview && isUpdatingReview &&
            <ReviewForm game={game} userReview={userReview} setIsUpdatingReview={setIsUpdatingReview} getReviews={getReviews} />
            }
            <div>
                {reviews.map(review => (
                    <div>
                        <p>Rating: {review.rating}</p>
                        <p>{review.comment}</p>
                        {review.updated_at &&
                        <>
                        <small><b>*edited</b></small>
                        <br />
                        </>
                        }
                        {review.user_id === parseInt(user.id) && !isUpdatingReview &&
                        <>
                            <button onClick={() => handleOnDeleteReview(review.id)}>Delete</button>
                            <button onClick={() => setIsUpdatingReview(true)}>Update</button>
                            {!userReview && setUserReview(review)}
                            {!userReview && console.log('is setting')}
                        </>
                        }
                        <br />
                    </div>
                ))}
            </div>
        </div>  
        }
        </>
    )
}