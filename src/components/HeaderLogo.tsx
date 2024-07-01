import LogoLong from "../assets/images/Logo_Long.png";
import Logo from "../assets/images/Logo.png";
import { Box } from "@mui/material";

export default function HeaderLogo() {
  return (
    <>
      <Box
        component="img"
        sx={{
          maxWidth: 250,
          display: { xs: "none", lg: "block" },
          filter: "drop-shadow(0px 0px 2px #222)",
        }}
        alt="logo"
        loading="lazy"
        src={LogoLong}
      />
      <Box
        component="img"
        sx={{
          maxWidth: 50,
          display: { xs: "block", lg: "none" },
          filter: "drop-shadow(0px 0px 2px #222)",
        }}
        alt="logo"
        loading="lazy"
        src={Logo}
      />
    </>
  );
}
