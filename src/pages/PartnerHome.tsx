import { useContext, useEffect, useState } from "react";
import { OriginalGame } from "../types/types.tsx";
import PartnerHomeGameList from "../components/PartnerHomeGameList.tsx";
import axiosInstance from "../utils/axiosInstance.tsx";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext.tsx";
import { Box, Button, Typography } from "@mui/material";

export default function PartnerHome() {
  const [games, setGames] = useState<OriginalGame[]>([]);
  const { getUser, loginUser, user } = useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  function fetchPartnerGames() {
    if (!isLoggedIn || !user.id) return;

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
            paddingBlock: 5,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              marginBottom: 2,
            }}
          >
            Meus Jogos
          </Typography>
          {games.length === 0 ? (
            <>
              {loading ? (
                <Typography sx={{ fontWeight: "bold" }}>
                  Carregando...
                </Typography>
              ) : (
                <>
                  <Typography sx={{ fontWeight: "bold" }}>
                    Parece que você ainda não criou nenhum jogo...
                  </Typography>
                </>
              )}{" "}
            </>
          ) : (
            <PartnerHomeGameList
              games={games}
              setGames={setGames}
              updateCallback={fetchPartnerGames}
            />
          )}
          <Button
            href="/partner/new-game"
            variant="contained"
            size="large"
            sx={{
              paddingInline: 2,
              marginBlock: 5,
            }}
          >
            Criar
          </Button>
        </Box>
      )}
    </>
  );
}
