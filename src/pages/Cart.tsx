import { useContext, useEffect, useState } from "react";
import CartItems from "../components/CartItems";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { CartItem, OriginalGame } from "../types/types";
import { getCartItems } from "../funcs/async/CartFunctions";
import { Typography } from "@mui/material";

export default function Cart() {
  const { getUser, loginUser, logoutUser } = useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [games, setGames] = useState<OriginalGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loginIfToken = () => {
    getUser().then(({ user, token }) => {
      if (token) {
        setIsLoggedIn(true);
        loginUser(token, user);
      } else {
        logoutUser();
        navigate("/login");
      }
    });
  };

  const handlePurchase = () => {
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
        getCartItems(setCartItems, setGames);
        alert("Compra realizada com sucesso!");
      })
      .catch((error) => {
        console.error(error);
        if (error.response.status === 401) {
          logoutUser();
          navigate("/login", { relative: "route" });
        }
        alert("Erro. \n\nTente novamente.");
      });
  };

  useEffect(() => {
    loginIfToken();
  }, []);
  useEffect(() => getCartItems(setCartItems, setGames, setIsLoading), []);

  return (
    <>
      {isLoggedIn && (
        <>
          <h1>Carrinho</h1>
          {isLoading ? (
            <Typography sx={{ fontWeight: "bold" }}>Carregando...</Typography>
          ) : (
            <div>
              <CartItems
                setCartItems={setCartItems}
                cartItems={cartItems}
                setGames={setGames}
                games={games}
              />
              <br />
              <br />

              {cartItems.length > 0 ? (
                <button onClick={handlePurchase}>Comprar</button>
              ) : (
                <p>
                  <b>Parece que você não tem nenhum item no carrinho...</b>
                </p>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
}
