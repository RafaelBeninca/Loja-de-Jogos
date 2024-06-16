import React, { useState, useContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import UserContext from '../contexts/UserContext.tsx'
import axiosInstance from "../utils/axiosInstance.tsx"
import { FormUser, UserContextInterface } from "../types/types.tsx"
import {
    Box,
    FormControl,
    TextField,
    // Divider,
    Paper,
    Typography,
  } from "@mui/material";
  import Button from "@mui/material/Button";

export default function Signup() {
    const [formUser, setFormUser] = useState<FormUser>({
        username: '',
        email_address: '',
        password: '',
        profile_picture: '',
        summary: ''
    })

    const [error, setError] = useState(false);
    const [usernameErrorMSG, setUsernameErrorMSG] = useState("");
    const [emailErrorMSG, setEmailErrorMSG] = useState("");
    const [passwordErrorMSG, setPasswordErrorMSG] = useState("");
    const [generalErrorMSG, setGeneralErrorMSG] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const { getUser, logoutUser, loginUser } = useContext<UserContextInterface>(UserContext)
    const navigate = useNavigate()

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!formUser.email_address || !formUser.password) {
            setGeneralErrorMSG("Todos os campos são obrigatórios!");
        }

        axiosInstance.post('/api/users', formUser).then((response) => {
            console.log(response)

            alert('Conta criada com sucesso!')
            navigate('/login')
        })
        .catch((error) => {
            setError(true);
            if (error.response.status === 401) {
              if (error.response.data.cause === "email_address") {
                setEmailErrorMSG(
                  "Esse E-Mail não pode ser usado, por favor use outro E-Mail"
                );
              } else if (error.response.data.cause === "password") {
                setPasswordErrorMSG("Essa senha não pode ser usada, por favor use outra senha,");
              } else if (error.response.data.cause === "username") {
                setPasswordErrorMSG("Esse nome não pode ser usado, por favor use outro nome");
              }
            } else {
              alert("Erro");
            }
    
            console.error(error);
          });
      };

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
        <Box>
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            // background: "linear-gradient(to right bottom, #0e1129, #162b27)",
          }}
        >
        <Paper
        elevation={2}
        sx={{
            borderRadius: "0.5rem",
            // bgcolor: "primary.dark",
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
            marginBlock: "6rem",
            width: "27rem",
            height: "34rem",
        }}
        >
        <Paper
            elevation={5}
            sx={{
            width: "25rem",
            height: "28rem",
            marginTop: "1rem",
            marginLeft: "1rem",
            // bgcolor: "primary.main",
            }}
        >
            {/* Formulário */}

        <Box
        component={"form"}
        sx={{
            marginTop: "1rem",
            marginLeft: "1rem",
        }}
        onSubmit={onSubmit}
        >
        <FormControl>
            <Typography variant="h1">SIGN UP</Typography>
            <TextField
            value={formUser.username}
            onChange={(e) =>
                setFormUser({
                ...formUser,
                username: e.target.value,
                })
            }
            error={error}
            helperText={usernameErrorMSG}
            id="username-input"
            label="Username"
            variant="standard"
            size="small"
            sx={{ width: 350, marginTop: "3rem" }}
            />
            <TextField
            value={formUser.email_address}
            onChange={(e) =>
                setFormUser({
                ...formUser,
                email_address: e.target.value,
                })
            }
            error={error}
            helperText={emailErrorMSG}
            id="email-input"
            label="E-Mail"
            variant="standard"
            size="small"
            type="email"
            sx={{ width: 350, marginTop: "3rem" }}
            />
            <TextField
            value={formUser.password}
            onChange={(e) =>
                setFormUser({ ...formUser, password: e.target.value })
            }
            error={error}
            helperText={passwordErrorMSG || generalErrorMSG}
            id="password-input"
            label="Password"
            variant="standard"
            size="small"
            type="password"
            sx={{ width: 350, marginTop: "3rem" }}
            />
            <Button onClick={() => {
                setUsernameErrorMSG("");
                setEmailErrorMSG("");
                setPasswordErrorMSG("");
                setGeneralErrorMSG("");
            }}
            variant="contained"
            type="submit"
            sx={{
                width: "5rem",
                // bgcolor: "secondary.dark",
                marginTop: "2rem",
            }}
            >
            Submit
            </Button>
        </FormControl>
        </Box>
        </Paper>
        <Box sx = {{textAlign: "center", marginTop: "1rem"}}>
            <Typography variant="subtitle1">Faça sua conta na Fusion Games Store.</Typography>
        </Box>
        </Paper>
        </Box>
      </Box>
            }
        </>
    )
}