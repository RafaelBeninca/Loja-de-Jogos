import { AccountCircle } from "@mui/icons-material";
import { Avatar, Box, IconButton, Menu, MenuItem } from "@mui/material";
import { useContext } from "react";
import { ThemeContext } from "../contexts/ThemeContext";
import { User } from "../types/types";
import MoreIcon from "@mui/icons-material/MoreVert";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FolderIcon from "@mui/icons-material/Folder";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

interface UserMobileMenuProps {
  mobileMoreAnchorEl: HTMLElement | null;
  setMobileMoreAnchorEl: React.Dispatch<
    React.SetStateAction<HTMLElement | null>
  >;
  handleMobileMenuClose: () => void;
  handleProfileMenuOpen: (event: React.MouseEvent<HTMLElement>) => void;
  user: User | null;
}

export default function UserMobileMenu({
  mobileMoreAnchorEl,
  setMobileMoreAnchorEl,
  handleMobileMenuClose,
  handleProfileMenuOpen,
  user,
}: UserMobileMenuProps) {
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
      <MenuItem
        sx={{
          display: "flex",
          gap: 1,
          paddingInline: 3,
        }}
      >
        {/* Notificações */}
        {/* <Badge badgeContent={4} color="error">
          </Badge> */}
        <FavoriteIcon />
        Wishlist
      </MenuItem>
      <MenuItem
        sx={{
          display: "flex",
          gap: 1,
          paddingInline: 3,
        }}
      >
        {/* Notificações */}
        {/* <Badge badgeContent={17} color="error">
          </Badge> */}
        <ShoppingCartIcon />
        Carrinho
      </MenuItem>
      <MenuItem
        sx={{
          display: "flex",
          gap: 1,
          paddingInline: 3,
        }}
      >
        {/* Notificações */}
        {/* <Badge badgeContent={17} color="error">
          </Badge> */}
        <FolderIcon />
        Biblioteca
      </MenuItem>
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
        {user?.profile_picture ? (
          <Avatar
            src={user.profile_picture}
            slotProps={{ img: { loading: "lazy" } }}
            sx={{
              width: 24,
              height: 24,
            }}
          />
        ) : (
          <AccountCircle />
        )}
        Perfil
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <Box sx={{ display: { xs: "flex", lg: "none" } }}>
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
