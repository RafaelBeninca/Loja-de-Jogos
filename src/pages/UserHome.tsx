import { useContext, useEffect, useState } from "react";
import { OriginalGame } from "../types/types.tsx";
import GameCarousel from "../components/GameCarousel.tsx";
import axiosInstance from "../utils/axiosInstance.tsx";
import UserContext from "../contexts/UserContext.tsx";
import { Box, Card, Rating, Typography } from "@mui/material";
// import { Carousel } from "react-responsive-carousel";
import "../styles/imageCarousel.css";
import { Link } from "react-router-dom";

export default function UserHome() {
  const [games, setGames] = useState<OriginalGame[]>([]);
  const [mainGame, setMainGame] = useState<OriginalGame | null>(null);
  const [loading, setLoading] = useState(true);
  // const [carouselImages, setCarouselImages] = useState<string[]>([]);
  const { getUser, logoutUser, loginUser } = useContext(UserContext);

  const loginIfToken = () => {
    getUser().then(({ user, token }) => {
      if (token) {
        loginUser(token, user);
      } else {
        logoutUser();
      }
    });
  };

  function fetchGames() {
    axiosInstance
      .get("/api/games")
      .then((response) => {
        setGames(response.data.gameList);
        setLoading(false);
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleCarouselImages = () => {
    const list: string[] = [];
    for (const key in mainGame) {
      const value = mainGame[key as keyof OriginalGame];
      if (
        key.includes("preview") &&
        typeof value === "string" &&
        value !== ""
      ) {
        list.push(value);
      }
    }

    // setCarouselImages(list);
  };

  useEffect(fetchGames, []);
  useEffect(() => {
    loginIfToken();
  }, []);
  useEffect(
    () => setMainGame(games[Math.floor(Math.random() * games.length)]),
    [games]
  );
  useEffect(handleCarouselImages, [mainGame]);

  return (
    <Box
      sx={{
        width: "70%",
        marginInline: "auto",
        display: "flex",
        flexDirection: "column",
        paddingBlock: 5,
        marginTop: 10,
      }}
    >
      {loading ? (
        <Typography sx={{ fontWeight: "bold" }}>Carregando...</Typography>
      ) : (
        <Box>
          <Typography
            variant="h1"
            sx={{
              marginBottom: 2,
            }}
          >
            Jogos
          </Typography>
          <Link
            to={`/game/${mainGame?.title}`}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
            // onClick={handleLinkClick}
          >
            <Card
              sx={{
                display: "flex",
                gap: 3,
                padding: 3,
                marginBottom: 5,
              }}
              elevation={4}
            >
              <Box
                sx={{
                  width: "70%",
                }}
              >
                {/* <Carousel
                    swipeable={true}
                    useKeyboardArrows={true}
                    showStatus={false}
                    thumbWidth={80}
                    infiniteLoop={true}
                    showThumbs={false}
                  >
                    {carouselImages.map((imgSrc) => {
                      return (
                        <div>
                          <img
                            src={imgSrc}
                            alt=""
                            draggable="false"
                            style={{ aspectRatio: 16 / 9 }}
                          />
                        </div>
                      );
                    })}
                  </Carousel> */}
                <Box
                  component={"img"}
                  src={mainGame?.banner_image}
                  sx={{
                    width: "100%",
                    aspectRatio: 16 / 9,
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="h2">{mainGame?.title}</Typography>
                  <Rating value={4.5} readOnly precision={0.1} size="small" />
                  <Typography>{mainGame?.summary}</Typography>
                </Box>
                <Typography variant="h2" component={"p"}>
                  R${mainGame?.price}
                </Typography>
              </Box>
            </Card>
          </Link>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            <GameCarousel games={games} title="RPG" />
            <GameCarousel games={games} title="FPS" />
            <GameCarousel games={games} title="Corrida" />
          </Box>
        </Box>
      )}
    </Box>
  );
}
