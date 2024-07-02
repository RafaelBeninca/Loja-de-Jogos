import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import React, { useContext } from "react";
import MoreIcon from "@mui/icons-material/MoreVert";
import { AccountCircle } from "@mui/icons-material";
import { ThemeContext } from "../contexts/ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

interface LoginMobileMenuProps {
  mobileMoreAnchorEl: HTMLElement | null;
  setMobileMoreAnchorEl: React.Dispatch<
    React.SetStateAction<HTMLElement | null>
  >;
  handleMobileMenuClose: () => void;
  handleProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
}

export default function LoginMobileMenu({
  mobileMoreAnchorEl,
  setMobileMoreAnchorEl,
  handleMobileMenuClose,
  handleProfileMenuOpen,
}: LoginMobileMenuProps) {
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const mobileMenuId = "primary-search-account-menu-mobile";

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {darkMode ? (
        <MenuItem
          onClick={toggleTheme}
          sx={{
            display: "flex",
            gap: 1,
            paddingInline: 3,
          }}
        >
          <LightModeIcon />
          Modo Claro
        </MenuItem>
      ) : (
        <MenuItem
          onClick={toggleTheme}
          sx={{
            display: "flex",
            gap: 1,
            paddingInline: 3,
          }}
        >
          <DarkModeIcon />
          Modo Escuro
        </MenuItem>
      )}
      <MenuItem
        onClick={handleProfileMenuOpen}
        sx={{
          display: "flex",
          gap: 1,
          paddingInline: 3,
        }}
      >
        <AccountCircle />
        Perfil
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <Box sx={{ display: { xs: "flex", md: "none" } }}>
        <IconButton
          size="large"
          aria-label="show more"
          aria-controls={mobileMenuId}
          aria-haspopup="true"
          onClick={handleMobileMenuOpen}
          color="inherit"
        >
          <MoreIcon />
        </IconButton>
      </Box>
      {renderMobileMenu}
    </>
  );
}
