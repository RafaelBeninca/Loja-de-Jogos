import { useContext } from "react"
import UserContext from "../contexts/UserContext"
import { emptyUser } from "../utils/defaultValues"
import { useNavigate } from "react-router-dom"

export default function Logout() {
    const { setToken, setUser } = useContext(UserContext)
    const navigate = useNavigate()

    setToken('')
    localStorage.setItem('token', '')

    setUser(emptyUser)

    navigate('/')

    return <></>
}