import { useContext, useEffect, useState } from "react";
import { BoughtGame, OriginalGame } from "../types/types";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";
import UserContext from "../contexts/UserContext";

export default function LibraryGameList() {
  const [games, setGames] = useState<OriginalGame[]>([]);
  const [boughtGames, setBoughtGames] = useState<BoughtGame[]>([]);
  const { user } = useContext(UserContext);

  const getGames = () => {
    if (!user.id) return;
    const config = {
      headers: {
        Authorization: "Bearer " + (localStorage.getItem("token") || ""),
      },
    };

    axiosInstance
      .get(`/api/bought_games?user_id=${user.id}`, config)
      .then((response) => {
        console.log(response);
        setGames(response.data.games);
        setBoughtGames(response.data.bought_games);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(getGames, []);

  return (
    <div>
      {games.map((game) => (
        <Link key={game.id} to={`/game/${game.title}`}>
          <div key={game.id}>
            <img src={game.banner_image} alt="" style={{ width: "6rem" }} />
            <br />
            {game.title}
            <br />
            Bought At:{" "}
            {
              boughtGames.filter(
                (boughtGame) => boughtGame.game_id === game.id
              )[0].created_at
            }
          </div>
          <br />
        </Link>
      ))}
      {games.length === 0 && (
        <p>
          <b>Parece que você ainda não comprou nenhum jogo...</b>
        </p>
      )}
    </div>
  );
}
