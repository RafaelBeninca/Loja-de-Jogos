import React, { useEffect, useState } from "react"
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { SimpleGame } from "../types/types"

interface VideoInputProps {
    name: string,
    id: string,
    setGame: (arg0: SimpleGame) => void,
    game: SimpleGame,
}

export default function VideoInput({ name, id, setGame, game }: VideoInputProps) {
    const [video, setVideo] = useState<string | ArrayBuffer | null>(null)
    
    const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement & {
            files: FileList
        }

        setGame({...game, [id]: target.files[0]});
        changeVideo(target.files[0])
    }

    const changeVideo = (image: File | undefined) => {
        if (!image) return

        const reader = new FileReader();
        
        reader.onload = () => {
            setVideo(reader.result)
        }

        reader.readAsDataURL(image)
    }

    useEffect(() => setVideo(game[id as keyof SimpleGame] as string), [])

    return (
        <label htmlFor={id} className="custom-file-upload">
            {name}
            {video ? 
                <video src={video as string} className="bg-image"/> :
                <AddPhotoAlternateIcon />
            }
            <input type="file" name={id} id={id} hidden accept="video/*" onChange={handleOnChange}/>
        </label>
    )
}