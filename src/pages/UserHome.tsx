import { useContext, useEffect, useState } from 'react'
import { OriginalGame } from '../types/types.tsx'
import UserHomeGameList from '../components/UserHomeGameList.tsx'
import axiosInstance from '../utils/axiosInstance.tsx'
import UserContext from '../contexts/UserContext.tsx'

export default function UserHome() {
    const [games, setGames] = useState<OriginalGame[]>([])
    const [loading, setLoading] = useState(true)
    const { getUser, logoutUser, loginUser } = useContext(UserContext)

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

    function fetchGames() {
        axiosInstance.get("/api/games").then((response) => {
            setGames(response.data.gameList)
            setLoading(false)
            console.log(response)
        }).catch((error) => {
            console.error(error)
        })
    }
                
    useEffect(fetchGames, [])
    useEffect(() => { loginIfToken() }, [])

    return (
        <div>
            {loading ? 
                <p><b>Carregando...</b></p> :
                <div>
                    <h1>Games</h1>
                    <UserHomeGameList games={games} />
                </div>
            }
        </div>
    )
}
