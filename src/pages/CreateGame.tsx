import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import { Box } from "@mui/material";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../styles/imageCarousel.css";
import GameForm from "../components/GameForm";
import { emptyOriginalGame } from "../utils/defaultValues";

export default function CreateGame() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { getUser, loginUser, logoutUser } = useContext(UserContext);
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

  useEffect(loginIfToken, []);

  return (
    <>
      {isLoggedIn && (
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
      )}
    </>
  );
}
