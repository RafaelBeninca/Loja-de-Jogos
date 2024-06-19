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
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const navigate = useNavigate();

  const loginIfToken = () => {
    getUser().then(({ user, token }) => {
      if (token) {
        setIsLoggedIn(true);
        loginUser(token, user);
      } else {
        logoutUser();
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

        navigate(`/user/${user.username}`, {
          state: { alert: "Informações alteradas com sucesso." },
        });
      })
      .catch((error) => {
        console.error(error);
        if (error.response.status === 401) {
          logoutUser();
          navigate("/");
        } else {
          setShowDialog(true);
          setDialogText("Erro.");
        }
      });
  };

  const onDeleteAccount = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + (localStorage.getItem("token") || ""),
      },
    };

    axiosInstance
      .delete("/api/users", config)
      .then((response) => {
        console.log(response);

        logoutUser();
        navigate("/", { state: { alert: "Conta deletada com sucesso." } });
      })
      .catch((error) => {
        console.error(error);

        if (error.response.status === 401) {
          logoutUser();
          navigate("/");
        }
        if (error.response.status === 403) {
          console.error("Usuário não tem permissão para excluir essa conta");
        } else {
          setShowDialog(true);
          setDialogText("Erro.");
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
        <Box
          sx={{ marginTop: "10rem", display: "flex", justifyContent: "center" }}
        >
          <Paper
            elevation={2}
            sx={{
              width: "40%",
              height: "45rem",
              display: "flex",
              marginBottom: 5,
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h1">OPÇÕES DO USUÁRIO</Typography>
            <Box
              component={"form"}
              sx={{
                display: "flex",
                flexDirection: "column",
                marginTop: "1rem",
                alignItems: "center",
              }}
              onSubmit={onSubmit}
            >
              <Box
                sx={{
                  width: "fit-content",
                }}
              >
                <UserImageInput
                  label="Imagem de Perfil"
                  name="profile_picture"
                  setUser={setFormUser}
                  user={formUser}
                  defaultImage={user.profile_picture}
                  required={false}
                />
              </Box>
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
                sx={{ width: 350, marginTop: "1rem" }}
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
                sx={{ width: "22rem", marginTop: "3rem" }}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "22rem",
                  justifyContent: "center",
                  gap: "2rem",
                  marginTop: "2rem",
                }}
              >
                <Button variant="contained" type="submit">
                  Alterar informações
                </Button>
                <Button
                  variant="outlined"
                  type="button"
                  color="error"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  {" "}
                  Excluir Conta{" "}
                </Button>
              </Box>
            </Box>
          </Paper>
          <Dialog
            open={showDialog}
            onClose={() => setShowDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{dialogText}</DialogTitle>
            <DialogActions>
              <Button onClick={() => setShowDialog(false)}>Ok</Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={showDeleteDialog}
            onClose={() => setShowDeleteDialog(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-delete-dialog-title">
              Tem certeza que deseja deletar sua conta?
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                Todos os seus dados serão deletados (essa ação é irreversível)
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setShowDeleteDialog(false)}>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  setShowDeleteDialog(false);
                  onDeleteAccount();
                }}
              >
                Continuar
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </>
  );
}
