import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext.tsx";
import axiosInstance from "../utils/axiosInstance.tsx";
import { FormUser, UserContextInterface } from "../types/types.tsx";
import {
  Box,
  FormControl,
  TextField,
  // Divider,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import Button from "@mui/material/Button";

export default function Signup() {
  const [formUser, setFormUser] = useState<FormUser>({
    username: "",
    email_address: "",
    password: "",
    profile_picture: "",
    summary: "",
  });

  const [error, setError] = useState(false);
  const [usernameErrorMSG, setUsernameErrorMSG] = useState("");
  const [emailErrorMSG, setEmailErrorMSG] = useState("");
  const [passwordErrorMSG, setPasswordErrorMSG] = useState("");
  const [generalErrorMSG, setGeneralErrorMSG] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const { user } = useContext<UserContextInterface>(UserContext);
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formUser.email_address || !formUser.password) {
      setGeneralErrorMSG("Todos os campos são obrigatórios!");
    }

    axiosInstance
      .post("/api/users", formUser)
      .then((response) => {
        console.log(response);

        setShowDialog(true);
        setDialogText("Conta criada com sucesso.");
        navigate("/login");
      })
      .catch((error) => {
        setError(true);
        if (error.response.status === 401) {
          if (error.response.data.cause === "email_address") {
            setEmailErrorMSG(
              "Esse E-Mail não pode ser usado, por favor use outro E-Mail"
            );
          } else if (error.response.data.cause === "password") {
            setPasswordErrorMSG(
              "Essa senha não pode ser usada, por favor use outra senha,"
            );
          } else if (error.response.data.cause === "username") {
            setPasswordErrorMSG(
              "Esse nome não pode ser usado, por favor use outro nome"
            );
          }
        } else {
          setShowDialog(true);
          setDialogText("Erro.");
        }

        console.error(error);
      });
  };

  useEffect(() => {
    if (!user) {
      setIsLoggedIn(false);
    } else if (user.id !== "0") {
      navigate("/");
    }
  }, [user?.id]);

  return (
    <>
      {!isLoggedIn && (
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            marginTop: 6,
            minHeight: { xs: "80vh", md: "90vh" },
            // background: "linear-gradient(to right bottom, #0e1129, #162b27)",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              borderRadius: "0.5rem",
              display: "flex",
              flexDirection: "column",
              marginBlock: "6rem",
              width: "85%",
              maxWidth: 420,
              padding: 2,
            }}
          >
            <Paper
              elevation={4}
              sx={{
                paddingBlock: 2,
                paddingInline: 3,
              }}
            >
              <Box component={"form"} onSubmit={onSubmit}>
                <FormControl
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                  }}
                >
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
                    sx={{ width: "100%", marginTop: "2rem" }}
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
                    sx={{ width: "100%", marginTop: "3rem" }}
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
                    sx={{ width: "100%", marginTop: "3rem" }}
                  />
                  {!formUser.email_address ||
                  !formUser.password ||
                  !formUser.username ? (
                    <Button
                      onClick={() => {
                        setUsernameErrorMSG("");
                        setEmailErrorMSG("");
                        setPasswordErrorMSG("");
                        setGeneralErrorMSG("");
                      }}
                      variant="contained"
                      disabled
                      type="submit"
                      sx={{
                        width: "5rem",
                        // bgcolor: "secondary.dark",
                        marginTop: "2rem",
                      }}
                    >
                      Submit
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
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
                  )}
                  <Typography
                    variant="caption"
                    sx={{
                      marginBlock: 2,
                    }}
                  >
                    Já possui uma conta?{" "}
                    <Link
                      to={"/login"}
                      style={{
                        color: "#354097",
                      }}
                    >
                      Login
                    </Link>
                  </Typography>
                </FormControl>
              </Box>
            </Paper>
            <Box sx={{ textAlign: "center", marginTop: "1rem" }}>
              <Typography variant="subtitle1">
                Faça sua conta na Fusion Games Store.
              </Typography>
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
        </Box>
      )}
    </>
  );
}
