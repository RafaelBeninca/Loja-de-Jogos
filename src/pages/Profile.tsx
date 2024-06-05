import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import axiosInstance from "../utils/axiosInstance";

export default function Profile() {
    const { getUser, loginUser, user } = useContext(UserContext)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
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

    const onDeleteAccount = () => {
        if (confirm('Tem certeza que deseja deletar sua conta? (essa ação é irreversível)')) {
            // Continuar
        } else {
            // Cancelar
            return
        }

        const config = {
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('token') || "")
            }
        }

        axiosInstance.delete('/api/users', config).then(response => {
            console.log(response)

            alert("Conta deletada com sucesso!")
            navigate('/logout')
        }).catch(error => {
            console.error(error)

            if (error.response.status === 401) {
                navigate('/logout')
            }
            if (error.response.status === 403) {
                console.error("Usuário não tem permissão para deletar essa conta")
            }
            else {
                alert(`${error.response.data}. \n\nTente novamente.`)
            }
        })
    }

    
    return (
        <>
        {isLoggedIn &&
            <div>
                <img src={user.profile_picture} alt="" style={{width: "6rem"}} />
                <br />
                <p><b>Id: {user.id}</b></p>

                <p><b>Username: {user.username}</b></p>

                <p><b>Email: {user.email_address}</b></p>

                <p><b>Sobre: {user.summary}</b></p>

                <button onClick={() => navigate('config')}>Alterar Dados</button>

                <br /><br /><br />

                <button onClick={onDeleteAccount}>Deletar Conta</button>
            </div>
        }
        </>
    )
}