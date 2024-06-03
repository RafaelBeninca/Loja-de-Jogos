import { useContext, useEffect, useState } from 'react'
import { OriginalGame } from '../types/types.tsx'
import PartnerHomeGameList from '../components/PartnerHomeGameList.tsx'
import GameForm from '../components/GameForm.tsx'
import Modal from '../components/Modal.tsx'
import axiosInstance from '../utils/axiosInstance.tsx'
import { useNavigate } from 'react-router-dom'
import { emptyOriginalGame } from '../utils/defaultValues.tsx'
import UserContext from '../contexts/UserContext.tsx'

interface Games {
    gameList: OriginalGame[]
}

export default function PartnerHome() {
    const [games, setGames] = useState<Games>({ gameList: [] })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentGame, setCurrentGame] = useState<OriginalGame>(emptyOriginalGame)
    const { getUser, loginUser } = useContext(UserContext)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => { loginIfToken() }, [])

    function fetchPartnerGames() {
        const token = localStorage.getItem('token')
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }

        axiosInstance.get<Games>("/api/partner-games", config).then((response) => {
            setGames(response.data)
            setLoading(false)
            console.log(response)
        }).catch((error) => {
            console.error(error)
            if (error.response.status === 401) {
                navigate('/login')
            }
        })
    }

    useEffect(fetchPartnerGames, [])

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
        fetchPartnerGames()
    }

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
            games.gameList.length === 0 && loading ? 
                <p><b>Carregando...</b></p> : 
                <div>
                    <PartnerHomeGameList games={games.gameList} onUpdate={openUpdateModal} updateCallback={onUpdate} />
                    <button onClick={openModal}>Create Game</button>

                    {isModalOpen && <Modal closeModal={closeModal}>
                        <GameForm existingGame={currentGame} updateCallback={onUpdate} />
                    </Modal>}
                </div>
        }
        </>
    )
}