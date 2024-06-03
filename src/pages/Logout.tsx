import { useContext, useEffect } from "react"
import UserContext from "../contexts/UserContext"
import { useNavigate } from "react-router-dom"

export default function Logout() {
    const { logoutUser } = useContext(UserContext)
    const navigate = useNavigate()

    const logout = () => {
        logoutUser()    
        navigate('/')
    }

    useEffect(logout, [])

    return <></>
}