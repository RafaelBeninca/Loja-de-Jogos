import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: 1,
        paddingBlock: 2,
        width: "100%",
        minHeight: 100,
        backgroundColor: "common.black",
      }}
    >
      <Typography variant="h2" component={"p"}>
        FUSION GAMES STORE
      </Typography>
      <Typography variant="caption">contact@fgs.com</Typography>
    </Box>
  );
}
