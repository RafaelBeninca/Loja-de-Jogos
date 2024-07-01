import { useContext, useEffect, useState } from "react";
import CartItems from "../components/CartItems";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { CartItem, GameAverage, GameGenre, OriginalGame } from "../types/types";
import { getCartItems } from "../funcs/async/CartFunctions";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogTitle,
  Typography,
} from "@mui/material";

export default function Cart() {
  const { logoutUser } = useContext(UserContext);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [games, setGames] = useState<OriginalGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gamesAverage, setGamesAverage] = useState<GameAverage[]>([]);
  const [gameGenres, setGameGenres] = useState<GameGenre[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const navigate = useNavigate();

  const handlePurchase = () => {
    setIsLoading(true);

    const config = {
      headers: {
        Authorization: "Bearer " + (localStorage.getItem("token") || ""),
      },
    };
    const data = {
      cart_items: cartItems,
    };

    axiosInstance
      .post("/api/bought_games", data, config)
      .then((response) => {
        console.log(response);
        setIsLoading(false);
        getCartItems(setCartItems, setGames);
        navigate("/", { state: { alert: "Compra realizada com sucesso!" } });
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
        if (error.response.status === 401) {
          logoutUser();
          navigate("/login", { relative: "route" });
        }
        setShowDialog(true);
      });
  };

  useEffect(
    () =>
      getCartItems(
        setCartItems,
        setGames,
        setIsLoading,
        setGamesAverage,
        setGameGenres
      ),
    []
  );

  return (
    <Box
      sx={{
        marginBlock: 5,
        marginTop: 15,
        width: "70%",
        marginInline: "auto",
        minHeight: "90vh",
      }}
    >
      <Typography
        variant="h1"
        sx={{
          marginBottom: 1,
        }}
      >
        Carrinho
      </Typography>
      {!isLoading && (
        <Box>
          <CartItems
            setCartItems={setCartItems}
            cartItems={cartItems}
            setGames={setGames}
            games={games}
            gameGenres={gameGenres}
            gamesAverage={gamesAverage}
          />
          {cartItems.length > 0 ? (
            <Button
              variant="contained"
              size="large"
              onClick={handlePurchase}
              sx={{
                marginBlock: 5,
              }}
            >
              Comprar
            </Button>
          ) : (
            <Typography
              sx={{
                fontWeight: "bold",
              }}
            >
              Parece que você não tem nenhum item no carrinho...
            </Typography>
          )}
        </Box>
      )}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Erro.</DialogTitle>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>Ok</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
