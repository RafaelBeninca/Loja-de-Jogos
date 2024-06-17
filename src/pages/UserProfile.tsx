import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import axiosInstance from "../utils/axiosInstance";
import { OriginalGame, User } from "../types/types";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from '@mui/icons-material/Settings';
import DefaultPFP from "../../Assets/images/DefaultPFP.jpg"
import {
  Box,
  // Divider,
  Paper,
  Typography,
  Card,
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
              <Paper
                sx={{
                  width: "69.7rem",
                  height: "15rem",
                  marginTop: "1rem",
                  marginLeft: "1rem",
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
                    src={profileUser.profile_picture ? profileUser.profile_picture : DefaultPFP}
                    alt=""
                  />
              <Box sx={{display: "flex", flexDirection: "column"}}>
                <> 
                  <Box sx={{display: "flex"}}>
                    <Typography sx={{marginTop: "3rem", marginLeft: "2rem"}} variant="h1">{profileUser.username}</Typography>
                    {isActiveUserProfile && (
                      <IconButton size="large" aria-label="settings" color="secondary" href="/settings/profile" sx={{height: "2rem", width: "2rem", marginTop: "2rem"}}>
                        <SettingsIcon />
                      </IconButton>
                    )}
                  </Box>
                  <Typography sx={{marginTop: "0.1rem", marginLeft: "2rem"}} variant="subtitle1">{profileUser.email_address}</Typography>
                  <Typography sx={{marginTop: "1.5rem", marginLeft: "2rem", maxWidth: "30rem", textOverflow: "ellipsis", display: "inline-block", overflow: "hidden"}} variant="subtitle2">{profileUser.summary}</Typography>
                </>
              </Box>
            </Paper>
              <Typography sx={{marginTop: "1rem", marginLeft: "1rem"}} variant="subtitle1">Jogos comprados:</Typography>
              <Paper sx={{ height: "10rem", alignItems: "center", display: "flex"}}>
                <Box sx={{ 
                  display: "flex",
                  flexDirection: "row",
                  gap: "1rem",
                  width: "97%",
                  marginLeft: "1rem",
                }}>
                {games?.map((game) => (
                  <Link key={game.id} to={`/game/${game.title}`}>
                    <Card key={game.id} sx={{textDecoration: "none", height: "7rem", backgroundColor: "primary.main"}}>
                      <img
                        src={game.banner_image}
                        alt=""
                        style={{ width: "6rem" }}
                      />
                      <br />

                      {game.title}
                      <br />
                    </Card>
                    <br />
                  </Link>
                ))}
                </Box>
              </Paper>
            </Paper>
            </Box>
          )}
        </>
      )}
    </>
  );
}
