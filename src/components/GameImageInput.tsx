import React, { useEffect, useState } from "react";
// import "../styles/mediaInput.css"
import { SimpleGame } from "../types/types";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { Box, InputLabel, alpha, styled } from "@mui/material";
import { handleNewImageUrl } from "../funcs/async/ImgFunctions";

interface GameImageInputProps {
  label: string;
  name: string;
  setGame: React.Dispatch<React.SetStateAction<SimpleGame>>;
  game: SimpleGame;
  required: boolean;
  showRequired?: boolean;
}

const StyledImageInput = styled(InputLabel)(({ theme }) => ({
  position: "relative",
  overflow: "visible",
  marginTop: 20,
  border: "1px solid",
  borderColor:
    theme.palette.mode === "dark" ? alpha("#fff", 0.2) : alpha("#000", 0.2),
  borderRadius: theme.shape.borderRadius,
  display: "inline-block",
  textAlign: "center",
  aspectRatio: 16 / 9,
  cursor: "pointer",
  width: "100%",
  ":hover": {
    borderColor: theme.palette.mode === "dark" ? "#fff" : "#000",
    color: theme.palette.mode === "dark" ? "#fff" : "#000",
  },
}));

export default function GameImageInput({
  label,
  name,
  setGame,
  game,
  required,
  showRequired,
}: GameImageInputProps) {
  const [bgImage, setBgImage] = useState<string | ArrayBuffer | null>(null);

  const image = game[name as keyof SimpleGame];

  const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };

    setGame((prevGame) => ({
      ...prevGame,
      [name]: target.files[0],
    }));
    changeBgImage(target.files[0]);
  };

  const changeBgImage = (image: File | undefined) => {
    if (!image) return;

    const reader = new FileReader();

    reader.onload = () => {
      setBgImage(reader.result);
    };

    reader.readAsDataURL(image);
  };
  
  // const handleImgError = (fieldName: string) => {
  //   axiosInstance
  //     .get(`/api/games?game_title=${game.title}&&field_name=${fieldName}`)
  //     .then((response) => {
  //       setGame({ ...game, [fieldName]: response.data.url });
  //       setBgImage(response.data.url);
  //       console.log(response);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  const handleImgError = async (fieldName: string) => {
    const url = await handleNewImageUrl(game, fieldName);

    setGame({ ...game, [fieldName]: url });
    setBgImage(url);
  };

  useEffect(() => setBgImage(image as string), [image]);

  return (
    <Box>
      <StyledImageInput>
        <InputLabel
          sx={{
            position: "absolute",
            top: -20,
            color: "inherit",
          }}
        >
          {label}
          {showRequired && "*"}
        </InputLabel>
        {bgImage ? (
          <Box
            component={"img"}
            src={bgImage ? (bgImage as string) : ""}
            onError={() => handleImgError(name)}
            loading="lazy"
            alt=""
            sx={{
              aspectRatio: 16 / 9,
              width: "100%",
            }}
          />
        ) : (
          <AddPhotoAlternateIcon
            fontSize="large"
            sx={{
              marginBlock: "20%",
            }}
          />
        )}
        <input
          type="file"
          name={name}
          hidden
          accept="image/*"
          required={required}
          onChange={handleOnChange}
        />
      </StyledImageInput>
    </Box>
  );
}
