import { useNavigate } from 'react-router-dom'
import { CartItem, OriginalGame } from '../types/types'
import axios from "axios"
import { useContext, useEffect, useState } from 'react'
import UserContext from '../contexts/UserContext'

export interface GameListProps {
    games: OriginalGame[],
    onUpdate: (game: OriginalGame) => void,
    updateCallback: () => void
}

export default function GameList({ games, onUpdate, updateCallback }: GameListProps) {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const { cartId } = useContext(UserContext)
    const navigate = useNavigate()

    const onDelete = (id: number) => {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
            }
        }
        axios.delete(import.meta.env.VITE_API_BASE_URL + `/api/games/${id}`, config).then((response) => {
            console.log(response);
            updateCallback()

            alert(`Jogo deletado com sucesso.`)
        }).catch((error) => {
            console.log(error);
            if (error.response.status === 401) {
                navigate('/logout')
            }
            else {
                alert(`${error.response.data}. \n\nTente novamente.`)
            }
        });
    }

    const onAddToCart = (game: OriginalGame) => {
        const data = {
            shop_order_id: cartId,
            game_id: game.id
        }
        const config = {
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
            }
        }
        axios.post(import.meta.env.VITE_API_BASE_URL + '/api/cart-item', data, config).then((response) => {
            console.log(response.data);
            setCartItems([...cartItems, response.data.cart_item])
        }).catch((error) => {
            console.error(error.data);
            if (error.response.status === 401) {
                navigate('/logout')
            }
            else {
                alert(`${error.response.data}. \n\nTente novamente.`)
            }
        });
    }

    const onRemoveFromCart = (cartItemId: number) => {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
            }
        }
        axios.delete(import.meta.env.VITE_API_BASE_URL + `/api/cart-item/${cartItemId}`, config).then((response) => {
            console.log(response.data);
            setCartItems(cartItems.filter(cartItem => cartItem.id !== cartItemId))
        }).catch((error) => {
            console.error(error.data);

            alert(`${error.response.data}. \n\nTente novamente.`)
        });
    }

    const getCartItems = () => {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
            }
        }
        axios.get(import.meta.env.VITE_API_BASE_URL + `/api/carts/${cartId}`, config).then((response) => {
            setCartItems(response.data.items)
            console.log(response.data)
        }).catch((error) => {
            console.error(error.data)
        })
    }

    useEffect(getCartItems, [cartId])

    const getCartItem = (game: OriginalGame) => {
        const cartItem = cartItems.find((item) => item.game_id === game.id)

        return cartItem!
    }

    return (
        <div>
            <h1>Game List</h1>
            <table>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game) => (
                        <tr key={game.id}>
                            <td>{game.id}</td>
                            <td>{game.title}</td>
                            <td>{game.price}</td>
                            <td>
                                <button onClick={() => onUpdate(game)}>Update</button>
                                <button onClick={() => onDelete(game.id)}>Delete</button>
                                {getCartItem(game) ?
                                    <button onClick={() => onRemoveFromCart(getCartItem(game).id)}>Remove from Cart</button> :
                                    <button onClick={() => onAddToCart(game)}>Add to Cart</button>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}