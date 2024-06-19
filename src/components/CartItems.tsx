import { onRemoveFromCart } from "../funcs/async/CartFunctions";
import { Link } from "react-router-dom";
import { CartItem, GameAverage, GameGenre, OriginalGame } from "../types/types";
import {
  Box,
  Card,
  Chip,
  IconButton,
  Paper,
  Rating,
  Typography,
} from "@mui/material";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import axiosInstance from "../utils/axiosInstance";

interface CartItemsProps {
  setCartItems: (items: CartItem[]) => void;
  cartItems: CartItem[];
  setGames: (games: OriginalGame[]) => void;
  games: OriginalGame[];
  gameGenres: GameGenre[];
  gamesAverage: GameAverage[];
}

export default function CartItems({
  setCartItems,
  cartItems,
  setGames,
  games,
  gameGenres,
  gamesAverage,
}: CartItemsProps) {
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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
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
                <Typography
                  sx={{
                    marginBlock: 1,
                  }}
                >
                  {game.summary.length >= 190
                    ? game.summary.substring(0, 186) + "..."
                    : game.summary}
                </Typography>
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
              <IconButton
                onClick={(e) => {
                  e.preventDefault();
                  onRemoveFromCart({
                    setCartItems: setCartItems,
                    cartItems: cartItems,
                    delCartItem: cartItems.find(
                      (cartItem) => cartItem.game_id == game.id
                    )!,
                    setGames: setGames,
                    games: games,
                  });
                }}
                sx={{
                  position: "absolute",
                  top: 10,
                  right: 10,
                }}
              >
                <RemoveShoppingCartIcon />
              </IconButton>
            </Box>
          </Card>
        </Link>
      ))}
    </Box>
  );
}
