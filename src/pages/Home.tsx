import { useContext, useEffect, useState } from 'react'
import { OriginalGame } from '../types/types.tsx'
import GameList from '../components/GameList.tsx'
import GameForm from '../components/GameForm.tsx'
import Modal from '../components/Modal.tsx'
import axiosInstance from '../utils/axiosInstance.tsx'
import { useNavigate } from 'react-router-dom'
import { emptyOriginalGame } from '../utils/defaultValues.tsx'
import UserContext from '../contexts/UserContext.tsx'

interface Games {
    gameList: OriginalGame[]
}

export default function Home() {
    const [games, setGames] = useState<Games>({ gameList: [] })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentGame, setCurrentGame] = useState<OriginalGame>(emptyOriginalGame)
    const { getUser, logoutUser, loginUser } = useContext(UserContext)

    const navigate = useNavigate()

    const loginIfToken = () => {
        getUser().then(({ user, token }) => {
            if (token) {
                loginUser(token, user)
            }
            else {
                logoutUser()
            }
        });
    }

    useEffect(() => { loginIfToken() }, [])

    function fetchGames() {
        const token = localStorage.getItem('token')
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }

        axiosInstance.get<Games>("/api/games", config).then((response) => {
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
        setCurrentGame(emptyOriginalGame)
    }

    const openModal = () => {
        if (!isModalOpen) setIsModalOpen(true)
    }

    const openUpdateModal = (game: OriginalGame) => {
        if (isModalOpen) return
        console.log(game)
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
