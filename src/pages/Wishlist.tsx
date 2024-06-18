import { useContext, useEffect, useState } from "react";
import WishlistItems from "../components/WishlistItems";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";

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
        <Box sx={{
          marginBlock: 5,
          marginTop: 15,
          width: "70%",
          marginInline: "auto"
        }}>
            <Typography variant="h1" sx={{
              marginBottom: 1
            }}>Wishlist</Typography>
            <WishlistItems />
        </Box>
        }
        </>
    )
}