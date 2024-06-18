import { useState, useEffect } from "react";
import {
  GameAverage,
  GameGenre,
  OriginalGame,
  WishlistItem,
} from "../types/types";
import {
  getWishlistItems,
  onRemoveFromWishlist,
} from "../funcs/async/WishlistFunctions";
import { Link } from "react-router-dom";
import {
  Box,
  Card,
  Chip,
  IconButton,
  Paper,
  Rating,
  Typography,
} from "@mui/material";
import axiosInstance from "../utils/axiosInstance";
import FavoriteIcon from "@mui/icons-material/Favorite";

export default function WishlistItems() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [games, setGames] = useState<OriginalGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gamesAverage, setGamesAverage] = useState<GameAverage[]>([]);
  const [gameGenres, setGameGenres] = useState<GameGenre[]>([]);

  const handleImgError = (game: OriginalGame, fieldName: string) => {
    axiosInstance
      .get(`/api/games?game_title=${game.title}&&field_name=${fieldName}`)
      .then((response) => {
        setGames(
          games.map((oldGame) =>
            oldGame.id === game.id
              ? { ...game, [fieldName]: response.data.url }
              : oldGame
          )
        );
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(
    () =>
      getWishlistItems(
        setWishlistItems,
        setGames,
        setIsLoading,
        setGamesAverage,
        setGameGenres
      ),
    []
  );

  return (
    <>
      {isLoading ? (
        <Typography sx={{ fontWeight: "bold" }}>Carregando...</Typography>
      ) : (
        <Box sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}>
          {games.map((game, index) => (
            <Link
              to={`/game/${game.title}`}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
              key={index}
            >
              <Card
                sx={{
                  position: "relative",
                  display: "flex",
                  gap: 3,
                  padding: 3,
                }}
                elevation={2}
              >
                {game && (
                  <Paper
                    component={"img"}
                    src={game.banner_image}
                    onError={() => handleImgError(game, "banner_image")}
                    sx={{
                      width: "34%",
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
                    width: "66%",
                  }}
                >
                  <Box>
                    <Typography variant="h2">{game.title}</Typography>
                    {gamesAverage?.map(
                      (gameAverage) =>
                        gameAverage.title === game.title && (
                          <Typography>
                            {gameAverage.avg.toPrecision(2) + " "}
                            <Rating
                              value={gameAverage.avg}
                              precision={0.1}
                              readOnly
                              size="small"
                              sx={{
                                position: "relative",
                                top: 4,
                              }}
                            />{" "}
                            ({gameAverage.num_of_reviews})
                          </Typography>
                        )
                    )}
                    <Typography sx={{
                      marginBlock: 1
                    }}>{game.summary.length >= 190 ? game.summary.substring(0, 186) + "..." : game.summary}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 0.6,
                    }}
                  >
                    <Typography variant="h2" component={"p"} color={"primary"}>
                      R${game.price}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                      }}
                    >
                      {gameGenres
                        ?.find(
                          ({ title, genres }) =>
                            game.title === title && genres.length > 0
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
                <IconButton
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10
                  }}
                  onClick={(e) => {
                    e.preventDefault();
                    onRemoveFromWishlist(
                      setWishlistItems,
                      wishlistItems,
                      wishlistItems.find(
                        (wishlistItem) => wishlistItem.game_id === game.id
                      )!,
                      setGames,
                      games
                    );
                  }}
                >
                  <FavoriteIcon />
                </IconButton>
              </Card>
            </Link>
          ))}
          {wishlistItems.length === 0 && (
            <Typography sx={{ fontWeight: "bold" }}>
              Parece que você não tem nenhum item na sua wishlist...
            </Typography>
          )}
        </Box>
      )}
    </>
  );
}
