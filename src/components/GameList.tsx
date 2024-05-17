import { useNavigate } from 'react-router-dom'
import { OriginalGame } from '../types/types'
import axios from "axios"
import { useContext } from 'react'
import UserContext from '../contexts/UserContext'
import { emptyUser } from '../utils/defaultValues'

export interface GameListProps {
    games: OriginalGame[],
    onUpdate: (game: OriginalGame) => void,
    updateCallback: () => void
}

export default function GameList({ games, onUpdate, updateCallback }: GameListProps) {
    const { setUser } = useContext(UserContext)
    const navigate = useNavigate()

    const onDelete = (id: number) => {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
            }
        }
        axios.delete(`http://localhost:5000/games/${id}`, config).then((response) => {
            console.log(response);
            updateCallback()

            alert(`Jogo deletado com sucesso.`)
        }).catch((error) => {
            console.log(error);
            if (error.response.status === 401) {
                setUser(emptyUser)
                navigate('/login')
            }
            else {
                alert(`${error.response.data}. \n\nTente novamente.`)
            }
        });
    }

    const onBuy = (game: OriginalGame) => {
        axios.post('http://localhost:5000/carts', {
            gameList: [{
                id: game.id.toString(),
                title: game.title,
                currency_id: "BRL",
                quantity: 1,
                unit_price: game.price
            }]
        }).then((response) => {
            console.log(response);

            window.location.href = response.data;
        }).catch((error) => {
            console.log(error);

            alert(`${error.response.data}. \n\nTente novamente.`)
        });
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
                                <button onClick={() => onBuy(game)}>Buy</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}