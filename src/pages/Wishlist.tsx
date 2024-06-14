import { useContext, useEffect, useState } from "react";
import WishlistItems from "../components/WishlistItems";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const { getUser, loginUser, logoutUser } = useContext(UserContext)
    const navigate = useNavigate()
    
    const loginIfToken = () => {
        getUser().then(({ user, token }) => {
            if (token) {
                setIsLoggedIn(true)
                loginUser(token, user)
            }
            else {
                logoutUser()
                navigate('/login')
            }
        });
    }

    useEffect(() => { loginIfToken() }, [])
    
    return (
        <>
        {isLoggedIn &&
        <div>
            <h1>Wishlist</h1>
            <WishlistItems />
        </div>
        }
        </>
    )
}