import {
  CartItem,
  GameAverage,
  GameGenre,
  OriginalGame,
} from "../../types/types";
import axiosInstance from "../../utils/axiosInstance";

const getCartItems = (
  setCartItems: (items: CartItem[]) => void,
  setGames?: (games: OriginalGame[]) => void,
  setIsLoading?: (isLoading: boolean) => void,
  setGamesAverage?: (avg: GameAverage[]) => void,
  setGameGenres?: (gameGenres: GameGenre[]) => void
) => {
  const config = {
    headers: {
      Authorization: "Bearer " + (localStorage.getItem("token") || ""),
    },
  };
  axiosInstance
    .get(`/api/carts`, config)
    .then((response) => {
      console.log(response);
      setCartItems(response.data.items);
      setGames?.(response.data.games);
      setGamesAverage?.(response.data.avgs);
      setGameGenres?.(response.data.game_genres);
      setIsLoading?.(false);
    })
    .catch((error) => {
      console.error(error.response);
      setIsLoading?.(false);
    });
};

interface OnRemoveFromCartDefault {
  delCartItem?: CartItem | null;
  setCartItems?: (items: CartItem[]) => void;
  cartItems?: CartItem[];
  setGames?: (games: OriginalGame[]) => void;
  games?: OriginalGame[];
  setCartItem?: React.Dispatch<React.SetStateAction<CartItem | null>>;
}

const onRemoveFromCart = ({
  delCartItem = undefined,
  setCartItems = undefined,
  cartItems = undefined,
  setGames = undefined,
  games = undefined,
  setCartItem = undefined,
}: OnRemoveFromCartDefault) => {
  const config = {
    headers: {
      Authorization: "Bearer " + (localStorage.getItem("token") || ""),
    },
  };
  axiosInstance
    .delete(`/api/cart-item?cart_item_id=${delCartItem?.id}`, config)
    .then((response) => {
      console.log(response.data);
      const newCartItems = cartItems?.filter(
        (cartItem) => cartItem.id !== delCartItem?.id
      );
      newCartItems && setCartItems?.(newCartItems);
      games &&
        setGames?.(games.filter((game) => game.id !== delCartItem?.game_id));

      setCartItem?.(null);
    })
    .catch((error) => {
      console.error(error.response);

      alert(`${error.response.data}. \n\nTente novamente.`);
    });
};

export { getCartItems, onRemoveFromCart };
