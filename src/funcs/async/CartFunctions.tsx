import { CartItem } from "../../types/types"
import axiosInstance from "../../utils/axiosInstance"

const getCartItems = (setCartItems: (items: CartItem[]) => void, cartId: string) => {
    const config = {
        headers: {
            'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
        }
    }
    axiosInstance.get(`/api/carts/${cartId}`, config).then((response) => {
        setCartItems(response.data.items)
        console.log(response.data)
    }).catch((error) => {
        console.error(error.data)
    })
}

const onRemoveFromCart = (setCartItems: (items: CartItem[]) => void, cartItems: CartItem[], cartItemId: number) => {
    const config = {
        headers: {
            'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
        }
    }
    axiosInstance.delete(`/api/cart-item/${cartItemId}`, config).then((response) => {
        console.log(response.data);
        setCartItems(cartItems.filter(cartItem => cartItem.id !== cartItemId))
    }).catch((error) => {
        console.error(error.data);

        alert(`${error.response.data}. \n\nTente novamente.`)
    });
}

export { getCartItems, onRemoveFromCart };