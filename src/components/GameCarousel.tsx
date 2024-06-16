import { Link, useNavigate } from "react-router-dom";
import { CartItem, OriginalGame, WishlistItem } from "../types/types";
import axiosInstance from "../utils/axiosInstance";
import { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import {
  getWishlistItems,
  onRemoveFromWishlist,
} from "../funcs/async/WishlistFunctions";
import { getCartItems, onRemoveFromCart } from "../funcs/async/CartFunctions";
import { Box, Card, IconButton, Paper, Typography } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export interface GameCarouselProps {
  games: OriginalGame[];
  title: string;
}

export default function GameCarousel({ games, title }: GameCarouselProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { logoutUser } = useContext(UserContext);
  const navigate = useNavigate();

  const onAddToCart = (game: OriginalGame) => {
    const data = {
      game_id: game.id,
    };
    const config = {
      headers: {
        Authorization: "Bearer " + (localStorage.getItem("token") || ""),
      },
    };
    axiosInstance
      .post("/api/cart-item", data, config)
      .then((response) => {
        console.log(response.data);
        setCartItems([...cartItems, response.data.cart_item]);
      })
      .catch((error) => {
        console.error(error.data);
        if (error.response.status === 401) {
          logoutUser();
          navigate("/login");
        } else if (error.response.status === 409) {
          alert("Você já comprou este jogo");
        } else {
          alert(`Erro. \n\nTente novamente.`);
        }
      });
  };

  const onAddToWishlist = (game: OriginalGame) => {
    const data = {
      game_id: game.id,
    };
    const config = {
      headers: {
        Authorization: "Bearer " + (localStorage.getItem("token") || ""),
      },
    };
    axiosInstance
      .post("/api/wishlist-item", data, config)
      .then((response) => {
        console.log(response.data);
        setWishlistItems([...wishlistItems, response.data.wishlist_item]);
      })
      .catch((error) => {
        console.error(error.data);
        if (error.response.status === 401) {
          logoutUser();
          navigate("/login");
        } else {
          alert(`${error.response.data}. \n\nTente novamente.`);
        }
      });
  };

  useEffect(() => getCartItems(setCartItems), []);
  useEffect(() => getWishlistItems(setWishlistItems), []);

  const getCartItem = (game: OriginalGame) => {
    const cartItem = cartItems.find((item) => item.game_id === game.id);

    return cartItem!;
  };

  const getWishlistItem = (game: OriginalGame) => {
    const wishlistItem = wishlistItems.find((item) => item.game_id === game.id);

    return wishlistItem!;
  };

  return (
    <Paper
      sx={{
        position: "relative",
        overflowY: "visible",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          position: "absolute",
          top: -12,
          left: 5,
        }}
      >
        {title}
      </Typography>
      <Box sx={{
        display: "flex",
        gap: 1,
        overflowX: "scroll",
        padding: 2,

      }}>
      {games.map((game) => (
          <Link
            to={`/game/${game.title}`}
            style={{
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <Card key={game.id} elevation={3}>
              <Box
                component={"img"}
                src={game.banner_image}
                alt=""
                sx={{
                  width: 200,
                  aspectRatio: 16 / 9,
                }}
              />
              <Box
                sx={{
                  padding: 1,
                }}
              >
                <Typography variant="h3">{game.title}</Typography>
                <Typography>R${game.price}</Typography>
                {getCartItem(game) ? (
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      onRemoveFromCart(
                        setCartItems,
                        cartItems,
                        getCartItem(game)
                      );
                    }}
                  >
                    <RemoveShoppingCartIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      onAddToCart(game);
                    }}
                  >
                    <AddShoppingCartIcon />
                  </IconButton>
                )}
                {getWishlistItem(game) ? (
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      onRemoveFromWishlist(
                        setWishlistItems,
                        wishlistItems,
                        getWishlistItem(game)
                      );
                    }}
                  >
                    <FavoriteIcon />
                  </IconButton>
                ) : (
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      onAddToWishlist(game);
                    }}
                  >
                    <FavoriteBorderIcon />
                  </IconButton>
                )}
              </Box>
            </Card>
          </Link>
      ))}
    </Box>
    </Paper>
  );
}
