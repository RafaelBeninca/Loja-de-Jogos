import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import { Box } from "@mui/material";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../styles/imageCarousel.css";
import GameForm from "../components/GameForm";
import { emptyOriginalGame } from "../utils/defaultValues";
import axiosInstance from "../utils/axiosInstance";
import { OriginalGame } from "../types/types";

export default function UpdateGame() {
  const [game, setGame] = useState<OriginalGame>(emptyOriginalGame);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { getUser, loginUser } = useContext(UserContext);
  const navigate = useNavigate();
  const params = useParams();

  const loginIfToken = () => {
    getUser().then(({ user, token }) => {
      if (token) {
        setIsLoggedIn(true);
        loginUser(token, user);
      } else {
        setIsLoggedIn(false);
        navigate("/logout");
      }
    });
  };

  const getGameWithTitle = () => {
    axiosInstance
      .get(`/api/games?game_title=${params.title}`)
      .then((response) => {
        console.log(response);
        setGame(response.data.game);
      })
      .catch((error) => {
        console.error(error);
        navigate("/error");
      });
  };

  useEffect(loginIfToken, []);
  useEffect(getGameWithTitle, [params.title]);
  
  return (
    <>
      {isLoggedIn && (
        <Box
          sx={{
            width: "70%",
            marginInline: "auto",
            display: "flex",
            flexDirection: "column",
            paddingBlock: 5,
          }}
        >
          <GameForm existingGame={game} key={game.id}/>
        </Box>
      )}
    </>
  )
}