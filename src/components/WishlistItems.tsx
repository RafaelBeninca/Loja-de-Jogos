import { useContext, useState, useEffect } from "react"
import UserContext from "../contexts/UserContext"
import axios from "axios"
import { WishlistItem } from "../types/types"
import { useNavigate } from "react-router-dom"

export default function CartItems() {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
    const { getUser, loginUser } = useContext(UserContext)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate()

    const getWishlistItems = () => {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
            }
        }
        axios.get(`/api/wishlist`, config).then((response) => {
            setWishlistItems(response.data.items)
            console.log(response.data)
        }).catch((error) => {
            console.error(error.data)
        })
    }

    const onRemoveFromWishlist = (wishlistItemId: number) => {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
            }
        }
        axios.delete(`/api/wishlist-item/${wishlistItemId}`, config).then((response) => {
            console.log(response.data);
            setWishlistItems(wishlistItems.filter(wishlistItem => wishlistItem.id !== wishlistItemId))
        }).catch((error) => {
            console.error(error.data);

            alert(`${error.response.data}. \n\nTente novamente.`)
        });
    }

    useEffect(getWishlistItems, [])

    const loginIfToken = () => {
        getUser().then(({ user, token }) => {
            if (token) {
                setIsLoggedIn(true)
                console.log(isLoggedIn)
                loginUser(token, user)
            }
            else {
                setIsLoggedIn(false)
                navigate('/logout')
            }
        });
    }

    useEffect(() => { loginIfToken() }, [])

    return (
        <>
            {isLoggedIn &&
                <div>
                    <h1>Wishlist</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>User Id</th>
                                <th>Game Id</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wishlistItems.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.user_id}</td>
                                    <td>{item.game_id}</td>
                                    <td>
                                        <button onClick={() => onRemoveFromWishlist(item.id)}>Remove from wishlist</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
        </>
    )
}