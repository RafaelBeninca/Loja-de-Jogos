import { useState, useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import UserContext from "../contexts/UserContext";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { ThemeContext } from "../contexts/ThemeContext";
// import HeaderLogo from "../components/HeaderLogo";
import LogoLong from "../assets/images/Logo_Long.png";
import LoginMobileMenu from "../components/LoginMobileMenu";

export default function LoginLayout() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);
  const { user } = useContext(UserContext);
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const isMenuOpen = Boolean(anchorEl);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          handleMenuClose();
          navigate(`/login`);
        }}
        key={"btnUserLogin"}
      >
        Login
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          navigate(`/signup`);
        }}
        key={"btnSignup"}
      >
        Signup
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="fixed">
          <Toolbar
            sx={{
              display: { xs: "flex" },
              justifyContent: "space-between",
              width: { xs: "95%", sm: "70%" },
              margin: "auto",
              paddingInline: { md: 0 },
            }}
          >
            <Link to={"/"}>
              <Box
                component="img"
                sx={{
                  maxWidth: 250,
                  filter: "drop-shadow(0px 0px 2px #222)",
                }}
                alt="logo"
                loading="lazy"
                src={LogoLong}
              />
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
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={menuId}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                {user?.profile_picture ? (
                  <Avatar src={user?.profile_picture} />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
            </Box>

            {/* Mobile Menu */}
            <LoginMobileMenu
              handleMobileMenuClose={handleMobileMenuClose}
              handleProfileMenuOpen={handleProfileMenuOpen}
              mobileMoreAnchorEl={mobileMoreAnchorEl}
              setMobileMoreAnchorEl={setMobileMoreAnchorEl}
            />
            {renderMenu}
          </Toolbar>
        </AppBar>
      </Box>
      <Outlet />
    </>
  );
}
