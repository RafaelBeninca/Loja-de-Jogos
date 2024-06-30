import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import axiosInstance from "../utils/axiosInstance";
import { OriginalGame, User } from "../types/types";
import IconButton from "@mui/material/IconButton";
import SettingsIcon from "@mui/icons-material/Settings";
import DefaultPFP from "../../Assets/images/DefaultPFP.jpg";
import {
  Box,
  Paper,
  Typography,
  Card,
  Backdrop,
  CircularProgress,
  Alert,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { handleNewImageUrl } from "../funcs/async/ImgFunctions";

export default function UserProfile() {
  const { user } = useContext(UserContext);
  const [profileUser, setProfileUser] = useState<User>();
  const [games, setGames] = useState<OriginalGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAlert, setShowAlert] = useState(false);

  const { username } = useParams();
  const { state } = useLocation();

  const isActiveUserProfile = user?.id === profileUser?.id;

  const getUserWithUsername = () => {
    if (!username) return;

    axiosInstance
      .get(`/api/users?username=${username}`)
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
        if (error.response.status === 400) {
          return;
        } else {
          console.error(error);
        }
      });
  };

  const handleImgError = async (game: OriginalGame, fieldName: string) => {
    await handleNewImageUrl(game, fieldName, setGames);
  };

  useEffect(getUserWithUsername, []);
  useEffect(fetchProfileUserBoughtGames, [isLoading]);
  useEffect(() => {
    if (state?.alert) {
      setShowAlert(true);
    }
  }, []);

  return (
    <>
      {!profileUser ? (
        <Typography fontWeight={"bold"}>Não achamos este usuário...</Typography>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Paper
            elevation={2}
            sx={{
              borderRadius: "0.5rem",
              alignItems: "left",
              marginBlock: "6rem",
              width: "85%",
              height: "30rem",
            }}
          >
            <Paper
              sx={{
                width: "69.7rem",
                height: "15rem",
                marginTop: "1rem",
                marginLeft: "1rem",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <Box
                component={"img"}
                sx={{
                  width: "10rem",
                  height: "10rem",
                  borderRadius: "50rem",
                  marginLeft: "3rem",
                  marginTop: "2rem",
                }}
                src={
                  profileUser.profile_picture
                    ? profileUser.profile_picture
                    : DefaultPFP
                }
                loading="lazy"
                alt=""
              />
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <>
                  <Box sx={{ display: "flex" }}>
                    <Typography
                      sx={{ marginTop: "3rem", marginLeft: "2rem" }}
                      variant="h1"
                    >
                      {profileUser.username}
                    </Typography>
                    {isActiveUserProfile && (
                      <IconButton
                        size="large"
                        aria-label="settings"
                        color="secondary"
                        href="/settings/profile"
                        sx={{
                          height: "2rem",
                          width: "2rem",
                          marginTop: "2rem",
                        }}
                      >
                        <SettingsIcon />
                      </IconButton>
                    )}
                  </Box>
                  <Typography
                    sx={{ marginTop: "0.1rem", marginLeft: "2rem" }}
                    variant="subtitle1"
                  >
                    {profileUser.email_address}
                  </Typography>
                  <Typography
                    sx={{
                      marginTop: "1.5rem",
                      marginLeft: "2rem",
                      maxWidth: "30rem",
                      textOverflow: "ellipsis",
                      display: "inline-block",
                      overflow: "hidden",
                    }}
                    variant="subtitle2"
                  >
                    {profileUser.summary}
                  </Typography>
                </>
              </Box>
            </Paper>
            <Typography
              sx={{ marginTop: "1rem", marginLeft: "1rem" }}
              variant="subtitle1"
            >
              Jogos comprados:
            </Typography>
            <Paper
              sx={{ height: "10rem", alignItems: "center", display: "flex" }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "1rem",
                  width: "97%",
                  marginLeft: "1rem",
                  overflow: "scroll",
                }}
              >
                {games?.map((game) => (
                  <Link key={game.id} to={`/game/${game.title}`}>
                    <Card
                      key={game.id}
                      sx={{
                        textDecoration: "none",
                        height: "8rem",
                        backgroundColor: "secondary.main",
                        marginTop: "2rem",
                      }}
                    >
                      <img
                        src={game.banner_image}
                        onError={() => handleImgError(game, "banner_image")}
                        loading="lazy"
                        alt=""
                        style={{ width: "10rem", aspectRatio: "16/9" }}
                      />
                      <br />
                      <Box
                        sx={{
                          backgroundColor: "secondary.dark",
                          textAlign: "center",
                          textDecoration: "none",
                        }}
                      >
                        <Typography
                          sx={{}}
                          color={"common.white"}
                          variant="subtitle2"
                        >
                          {game.title}
                        </Typography>
                      </Box>
                      <br />
                    </Card>
                    <br />
                  </Link>
                ))}
              </Box>
            </Paper>
          </Paper>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          {showAlert && (
            <Alert
              icon={<CheckIcon fontSize="inherit" />}
              severity="success"
              onClose={() => {
                setShowAlert(false);
                window.history.replaceState({}, "");
              }}
              sx={{
                position: "fixed",
                bottom: "3vh",
                left: "50%",
                transform: "translate(-50%)",
              }}
            >
              {state.alert}
            </Alert>
          )}
        </Box>
      )}
    </>
  );
}
