import { OriginalGame, SimpleGame } from "../../types/types";
import axiosInstance from "../../utils/axiosInstance";

const handleNewImageUrl = async (
  game: OriginalGame | SimpleGame,
  fieldName: string,
  setGames?: (games: React.SetStateAction<OriginalGame[]>) => void
): Promise<string> => {
  try {
    const response = await axiosInstance.get(
      `/api/games?game_title=${game.title}&&field_name=${fieldName}`
    );

    // If game is of type OriginalGame
    if (typeof game.price === "number") {
      setGames?.((prevGames) =>
        prevGames.map((oldGame) =>
          oldGame.id === game.id
            ? { ...(game as OriginalGame), [fieldName]: response.data.url }
            : oldGame
        )
      );
    }

    console.log(response);
    return response.data.url;
  } catch (error) {
    console.error(error);
    return "";
  }
};

export { handleNewImageUrl };
