import React, { useContext, useState } from "react"
import axiosInstance from "../utils/axiosInstance"
import { OriginalGame, SimpleGame } from "../types/types"
import { useNavigate } from "react-router-dom"
import UserContext from "../contexts/UserContext"
import GameImageInput from "./GameImageInput"
import TrailerInput from "./VideoInput"
import ExeInput from "./ExeInput"

interface GameFormProps {
    existingGame: OriginalGame,
    updateCallback: () => void
}

export default function GameForm({ existingGame, updateCallback }: GameFormProps) {
    const { user } = useContext(UserContext);
    const [game, setGame] = useState<SimpleGame>({
        id: existingGame.id || 0,
        creator_id: parseInt(user.id),
        publisher: existingGame.publisher || "",
        developer: existingGame.developer || "",
        title: existingGame.title || "",
        price: existingGame.price.toString() || "",
        release_date: existingGame.release_date ? new Date(existingGame.release_date).toISOString().substring(0, 16) : "",
        summary: existingGame.summary || "",
        about: existingGame.about || "",
        game_file: existingGame.game_file,
        banner_image: existingGame.banner_image,
        trailer_1: existingGame.trailer_1,
        trailer_2: existingGame.trailer_1,
        trailer_3: existingGame.trailer_1,
        preview_image_1: existingGame.preview_image_1,
        preview_image_2: existingGame.preview_image_2,
        preview_image_3: existingGame.preview_image_3,
        preview_image_4: existingGame.preview_image_4,
        preview_image_5: existingGame.preview_image_5,
        preview_image_6: existingGame.preview_image_6,
    });
    const [submitMessage, setSubmitMessage] = useState("");
    const navigate = useNavigate();

    const isUpdating = existingGame.id !== 0;

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!parseFloat(game.price)) {
            setSubmitMessage("Digite valores válidos.");
            return;
        }

        const formData = new FormData();
        
        formData.append('creator_id', game.creator_id.toString());
        formData.append('publisher', game.publisher);
        formData.append('developer', game.developer);
        formData.append('title', game.title);
        formData.append('price', game.price);
        formData.append('release_date', game.release_date);
        formData.append('summary', game.summary);
        formData.append('about', game.about);

        if (game.game_file && game.game_file instanceof File) {
            formData.append('game_file', game.game_file);
        }
        if (game.banner_image && game.banner_image instanceof File) {
            formData.append('banner_image', game.banner_image);
        }
        if (game.trailer_1 && game.trailer_1 instanceof File) {
            formData.append('trailer_1', game.trailer_1);
        }
        if (game.trailer_2 && game.trailer_2 instanceof File) {
            formData.append('trailer_2', game.trailer_2);
        }
        if (game.trailer_3 && game.trailer_3 instanceof File) {
            formData.append('trailer_3', game.trailer_3);
        }

        for (let i = 1; i < 7; i++) {
            const field = game[`preview_image_${i}` as keyof SimpleGame]

            if (field && field instanceof File) {
                formData.append(`preview_image_${i}`, field as File)
            }
        }

        let request = axiosInstance.post;
        let url = '/api/games';
        const token = localStorage.getItem('token') || '';

        if (isUpdating) {
            request = axiosInstance.patch
            url += `/${game.id}`
        }

        const config = {
            headers: {
                'Authorization': 'Bearer ' + token,
                'Content-type': "multipart/form-data"
            }
        };

        request(url, formData, config)
            .then((response) => {
                console.log(response);
                updateCallback();

                alert(`Jogo ${isUpdating ? 'alterado' : 'criado'} com sucesso.`);
            })
            .catch((error) => {
                console.log(error);
                if (error.response.status === 401) {
                    navigate('/logout');
                }
                else {
                    alert(`Erro. \n\nTente novamente.`);
                }
            });

    }

    const trailerInputs = [];
    for (let i = 0; i < 3; i++) {
        trailerInputs.push(<TrailerInput name={`Trailer ${i + 1}`} id={`trailer_${i+1}`} setGame={setGame} game={game} key={i+1} />)
    }

    const previewImageInputs = [];
    for (let i = 0; i < 6; i++) {
        previewImageInputs.push(<GameImageInput name={`Preview Image ${i + 1}`} id={`preview_image_${i+1}`} setGame={setGame} game={game} required={false} key={i+1} />)
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

            <ExeInput name="Game File" id="game_file" required={isUpdating ? false : true} game={game} setGame={setGame}/>
            <br /><br />

            <GameImageInput name="Banner Image" id="banner_image" setGame={setGame} game={game} required={isUpdating ? false : true} />
            <br /><br />

            {trailerInputs.map(trailerInput => (
                <>
                    {trailerInput}
                    <br /><br />
                </>
            ))}

            {previewImageInputs.map(previewImageInput => (
                <>
                    {previewImageInput}
                    <br /><br />
                </>
            ))}

            <button type="submit">{isUpdating ? 'Update' : 'Create'} Game</button>

            <p>{submitMessage}</p>
        </form>
    )
}