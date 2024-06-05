import React, { useContext, useEffect, useState } from "react"
import UserContext from "../contexts/UserContext"
import { useNavigate } from "react-router-dom"
import axiosInstance from "../utils/axiosInstance"
import { FormUser } from "../types/types"
import UserImageInput from "../components/UserImageInput"

export default function ProfileConfig() {
    const { user, getUser, loginUser } = useContext(UserContext)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [formUser, setFormUser] = useState<FormUser>({
        username: user.username,
        email_address: user.email_address,
        password: "",
        profile_picture: "",
        summary: user.summary
    })
    const navigate = useNavigate()

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

    useEffect(() => { loginIfToken() }, [])


    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        const formData = new FormData();

        if (formUser.username) formData.append('username', formUser.username)
        if (formUser.email_address) formData.append('email_address', formUser.email_address)
        if (formUser.password) formData.append('password', formUser.password)
        if (formUser.summary) formData.append('summary', formUser.summary)

        if (formUser.profile_picture && formUser.profile_picture instanceof File) {
            formData.append('profile_picture', formUser.profile_picture);
        }

        const config = {
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('token') || ""),
                'Content-type': "multipart/form-data"
            }
        }

        axiosInstance.patch('/api/users', formData, config).then(response => {
            console.log(response);
            loginUser(response.data.token, response.data.user)

            alert("Informações alteradas com sucesso!")
            navigate('/profile')
        }).catch(error => {
            console.error(error)
            if (error.response.status === 401) {
                navigate('/logout');
            }
            else {
                alert(`Erro. \n\nTente novamente.`);
            }
        })
    }
    
    return (
        <>
        {isLoggedIn &&
        <form onSubmit={onSubmit} encType="multipart/form-data">
            <UserImageInput name="Profile Picture" id="profile_picture" setUser={setFormUser} user={formUser} defaultImage={user.profile_picture} required={false} />
            <br /><br />

            <input type="text" placeholder="Nome de usuário" required value={formUser.username} onChange={e => setFormUser({...formUser, username: e.target.value})}/>
            <br /><br />
            
            <input type="text" placeholder="Email" required value={formUser.email_address} onChange={e => setFormUser({...formUser, email_address: e.target.value})}/>
            <br /><br />
            
            <input type="password" placeholder="Senha" value={formUser.password} onChange={e => setFormUser({...formUser, password: e.target.value})}/>
            <br /><br />

            <textarea placeholder="Sobre você" value={formUser.summary} onChange={e => setFormUser({...formUser, summary: e.target.value})}/>
            <br /><br />

            <button type="submit">Alterar informações</button>
        </form>
        }
        </>
    )
}