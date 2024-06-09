import { Link, useNavigate, useParams } from "react-router-dom"
import axiosInstance from "../utils/axiosInstance";
import { useContext, useEffect, useState } from "react";
import { OriginalGame, Review, User } from "../types/types";
import UserContext from "../contexts/UserContext";
import ReviewForm from "../components/ReviewForm";
import { emptyOriginalGame } from "../utils/defaultValues";

export default function Game() {
    const [game, setGame] = useState<OriginalGame>(emptyOriginalGame);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [userReview, setUserReview] = useState<Review | null>(null);
    const [isUpdatingReview, setIsUpdatingReview] = useState(false);
    const [isBoughtGame, setIsBoughtGame] = useState(false);
    const [developerUser, setDeveloperUser] = useState<User>();
    const [publisherUser, setPublisherUser] = useState<User>();
    const { getUser, loginUser, logoutUser, user } = useContext(UserContext);
    const params = useParams();
    const navigate = useNavigate();

    const loginIfToken = () => {
        getUser().then(({ user, token }) => {
            if (token) {
                loginUser(token, user)
            }
            else {
                logoutUser()
            }
        });
    }
    
    const getReviews = () => {
        axiosInstance.get(`/api/reviews?game_id=${game.id}`).then(response => {
            console.log(response);
            setReviews(response.data.reviews)
            setUsers(response.data.users)
            setUserReview(null)
        }).catch(error => {
            console.error(error);
        })
    }

    const getGameWithTitle = () => {
        axiosInstance.get(`/api/games?game_title=${params.title}`).then(response => {
            console.log(response);
            setGame(response.data.game)
        }).catch(error => {
            console.error(error);
            navigate('/error')
        })
    }

    const getBoughtGame = () => {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
            }
        }

        axiosInstance.get(`/api/bought_games?user_id=${user.id}&&game_id=${game.id}`, config).then(response => {
            console.log(response)
            setIsBoughtGame(true)
        }).catch(error => {
            console.error(error)
        })
    }

    const handleOnClickBuy = () => {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
                }
        }
        const data = {
            game_id: game.id
        }

        axiosInstance.post('/api/cart-item', data, config).then((response) => {
            console.log(response.data);
            navigate('/cart', {relative: 'route'})
        }).catch((error) => {
            console.error(error.data);
            if (error.response.status === 401) {
                logoutUser()
                navigate("/login", {relative: "route"})
            }
            else if (error.response.status === 409) {
                navigate("/cart", {relative: "route"})
            }
            else {
                alert(`Erro. \n\nTente novamente.`)
            }
        });
    }

    const handleOnDeleteReview = (reviewId: number) => {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
            }
        }

        axiosInstance.delete(`/api/reviews?review_id=${reviewId}`, config).then(response => {
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

    const getReviewUser = (review: Review) => {
        return users.filter(user => parseInt(user.id) === review.user_id)[0]
    }

    const getDeveloperUser = () => {
        axiosInstance.get(`/api/users?username=${game.developer}`).then(response => {
            console.log(response)
            setDeveloperUser(response.data.user)
        }).catch(error => {
            console.error(error)
        })
    }

    const getPublisherUser = () => {
        axiosInstance.get(`/api/users?username=${game.publisher}`).then(response => {
            console.log(response)
            setPublisherUser(response.data.user)
        }).catch(error => {
            console.error(error)
        })
    }

    useEffect(loginIfToken, [])
    useEffect(getGameWithTitle, [])
    useEffect(getReviews, [game.id])
    useEffect(getDeveloperUser, [game.developer])
    useEffect(getPublisherUser, [game.publisher])
    useEffect(getBoughtGame, [user.id, game.id])

    return (
        <>
        {game.id === 0 ?
        <p><b>Carregando...</b></p> :
        <div>
            <h1>{params.title}</h1>
            <img src={game?.banner_image} alt="" style={{width: "30rem"}} />
            <br /><br />
            Developer: {developerUser ? 
                <Link to={`/partner/${developerUser.username}`}>{developerUser.username}</Link> :
                game.developer
            }
            <br />

            Publisher: {publisherUser ? 
                <Link to={`/partner/${publisherUser.username}`}>{publisherUser.username}</Link> :
                game.publisher
            }
            <br /><br />

            {isBoughtGame ? 
            <a href={game?.game_file}>Download</a> :
            <button onClick={handleOnClickBuy}>Comprar</button>
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
                        <Link key={review.id} to={`/user/${getReviewUser(review).username}`} >
                            <img src={getReviewUser(review).profile_picture} alt="" style={{width: "2rem", height: "2rem", borderRadius: '1rem'}} />
                            <p style={{display: 'inline'}}><b>{getReviewUser(review).username}</b></p>
                        </Link>
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
                        </>
                        }
                        <br /><br />
                    </div>
                ))}
            </div>
        </div>  
        }
        </>
    )
}