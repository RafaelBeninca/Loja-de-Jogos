import { WishlistItem } from "../../types/types"
import axiosInstance from "../../utils/axiosInstance"

const getWishlistItems = (setWishlistItems: (items: WishlistItem[]) => void) => {
    const config = {
        headers: {
            'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
        }
    }
    axiosInstance.get(`/api/wishlist`, config).then((response) => {
        setWishlistItems(response.data.items)
        console.log(response.data)
    }).catch((error) => {
        console.error(error.data)
    })
}

const onRemoveFromWishlist = (setWishlistItems: (items: WishlistItem[]) => void, wishlistItems: WishlistItem[], wishlistItemId: number) => {
    const config = {
        headers: {
            'Authorization': 'Bearer ' + (localStorage.getItem('token') || '')
        }
    }
    axiosInstance.delete(`/api/wishlist-item/${wishlistItemId}`, config).then((response) => {
        console.log(response.data);
        setWishlistItems(wishlistItems.filter(wishlistItem => wishlistItem.id !== wishlistItemId))
    }).catch((error) => {
        console.error(error.data);

        alert(`${error.response.data}. \n\nTente novamente.`)
    });
}

export { getWishlistItems, onRemoveFromWishlist };