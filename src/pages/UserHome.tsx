import { useContext, useEffect, useState } from "react";
import {
  CartItem,
  GameGenre,
  Genre,
  OriginalGame,
  WishlistItem,
} from "../types/types.tsx";
import GameCarousel from "../components/GameCarousel.tsx";
import axiosInstance from "../utils/axiosInstance.tsx";
import UserContext from "../contexts/UserContext.tsx";
import { Box, Card, Chip, Paper, Rating, Typography } from "@mui/material";
import "../styles/imageCarousel.css";
import { Link } from "react-router-dom";
import { getCartItems } from "../funcs/async/CartFunctions.tsx";
import { getWishlistItems } from "../funcs/async/WishlistFunctions.tsx";

export default function UserHome() {
  const [games, setGames] = useState<OriginalGame[]>([]);
  const [mainGame, setMainGame] = useState<OriginalGame | null>(null);
  const [gameGenres, setGameGenres] = useState<GameGenre[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const { getUser, logoutUser, loginUser, user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  const loginIfToken = () => {
    getUser().then(({ user, token }) => {
      if (token) {
        loginUser(token, user);
      } else {
        logoutUser();
      }
    });
  };

  const getGenres = () => {
    axiosInstance
      .get(`/api/genres`)
      .then((response) => {
        console.log(response);
        setGenres(response.data.genres);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getGameGenres = () => {
    axiosInstance
      .get(`/api/genres?with_games=true`)
      .then((response) => {
        console.log(response);
        setGameGenres(response.data.game_genres);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchGames = () => {
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
  };

  const handleMainImgError = (
    game: OriginalGame,
    fieldName: string
  ) => {
    console.log("img error")
    if (!mainGame) return;

    axiosInstance
      .get(`/api/games?game_title=${game.title}&&field_name=${fieldName}`)
      .then((response) => {
        setMainGame({
          ...mainGame,
          [fieldName]: response.data.url,
        });
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(fetchGames, []);
  useEffect(() => {
    loginIfToken();
  }, []);
  useEffect(() => {
    if (loading) return;

    setMainGame(games[Math.floor(Math.random() * games.length)]);
  }, [loading]);
  useEffect(getGameGenres, []);
  useEffect(getGenres, []);

  useEffect(() => {
    if (!user.id) return;
    getCartItems(setCartItems);
  }, []);
  useEffect(() => {
    if (!user.id) return;
    getWishlistItems(setWishlistItems);
  }, []);
  useEffect(() => {
    if (!mainGame || mainGame.banner_image) return;

    handleMainImgError(mainGame, "banner_image")

  }, [mainGame?.banner_image])

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
          >
            <Card
              sx={{
                display: "flex",
                gap: 3,
                padding: 3,
                marginBottom: 8,
              }}
              elevation={2}
            >
              {mainGame && (
                <Paper
                  component={"img"}
                  src={mainGame.banner_image}
                  onError={() => handleMainImgError(mainGame, "banner_image")}
                  sx={{
                    width: "70%",
                    aspectRatio: 16 / 9,
                    borderRadius: 1,
                  }}
                  elevation={4}
                />
              )}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  justifyContent: "space-between",
                  width: "30%",
                }}
              >
                <Box>
                  <Typography variant="h2">{mainGame?.title}</Typography>
                  <Rating value={4.5} readOnly precision={0.1} size="small" />
                  <Typography>{mainGame?.summary}</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 0.6,
                  }}
                >
                  <Typography variant="h2" component={"p"} color={"primary"}>
                    R${mainGame?.price}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                    }}
                  >
                    {gameGenres
                      .filter(
                        ({ title, genres }) =>
                          mainGame?.title === title && genres.length > 0
                      )[0]
                      ?.genres.map((genre, index) => (
                        <Chip
                          key={index}
                          label={genre.name}
                          size="small"
                          variant="outlined"
                          color="secondary"
                        />
                      ))}
                  </Box>
                </Box>
              </Box>
            </Card>
          </Link>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {genres.map((genre, index) => (
              <GameCarousel
                games={games.filter(
                  (game) =>
                    gameGenres
                      .filter(
                        ({ title, genres }) =>
                          game.title === title && genres.length > 0
                      )[0]
                      .genres.filter(({ name }) => name === genre.name)[0]
                )}
                title={genre.name.toUpperCase()}
                cartItems={cartItems}
                setCartItems={setCartItems}
                wishlistItems={wishlistItems}
                setWishlistItems={setWishlistItems}
                key={index}
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
