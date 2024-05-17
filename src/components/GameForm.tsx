import React, { useState, useContext } from "react"
import axios from "axios"
import { OriginalGame, SimpleGame } from "../types/types"
import UserContext from "../contexts/UserContext"
import { useNavigate } from "react-router-dom"
import { emptyUser } from "../utils/defaultValues"

interface GameFormProps {
    existingGame: OriginalGame,
    updateCallback: () => void
}

export default function GameForm({ existingGame = { id: 0, title: "", price: 0 }, updateCallback }: GameFormProps) {
    const [game, setGame] = useState<SimpleGame>({
        id: existingGame.id || 0,
        title: existingGame.title || "",
        price: existingGame.price.toString() || ""
    })
    const [submitMessage, setSubmitMessage] = useState("")
    const { setUser } = useContext(UserContext)
    const token = localStorage.getItem('token') || ''
    const navigate = useNavigate()

    const isUpdating = existingGame.id !== 0

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!game.title || !game.price) {
            setSubmitMessage("Todos os campos devem ser preenchidos.")
            return
        }

        if (!parseFloat(game.price)) {
            setSubmitMessage("Digite valores válidos.")
            return
        }

        let request = axios.post
        let url = 'http://localhost:5000/games'
        const data = {
            title: game.title,
            price: parseFloat(game.price)
        }
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }

        if (isUpdating) {
            request = axios.patch
            url += `/${game.id}`
        }

        request(url, data, config)
            .then((response) => {
                console.log(response);
                updateCallback()

                alert(`Jogo ${isUpdating ? 'alterado' : 'criado'} com sucesso.`)
            })
            .catch((error) => {
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

    return (
        <form onSubmit={onSubmit}>
            <label htmlFor="title">Title</label>
            <input type="text" name="title" id="title" value={game.title} onChange={(e) => setGame({ ...game, title: e.target.value })} />
            <br /><br />

            <label htmlFor="price">Price</label>
            <input type="text" name="price" id="price" value={game.price} onChange={(e) => setGame({ ...game, price: e.target.value })} />
            <br /><br />

            <button type="submit">{isUpdating ? 'Update' : 'Create'} Game</button>

            <p>{submitMessage}</p>
        </form>
    )
}