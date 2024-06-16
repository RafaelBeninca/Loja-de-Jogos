import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import axiosInstance from "../utils/axiosInstance";
import { OriginalGame, User } from "../types/types";
import {
  Box,
  FormControl,
  TextField,
  // Divider,
  Paper,
  Typography,
} from "@mui/material";

export default function UserProfile() {
  const { getUser, loginUser, user, logoutUser } = useContext(UserContext);
  const [profileUser, setProfileUser] = useState<User>();
  const [games, setGames] = useState<OriginalGame[]>();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const params = useParams();

  const isActiveUserProfile = user.id === profileUser?.id;

  const loginIfToken = () => {
    getUser().then(({ user, token }) => {
      if (token) {
        loginUser(token, user);
      } else {
        logoutUser();
      }
    });
  };

  const getUserWithUsername = () => {
    axiosInstance
      .get(`/api/users?username=${params.username}`)
      .then((response) => {
        console.log(response);
        setProfileUser(response.data.user);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  };

  const fetchProfileUserBoughtGames = () => {
    if (!profileUser) return;

    axiosInstance
      .get(`/api/bought_games?user_id=${profileUser.id}`)
      .then((response) => {
        console.log(response);
        setGames(response.data.games);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(loginIfToken, []);
  useEffect(getUserWithUsername, []);
  useEffect(fetchProfileUserBoughtGames, [isLoading]);

  return (
    <>
      {isLoading ? (
        <Typography sx={{ fontWeight: "bold" }}>Carregando...</Typography>
      ) : (
        <>
          {!profileUser ? (
            <p>
              <b>Não achamos este usuário...</b>
            </p>
          ) : (
            <Box 
              sx={{
                display: "flex",
                justifyContent: "center",
              }}>
            <Paper
              elevation={2}
              sx={{
                borderRadius: "0.5rem",
                alignItems: "left",
                marginBlock: "6rem",
                width: "85%",
                height: "30rem",
              }}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                }}>
                <Box
                    component={"img"}
                    sx={{
                      width: "10rem",
                      height: "10rem",
                      borderRadius: "50rem",
                      marginLeft: "3rem",
                      marginTop: "2rem"
                    }}
                    src={profileUser.profile_picture}
                    alt=""
                  />
              <Box sx={{display: "flex", flexDirection: "column"}}>
                <Typography sx={{marginTop: "3rem", marginLeft: "2rem"}} variant="h1">{profileUser.username}</Typography>
                <Typography sx={{marginTop: "2rem", marginLeft: "2rem"}} variant="subtitle1">{profileUser.summary}</Typography>
                </Box>
              </Box>
              <br />
              {isActiveUserProfile && (
                <p>
                  <b>Email: {profileUser.email_address}</b>
                </p>
              )}
              {isActiveUserProfile && (
                <button
                  onClick={() =>
                    navigate("/settings/profile", { relative: "route" })
                  }
                >
                  Settings
                </button>
              )}
              <br />
              <br />
              <br />
              Jogos comprados:
              <div>
                {games?.map((game) => (
                  <Link key={game.id} to={`/game/${game.title}`}>
                    <div key={game.id}>
                      <img
                        src={game.banner_image}
                        alt=""
                        style={{ width: "6rem" }}
                      />
                      <br />

                      {game.title}
                      <br />
                    </div>
                    <br />
                  </Link>
                ))}
              </div>
            </Paper>
            </Box>
          )}
        </>
      )}
    </>
  );
}
