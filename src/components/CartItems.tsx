import { onRemoveFromCart } from "../funcs/async/CartFunctions"
import { Link } from "react-router-dom"
import { CartItem, OriginalGame } from "../types/types"

interface CartItemsProps {
    setCartItems: (items: CartItem[]) => void,
    cartItems: CartItem[],
    setGames: (games: OriginalGame[]) => void,
    games: OriginalGame[]
}

export default function CartItems({setCartItems, cartItems, setGames, games}: CartItemsProps) {
    return (
        <div>
            {games.map((game) => (
                <Link key={game.id} to={`../game/${game.title}`}>
                    <div key={game.id}>
                        <img src={game.banner_image} alt="" style={{width: "6rem"}}/>
                        <br />
                        
                        {game.title}
                        <br />
                        R${game.price}
                        <br />

                        <button onClick={(e) => {e.preventDefault(); onRemoveFromCart(setCartItems, cartItems, cartItems.find((cartItem) => cartItem.game_id == game.id)!, setGames, games)}}>Remove from cart</button>
                    </div>
                </Link>
            ))}
        </div>
    )
}