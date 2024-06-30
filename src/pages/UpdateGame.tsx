import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../styles/imageCarousel.css";
import GameForm from "../components/GameForm";
import { emptyOriginalGame } from "../utils/defaultValues";
import axiosInstance from "../utils/axiosInstance";
import { OriginalGame } from "../types/types";

export default function UpdateGame() {
  const [game, setGame] = useState<OriginalGame>(emptyOriginalGame);
  const navigate = useNavigate();
  const { title } = useParams();

  const getGameWithTitle = () => {
    axiosInstance
      .get(`/api/games?game_title=${title}`)
      .then((response) => {
        console.log(response);
        setGame(response.data.game);
      })
      .catch((error) => {
        console.error(error);
        navigate("/error");
      });
  };

  useEffect(getGameWithTitle, [title]);

  return (
    <Box
      sx={{
        width: "70%",
        marginInline: "auto",
        display: "flex",
        flexDirection: "column",
        marginBlock: 5,
        marginTop: 12,
      }}
    >
      <GameForm existingGame={game} key={game.id} />
    </Box>
  );
}
