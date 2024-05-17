import { useEffect, useState, useContext } from 'react'
import { OriginalGame } from '../types/types.tsx'
import GameList from '../components/GameList.tsx'
import GameForm from '../components/GameForm.tsx'
import Modal from '../components/Modal.tsx'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import UserContext from '../contexts/UserContext.tsx'

interface Games {
    gameList: OriginalGame[]
}

export default function Home() {
    const [games, setGames] = useState<Games>({ gameList: [] })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentGame, setCurrentGame] = useState<OriginalGame>({
        id: 0,
        title: "",
        price: 0
    })
    const { token } = useContext(UserContext)
    
    const navigate = useNavigate()

    function fetchGames() {
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
        axios.get<Games>("http://localhost:5000/games", config).then((response) => {
            setGames(response.data)
            console.log(response)
        }).catch((error) => {
            console.error(error)
            if (error.response.status === 401) {
                navigate('/login')
            }
        })
    }

    useEffect(fetchGames, [])

    const closeModal = () => {
        setIsModalOpen(false)
        setCurrentGame({
            id: 0,
            title: "",
            price: 0
        })
    }

    const openModal = () => {
        if (!isModalOpen) setIsModalOpen(true)
    }

    const openUpdateModal = (game: OriginalGame) => {
        if (isModalOpen) return
        setCurrentGame(game)
        setIsModalOpen(true)
    }

    const onUpdate = () => {
        closeModal()
        fetchGames()
    }

    return (
        <div>
            <GameList games={games.gameList} onUpdate={openUpdateModal} updateCallback={onUpdate} />
            <button onClick={openModal}>Create Game</button>

            {isModalOpen && <Modal closeModal={closeModal}>
                <GameForm existingGame={currentGame} updateCallback={onUpdate} />
            </Modal>}
        </div>
    )
}
