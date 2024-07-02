import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext.tsx";
import axiosInstance from "../utils/axiosInstance.tsx";
import { OriginalGame, UserContextInterface } from "../types/types.tsx";
import {
  Box,
  FormControl,
  TextField,
  // Divider,
  Paper,
  Typography,
  Backdrop,
  CircularProgress,
} from "@mui/material";
import Button from "@mui/material/Button";
// import Logo from "../../Assets/images/Logo_Title.png";

import "../styles/userLogin.css";
import { handleNewImageUrl } from "../funcs/async/ImgFunctions.tsx";

export default function UserLogin() {
  const [formUser, setFormUser] = useState({
    email_address: "",
    password: "",
  });
  const [games, setGames] = useState<OriginalGame[]>([]);
  const [error, setError] = useState(false);
  const [emailErrorMSG, setEmailErrorMSG] = useState("");
  const [passwordErrorMSG, setPasswordErrorMSG] = useState("");
  const [generalErrorMSG, setGeneralErrorMSG] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [displayGame, setDisplayGame] = useState<OriginalGame | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const { loginUser, user } = useContext<UserContextInterface>(UserContext);
  const navigate = useNavigate();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formUser.email_address || !formUser.password) {
      setGeneralErrorMSG("Todos os campos são obrigatórios!");
    }

    axiosInstance
      .post("/api/auth", formUser)
      .then((response) => {
        loginUser(response.data.token, response.data.user);
        setIsLoading(false);
        navigate("/");
      })
      .catch((error) => {
        setError(true);
        setIsLoading(false);
        if (error.response.status === 401) {
          if (error.response.data.cause === "email_address") {
            setEmailErrorMSG(
              "Não foi possível encontrar sua conta! Tente novamente"
            );
          } else if (error.response.data.cause === "password") {
            setPasswordErrorMSG("Senha incorreta! Tente novamente");
          }
        } else {
          alert("Erro");
        }

        console.error(error);
      });
  };

  const fetchGames = () => {
    axiosInstance
      .get("/api/games")
      .then((response) => {
        setGames(response.data.gameList);
        setIsLoading(false);
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleImgError = async (game: OriginalGame) => {
    await handleNewImageUrl(game, "banner_image", setGames);
  };

  useEffect(() => {
    if (!user) {
      setIsLoggedIn(false);
    } else if (user.id !== "0") {
      navigate("/");
    }
  }, [user?.id]);

  useEffect(fetchGames, []);
  useEffect(() => {
    if (isLoading) return;

    setDisplayGame(games[Math.floor(Math.random() * games.length)]);
  }, [isLoading]);

  return (
    <>
      {!isLoggedIn && (
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            marginTop: 6,
            minHeight: {xs: "80vh", md: "90vh"},
            // background: "linear-gradient(to right bottom, #0e1129, #162b27)",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              borderRadius: "0.5rem",
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              gap: 2,
              marginBlock: "6rem",
              width: { xs: "85%", sm: "50%", md: "80%" },
              padding: 2,
            }}
          >
            <Paper
              elevation={5}
              sx={{
                paddingInline: 2,
                paddingBlock: 4,
                width: { md: "40%" },
              }}
            >
              <Box component={"form"} onSubmit={onSubmit}>
                <FormControl
                  sx={{
                    width: "100%",
                  }}
                >
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
                    label="E-Mail"
                    variant="standard"
                    size="small"
                    type="email"
                    sx={{ width: "100%", maxWidth: 250, marginTop: "2rem" }}
                  />
                  <TextField
                    error={error}
                    helperText={passwordErrorMSG || generalErrorMSG}
                    value={formUser.password}
                    onChange={(e) =>
                      setFormUser({ ...formUser, password: e.target.value })
                    }
                    id="password-input"
                    label="Password"
                    variant="standard"
                    size="small"
                    type="password"
                    sx={{ width: "100%", maxWidth: 250, marginTop: "3rem" }}
                  />
                  {!formUser.email_address || !formUser.password ? (
                    <Button
                      variant="contained"
                      type="submit"
                      disabled
                      onClick={() => {
                        setEmailErrorMSG("");
                        setPasswordErrorMSG("");
                        setGeneralErrorMSG("");
                      }}
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
                      variant="contained"
                      type="submit"
                      onClick={() => {
                        setEmailErrorMSG("");
                        setPasswordErrorMSG("");
                        setGeneralErrorMSG("");
                      }}
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
                    Não possui uma conta?{" "}
                    <Link
                      to={"/signup"}
                      style={{
                        color: "#354097",
                      }}
                    >
                      Signup
                    </Link>
                  </Typography>
                </FormControl>
              </Box>
            </Paper>
            {displayGame?.banner_image ? (
              <Paper
                component={"div"}
                elevation={5}
                sx={{
                  display: { xs: "none", md: "block" },
                  width: "60%",
                  height: "26rem",
                  bgcolor: "primary.dark",
                  background: `url(${displayGame.banner_image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
                onError={() => handleImgError(displayGame)}
              />
            ) : (
              <Paper
                component={"div"}
                elevation={5}
                sx={{
                  width: "42rem",
                  height: "28rem",
                  marginTop: "1rem",
                  marginLeft: "1rem",
                  bgcolor: "primary.dark",
                }}
              />
            )}
          </Paper>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Box>
      )}
    </>
  );
}
