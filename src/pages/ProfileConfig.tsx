import React, { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { FormUser } from "../types/types";
import UserImageInput from "../components/UserImageInput";
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  Button
} from "@mui/material";

export default function ProfileConfig() {
  const { user, getUser, loginUser, logoutUser } = useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formUser, setFormUser] = useState<FormUser>({
    username: "",
    email_address: "",
    password: "",
    profile_picture: "",
    summary: "",
  });
  const navigate = useNavigate();

  const loginIfToken = () => {
    getUser().then(({ user, token }) => {
      if (token) {
        setIsLoggedIn(true);
        loginUser(token, user);
      } else {
        logoutUser()
        navigate("/");
      }
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    if (formUser.username) formData.append("username", formUser.username);
    if (formUser.email_address)
      formData.append("email_address", formUser.email_address);
    if (formUser.password) formData.append("password", formUser.password);
    if (formUser.summary) formData.append("summary", formUser.summary);

    if (formUser.profile_picture && formUser.profile_picture instanceof File) {
      formData.append("profile_picture", formUser.profile_picture);
    }

    const config = {
      headers: {
        Authorization: "Bearer " + (localStorage.getItem("token") || ""),
        "Content-type": "multipart/form-data",
      },
    };

    axiosInstance
      .patch("/api/users", formData, config)
      .then((response) => {
        console.log(response);
        loginUser(response.data.token, response.data.user);

        alert("Informações alteradas com sucesso!");
        navigate(`/user/${user.username}`);
      })
      .catch((error) => {
        console.error(error);
        if (error.response.status === 401) {
          logoutUser()
          navigate("/");
        } else {
          alert(`Erro. \n\nTente novamente.`);
        }
      });
  };

  const onDeleteAccount = () => {
    if (
      confirm(
        "Tem certeza que deseja excluir sua conta? (essa ação é irreversível)"
      )
    ) {
      // Continuar
    } else {
      // Cancelar
      return;
    }

    const config = {
      headers: {
        Authorization: "Bearer " + (localStorage.getItem("token") || ""),
      },
    };

    axiosInstance
      .delete("/api/users", config)
      .then((response) => {
        console.log(response);

        alert("Conta deletada com sucesso!");
        logoutUser()
        navigate("/");
      })
      .catch((error) => {
        console.error(error);

        if (error.response.status === 401) {
          logoutUser()
          navigate("/");
        }
        if (error.response.status === 403) {
          console.error("Usuário não tem permissão para excluir essa conta");
        } else {
          alert(`${error.response.data}. \n\nTente novamente.`);
        }
      });
  };

  useEffect(loginIfToken, []);
  useEffect(
    () =>
      setFormUser({
        username: user.username,
        email_address: user.email_address,
        password: "",
        profile_picture: "",
        summary: user.summary,
      }),
    [isLoggedIn]
  );

  return (
    <>
      {isLoggedIn && (
       <Box sx={{marginTop: "10rem", display: "flex", justifyContent: "center"}}>
       <Paper elevation={2} sx={{width: "40%", height: "40rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
       <Typography variant="h1">OPÇÕES DO USUÁRIO</Typography>
       <Box
          component={"form"}
          sx={{
            marginTop: "1rem",
            marginLeft: "1rem",
          }}
          onSubmit={onSubmit}
        >
         <FormControl sx={{width: "50%"}}>
          <Box sx={{width: "5rem", height: "5rem", backgroundColor: "primary"}}>
            <UserImageInput
              name="Profile Picture"
              id="profile_picture"
              setUser={setFormUser}
              user={formUser}
              defaultImage={user.profile_picture}
              required={false}
            />
          </Box>
           <br />
           <br />
           <TextField
             value={formUser.username}
             type="text"
             required
             onChange={(e) =>
               setFormUser({
                 ...formUser,
                 username: e.target.value,
               })
             }
             label="Novo Nome:"
             variant="standard"
             size="small"
             sx={{ width: 350, marginTop: "2rem" }}
           />
           <TextField
             value={formUser.email_address}
             type="text"
             required
             onChange={(e) =>
               setFormUser({
                 ...formUser,
                 email_address: e.target.value,
               })
             }
             id="email-input"
             label="Novo E-Mail:"
             variant="standard"
             size="small"
             sx={{ width: 350, marginTop: "2rem" }}
           />
           <TextField
             value={formUser.password}
             type="password"
             required
             onChange={(e) =>
               setFormUser({
                 ...formUser,
                 password: e.target.value,
               })
             }
             id="password-input"
             label="Nova Senha:"
             variant="standard"
             size="small"
             sx={{ width: 350, marginTop: "2rem" }}
           />  

          <TextField 
            variant="outlined"
            color="secondary"
            fullWidth
            value={formUser.summary}
            onChange={(e) =>
              setFormUser({ ...formUser, summary: e.target.value })
            }
            label="Sobre Você"
            sx={{width: "22rem", marginTop: "3rem"}}>
           </TextField>
              <Box sx={{display: "flex", flexDirection: "row", width: "22rem", justifyContent: "center", gap: "2rem", marginTop: "2rem"}}>
                <Button variant="contained" type="submit">Alterar informações</Button>
                <Button variant="contained" type="button" onClick={onDeleteAccount}> Excluir Conta </Button>
              </Box>
              </FormControl>
              </Box>
          </Paper>
        </Box>
      )}
    </>
  );
}
