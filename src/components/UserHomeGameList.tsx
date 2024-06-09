import { Link, useNavigate } from 'react-router-dom'
import { CartItem, OriginalGame, WishlistItem } from '../types/types'
import axiosInstance from '../utils/axiosInstance'
import { useContext, useEffect, useState } from 'react'
import UserContext from '../contexts/UserContext'
import { getWishlistItems, onRemoveFromWishlist } from '../funcs/async/WishlistFunctions'
import { getCartItems, onRemoveFromCart } from '../funcs/async/CartFunctions'
import '../styles/userHome.css'

export interface UserHomeGameListProps {
    games: OriginalGame[]
}

export default function UserHomeGameList({ games }: UserHomeGameListProps) {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
    const { logoutUser } = useContext(UserContext)
    const navigate = useNavigate()

    const onAddToCart = (game: OriginalGame) => {
        const data = {
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
            else if (error.response.status === 409) {
                alert('Você já comprou este jogo')
            }
            else {
                alert(`Erro. \n\nTente novamente.`)
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
        axiosInstance.post('/api/wishlist-item', data, config).then((response) => {
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

    useEffect(() => getCartItems(setCartItems), [])
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
            <div className='game-carroussel'>
                {games.map(game => (
                    <Link key={game.id} className='game-card' to={`game/${game.title}`}>
                        <img src={game.banner_image} alt="" className='game-banner-img' />
                        <br />
                        {game.title}
                        <span>   </span>
                        {game.price}
                        <br />
                        
                            {getCartItem(game) ?
                                <button onClick={(e) => {e.preventDefault(); onRemoveFromCart(setCartItems, cartItems, getCartItem(game))}}>Remove from cart</button> :
                                <button onClick={(e) => {e.preventDefault(); onAddToCart(game)}}>Add to cart</button>
                            }
                            {getWishlistItem(game) ?
                                <button onClick={(e) => {e.preventDefault(); onRemoveFromWishlist(setWishlistItems, wishlistItems, getWishlistItem(game))}}>Remove from wishlist</button> :
                                <button onClick={(e) => {e.preventDefault(); onAddToWishlist(game)}}>Add to wishlist</button>
                            }
                    </Link>
                ))}
            </div>
    )
}