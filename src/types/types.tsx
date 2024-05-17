export interface OriginalGame {
    id: number,
    title: string,
    price: number
}

export interface SimpleGame {
    id: number,
    title: string,
    price: string
}

export interface User {
    id: string,
    username: string,
    email_address: string,
    created_at: string,
    updated_at: string
}

export interface UserContextInterface {
    user: User,
    setUser: (arg: User) => void,
    token: string,
    setToken: (arg: string) => void
}