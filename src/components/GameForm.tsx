import React, { useState } from "react"
import axios from "axios"
import { OriginalGame, SimpleGame } from "../types/types"
import { useNavigate } from "react-router-dom"

interface GameFormProps {
    existingGame: OriginalGame,
    updateCallback: () => void
}

export default function GameForm({ existingGame, updateCallback }: GameFormProps) {
    const [game, setGame] = useState<SimpleGame>({
        id: existingGame.id || 0,
        publisher: existingGame.publisher || "",
        developer: existingGame.developer || "",
        title: existingGame.title || "",
        price: existingGame.price.toString() || "",
        release_date: existingGame.release_date ? new Date(existingGame.release_date).toISOString().substring(0, 16) : "",
        summary: existingGame.summary || "",
        about: existingGame.about || "",
        game_file: existingGame.game_file || "",
        banner_image: existingGame.banner_image || "",
        trailer_1: existingGame.trailer_1 || "",
        trailer_2: existingGame.trailer_1 || "",
        trailer_3: existingGame.trailer_1 || "",
        preview_image_1: existingGame.preview_image_1 || "",
        preview_image_2: existingGame.preview_image_2 || "",
        preview_image_3: existingGame.preview_image_3 || "",
        preview_image_4: existingGame.preview_image_4 || "",
        preview_image_5: existingGame.preview_image_5 || "",
        preview_image_6: existingGame.preview_image_6 || "",
    })
    const [submitMessage, setSubmitMessage] = useState("")
    const navigate = useNavigate()

    const isUpdating = existingGame.id !== 0

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!parseFloat(game.price)) {
            setSubmitMessage("Digite valores válidos.")
            return
        }

        let request = axios.post
        let url = '/api/games'
        const token = localStorage.getItem('token') || ''

        const data = {
            publisher: game.publisher,
            developer: game.developer,
            title: game.title,
            price: parseFloat(game.price),
            release_date: game.release_date,
            summary: game.summary,
            about: game.about,
            game_file: game.game_file,
            banner_image: game.banner_image,
            trailer_1: game.trailer_1,
            trailer_2: game.trailer_2,
            trailer_3: game.trailer_3,
            preview_image_1: game.preview_image_1,
            preview_image_2: game.preview_image_2,
            preview_image_3: game.preview_image_3,
            preview_image_4: game.preview_image_4,
            preview_image_5: game.preview_image_5,
            preview_image_6: game.preview_image_6,
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
                    navigate('/logout')
                }
                else {
                    alert(`${error.response.data}. \n\nTente novamente.`)
                }
            });

    }

    return (
        <form onSubmit={onSubmit} encType="multipart/form-data">
            <label htmlFor="title">Title </label>
            <input type="text" name="title" id="title" required value={game.title} onChange={(e) => setGame({ ...game, title: e.target.value })} />
            <br /><br />

            <label htmlFor="publisher">Publisher </label>
            <input type="text" name="publisher" id="publisher" required value={game.publisher} onChange={(e) => setGame({ ...game, publisher: e.target.value })} />
            <br /><br />

            <label htmlFor="developer">Developer </label>
            <input type="text" name="developer" id="developer" required value={game.developer} onChange={(e) => setGame({ ...game, developer: e.target.value })} />
            <br /><br />

            <label htmlFor="price">Price </label>
            <input type="text" name="price" id="price" required value={game.price} onChange={(e) => setGame({ ...game, price: e.target.value })} />
            <br /><br />

            <label htmlFor="release_date">Release Date </label>
            <input type="datetime-local" name="release_date" id="release_date" value={game.release_date} onChange={(e) => setGame({ ...game, release_date: e.target.value })} />
            <br /><br />

            <label htmlFor="summary">Summary </label>
            <input type="text" name="summary" id="summary" required value={game.summary} onChange={(e) => setGame({ ...game, summary: e.target.value })} />
            <br /><br />

            <label htmlFor="about">About </label>
            <input type="text" name="about" id="about" value={game.about} onChange={(e) => setGame({ ...game, about: e.target.value })} />
            <br /><br />

            {/* <label htmlFor="game_file">Game File </label>
            <input type="file" name="game_file" id="game_file" required value={game.game_file} onChange={(e) => setGame({ ...game, game_file: e.target.value })} />
            <br /><br />

            <label htmlFor="banner_image">Banner Image </label>
            <input type="file" name="banner_image" id="banner_image" required value={game.banner_image} onChange={(e) => setGame({ ...game, banner_image: e.target.value })} />
            <br /><br /> */}

            <label htmlFor="trailer_1">Trailer 1 </label>
            <input type="file" name="trailer_1" id="trailer_1" value={game.trailer_1} onChange={(e) => setGame({ ...game, trailer_1: e.target.value })} />
            <br /><br />

            <label htmlFor="trailer_2">Trailer 2 </label>
            <input type="file" name="trailer_2" id="trailer_2" value={game.trailer_2} onChange={(e) => setGame({ ...game, trailer_2: e.target.value })} />
            <br /><br />

            <label htmlFor="trailer_3">Trailer 3 </label>
            <input type="file" name="trailer_3" id="trailer_3" value={game.trailer_3} onChange={(e) => setGame({ ...game, trailer_3: e.target.value })} />
            <br /><br />

            <label htmlFor="preview_image_1">Preview Image 1 </label>
            <input type="file" name="preview_image_1" id="preview_image_1" value={game.preview_image_1} onChange={(e) => setGame({ ...game, preview_image_1: e.target.value })} />
            <br /><br />

            <label htmlFor="preview_image_2">Preview Image 2 </label>
            <input type="file" name="preview_image_2" id="preview_image_2" value={game.preview_image_2} onChange={(e) => setGame({ ...game, preview_image_2: e.target.value })} />
            <br /><br />

            <label htmlFor="preview_image_3">Preview Image 3 </label>
            <input type="file" name="preview_image_3" id="preview_image_3" value={game.preview_image_3} onChange={(e) => setGame({ ...game, preview_image_3: e.target.value })} />
            <br /><br />

            <label htmlFor="preview_image_4">Preview Image 4 </label>
            <input type="file" name="preview_image_4" id="preview_image_4" value={game.preview_image_4} onChange={(e) => setGame({ ...game, preview_image_4: e.target.value })} />
            <br /><br />

            <label htmlFor="preview_image_5">Preview Image 5 </label>
            <input type="file" name="preview_image_5" id="preview_image_5" value={game.preview_image_5} onChange={(e) => setGame({ ...game, preview_image_5: e.target.value })} />
            <br /><br />

            <label htmlFor="preview_image_6">Preview Image 6 </label>
            <input type="file" name="preview_image_6" id="preview_image_6" value={game.preview_image_6} onChange={(e) => setGame({ ...game, preview_image_6: e.target.value })} />
            <br /><br />

            <button type="submit">{isUpdating ? 'Update' : 'Create'} Game</button>

            <p>{submitMessage}</p>
        </form>
    )
}