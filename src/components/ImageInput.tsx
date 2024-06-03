import React, { useEffect, useState } from "react"
import "../styles/mediaInput.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-regular-svg-icons'
import { SimpleGame } from "../types/types"

interface ImageInputProps {
    name: string,
    id: string,
    setGame: (arg0: SimpleGame) => void,
    game: SimpleGame,
    required: boolean
}

export default function ImageInput({ name, id, setGame, game, required }: ImageInputProps) {
    const [bgImage, setBgImage] = useState<string | ArrayBuffer | null>(null)
    
    const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement & {
            files: FileList
        }

        setGame({...game, [id]: target.files[0]});
        changeBgImage(target.files[0])
    }

    const changeBgImage = (image: File | undefined) => {
        if (!image) return

        const reader = new FileReader();
        
        reader.onload = () => {
            setBgImage(reader.result)
        }

        reader.readAsDataURL(image)
    }

    useEffect(() => setBgImage(game[id as keyof SimpleGame] as string), [])

    return (
        <label htmlFor={id} className="custom-file-upload">
            {name}
            {bgImage ? 
                <img src={bgImage as string} alt="" className="bg-image"/> :
                <FontAwesomeIcon icon={faImage} />
            }
            <input type="file" name={id} id={id} accept="image/*" required={required} onChange={handleOnChange}/>
        </label>
    )
}