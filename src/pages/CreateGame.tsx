import { Box } from "@mui/material";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../styles/imageCarousel.css";
import GameForm from "../components/GameForm";
import { emptyOriginalGame } from "../utils/defaultValues";

export default function CreateGame() {
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
      <GameForm existingGame={emptyOriginalGame} />
    </Box>
  );
}
