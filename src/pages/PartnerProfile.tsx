import { useContext, useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { OriginalGame, User } from "../types/types"
import UserContext from "../contexts/UserContext"
import axiosInstance from "../utils/axiosInstance"

export default function PartnerProfile() {
    const { getUser, loginUser, user, logoutUser } = useContext(UserContext)
    const [profileUser, setProfileUser] = useState<User>()
    const [games, setGames] = useState<OriginalGame[]>()
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate()
    const params = useParams();

    const isActiveUserProfile = user.id === profileUser?.id;

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

    const getUserWithUsername = () => {
        axiosInstance.get(`/api/users?username=${params.username}`).then(response => {
            console.log(response)
            setProfileUser(response.data.user)
            setIsLoading(false)
        }).catch(error => {
            console.error(error)
            setIsLoading(false)
        })
    }

    const fetchProfileUserCreatedGames = () => {
        if (!profileUser) return

        axiosInstance.get(`/api/games?creator_id=${profileUser.id}`).then(response => {
            console.log(response)
            setGames(response.data.gameList)
        }).catch(error => {
            console.error(error)
        })
    }

    useEffect(loginIfToken, [])
    useEffect(getUserWithUsername, [])
    useEffect(fetchProfileUserCreatedGames, [isLoading])
    
    return (
        <>
        {isLoading ? 
        <p><b>Carregando...</b></p> :
        <>
        {!profileUser ? 
            <p><b>Não achamos este usuário...</b></p> :
            <div>
                <img src={profileUser.profile_picture} alt="" style={{width: "6rem"}} />
                <br />
                <p><b>Username: {profileUser.username}</b></p>

                {isActiveUserProfile && <p><b>Email: {profileUser.email_address}</b></p>}

                <p><b>Sobre: {profileUser.summary}</b></p>

                {isActiveUserProfile && 
                <button onClick={() => navigate('/settings/profile', {relative: "route"})}>Settings</button>
                }
                <br /><br /><br />
                
                Jogos feitos: 
                <div>
                {games?.map((game) => (
                    <Link key={game.id} to={`/game/${game.title}`}>
                        <div key={game.id}>
                            <img src={game.banner_image} alt="" style={{width: "6rem"}}/>
                            <br />
                            
                            {game.title}
                            <br />
                        </div>
                        <br />
                    </Link>
                ))}
                </div>
            </div>
        }
        </>
        }
        </>
    )
}