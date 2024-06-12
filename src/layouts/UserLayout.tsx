// import { useContext } from "react";
// import { Outlet, Link } from "react-router-dom";
// import UserContext from "../contexts/UserContext";

// export default function UserLayout() {
//     const { user, token } = useContext(UserContext)

//     return (
//     <>
//         <nav>
//         <ul>
//             <li>
//                 <Link to="/">Home</Link>
//             </li>
//             {token ?
//                 <li>
//                     <Link to='/logout'>Logout</Link>
//                 </li> :
//                 <>
//                     <li>
//                         <Link to="/login">Login as user</Link>
//                     </li>
//                     <li>
//                         <Link to="/partner/login">Login as partner</Link>
//                     </li>
//                 </>
//             }
//             {!token &&
//             <li>
//                 <Link to='/signup'>Signup</Link>
//             </li>
//             }
//             {token &&
//             <li>
//                 <Link to='/cart'>Cart</Link>
//             </li>
//             }
//             {token &&
//             <li>
//                 <Link to='/wishlist'>Wishlist</Link>
//             </li>
//             }
//             {token &&
//             <li>
//                 <Link to='/library'>Library</Link>
//             </li>
//             }
//             {token &&
//             <li>
//                 <a href={`/user/${user.username}`}><img src={user.profile_picture} alt="" width={'50px'} height={'50px'}/></a>
//             </li>
//             }
//         </ul>
//         </nav>

//         <Outlet />
//     </>
//     )
// }

import { useState, useContext } from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreIcon from "@mui/icons-material/MoreVert";
import LogoLong from "../assets/images/Logo_Long.png";
import { Link, Outlet, useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";
import { Avatar } from "@mui/material";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

export default function UserLayout() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    useState<null | HTMLElement>(null);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

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

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
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
        {user.username ? 
            <>
                <MenuItem onClick={() => {handleMenuClose(); navigate(`/user/${user.username}`)}}>Profile</MenuItem>
                <MenuItem onClick={() => {handleMenuClose(); navigate(`/settings/profile`)}}>Settings</MenuItem>
                <MenuItem onClick={() => {handleMenuClose(); navigate(`/logout`)}}>Logout</MenuItem>
            </> :
            <>
                <MenuItem onClick={() => {handleMenuClose(); navigate(`/login`)}}>Login de usuário</MenuItem>
                <MenuItem onClick={() => {handleMenuClose(); navigate(`/partner/login`)}}>Login de parceiro</MenuItem>
                <MenuItem onClick={() => {handleMenuClose(); navigate(`/signup`)}}>Signup</MenuItem>
            </>
        }
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
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
      <MenuItem>
        <IconButton size="large" aria-label="wishlist" color="inherit">
          <Badge badgeContent={4} color="error">
            <FavoriteIcon />
          </Badge>
        </IconButton>
        <p>Wishlist</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" aria-label="carrinho" color="inherit">
          <Badge badgeContent={17} color="error">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <p>Carrinho</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="primary-search-account-menu"
          aria-haspopup="true"
          color="inherit"
        >
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Link to={"/"}>
              <Box
                component="img"
                sx={{
                  width: 350,
                  maxWidth: { xs: 350, md: 250 },
                }}
                alt="The house from the offer."
                src={LogoLong}
              />
            </Link>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ "aria-label": "search" }}
              />
            </Search>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <IconButton size="large" aria-label="wishlist" color="inherit" onClick={() => navigate('/wishlist')}>
                {/* Ícone de notificação */}
                {/* <Badge badgeContent={4} color="error">
                </Badge> */}
                <FavoriteIcon />
              </IconButton>
              <IconButton size="large" aria-label="carrinho" color="inherit" onClick={() => navigate('/cart')}>
                {/* Ícone de notificação */}
                {/* <Badge badgeContent={17} color="error">
                </Badge> */}
                <ShoppingCartIcon />
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
                {user.profile_picture ? (
                  <Avatar src={user.profile_picture} />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
            </Box>

            {/* Mobile Menu */}
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
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </Box>
      <Outlet />
    </>
  );
}
