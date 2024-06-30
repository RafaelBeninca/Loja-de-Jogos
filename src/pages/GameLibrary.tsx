import LibraryGameList from "../components/LibraryGameList";
import { Box, Typography } from "@mui/material";

export default function GameLibrary() {
  return (
    <Box
      sx={{
        marginBlock: 5,
        marginTop: 15,
        width: "70%",
        marginInline: "auto",
        minHeight: "61vh"
      }}
    >
      <Typography
        variant="h1"
        sx={{
          marginBottom: 1,
        }}
      >
        Biblioteca
      </Typography>
      <LibraryGameList />
    </Box>
  );
}
