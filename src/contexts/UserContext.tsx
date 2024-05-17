import React from "react";
import { createContext, useState } from "react";
import { UserContextInterface } from '../types/types'
import { emptyUser } from "../utils/defaultValues";

interface UserProviderProps {
    children: React.ReactElement
}

const UserContext = createContext<UserContextInterface>({
    user: emptyUser,
    setUser: () => { },
    token: '',
    setToken: () => { }
})

export function UserProvider({ children }: UserProviderProps) {
    const [user, setUser] = useState({
        id: '',
        username: '',
        email_address: '',
        created_at: '',
        updated_at: ''
    })
    const [token, setToken] = useState('')

    return (
        <UserContext.Provider value={{ user, setUser, token, setToken }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContext