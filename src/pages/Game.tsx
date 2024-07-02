import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useContext, useEffect, useState } from "react";
import {
  CartItem,
  Genre,
  OriginalGame,
  Review,
  User,
  WishlistItem,
} from "../types/types";
import UserContext from "../contexts/UserContext";
import ReviewForm from "../components/ReviewForm";
import { emptyOriginalGame } from "../utils/defaultValues";
import {
  Avatar,
  Box,
  Button,
  Card,
  Chip,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../styles/imageCarousel.css";
import Rating from "@mui/material/Rating";
import AddShoppingCart from "@mui/icons-material/AddShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import { onRemoveFromCart } from "../funcs/async/CartFunctions";
import { onRemoveFromWishlist } from "../funcs/async/WishlistFunctions";
import MoreIcon from "@mui/icons-material/MoreVert";
import ImageComponent from "../components/ImageComponent";
import BuyButton from "../components/BuyButton";

export default function Game() {
  const [game, setGame] = useState<OriginalGame>(emptyOriginalGame);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [reviewAverage, setReviewAverage] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isUpdatingReview, setIsUpdatingReview] = useState(false);
  const [isBoughtGame, setIsBoughtGame] = useState(false);
  const [developerUser, setDeveloperUser] = useState<User>();
  const [publisherUser, setPublisherUser] = useState<User>();
  const [carouselImagesSrc, setCarouselImagesSrc] = useState<
    { key: string; value: string }[]
  >([]);
  const [carouselImages, setCarouselImages] = useState<React.ReactElement[]>(
    []
  );
  const [hasHandledCarouselImages, setHasHandledCarouselImages] =
    useState(false);
  const [gameMoreAnchorEl, setGameMoreAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [wishlistItem, setWishlistItem] = useState<WishlistItem | null>(null);
  const [cartItem, setCartItem] = useState<CartItem | null>(null);
  const { logoutUser, user } = useContext(UserContext);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const navigate = useNavigate();
  const { title } = useParams();

  const isGameMenuOpen = Boolean(gameMoreAnchorEl);

  const getWishlistItem = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + (localStorage.getItem("token") || ""),
      },
    };
    if (game.id === 0 || user?.id === "") return;

    axiosInstance
      .get(`/api/wishlist?game_id=${game.id}`, config)
      .then((response) => {
        console.log(response);
        setWishlistItem(response.data.item);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          return;
        } else {
          console.error(error);
        }
      });
  };

  const getCartItem = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + (localStorage.getItem("token") || ""),
      },
    };
    if (game.id === 0 || user?.id === "") return;

    axiosInstance
      .get(`/api/carts?game_id=${game.id}`, config)
      .then((response) => {
        console.log(response);
        setCartItem(response.data.item);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          return;
        } else {
          console.error(error);
        }
      });
  };

  const getReviews = () => {
    if (game.id === 0) return;

    axiosInstance
      .get(`/api/reviews?game_id=${game.id}`)
      .then((response) => {
        console.log(response);
        setReviews(response.data.reviews);
        setUsers(response.data.users);
        setReviewAverage(response.data.avg);
        setUserReview(null);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getGameWithTitle = () => {
    axiosInstance
      .get(`/api/games?game_title=${title}`)
      .then((response) => {
        console.log(response);
        setGame(response.data.game);
        setGenres(response.data.genres);
      })
      .catch((error) => {
        console.error(error);
        navigate("/error");
      });
  };

  const getBoughtGame = () => {
    if (user?.id === "0" || game.id === 0) return;

    const config = {
      headers: {
        Authorization: "Bearer " + (localStorage.getItem("token") || ""),
      },
    };

    axiosInstance
      .get(`/api/bought_games?user_id=${user?.id}&&game_id=${game.id}`, config)
      .then((response) => {
        console.log(response);
        setIsBoughtGame(true);
      })
      .catch((error) => {
        if (error.response.status === 400) {
          return;
        } else {
          console.error(error);
        }
      });
  };

  const handleOnClickBuy = () => {
    const config = {
      headers: {
        Authorization: "Bearer " + (localStorage.getItem("token") || ""),
      },
    };
    const data = {
      game_id: game.id,
    };

    axiosInstance
      .post("/api/cart-item", data, config)
      .then((response) => {
        console.log(response.data);
        navigate("/cart", { relative: "route" });
      })
      .catch((error) => {
        console.error(error.data);
        if (error.response.status === 401) {
          logoutUser();
          navigate("/login", { relative: "route" });
        } else if (error.response.status === 409) {
          navigate("/cart", { relative: "route" });
        } else {
          setShowDialog(true);
          setDialogText("Erro.");
        }
      });
  };

  const handleOnDeleteReview = (reviewId: number) => {
    const config = {
      headers: {
        Authorization: "Bearer " + (localStorage.getItem("token") || ""),
      },
    };

    axiosInstance
      .delete(`/api/reviews?review_id=${reviewId}`, config)
      .then((response) => {
        console.log(response);
        setShowDialog(true);
        setDialogText("Review excluída com sucesso.");
        getReviews();
      })
      .catch((error) => {
        console.error(error);
        if (error.response.status === 401) {
          logoutUser();
          navigate("/");
        } else {
          setShowDialog(true);
          setDialogText("Erro.");
        }
      });
  };

  const getReviewUser = (review: Review) => {
    return users.find((user) => parseInt(user.id) === review.user_id)!;
  };

  const getDeveloperUser = () => {
    if (!game.developer) return;

    axiosInstance
      .get(`/api/users?username=${game.developer}`)
      .then((response) => {
        console.log(response);
        setDeveloperUser(response.data.user);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getPublisherUser = () => {
    if (!game.publisher) return;

    axiosInstance
      .get(`/api/users?username=${game.publisher}`)
      .then((response) => {
        console.log(response);
        setPublisherUser(response.data.user);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getFormattedDatetime = (date: string) => {
    const newDate = new Date(date);
    return (
      newDate.toLocaleTimeString().substring(0, 5) +
      " - " +
      newDate.toLocaleDateString()
    );
  };

  const handleCarouselImages = () => {
    if (game.id === 0) return;

    const list: { key: string; value: string }[] = [];
    for (const key in game) {
      const value = game[key as keyof OriginalGame];
      if (
        key.includes("preview") &&
        typeof value === "string" &&
        value !== ""
      ) {
        list.push({ key: key, value: value });
      }
    }

    setCarouselImagesSrc(list);
    setHasHandledCarouselImages(true);
    console.log(list);
  };

  const createCarouselImages = () => {
    if (!hasHandledCarouselImages) return;

    const list: React.ReactElement[] = [];

    if (carouselImagesSrc.length > 0) {
      carouselImagesSrc.map(({ key, value }, index) => {
        list.push(
          <div key={index}>
            <ImageComponent
              game={game}
              setGame={setGame}
              fieldName={key}
              src={value}
              setCarouselImagesSrc={setCarouselImagesSrc}
            />
          </div>
        );
      });
    } else {
      list.push(
        <div
          style={{
            width: "100%",
            aspectRatio: 16 / 9,
          }}
        >
          <Paper
            elevation={2}
            sx={{
              width: "100%",
              aspectRatio: 16 / 9,
            }}
          >
            <InsertPhotoIcon
              color="secondary"
              sx={{
                marginBlock: "20%",
                fontSize: 100,
              }}
            />
          </Paper>
        </div>
      );
    }

    setCarouselImages(list);
  };

  const getGameFileLink = async () => {
    if (game.id === 0) return;

    try {
      const response = await axiosInstance.head(game.game_file);
      console.log(response);
    } catch (error) {
      console.log(error);
      const response = await axiosInstance.get(
        `/api/games?game_title=${game.title}&&field_name=game_file`
      );
      setGame({ ...game, game_file: response.data.url });
    }
  };

  const handleGameMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setGameMoreAnchorEl(event.currentTarget);
  };

  const handleGameMenuClose = (e: object) => {
    const event = e as React.MouseEvent<MouseEvent>;

    event.preventDefault();
    event.stopPropagation();
    setGameMoreAnchorEl(null);
  };

  const onAddToCart = () => {
    const data = {
      game_id: game.id,
    };
    const config = {
      headers: {
        Authorization: "Bearer " + (localStorage.getItem("token") || ""),
      },
    };
    axiosInstance
      .post("/api/cart-item", data, config)
      .then((response) => {
        console.log(response.data);
        setCartItem(response.data.cart_item);
      })
      .catch((error) => {
        console.error(error.data);
        if (error.response.status === 401) {
          logoutUser();
          navigate("/login");
        } else if (error.response.status === 409) {
          setShowDialog(true);
          setDialogText("Você já comprou este jogo.");
        } else {
          setShowDialog(true);
          setDialogText("Erro.");
        }
      });
  };

  const onAddToWishlist = () => {
    const data = {
      game_id: game.id,
    };
    const config = {
      headers: {
        Authorization: "Bearer " + (localStorage.getItem("token") || ""),
      },
    };
    axiosInstance
      .post("/api/wishlist-item", data, config)
      .then((response) => {
        console.log(response.data);
        setWishlistItem(response.data.wishlist_item);
      })
      .catch((error) => {
        console.error(error.data);
        if (error.response.status === 401) {
          logoutUser();
          navigate("/login");
        } else {
          setShowDialog(true);
          setDialogText("Erro.");
        }
      });
  };

  const renderGameMenu = (
    <Menu
      anchorEl={gameMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isGameMenuOpen}
      onClose={(e) => handleGameMenuClose(e)}
    >
      {cartItem ? (
        <MenuItem
          onClick={(e) => {
            e.preventDefault();
            onRemoveFromCart({
              delCartItem: cartItem,
              setCartItem: setCartItem,
            });
          }}
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <RemoveShoppingCartIcon />
          <Typography>Remover</Typography>
        </MenuItem>
      ) : (
        <MenuItem
          onClick={(e) => {
            e.preventDefault();
            onAddToCart();
          }}
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <AddShoppingCart />
          <Typography>Adicionar</Typography>
        </MenuItem>
      )}
      {wishlistItem ? (
        <MenuItem
          onClick={(e) => {
            e.preventDefault();
            onRemoveFromWishlist({
              delWishlistItem: wishlistItem,
              setWishlistItem: setWishlistItem,
            });
          }}
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <FavoriteIcon />
          <Typography>Remover</Typography>
        </MenuItem>
      ) : (
        <MenuItem
          onClick={(e) => {
            e.preventDefault();
            onAddToWishlist();
          }}
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <FavoriteBorderIcon />
          <Typography>Adicionar</Typography>
        </MenuItem>
      )}
    </Menu>
  );

  useEffect(getGameWithTitle, [title]);
  useEffect(getReviews, [game.id]);
  useEffect(getWishlistItem, [game.id, user?.id]);
  useEffect(getCartItem, [game.id, user?.id]);
  useEffect(getDeveloperUser, [game.developer]);
  useEffect(getPublisherUser, [game.publisher]);
  useEffect(getBoughtGame, [user?.id, game.id]);
  useEffect(handleCarouselImages, [game.id]);
  useEffect(createCarouselImages, [hasHandledCarouselImages]);
  useEffect(() => {
    getGameFileLink();
  }, []);
  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [window.screen.width]);

  return (
    <Box
      sx={{
        width: { xs: "90%", sm: "70%" },
        marginInline: "auto",
        display: "flex",
        flexDirection: "column",
        paddingBlock: 5,
        marginTop: 10,
        gap: 4,
      }}
      key={title}
    >
      {game.id === 0 ? (
        <Typography sx={{ fontWeight: "bold" }}>Carregando...</Typography>
      ) : (
        <>
          <Box
            sx={{
              position: "relative",
            }}
          >
            <Typography variant="h1">{title}</Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column-reverse", md: "row" },
                gap: 3,
              }}
            >
              {screenWidth < 900 && (
                  <BuyButton
                    isBoughtGame={isBoughtGame}
                    game={game}
                    handleOnClickBuy={handleOnClickBuy}
                  />
                )}
              <Box
                sx={{
                  width: { xs: "100%", md: "70%" },
                  marginTop: {xs: 2, md: 0}
                }}
              >
                <Carousel
                  swipeable={true}
                  useKeyboardArrows={true}
                  showStatus={false}
                  thumbWidth={100}
                  infiniteLoop={true}
                  renderThumbs={() =>
                    carouselImagesSrc.map(({ value }) => {
                      return (
                        <img
                          src={value}
                          loading="lazy"
                          style={{ aspectRatio: 16 / 9 }}
                        />
                      );
                    })
                  }
                >
                  {carouselImages}
                </Carousel>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  width: { xs: "100%", md: "30%" },
                }}
              >
                <ImageComponent
                  game={game}
                  setGame={setGame}
                  fieldName={"banner_image"}
                  src={game.banner_image}
                />
                <Typography>{game.summary}</Typography>

                <Typography>
                  Análises: {reviewAverage.toPrecision(2) + " "}
                  <Rating
                    value={reviewAverage}
                    precision={0.1}
                    readOnly
                    sx={{ fontSize: 12 }}
                  />{" "}
                  ({reviews.length})
                </Typography>
                <Typography>
                  Data de lançamento:{" "}
                  {game.release_date
                    ? getFormattedDatetime(game.release_date)
                    : "Não definida"}
                </Typography>
                <Box>
                  <Typography>
                    Desenvolvedor:{" "}
                    {developerUser ? (
                      <Link to={`/partner/${developerUser.username}`}>
                        {developerUser.username}
                      </Link>
                    ) : (
                      game.developer
                    )}
                  </Typography>
                  <Typography>
                    Distribuidora:{" "}
                    {publisherUser ? (
                      <Link to={`/partner/${publisherUser.username}`}>
                        {publisherUser.username}
                      </Link>
                    ) : (
                      game.publisher
                    )}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: 0.6,
                  }}
                >
                  {genres.map((genre) => (
                    <Chip
                      key={genre.id}
                      label={genre.name}
                      size="small"
                      variant="outlined"
                      color="secondary"
                    />
                  ))}
                </Box>
                {screenWidth >= 900 && (
                  <BuyButton
                    isBoughtGame={isBoughtGame}
                    game={game}
                    handleOnClickBuy={handleOnClickBuy}
                  />
                )}
              </Box>
            </Box>
            <IconButton
              size="large"
              aria-label="show more"
              aria-haspopup="true"
              color="inherit"
              onClick={(e) => handleGameMenuOpen(e)}
              sx={{
                position: "absolute",
                top: 0,
                right: -14,
              }}
            >
              <MoreIcon />
            </IconButton>
            {renderGameMenu}
          </Box>
          {/* Sobre */}
          <Box>
            <Typography variant="h2" sx={{ fontSize: 24, marginBlock: 2 }}>
              Sobre
            </Typography>
            <Typography>{game.about}</Typography>
          </Box>

          {/* Reviews */}
          <Box>
            <Typography variant="h2" sx={{ fontSize: 24, marginBlock: 2 }}>
              Análises
            </Typography>

            {/* Review nova */}
            {isBoughtGame && !userReview && (
              <ReviewForm game={game} getReviews={getReviews} />
            )}

            {/* Update de review */}
            {isBoughtGame && userReview && isUpdatingReview && (
              <ReviewForm
                game={game}
                userReview={userReview}
                setIsUpdatingReview={setIsUpdatingReview}
                getReviews={getReviews}
              />
            )}
            <Box>
              {reviews.length === 0 ? (
                <Typography>
                  Parece que este jogo ainda não tem nenhuma análise
                </Typography>
              ) : (
                <>
                  {reviews.map((review) => (
                    <Card
                      sx={{
                        padding: 2,
                        borderRadius: 1,
                        marginBottom: 3,
                      }}
                      key={review.id}
                    >
                      <Link
                        to={`/user/${getReviewUser(review).username}`}
                        style={{
                          display: "flex",
                          gap: 5,
                          width: "fit-content",
                          justifyContent: "center",
                          alignItems: "center",
                          textDecoration: "none",
                          color: "inherit",
                        }}
                      >
                        <Avatar
                          src={getReviewUser(review).profile_picture}
                          alt=""
                        />
                        <Typography sx={{ fontWeight: "bold" }}>
                          {getReviewUser(review).username}
                        </Typography>
                      </Link>
                      <Rating
                        value={review.rating}
                        readOnly
                        size="small"
                        sx={{
                          marginTop: 1,
                        }}
                        precision={0.5}
                      />
                      <Typography sx={{ fontSize: 14, marginBlock: 2 }}>
                        {review.comment}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                        }}
                      >
                        Publicada: {getFormattedDatetime(review.created_at)}
                      </Typography>
                      {review.updated_at && (
                        <Typography variant="caption">
                          Editada: {getFormattedDatetime(review.updated_at)}
                        </Typography>
                      )}
                      {review.user_id === parseInt(user?.id || "0") &&
                        !isUpdatingReview && (
                          <>
                            <Box
                              sx={{
                                display: "flex",
                                gap: 1,
                                marginTop: 1,
                              }}
                            >
                              <Button
                                color="primary"
                                variant="contained"
                                size="small"
                                onClick={() => setIsUpdatingReview(true)}
                              >
                                Alterar
                              </Button>
                              <Button
                                color="error"
                                variant="outlined"
                                size="small"
                                onClick={() => handleOnDeleteReview(review.id)}
                              >
                                Excluir
                              </Button>
                            </Box>
                            {!userReview && setUserReview(review)}
                          </>
                        )}
                    </Card>
                  ))}
                </>
              )}
            </Box>
          </Box>
        </>
      )}
      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{dialogText}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setShowDialog(false)}>Ok</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
