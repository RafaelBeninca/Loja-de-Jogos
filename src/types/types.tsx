export interface OriginalGame {
    id: number,
    creator_id: number,
    publisher: string,
    developer: string,
    title: string,
    price: number,
    release_date: string,
    summary: string,
    about: string,
    game_file: string,
    banner_image: string,
    trailer_1: string,
    trailer_2: string,
    trailer_3: string,
    preview_image_1: string,
    preview_image_2: string,
    preview_image_3: string,
    preview_image_4: string,
    preview_image_5: string,
    preview_image_6: string,
}

export interface SimpleGame {
    id: number,
    creator_id: number,
    publisher: string,
    developer: string,
    title: string,
    price: string,
    release_date: string,
    summary: string,
    about: string,
    game_file: File | undefined | string,
    banner_image: File | undefined | string,
    trailer_1: File | undefined | string,
    trailer_2: File | undefined | string,
    trailer_3: File | undefined | string,
    preview_image_1: File | undefined | string,
    preview_image_2: File | undefined | string,
    preview_image_3: File | undefined | string,
    preview_image_4: File | undefined | string,
    preview_image_5: File | undefined | string,
    preview_image_6: File | undefined | string,
}

// export interface SimpleGame {
//     id: number,
//     creator_id: number,
//     publisher: string,
//     developer: string,
//     title: string,
//     price: string,
//     release_date: string,
//     summary: string,
//     about: string,
//     game_file: File | undefined,
//     banner_image: File | undefined,
//     trailers: FileList | undefined,
//     preview_images: FileList | undefined,
// }

export interface User {
    id: string,
    username: string,
    email_address: string,
    profile_picture: string,
    summary: string,
    created_at: string,
    updated_at: string
}

export interface UserContextInterface {
    user: User,
    getUser: () => Promise<{ user: User, token: string }>,
    logoutUser: () => void,
    loginUser: (token: string, user: User) => void,
    token: string,
    cartId: string,
    setCartId: (cartId: string) => void
}

export interface CartItem {
    id: number,
    shop_order_id: number,
    game_id: number,
    created_at: string
}

export interface WishlistItem {
    id: number,
    user_id: number,
    game_id: number,
    created_at: string
}