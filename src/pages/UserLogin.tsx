import React, { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import UserContext from '../contexts/UserContext.tsx'
import axiosInstance from "../utils/axiosInstance.tsx"
import { UserContextInterface } from "../types/types.tsx"
import { Box, ThemeProvider, FormControl, TextField, Divider, Paper, Typography } from "@mui/material"
import Button from '@mui/material/Button';
import theme from "../components/Theming.tsx"
import Logo from "../../Assets/images/Logo_Title.png"
import Display from "../../Assets/images/Teste.png"

import "../styles/userLogin.css"

console.log(Logo)

export default function UserLogin() {
    const [formUser, setFormUser] = useState({
        email_address: '',
        password: ''
    })
    const [error, setError] = useState(false)
    const [errorMSG, setErrorMSG] = useState("")
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const { getUser, logoutUser, loginUser } = useContext<UserContextInterface>(UserContext)
    const navigate = useNavigate()

    const onSubmit = () => {
        axiosInstance.post('/api/auth', formUser).then((response) => {
            loginUser(response.data.token, response.data.user)
            navigate('/')
        }).catch((error) => {
            setError(true)
            setErrorMSG("input inválido.")
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
            <ThemeProvider theme={theme}>
                <Box sx={{
                    alignItems:'center',
                    display: 'flex',
                    flexDirection: "column",
                    background: 'linear-gradient(to right bottom, #0e1129, #162b27)'
                }}>

                    {/* Logo e "Div" do Login */}

                    <img style={{maxWidth: "100%", width: "15rem", marginBottom: '5rem', marginTop: '3rem'}} src={Logo} alt="logo"/>
                    <Paper elevation={24} sx={{
                        borderRadius: '0.5rem',
                        bgcolor: 'primary.dark',
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'left',
                        marginBottom: '10rem',
                        width: '70rem',
                        height: '30rem'
                    }}>
                    <Paper elevation={12} sx= {{
                        width: '25rem',
                        height: '28rem',
                        marginTop: '1rem',
                        marginLeft: '1rem',
                        bgcolor: 'primary.main'
                    }}>

                    {/* Formulário */}

                    <FormControl sx={{
                        marginTop: '1rem',
                        marginLeft: '1rem',
                    }}> 
                        <Typography variant="h1">LOGIN</Typography>
                        <TextField
                            error={error}
                            helperText={errorMSG}
                            required value={formUser.email_address} onChange={(e) => setFormUser({ ...formUser, email_address: e.target.value })}
                            id="email-input"
                            label="Enter E-Mail:"
                            variant="standard"
                            size="small"
                            color="secondary"
                            sx={{width:350, marginTop: '2rem'}}
                        />
                        <TextField
                            error={error}
                            helperText={errorMSG}
                            required value={formUser.password} onChange={(e) => setFormUser({ ...formUser, password: e.target.value })}
                            id="password-input"
                            label="Enter Password:"
                            variant="standard"
                            type="password"
                            size="small"
                            color="secondary"
                            sx={{width:350, marginTop: '3rem',}}
                        />
                        <Button variant="contained" onClick={onSubmit} sx={{
                            width: '5rem',
                            bgcolor: 'secondary.dark',
                            marginTop: '2rem'
                            }}>Submit
                        </Button>
                    </FormControl>
                    </Paper>
                    <Paper elevation={12} sx= {{
                        width: '42rem',
                        height: '28rem',
                        marginTop: '1rem',
                        marginLeft: '1rem',
                        bgcolor: 'primary.dark',
                        }}>
                        <img style={{maxWidth: '100%', width: '100%', height: '100%', borderRadius: '0.3rem'}} src={Display} alt="Display"/> 
                    </Paper>
                    </Paper>
                </Box>

                {/* Footer da página */} 

                <Box sx={{
                    bgcolor: '#000',
                    width: '100%',
                    height: '5rem'
                }}>
                <Typography variant="h1">FOOTER PLACEHOLDER</Typography>
                </Box>

            </ThemeProvider>
            }
        </>
    )
}