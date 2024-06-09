import { useContext, useEffect, useState } from "react";
import CartItems from "../components/CartItems";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { CartItem, OriginalGame } from "../types/types";
import { getCartItems } from "../funcs/async/CartFunctions"

export default function Cart() {
    const { getUser, loginUser, logoutUser } = useContext(UserContext)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [games, setGames] = useState<OriginalGame[]>([])
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

    const handlePurchase = () => {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
            }
        }
        const data = {
            cart_items: cartItems
        }

        axiosInstance.post('/api/bought_games', data, config).then(response => {
            console.log(response)
            getCartItems(setCartItems, setGames)
            alert('Compra realizada com sucesso!')
        }).catch(error => {
            console.error(error)
            if (error.response.status === 401) {
                logoutUser();
                navigate('/login', {relative: "route"});
            }
            alert('Erro. \n\nTente novamente.')
        })
    }

    useEffect(() => { loginIfToken() }, [])
    useEffect(() => getCartItems(setCartItems, setGames), [])

    return (
        <>
        {isLoggedIn &&
            <div>
                <h1>Carrinho</h1>
                <CartItems setCartItems={setCartItems} cartItems={cartItems} setGames={setGames} games={games} />
                <br /><br />

                {cartItems.length > 0 ? 
                <button onClick={handlePurchase}>Comprar</button> :
                <p><b>Parece que você não tem nenhum item no carrinho...</b></p>
                }
            </div>
        }
        </>
    )
}