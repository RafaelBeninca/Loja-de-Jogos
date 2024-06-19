import React, { useEffect, useState } from "react"
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { FormUser } from "../types/types"

interface UserImageInputProps {
    name: string,
    id: string,
    setUser: React.Dispatch<React.SetStateAction<FormUser>>,
    user: FormUser,
    defaultImage: string,
    required: boolean
}

export default function UserImageInput({ name, id, setUser, defaultImage, required }: UserImageInputProps) {
    const [bgImage, setBgImage] = useState<string | ArrayBuffer | null>(null)
    
    const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement & {
            files: FileList
        }

        setUser((prevUser) => ({
          ...prevUser,
          [id]: target.files[0],
        }));
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

    useEffect(() => setBgImage(defaultImage), [])

    return (
        <label htmlFor={id} className="custom-file-upload">
            {name}
            {bgImage ? 
                <img style={{borderRadius: "50rem", width: "5rem", height: "5rem", marginTop: "1rem"}} src={bgImage as string} alt="" className="bg-image"/> :
                <AddPhotoAlternateIcon />
            }
            <input type="file" name={id} id={id} accept="image/*" hidden required={required} onChange={handleOnChange}/>
        </label>
    )
}