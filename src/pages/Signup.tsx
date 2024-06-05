import React, { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import UserContext from '../contexts/UserContext.tsx'
import axiosInstance from "../utils/axiosInstance.tsx"
import { FormUser, UserContextInterface } from "../types/types.tsx"

export default function Signup() {
    const [formUser, setFormUser] = useState<FormUser>({
        username: '',
        email_address: '',
        password: '',
        profile_picture: '',
        summary: ''
    })
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const { getUser, logoutUser, loginUser } = useContext<UserContextInterface>(UserContext)
    const navigate = useNavigate()

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        axiosInstance.post('/api/users', formUser).then((response) => {
            console.log(response)

            alert('Conta criada com sucesso!')
            navigate('/login')
        }).catch((error) => {
            if (error.response.status === 400) {
                alert('Nome de usuário e/ou email já existem! \n\nTente novamente.')
            }
            else {
                alert('Erro. Tente novamente')
            }

            console.error(error)
        })
    }

    const loginIfToken = () => {
        getUser().then(({ user, token }) => {
            if (token) {
                setIsLoggedIn(true)
                loginUser(token, user)
                navigate('/')
            }
            else {
                setIsLoggedIn(false)
                logoutUser()
            }
        });
    }


    useEffect(() => { loginIfToken() }, [])

    return (
        <>
            {!isLoggedIn &&
                <div>
                    <h1>Signup</h1>
                    <form onSubmit={onSubmit}>
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" id="username-input" required value={formUser.username} onChange={(e) => setFormUser({ ...formUser, username: e.target.value })} />
                        <br /><br />

                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" id="email-input" required value={formUser.email_address} onChange={(e) => setFormUser({ ...formUser, email_address: e.target.value })} />
                        <br /><br />

                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password-input" required value={formUser.password} onChange={(e) => setFormUser({ ...formUser, password: e.target.value })} />
                        <br /><br />

                        <button type="submit">Signup</button>
                    </form>
                </div>
            }
        </>
    )
}