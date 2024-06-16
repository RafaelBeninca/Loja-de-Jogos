import LogoLong from "../assets/images/Logo_Long.png";
import { Box } from "@mui/material";

export default function HeaderLogo() {
  return (
    <Box
      component="img"
      sx={{
        width: 350,
        maxWidth: { xs: 350, md: 250 },
        filter: "drop-shadow(0px 0px 2px #222)",
      }}
      alt="logo"
      src={LogoLong}
    />
  );
}
