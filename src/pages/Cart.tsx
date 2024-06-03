import { useContext, useEffect, useState } from "react";
import CartItems from "../components/CartItems";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";

export default function Cart() {
    const { getUser, loginUser } = useContext(UserContext)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate()

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
            <CartItems />
        }
        </>
    )
}