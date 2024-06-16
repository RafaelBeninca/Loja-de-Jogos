import React, { useEffect, useState } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { SimpleGame } from "../types/types";
import { Box, InputLabel, Typography, alpha, styled } from "@mui/material";

interface ExeInputProps {
  label: string;
  name: string;
  setGame: (arg0: SimpleGame) => void;
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

    setGame({ ...game, [name]: target.files[0] });
    setFilename(target.files[0].name);
  };

  const changeFilename = (fileLink: string | undefined) => {
    if (!fileLink) return;

    const temp = fileLink.split("?X-Goog-Algorithm")[0];
    const fn = temp.split("/").pop();

    setFilename(fn);
  };

  useEffect(
    () => changeFilename(game[name as keyof SimpleGame] as string | undefined),
    []
  );

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
