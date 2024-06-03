import { useContext, useState, useEffect } from "react"
import UserContext from "../contexts/UserContext"
import axiosInstance from "../utils/axiosInstance"
import { CartItem } from "../types/types"

export default function CartItems() {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const { cartId } = useContext(UserContext)

    const getCartItems = () => {
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

    const onRemoveFromCart = (cartItemId: number) => {
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

    useEffect(getCartItems, [cartId])

    return (
        <>
        <div>
            <h1>Carrinho</h1>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Cart Id</th>
                        <th>Game Id</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map((item) => (
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.shop_order_id}</td>
                            <td>{item.game_id}</td>
                            <td>
                                <button onClick={() => onRemoveFromCart(item.id)}>Remove from cart</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    )
}