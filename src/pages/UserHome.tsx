import { useContext, useEffect, useState } from 'react'
import { OriginalGame } from '../types/types.tsx'
import UserHomeGameList from '../components/UserHomeGameList.tsx'
import axiosInstance from '../utils/axiosInstance.tsx'
import UserContext from '../contexts/UserContext.tsx'

interface Games {
    gameList: OriginalGame[]
}

export default function UserHome() {
    const [games, setGames] = useState<Games>({ gameList: [] })
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

    useEffect(() => { loginIfToken() }, [])

    function fetchGames() {
        axiosInstance.get<Games>("/api/games").then((response) => {
            setGames(response.data)
            setLoading(false)
            console.log(response)
        }).catch((error) => {
            console.error(error)
        })
    }

    useEffect(fetchGames, [])

    return (
        <div>
            {loading ? 
                <p><b>Carregando...</b></p> :
                <UserHomeGameList games={games.gameList} />
            }
        </div>
    )
}
