import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext.tsx";
import axiosInstance from "../utils/axiosInstance.tsx";
import { UserContextInterface } from "../types/types.tsx";
import {
  Box,
  ThemeProvider,
  FormControl,
  TextField,
  // Divider,
  Paper,
  Typography,
} from "@mui/material";
import Button from "@mui/material/Button";
import theme from "../components/Theming.tsx";
import Logo from "../../Assets/images/Logo_Title.png";
import Display from "../../Assets/images/Teste.png";

import "../styles/userLogin.css";

export default function UserLogin() {
  const [formUser, setFormUser] = useState({
    email_address: "",
    password: "",
  });
  const [error, setError] = useState(false);
  const [emailErrorMSG, setEmailErrorMSG] = useState("");
  const [passwordErrorMSG, setPasswordErrorMSG] = useState("");
  const [generalErrorMSG, setGeneralErrorMSG] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { getUser, logoutUser, loginUser } =
    useContext<UserContextInterface>(UserContext);
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!formUser.email_address || !formUser.password) {
      setGeneralErrorMSG("Todos os campos são obrigatórios!")
    }

    axiosInstance
      .post("/api/auth", formUser)
      .then((response) => {
        loginUser(response.data.token, response.data.user);
        navigate("/");
      })
      .catch((error) => {
        setError(true);
        if (error.response.status === 401) {
          if (error.response.data.cause === "email_address") {
            setEmailErrorMSG("Não foi possível encontrar sua conta! Tente novamente");
          }
          else if (error.response.data.cause === "password") {
            setPasswordErrorMSG("Senha incorreta! Tente novamente");
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
        setIsLoggedIn(true);
        loginUser(token, user);
        navigate("/");
      } else {
        setIsLoggedIn(false);
        logoutUser();
      }
    });
  };

  useEffect(() => {
    loginIfToken();
  }, []);

  return (
    <>
      {!isLoggedIn && (
        <ThemeProvider theme={theme}>
          <Box
            sx={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              background: "linear-gradient(to right bottom, #0e1129, #162b27)",
            }}
          >
            {/* Logo e "Div" do Login */}

            <Box
              component={"img"}
              sx={{
                maxWidth: "100%",
                width: "15rem",
                marginBottom: "5rem",
                marginTop: "3rem",
              }}
              src={Logo}
              alt="logo"
            />
            <Paper
              elevation={24}
              sx={{
                borderRadius: "0.5rem",
                bgcolor: "primary.dark",
                display: "flex",
                flexDirection: "row",
                alignItems: "left",
                marginBottom: "10rem",
                width: "70rem",
                height: "30rem",
              }}
            >
              <Paper
                elevation={12}
                sx={{
                  width: "25rem",
                  height: "28rem",
                  marginTop: "1rem",
                  marginLeft: "1rem",
                  bgcolor: "primary.main",
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
                    <Typography variant="h1">LOGIN</Typography>
                    <TextField
                      error={error}
                      helperText={emailErrorMSG}
                      value={formUser.email_address}
                      onChange={(e) =>
                        setFormUser({
                          ...formUser,
                          email_address: e.target.value,
                        })
                      }
                      id="email-input"
                      label="E-Mail:"
                      variant="standard"
                      size="small"
                      type="email"
                      InputLabelProps={{
                        style: {
                          color: "#fff",
                        },
                      }}
                      sx={{ width: 350, marginTop: "2rem" }}
                    />
                    <TextField
                      error={error}
                      helperText={passwordErrorMSG || generalErrorMSG}
                      value={formUser.password}
                      onChange={(e) =>
                        setFormUser({ ...formUser, password: e.target.value })
                      }
                      id="password-input"
                      label="Password:"
                      variant="standard"
                      size="small"
                      type="password"
                      InputLabelProps={{
                        style: {
                          color: "#fff",
                        },
                      }}
                      sx={{ width: 350, marginTop: "3rem" }}
                    />
                    <Button
                      variant="contained"
                      type="submit"
                      onClick={() => {setEmailErrorMSG(""); setPasswordErrorMSG(""); setGeneralErrorMSG("")}}
                      sx={{
                        width: "5rem",
                        bgcolor: "secondary.dark",
                        marginTop: "2rem",
                      }}
                    >
                      Submit
                    </Button>
                  </FormControl>
                </Box>
              </Paper>
              <Paper
                elevation={12}
                sx={{
                  width: "42rem",
                  height: "28rem",
                  marginTop: "1rem",
                  marginLeft: "1rem",
                  bgcolor: "primary.dark",
                }}
              >
                <Box
                  component={"img"}
                  sx={{
                    maxWidth: "100%",
                    width: "100%",
                    height: "100%",
                    borderRadius: "0.3rem",
                  }}
                  src={Display}
                  alt="Display"
                />
              </Paper>
            </Paper>
          </Box>

          {/* Footer da página */}

          <Box
            sx={{
              bgcolor: "#000",
              width: "100%",
              height: "5rem",
            }}
          >
            <Typography variant="h1">FOOTER PLACEHOLDER</Typography>
          </Box>
        </ThemeProvider>
      )}
    </>
  );
}
