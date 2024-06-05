import { useNavigate } from 'react-router-dom'
import { CartItem, OriginalGame, WishlistItem } from '../types/types'
import axiosInstance from '../utils/axiosInstance'
import { useContext, useEffect, useState } from 'react'
import UserContext from '../contexts/UserContext'
import { getWishlistItems, onRemoveFromWishlist } from '../funcs/async/WishlistFunctions'
import { getCartItems, onRemoveFromCart } from '../funcs/async/CartFunctions'

export interface UserHomeGameListProps {
    games: OriginalGame[]
}

export default function UserHomeGameList({ games }: UserHomeGameListProps) {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
    const { cartId, logoutUser } = useContext(UserContext)
    const navigate = useNavigate()

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
        axiosInstance.post('/api/cart-item', data, config).then((response) => {
            console.log(response.data);
            setCartItems([...cartItems, response.data.cart_item])
        }).catch((error) => {
            console.error(error.data);
            if (error.response.status === 401) {
                logoutUser()
                navigate("/login")
            }
            else {
                alert(`${error.response.data}. \n\nTente novamente.`)
            }
        });
    }

    const onAddToWishlist = (game: OriginalGame) => {
        const data = {
            game_id: game.id
        }
        const config = {
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
            }
        }
        axiosInstance.post('/api/wishlist', data, config).then((response) => {
            console.log(response.data);
            setWishlistItems([...wishlistItems, response.data.wishlist_item])
        }).catch((error) => {
            console.error(error.data);
            if (error.response.status === 401) {
                logoutUser()
                navigate("/login")
            }
            else {
                alert(`${error.response.data}. \n\nTente novamente.`)
            }
        });
    }

    useEffect(() => getCartItems(setCartItems, cartId), [cartId])
    useEffect(() => getWishlistItems(setWishlistItems), [])

    const getCartItem = (game: OriginalGame) => {
        const cartItem = cartItems.find((item) => item.game_id === game.id)

        return cartItem!
    }

    const getWishlistItem = (game: OriginalGame) => {
        const wishlistItem = wishlistItems.find((item) => item.game_id === game.id)

        return wishlistItem!
    }

    return (
        <div>
            <h1>Game List</h1>
            <table>
                <thead>
                    <tr>
                        <th>Banner Image</th>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game) => (
                        <tr key={game.id}>
                            <td><img src={game.banner_image} alt="" style={{width: "6rem"}} /></td>
                            <td>{game.id}</td>
                            <td>{game.title}</td>
                            <td>{game.price}</td>
                            <td>
                                {getCartItem(game) ?
                                    <button onClick={() => onRemoveFromCart(setCartItems, cartItems, getCartItem(game).id)}>Remove from cart</button> :
                                    <button onClick={() => onAddToCart(game)}>Add to cart</button>
                                }
                                {getWishlistItem(game) ?
                                    <button onClick={() => onRemoveFromWishlist(setWishlistItems, wishlistItems, getWishlistItem(game).id)}>Remove from wishlist</button> :
                                    <button onClick={() => onAddToWishlist(game)}>Add to wishlist</button>
                                }
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}