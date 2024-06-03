import React, { useEffect, useState } from "react"
import "../styles/mediaInput.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faImage } from '@fortawesome/free-regular-svg-icons'
import { SimpleGame } from "../types/types"

interface ExeInputProps {
    name: string,
    id: string,
    setGame: (arg0: SimpleGame) => void,
    game: SimpleGame,
    required: boolean
}

export default function ExeInput({ name, id, setGame, game, required }: ExeInputProps) {
    const [filename, setFilename] = useState<string | undefined>()
    
    const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement & {
            files: FileList
        }

        setGame({...game, [id]: target.files[0]});
        setFilename(target.files[0].name)
    }

    const changeFilename = (fileLink: string | undefined) => {
        if (!fileLink) return

        const temp = fileLink.split("?X-Goog-Algorithm")[0]
        const fn = temp.split("/").pop()

        setFilename(fn)
    }

    useEffect(() => changeFilename(game[id as keyof SimpleGame] as string | undefined), [])

    return (
        <label htmlFor={id} className="custom-file-upload">
            {name}
            {filename ? 
                <p><b>{filename}</b></p> :
                <FontAwesomeIcon icon={faImage} />
            }
            <input type="file" name={id} id={id} accept=".exe" required={required} onChange={handleOnChange}/>
        </label>
    )
}