import { useContext, useState, useEffect } from "react"
import UserContext from "../contexts/UserContext"
import { WishlistItem } from "../types/types"
import { useNavigate } from "react-router-dom"
import { getWishlistItems, onRemoveFromWishlist } from "../funcs/async/WishlistFunctions"

export default function CartItems() {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
    const { getUser, loginUser } = useContext(UserContext)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate()

    useEffect(() => getWishlistItems(setWishlistItems), [])

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
                                        <button onClick={() => onRemoveFromWishlist(setWishlistItems, wishlistItems, item.id)}>Remove from wishlist</button>
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