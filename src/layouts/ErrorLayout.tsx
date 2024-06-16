import { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import { Link, Outlet } from "react-router-dom";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { ThemeContext } from "../contexts/ThemeContext";
import HeaderLogo from "../components/HeaderLogo";

export default function ErrorLayout() {
  const { darkMode, toggleTheme } = useContext(ThemeContext);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="sticky">
          <Toolbar sx={{ width: "70%", margin: "auto", padding: { md: 0 } }}>
            <Link to={"/"}>
              <HeaderLogo />
            </Link>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1 }}>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                onClick={toggleTheme}
              >
                {darkMode ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </>
  );
}
