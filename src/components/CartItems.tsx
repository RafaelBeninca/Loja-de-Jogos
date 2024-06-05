import { useContext, useState, useEffect } from "react"
import UserContext from "../contexts/UserContext"
import { CartItem } from "../types/types"
import { getCartItems, onRemoveFromCart } from "../funcs/async/CartFunctions"

export default function CartItems() {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const { cartId } = useContext(UserContext)

    useEffect(() => getCartItems(setCartItems, cartId), [cartId])

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
                                <button onClick={() => onRemoveFromCart(setCartItems, cartItems, item.id)}>Remove from cart</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    )
}