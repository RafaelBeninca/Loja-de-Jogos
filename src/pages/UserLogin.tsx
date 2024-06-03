import React, { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import UserContext from '../contexts/UserContext.tsx'
import axiosInstance from "../utils/axiosInstance.tsx"
import { UserContextInterface } from "../types/types.tsx"

export default function UserLogin() {
    const [formUser, setFormUser] = useState({
        email_address: '',
        password: ''
    })
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const { getUser, logoutUser, loginUser } = useContext<UserContextInterface>(UserContext)
    const navigate = useNavigate()

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        axiosInstance.post('/api/auth', formUser).then((response) => {
            loginUser(response.data.token, response.data.user)
            navigate('/')
        }).catch((error) => {
            if (error.response.status === 401) {
                alert('Email e/ou senha incorretos! \n\nTente novamente.')
            }
            else {
                alert('Erro')
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
                    <h1>Login</h1>
                    <form onSubmit={onSubmit}>

                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" id="email-input" required value={formUser.email_address} onChange={(e) => setFormUser({ ...formUser, email_address: e.target.value })} />
                        <br /><br />

                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password-input" required value={formUser.password} onChange={(e) => setFormUser({ ...formUser, password: e.target.value })} />
                        <br /><br />

                        <button type="submit">Login</button>
                    </form>
                </div>
            }
        </>
    )
}