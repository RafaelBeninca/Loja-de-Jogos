import { useState, useEffect } from "react";
import { OriginalGame, WishlistItem } from "../types/types";
import {
  getWishlistItems,
  onRemoveFromWishlist,
} from "../funcs/async/WishlistFunctions";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";

export default function WishlistItems() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [games, setGames] = useState<OriginalGame[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(
    () => getWishlistItems(setWishlistItems, setGames, setIsLoading),
    []
  );

  return (
    <>
      {isLoading ? (
        <Typography sx={{ fontWeight: "bold" }}>Carregando...</Typography>
      ) : (
        <div>
          {games.map((game) => (
            <Link key={game.id} to={`../game/${game.title}`}>
              <tr key={game.id}>
                <img src={game.banner_image} alt="" style={{ width: "6rem" }} />
                <br />

                {game.title}
                <br />

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onRemoveFromWishlist(
                      setWishlistItems,
                      wishlistItems,
                      wishlistItems.filter(
                        (wishlistItem) => wishlistItem.game_id == game.id
                      )[0],
                      setGames,
                      games
                    );
                  }}
                >
                  Remove from wishlist
                </button>
              </tr>
            </Link>
          ))}
          {wishlistItems.length === 0 && (
            <p>
              <b>Parece que você não tem nenhum item na sua wishlist...</b>
            </p>
          )}
        </div>
      )}
    </>
  );
}
