import { useNavigate } from 'react-router-dom'
import { OriginalGame } from '../types/types'
import axiosInstance from '../utils/axiosInstance'

export interface PartnerHomeGameListProps {
    games: OriginalGame[],
    onUpdate: (game: OriginalGame) => void,
    updateCallback: () => void
}

export default function PartnerHomeGameList({ games, onUpdate, updateCallback }: PartnerHomeGameListProps) {
    const navigate = useNavigate()

    const onDelete = (gameId: number) => {
        if (confirm('Tem certeza que deseja deletar esse jogo?')) {
            // Continuar
        } else {
            // Cancelar
            return
        }

        const config = {
            headers: {
                'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
            }
        }
        axiosInstance.delete(`/api/games?game_id=${gameId}`, config).then((response) => {
            console.log(response);
            updateCallback()

            alert(`Jogo deletado com sucesso.`)
        }).catch((error) => {
            console.log(error);
            
            if (error.response.status === 401) {
                navigate('/logout')
            }
            if (error.response.status === 403) {
                console.error("Usuário não tem permissão para deletar esse jogo")
            }
            else {
                alert(`${error.response.data}. \n\nTente novamente.`)
            }
        });
    }

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Banner Image</th>
                        <th>Id</th>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {games.map((game) => (
                        <tr key={game.id}>
                            <td><img src={game.banner_image} alt="" style={{width: "6rem"}}/></td>
                            <td>{game.id}</td>
                            <td>{game.title}</td>
                            <td>{game.price}</td>
                            <td>
                                <button onClick={() => onUpdate(game)}>Update</button>
                                <button onClick={() => onDelete(game.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}