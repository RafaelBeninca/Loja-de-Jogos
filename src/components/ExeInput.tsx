import React, { useEffect, useState } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { SimpleGame } from "../types/types";
import { Box, InputLabel, Typography, alpha, styled } from "@mui/material";
import axiosInstance from "../utils/axiosInstance";

interface ExeInputProps {
  label: string;
  name: string;
  setGame: React.Dispatch<React.SetStateAction<SimpleGame>>;
  game: SimpleGame;
  required: boolean;
  showRequired?: boolean;
}

const StyledExeInput = styled(InputLabel)(({ theme }) => ({
  position: "relative",
  overflow: "visible",
  marginTop: 20,
  border: "1px solid",
  borderColor:
    theme.palette.mode === "dark" ? alpha("#fff", 0.2) : alpha("#000", 0.2),
  borderRadius: theme.shape.borderRadius,
  display: "inline-block",
  textAlign: "center",
  cursor: "pointer",
  width: "100%",
  textWrap: "wrap",
  ":hover": {
    borderColor: theme.palette.mode === "dark" ? "#fff" : "#000",
    color: theme.palette.mode === "dark" ? "#fff" : "#000",
  },
}));

export default function ExeInput({
  label,
  name,
  setGame,
  game,
  required,
  showRequired,
}: ExeInputProps) {
  const [filename, setFilename] = useState<string | undefined>();

  const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & {
      files: FileList;
    };

    if (target.files[0].name.length >= 200) {
      alert("O nome do arquivo é muito grande! \n\nTente novamente.");
      return;
    }

    setGame((prevGame) => ({
      ...prevGame,
      [name]: target.files[0],
    }));
    setFilename(target.files[0].name);
  };

  const changeFilename = (fileLink: string | undefined) => {
    if (!fileLink) return;

    const temp = fileLink.split("?X-Goog-Algorithm")[0];
    const fn = temp.split("/").pop();

    setFilename(fn);
  };

  const handleFilenameError = () => {
    if (filename) return;

    axiosInstance
      .get(`/api/games?game_title=${game.title}&&field_name=game_file`)
      .then((response) => {
        setGame({ ...game, game_file: response.data.url });
        changeFilename(response.data.url);
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(
    () => changeFilename(game[name as keyof SimpleGame] as string | undefined),
    []
  );
  useEffect(handleFilenameError, [filename]);

  return (
    <Box>
      <StyledExeInput>
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
        {filename ? (
          <Typography
            sx={{
              marginBlock: "1rem",
            }}
          >
            {filename}
          </Typography>
        ) : (
          <FileUploadIcon
            sx={{
              marginBlock: "1rem",
            }}
          />
        )}
        <input
          type="file"
          name={name}
          hidden
          accept=".exe"
          required={required}
          onChange={handleOnChange}
        />
      </StyledExeInput>
    </Box>
  );
}
