import { CartItem, OriginalGame } from "../../types/types"
import axiosInstance from "../../utils/axiosInstance"

const getCartItems = (setCartItems: (items: CartItem[]) => void, setGames?: (games: OriginalGame[]) => void, setIsLoading?: (isLoading: boolean) => void) => {
    const config = {
        headers: {
            'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
        }
    }
    axiosInstance.get(`/api/carts`, config).then((response) => {
        console.log(response)
        setCartItems(response.data.items)
        setGames?.(response.data.games)
        setIsLoading?.(false)
    }).catch((error) => {
        console.error(error.response)
        setIsLoading?.(false)
    })
}

const onRemoveFromCart = (setCartItems: (items: CartItem[]) => void, cartItems: CartItem[], delCartItem: CartItem, setGames?: (games: OriginalGame[]) => void, games?: OriginalGame[]) => {
    const config = {
        headers: {
            'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
        }
    }
    axiosInstance.delete(`/api/cart-item?cart_item_id=${delCartItem.id}`, config).then((response) => {
        console.log(response.data);
        setCartItems(cartItems.filter(cartItem => cartItem.id !== delCartItem.id))
        games && setGames?.(games.filter(game => game.id !== delCartItem.game_id))
    }).catch((error) => {
        console.error(error.response);

        alert(`${error.response.data}. \n\nTente novamente.`)
    });
}

export { getCartItems, onRemoveFromCart };