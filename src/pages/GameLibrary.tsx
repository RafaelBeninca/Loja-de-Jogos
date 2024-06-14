import { useContext, useEffect, useState } from "react"
import LibraryGameList from "../components/LibraryGameList"
import { useNavigate } from "react-router-dom"
import UserContext from "../contexts/UserContext"

export default function GameLibrary() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const { getUser, loginUser, logoutUser } = useContext(UserContext)
    const navigate = useNavigate()
    
    const loginIfToken = () => {
        getUser().then(({ user, token }) => {
            if (token) {
                setIsLoggedIn(true)
                loginUser(token, user)
            }
            else {
                logoutUser()
                navigate('/login')
            }
        });
    }

    useEffect(() => { loginIfToken() }, [])
    
    return (
        <>
        {isLoggedIn &&
        <div>
            <h1>Library</h1>
            <LibraryGameList />
        </div>
        }
        </>
    )
}