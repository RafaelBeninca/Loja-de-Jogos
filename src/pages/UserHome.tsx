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
import {
  Alert,
  Backdrop,
  Box,
  Card,
  Chip,
  CircularProgress,
  Paper,
  Rating,
  Typography,
} from "@mui/material";
import "../styles/imageCarousel.css";
import { Link, useLocation } from "react-router-dom";
import { getCartItems } from "../funcs/async/CartFunctions.tsx";
import { getWishlistItems } from "../funcs/async/WishlistFunctions.tsx";
import CheckIcon from "@mui/icons-material/Check";

export default function UserHome() {
  const [games, setGames] = useState<OriginalGame[]>([]);
  const [mainGame, setMainGame] = useState<OriginalGame | null>(null);
  const [gameGenres, setGameGenres] = useState<GameGenre[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { getUser, logoutUser, loginUser, user } = useContext(UserContext);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [reviewAverage, setReviewAverage] = useState<number>(0);
  const [numReviews, setNumReviews] = useState<number>(0);
  const [showAlert, setShowAlert] = useState(false);

  const { state } = useLocation();

  const loginIfToken = () => {
    getUser().then(({ user, token }) => {
      if (token) {
        loginUser(token, user);
      } else {
        logoutUser();
      }
    });
  };

  const getReviews = () => {
    if (!mainGame || mainGame.id === 0) return;

    axiosInstance
      .get(`/api/reviews?game_id=${mainGame.id}`)
      .then((response) => {
        console.log(response);
        setNumReviews(response.data.reviews.length);
        setReviewAverage(response.data.avg);
      })
      .catch((error) => {
        console.error(error);
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
        setIsLoading(false);
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleMainImgError = () => {
    if (!mainGame) return;

    axiosInstance
      .get(`/api/games?game_title=${mainGame.title}&&field_name=banner_image`)
      .then((response) => {
        setMainGame({
          ...mainGame,
          banner_image: response.data.url,
        });
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getGenreGames = (genre: Genre) => {
    return games.filter((game) =>
      gameGenres.find(
        ({ title, genres }) =>
          game.title === title &&
          genres.length > 0 &&
          genres.find(({ name }) => name === genre.name)
      )
    );
  };

  useEffect(fetchGames, []);
  useEffect(() => {
    loginIfToken();
  }, []);
  useEffect(() => {
    if (isLoading) return;

    setMainGame(games[Math.floor(Math.random() * games.length)]);
  }, [isLoading]);
  useEffect(getGameGenres, []);
  useEffect(getGenres, []);

  useEffect(() => {
    if (!user.id) return;
    getCartItems(setCartItems);
  }, [user.id]);
  useEffect(() => {
    if (!user.id) return;
    getWishlistItems(setWishlistItems);
  }, [user.id]);
  useEffect(() => {
    if (!mainGame || mainGame.banner_image) return;

    handleMainImgError();
  }, [mainGame?.banner_image]);
  useEffect(getReviews, [mainGame?.id]);
  useEffect(() => {
    if (state?.alert) {
      setShowAlert(true);
    }
  }, []);

  return (
    <Box
      sx={{
        width: "70%",
        marginInline: "auto",
        display: "flex",
        flexDirection: "column",
        marginBlock: 5,
        marginTop: 15,
      }}
    >
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
                onError={handleMainImgError}
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
                <Typography>
                  {reviewAverage.toPrecision(2) + " "}
                  <Rating
                    value={reviewAverage}
                    precision={0.1}
                    readOnly
                    size="small"
                    sx={{
                      position: "relative",
                      top: 4,
                    }}
                  />{" "}
                  ({numReviews})
                </Typography>
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
                    .find(
                      ({ title, genres }) =>
                        mainGame?.title === title && genres.length > 0
                    )
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
          {genres.map(
            (genre, index) =>
              getGenreGames(genre).length > 0 && (
                <GameCarousel
                  games={getGenreGames(genre)}
                  setGames={setGames}
                  title={genre.name.toUpperCase()}
                  cartItems={cartItems}
                  setCartItems={setCartItems}
                  wishlistItems={wishlistItems}
                  setWishlistItems={setWishlistItems}
                  key={index}
                />
              )
          )}
          <GameCarousel
            games={games}
            setGames={setGames}
            title={"TODOS"}
            cartItems={cartItems}
            setCartItems={setCartItems}
            wishlistItems={wishlistItems}
            setWishlistItems={setWishlistItems}
          />
        </Box>
      </Box>
      {showAlert && (
        <Alert
          icon={<CheckIcon fontSize="inherit" />}
          severity="success"
          onClose={() => {setShowAlert(false); window.history.replaceState({}, '')}}
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
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
