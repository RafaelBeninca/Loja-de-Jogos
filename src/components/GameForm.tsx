import React, { useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { OriginalGame, SimpleGame } from "../types/types";
import { useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import GameImageInput from "./GameImageInput";
import TrailerInput from "./VideoInput";
import ExeInput from "./ExeInput";
import { Box, Button, TextField, Typography } from "@mui/material";
import { Carousel } from "react-responsive-carousel";

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
    game_file: existingGame.game_file,
    banner_image: existingGame.banner_image,
    trailer_1: existingGame.trailer_1,
    trailer_2: existingGame.trailer_1,
    trailer_3: existingGame.trailer_1,
    preview_image_1: existingGame.preview_image_1,
    preview_image_2: existingGame.preview_image_2,
    preview_image_3: existingGame.preview_image_3,
    preview_image_4: existingGame.preview_image_4,
    preview_image_5: existingGame.preview_image_5,
    preview_image_6: existingGame.preview_image_6,
  });
  const [carouselImages, setCarouselImages] = useState<React.ReactElement[]>(
    []
  );
  const navigate = useNavigate();

  console.log(game)

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
        formData.append(`preview_image_${i}`, field as File);
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

  const trailerInputs = [];
  for (let i = 0; i < 3; i++) {
    trailerInputs.push(
      <TrailerInput
        name={`Trailer ${i + 1}`}
        id={`trailer_${i + 1}`}
        setGame={setGame}
        game={game}
        key={i + 1}
      />
    );
  }

  const previewImageInputs = [];
  for (let i = 0; i < 6; i++) {
    previewImageInputs.push(
      <GameImageInput
        label={`Preview Image ${i + 1}`}
        name={`preview_image_${i + 1}`}
        setGame={setGame}
        game={game}
        required={false}
        key={i + 1}
      />
    );
  }

  const handleCarouselImages = () => {
    const list: React.ReactElement[] = [];
    for (const key in game) {
      const value = game[key as keyof OriginalGame];
      if (key.includes("preview") && typeof value === "string") {
        if (value !== "") {
          list.push(
            <div key={key}>
              <img
                src={value}
                alt=""
                draggable="false"
                style={{ aspectRatio: 16 / 9 }}
              />
            </div>
          );
        } else {
          let labelArray = key.split("_");
          labelArray = labelArray.map(
            (word) => word.charAt(0).toUpperCase() + word.slice(1)
          );
          const label = labelArray.join(" ");

          list.push(
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
        }
      }
    }

    setCarouselImages(list);
  };

  useEffect(handleCarouselImages, [game.preview_image_1]);

  return (
    <form onSubmit={onSubmit} encType="multipart/form-data">
      <TextField
        label={"Título:"}
        sx={{
          marginBlock: 2,
        }}
        required
        value={game.title}
        onChange={(e) => setGame({ ...game, title: e.target.value })}
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
            thumbWidth={100}
            infiniteLoop={true}
            width={"101%"}
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
            onChange={(e) => setGame({ ...game, summary: e.target.value })}
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
            onChange={(e) => setGame({ ...game, developer: e.target.value })}
          />
          <TextField
            label={"Distribuidora"}
            name="publisher"
            size="small"
            required
            value={game.publisher}
            onChange={(e) => setGame({ ...game, publisher: e.target.value })}
          />
          <TextField
            label={"Preço"}
            name="price"
            size="small"
            required
            value={game.price}
            onChange={(e) => setGame({ ...game, price: e.target.value })}
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
          onChange={(e) => setGame({ ...game, about: e.target.value })}
        />
      </Box>
      <Button
        type="submit"
        variant="contained"
        sx={{
          marginTop: 3,
        }}
      >
        {isUpdating ? "Update" : "Create"} Game
      </Button>
    </form>
  );
}
