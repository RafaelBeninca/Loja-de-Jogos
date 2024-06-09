import { OriginalGame, WishlistItem } from "../../types/types"
import axiosInstance from "../../utils/axiosInstance"

const getWishlistItems = (setWishlistItems: (items: WishlistItem[]) => void, setGames?: (games: OriginalGame[]) => void) => {
    const config = {
        headers: {
            'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
        }
    }
    axiosInstance.get(`/api/wishlist`, config).then((response) => {
        setWishlistItems(response.data.items)
        setGames?.(response.data.games)
        console.log(response.data)
    }).catch((error) => {
        console.error(error.data)
    })
}

const onRemoveFromWishlist = (setWishlistItems: (items: WishlistItem[]) => void, wishlistItems: WishlistItem[], delWishlistItem: WishlistItem, setGames?: (games: OriginalGame[]) => void, games?: OriginalGame[]) => {
    const config = {
        headers: {
            'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
        }
    }
    axiosInstance.delete(`/api/wishlist-item?wishlist_item_id=${delWishlistItem.id}`, config).then((response) => {
        console.log(response.data);
        setWishlistItems(wishlistItems.filter(wishlistItem => wishlistItem.id !== delWishlistItem.id))
        games && setGames?.(games.filter(game => game.id !== delWishlistItem.game_id))
    }).catch((error) => {
        console.error(error.data);

        alert(`${error.response.data}. \n\nTente novamente.`)
    });
}

export { getWishlistItems, onRemoveFromWishlist };