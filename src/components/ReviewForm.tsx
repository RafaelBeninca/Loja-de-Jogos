import { useNavigate } from "react-router-dom";
import { OriginalGame, Review } from "../types/types";
import axiosInstance from "../utils/axiosInstance";
import { useState } from "react";

interface ReviewFormProps {
    game: OriginalGame,
    userReview?: Review,
    setIsUpdatingReview?: (arg0: boolean) => void
    getReviews: () => void
}

const emptyUserReview = {
    id: 0,
    user_id: 0,
    game_id: 0,
    rating: 0,
    comment: "",
    created_at: "",
    updated_at: ""
}

export default function ReviewForm({ game, userReview=emptyUserReview, setIsUpdatingReview, getReviews }: ReviewFormProps) {
    const [newReview, setNewReview] = useState<Review>({
        id: userReview.id,
        user_id: userReview.user_id,
        game_id: userReview.game_id,
        rating: userReview.rating,
        comment: userReview.comment,
        created_at: userReview.created_at,
        updated_at: userReview.updated_at
    });
    
    const navigate = useNavigate();

    const isUpdatingReview = userReview.id !== 0;
    
    const createReview = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!game) return

        const config = {
            headers: {
                "Authorization": "Bearer " + (localStorage.getItem('token') || '')
            }
        }

        const data = {
            game_id: game.id,
            comment: newReview.comment,
            rating: newReview.rating
        }

        axiosInstance.post(`/api/reviews`, data, config).then(response => {
            console.log(response)
            alert("Review criada com sucesso!")
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

    const updateReview = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const config = {
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
            }
        }

        const body = {
            rating: newReview.rating,
            comment: newReview.comment
        }

        axiosInstance.patch(`/api/review/${newReview.id}`, body, config).then(response => {
            console.log(response)
            alert("Review alterada com sucesso!")
            setIsUpdatingReview!(false)
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

    return (
        <form onSubmit={isUpdatingReview ? updateReview : createReview}>
            Rating: <input type="number" placeholder="1-5" required value={newReview.rating} style={{width: "5rem"}} onChange={e => setNewReview({...newReview, rating: parseInt(e.target.value)})}/>
            {isUpdatingReview &&
            <>
            <span onClick={() => setIsUpdatingReview!(false)} style={{cursor: 'pointer'}}><b>X</b></span>
            </>
            }
            <br />
            <textarea name="comment" id="comment" placeholder="Digite sua review aqui..." value={newReview.comment} cols={50} rows={4} onChange={e => setNewReview({...newReview, comment: e.target.value})} />
            <br /><br />
            <button type="submit">{isUpdatingReview ? "Update" : "Create"}</button>
        </form>
    )
}