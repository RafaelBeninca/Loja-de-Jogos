import { Box, Typography } from "@mui/material";
import LogoLong from "../assets/images/Logo_Long.png";

export default function Footer() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        gap: 1,
        paddingTop: 3,
        paddingBottom: 5,
        width: "100%",
        minHeight: 100,
        backgroundColor: "common.black",
      }}
    >
      {/* <Typography variant="h2" component={"p"}>
        FUSION GAMES STORE
      </Typography> */}
      <Box
        component="img"
        sx={{
          maxWidth: 300,
          filter: "drop-shadow(0px 0px 2px #222)",
        }}
        alt="logo"
        loading="lazy"
        src={LogoLong}
      />
      <Typography variant="caption">contact@fgs.com</Typography>
    </Box>
  );
}
