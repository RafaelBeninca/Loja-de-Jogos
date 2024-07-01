import { Link, useNavigate } from "react-router-dom";
import { CartItem, OriginalGame, WishlistItem } from "../types/types";
import axiosInstance from "../utils/axiosInstance";
import React, { useContext, useState } from "react";
import UserContext from "../contexts/UserContext";
import { onRemoveFromWishlist } from "../funcs/async/WishlistFunctions";
import { onRemoveFromCart } from "../funcs/async/CartFunctions";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { handleNewImageUrl } from "../funcs/async/ImgFunctions";

export interface GameCarouselProps {
  games: OriginalGame[];
  setGames: React.Dispatch<React.SetStateAction<OriginalGame[]>>;
  title: string;
  cartItems: CartItem[];
  setCartItems: (cartItems: CartItem[]) => void;
  wishlistItems: WishlistItem[];
  setWishlistItems: (wishlistItems: WishlistItem[]) => void;
}

export default function GameCarousel({
  games,
  setGames,
  title,
  cartItems,
  setCartItems,
  wishlistItems,
  setWishlistItems,
}: GameCarouselProps) {
  const { logoutUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [dialogText, setDialogText] = useState("");

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
          setShowDialog(true);
          setDialogText("Você já comprou este jogo.");
        } else {
          setShowDialog(true);
          setDialogText("Erro.");
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
          setShowDialog(true);
          setDialogText("Erro.");
        }
      });
  };

  // const handleImgError = (game: OriginalGame, fieldName: string) => {
  //   axiosInstance
  //     .get(`/api/games?game_title=${game.title}&&field_name=${fieldName}`)
  //     .then((response) => {
  //       setGames(
  //         games.map((oldGame) =>
  //           oldGame.id === game.id
  //             ? { ...game, [fieldName]: response.data.url }
  //             : oldGame
  //         )
  //       );
  //       console.log(response);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  const handleImgError = async (game: OriginalGame, fieldName: string) => {
    await handleNewImageUrl(game, fieldName, setGames);
  };

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
      <Box
        sx={{
          display: "flex",
          gap: 1,
          overflowX: "scroll",
          padding: 2,
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
            <Card key={game.id} elevation={3}>
              <Box
                component={"img"}
                src={game.banner_image ? game.banner_image : ""}
                onError={() => handleImgError(game, "banner_image")}
                loading="lazy"
                alt=""
                sx={{
                  width: {xs: 150, sm: 200},
                  aspectRatio: 16 / 9,
                }}
              />
              <Box
                sx={{
                  padding: 1,
                }}
              >
                <Typography variant="h3">{game.title}</Typography>
                <Typography>R${game.price.toFixed(2)}</Typography>
                {getCartItem(game) ? (
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      onRemoveFromCart({
                        setCartItems: setCartItems,
                        cartItems: cartItems,
                        delCartItem: getCartItem(game),
                      });
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
                      onRemoveFromWishlist({
                        setWishlistItems: setWishlistItems,
                        wishlistItems: wishlistItems,
                        delWishlistItem: getWishlistItem(game),
                      });
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
      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialogText}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>Ok</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
