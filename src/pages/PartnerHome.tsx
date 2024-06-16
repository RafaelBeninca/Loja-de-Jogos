import { useContext, useEffect, useState } from "react";
import { OriginalGame } from "../types/types.tsx";
import PartnerHomeGameList from "../components/PartnerHomeGameList.tsx";
import axiosInstance from "../utils/axiosInstance.tsx";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext.tsx";
import { Box, Typography } from "@mui/material";

export default function PartnerHome() {
  const [games, setGames] = useState<OriginalGame[]>([]);
  const { getUser, loginUser, user } = useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  function fetchPartnerGames() {
    if (!isLoggedIn) return;

    const token = localStorage.getItem("token");
    const config = {
      headers: {
        Authorization: "Bearer " + token,
      },
    };

    axiosInstance
      .get(`/api/games?creator_id=${user.id}`, config)
      .then((response) => {
        setGames(response.data.gameList);
        setLoading(false);
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
        if (error.response.status === 401) {
          navigate("/partner/login", { relative: "route" });
        }
      });
  }

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

  useEffect(() => {
    loginIfToken();
  }, []);
  useEffect(fetchPartnerGames, [isLoggedIn]);

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
          {games.length === 0 && loading ? (
            <Typography sx={{ fontWeight: "bold" }}>Carregando...</Typography>
          ) : (
            <>
              <Typography variant="h1" sx={{
                marginBottom: 2
              }}>Meus Jogos</Typography>
              <PartnerHomeGameList
                games={games}
                updateCallback={fetchPartnerGames}
              />
            </>
          )}
        </Box>
      )}
    </>
  );
}
