import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Genre, OriginalGame, SimpleGame } from "../types/types";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import GameImageInput from "./GameImageInput";
// import TrailerInput from "./VideoInput";
import ExeInput from "./ExeInput";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  TextField,
  Typography,
} from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

interface GameFormProps {
  existingGame: OriginalGame;
}

export default function GameForm({ existingGame }: GameFormProps) {
  const { user } = useContext(UserContext);
  const [game, setGame] = useState<SimpleGame>({
    id: existingGame.id || 0,
    creator_id: parseInt(user.id),
    publisher: existingGame.publisher || "",
    developer: existingGame.developer || "",
    title: existingGame.title || "",
    price: existingGame.price.toString() || "",
    release_date: existingGame.release_date
      ? new Date(existingGame.release_date).toISOString().substring(0, 16)
      : "",
    summary: existingGame.summary || "",
    about: existingGame.about || "",
    game_file: existingGame.game_file || "",
    banner_image: existingGame.banner_image || "",
    trailer_1: existingGame.trailer_1 || "",
    trailer_2: existingGame.trailer_1 || "",
    trailer_3: existingGame.trailer_1 || "",
    preview_image_1: existingGame.preview_image_1 || "",
    preview_image_2: existingGame.preview_image_2 || "",
    preview_image_3: existingGame.preview_image_3 || "",
    preview_image_4: existingGame.preview_image_4 || "",
    preview_image_5: existingGame.preview_image_5 || "",
    preview_image_6: existingGame.preview_image_6 || "",
  });
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [carouselImages, setCarouselImages] = useState<React.ReactElement[]>(
    []
  );
  const [carouselThumbImages, setCarouselThumbImages] = useState<
    React.ReactElement[]
  >([]);
  const navigate = useNavigate();

  const isUpdating = existingGame.id !== 0;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!parseFloat(game.price)) {
      return;
    }

    const formData = new FormData();

    formData.append("creator_id", game.creator_id.toString());
    formData.append("publisher", game.publisher);
    formData.append("developer", game.developer);
    formData.append("title", game.title);
    formData.append("price", game.price);
    formData.append("release_date", game.release_date);
    formData.append("summary", game.summary);
    formData.append("about", game.about);
    formData.append("genres", JSON.stringify(selectedGenres));

    if (game.game_file && game.game_file instanceof File) {
      formData.append("game_file", game.game_file);
    }
    if (game.banner_image && game.banner_image instanceof File) {
      formData.append("banner_image", game.banner_image);
    }
    if (game.trailer_1 && game.trailer_1 instanceof File) {
      formData.append("trailer_1", game.trailer_1);
    }
    if (game.trailer_2 && game.trailer_2 instanceof File) {
      formData.append("trailer_2", game.trailer_2);
    }
    if (game.trailer_3 && game.trailer_3 instanceof File) {
      formData.append("trailer_3", game.trailer_3);
    }

    for (let i = 1; i < 7; i++) {
      const field = game[`preview_image_${i}` as keyof SimpleGame];

      if (field && field instanceof File) {
        formData.append(`preview_image_${i}`, field);
      }
    }

    let request = axiosInstance.post;
    let url = "/api/games";
    const token = localStorage.getItem("token") || "";

    if (isUpdating) {
      request = axiosInstance.patch;
      url += `?game_id=${game.id}`;
    }

    const config = {
      headers: {
        Authorization: "Bearer " + token,
        "Content-type": "multipart/form-data",
      },
    };

    request(url, formData, config)
      .then((response) => {
        console.log(response);

        alert(`Jogo ${isUpdating ? "alterado" : "criado"} com sucesso.`);
        navigate("/partner");
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status === 401) {
          navigate("/logout");
        } else {
          alert(`Erro. \n\nTente novamente.`);
        }
      });
  };

  const getGameGenres = () => {
    if (game.id === 0) return;
    if (!isUpdating) return;

    axiosInstance
      .get(`/api/genres?game_id=${game.id}`)
      .then((response) => {
        console.log(response);
        const genres: Genre[] = response.data.genres;
        setSelectedGenres(genres.map((genre) => genre.name));
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getGenres = () => {
    axiosInstance
      .get(`/api/genres`)
      .then((response) => {
        console.log(response);
        setGenres(response.data.genres);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleImgError = (
    fieldName: string
  ) => {
    axiosInstance
      .get(`/api/games?game_title=${game.title}&&field_name=${fieldName}`)
      .then((response) => {
        setGame({ ...game, [fieldName]: response.data.url });
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCarouselImages = () => {
    const inputList: React.ReactElement[] = [];
    const thumbList: React.ReactElement[] = [];

    for (const key in game) {
      const value = game[key as keyof SimpleGame];
      if (key.includes("preview") && typeof value === "string") {
        let labelArray = key.split("_");
        labelArray = labelArray.map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1)
        );
        const label = labelArray.join(" ");

        inputList.push(
          <div
            key={key}
            style={{
              width: "100%",
              aspectRatio: "16 / 9",
            }}
          >
            <GameImageInput
              label={label}
              name={key}
              game={game}
              setGame={setGame}
              required={false}
            />
          </div>
        );

        thumbList.push(
          <div
            key={key}
            style={{
              display: "flex",
              width: "100%",
              aspectRatio: "16 / 9",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {value ? (
              <img src={value} onError={() => handleImgError(key)} />
            ) : (
              <AddPhotoAlternateIcon fontSize="small" />
            )}
          </div>
        );
      }
    }

    setCarouselImages(inputList);
    setCarouselThumbImages(thumbList);
  };

  useEffect(handleCarouselImages, [game.id]);
  useEffect(getGameGenres, [game.id]);
  useEffect(getGenres, []);

  return (
    <form onSubmit={onSubmit} encType="multipart/form-data">
      <TextField
        label={"Título:"}
        sx={{
          marginBlock: 2,
        }}
        required
        value={game.title}
        onChange={(e) => {
          if (e.target.value.length >= 100) return;
          setGame({ ...game, title: e.target.value });
        }}
      />
      <Box
        sx={{
          display: "flex",
          gap: 3,
        }}
      >
        <Box
          sx={{
            width: "70%",
          }}
        >
          <Carousel
            swipeable={true}
            useKeyboardArrows={true}
            showStatus={false}
            thumbWidth={120}
            width={"101%"}
            renderThumbs={() => carouselThumbImages}
            showThumbs={false}
          >
            {carouselImages}
          </Carousel>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width: "30%",
          }}
        >
          <GameImageInput
            label="Banner"
            name="banner_image"
            setGame={setGame}
            game={game}
            required={isUpdating ? false : true}
            showRequired
          />
          <TextField
            label={"Resumo"}
            name="summary"
            required
            multiline
            size="small"
            value={game.summary}
            onChange={(e) => {
              if (e.target.value.length >= 500) return;
              setGame({ ...game, summary: e.target.value });
            }}
          />

          {/* <Typography>
            Data de lançamento:{" "}
            {game.release_date
              ? getFormattedDatetime(game.release_date)
              : "Não definida"}
          </Typography> */}
          <TextField
            type="datetime-local"
            name="release_date"
            label={"Data de lançamento"}
            InputLabelProps={{ shrink: true }}
            size="small"
            value={game.release_date}
            onChange={(e) => setGame({ ...game, release_date: e.target.value })}
          />
          <TextField
            label={"Desenvolvedor"}
            name="developer"
            size="small"
            required
            value={game.developer}
            onChange={(e) => {
              if (e.target.value.length >= 500) return;
              setGame({ ...game, developer: e.target.value });
            }}
          />
          <TextField
            label={"Distribuidora"}
            name="publisher"
            size="small"
            required
            value={game.publisher}
            onChange={(e) => {
              if (e.target.value.length >= 500) return;
              setGame({ ...game, publisher: e.target.value });
            }}
          />
          <TextField
            label={"Preço"}
            name="price"
            size="small"
            required
            value={game.price}
            onChange={(e) => {
              if (e.target.value.length >= 10) return;
              setGame({ ...game, price: e.target.value });
            }}
          />
          <Autocomplete
            multiple
            id="tags-filled"
            options={genres.map((genre) => genre.name)}
            freeSolo
            value={selectedGenres.map((genre) => genre)}
            onChange={(e, value) => {
              if (value.length >= 20) return;
              setSelectedGenres(value);
            }}
            renderTags={(value: readonly string[], getTagProps) =>
              value.map((option: string, index: number) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    variant="outlined"
                    label={option}
                    key={key}
                    {...tagProps}
                  />
                );
              })
            }
            renderInput={(params) => (
              <TextField {...params} variant="outlined" label="Tags" />
            )}
          />
          <ExeInput
            label="Game File"
            name="game_file"
            required={isUpdating ? false : true}
            showRequired
            game={game}
            setGame={setGame}
          />
        </Box>
      </Box>
      <Box>
        <Typography variant="h2" sx={{ fontSize: 24, marginBlock: 3 }}>
          Sobre
        </Typography>
        <TextField
          label={"Sobre"}
          value={game.about}
          multiline
          fullWidth
          maxRows={15}
          required
          onChange={(e) => {
            if (e.target.value.length >= 10000) return;
            setGame({ ...game, about: e.target.value });
          }}
        />
      </Box>
      <Button
        type="submit"
        variant="contained"
        sx={{
          marginTop: 3,
        }}
      >
        {isUpdating ? "Alterar" : "Publicar"} Jogo
      </Button>
    </form>
  );
}
