import { useContext, useEffect, useState } from "react"
import { BoughtGame, OriginalGame } from "../types/types"
import axiosInstance from "../utils/axiosInstance"
import { Link, useNavigate } from "react-router-dom"
import UserContext from "../contexts/UserContext"

export default function LibraryGameList() {
    const [games, setGames] = useState<OriginalGame[]>([])
    const [boughtGames, setBoughtGames] = useState<BoughtGame[]>([])
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { getUser, loginUser, user } = useContext(UserContext);
    const navigate = useNavigate();

    const loginIfToken = () => {
        getUser().then(({ user, token }) => {
            if (token) {
                setIsLoggedIn(true)
                console.log(isLoggedIn)
                loginUser(token, user)
            }
            else {
                setIsLoggedIn(false)
                navigate('/logout')
            }
        });
    }

    const getGames = () => {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
            }
        }

        axiosInstance.get(`/api/bought_games?user_id=${user.id}`, config).then(response => {
            console.log(response)
            setGames(response.data.games)
            setBoughtGames(response.data.bought_games)
        }).catch(error => {
            console.error(error)
        })
    }

    useEffect(getGames, [])
    useEffect(loginIfToken, [])
    
    return (
        <>
        {!isLoggedIn ? 
        <p><b>Carregando...</b></p> :
        <div>
            {games.map((game) => (
                <Link key={game.id} to={`/game/${game.title}`}>
                    <div key={game.id}>
                        <img src={game.banner_image} alt="" style={{width: "6rem"}}/>
                        <br />
                        
                        {game.title}
                        <br />

                        Bought At: {boughtGames.filter((boughtGame) => boughtGame.game_id === game.id)[0].created_at}
                    </div>
                    <br />
                </Link>
            ))}
        </div>
        }
        </>
    )
}