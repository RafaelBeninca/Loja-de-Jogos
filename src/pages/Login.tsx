import React, { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import UserContext from '../contexts/UserContext.tsx'
import axios from "axios"
import { UserContextInterface } from "../types/types.tsx"

export default function Login() {
    const [formUser, setFormUser] = useState({
        email_address: '',
        password: ''
    })
    const [submitMessage, setSubmitMessage] = useState("")
    const { setUser } = useContext<UserContextInterface>(UserContext)
    const navigate = useNavigate()

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!formUser.email_address || !formUser.password) {
            setSubmitMessage("Todos os campos devem ser preenchidos")
        }

        axios.post('http://localhost:5000/auth', formUser).then((response) => {
            localStorage.setItem('token', response.data.token)
            setUser(response.data.user)
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

    const hasValidToken = () => {
        const token = localStorage.getItem('token') || ''
        
        if (token === "") {
            return false
        }

        const data = {}

        const config = {
            headers: {
                Authorization: "Bearer " + token
            }
        }

        axios.post('http://localhost:5000/check_token', data, config).then((response) => {
            setUser(response.data.user)

            navigate('/')
        }).catch((error) => {
            console.error(error)
            return false
        })
    }

    return (
        <>
            {!hasValidToken() &&
                <div>
                    <h1>Login</h1>
                    <form onSubmit={onSubmit}>

                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" id="email-input" value={formUser.email_address} onChange={(e) => setFormUser({ ...formUser, email_address: e.target.value })} />
                        <br /><br />

                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password-input" value={formUser.password} onChange={(e) => setFormUser({ ...formUser, password: e.target.value })} />
                        <br /><br />

                        <button type="submit">Login</button>

                        <p>{submitMessage}</p>
                    </form>
                </div>
            }
        </>
    )
}