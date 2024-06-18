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
  const [carouselImages, setCarouselImages] = useState<
    { key: string; value: string }[]
  >([]);
  const [gameMoreAnchorEl, setGameMoreAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [wishlistItem, setWishlistItem] = useState<WishlistItem | null>(null);
  const [cartItem, setCartItem] = useState<CartItem | null>(null);
  const { getUser, loginUser, logoutUser, user } = useContext(UserContext);
  const params = useParams();
  const navigate = useNavigate();

  const isGameMenuOpen = Boolean(gameMoreAnchorEl);

  const loginIfToken = () => {
    getUser().then(({ user, token }) => {
      if (token) {
        loginUser(token, user);
      } else {
        logoutUser();
      }
    });
  };

  const getWishlistItem = () => {
    axiosInstance
      .get(`/api/wishlist?game_id=${game.id}`)
      .then((response) => {
        console.log(response);
        setWishlistItem(response.data.item);
      })
      .catch((error) => {
        console.error(error);
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
      .get(`/api/games?game_title=${params.title}`)
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
    if (user.id === "0" || game.id === 0) return;

    const config = {
      headers: {
        Authorization: "Bearer " + (localStorage.getItem("token") || ""),
      },
    };

    axiosInstance
      .get(`/api/bought_games?user_id=${user.id}&&game_id=${game.id}`, config)
      .then((response) => {
        console.log(response);
        setIsBoughtGame(true);
      })
      .catch((error) => {
        console.error(error);
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
          alert(`Erro. \n\nTente novamente.`);
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
        alert("Review excluída com sucesso!");
        getReviews();
      })
      .catch((error) => {
        console.error(error);
        if (error.response.status === 401) {
          navigate("/logout");
        } else {
          alert(`Erro. \n\nTente novamente.`);
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

    setCarouselImages(list);
    console.log(list);
  };

  const handleImgError = async (fieldName: string) => {
    try {
      const response = await axiosInstance.get(
        `/api/games?game_title=${game.title}&&field_name=${fieldName}`
      );
      setGame({ ...game, [fieldName]: response.data.url });
      console.log(response);
    } catch (error) {
      console.error(error);
    }
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

  const handleGameMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
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
          alert("Você já comprou este jogo");
        } else {
          alert(`Erro. \n\nTente novamente.`);
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
          alert(`${error.response.data}. \n\nTente novamente.`);
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
            gap: 1
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
            gap: 1
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
            gap: 1
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
            gap: 1
          }}
        >
          <FavoriteBorderIcon />
          <Typography>Adicionar</Typography>
        </MenuItem>
      )}
    </Menu>
  );

  useEffect(loginIfToken, []);
  useEffect(getGameWithTitle, [params.title]);
  useEffect(getReviews, [game.id]);
  useEffect(getWishlistItem, [game.id]);
  useEffect(getDeveloperUser, [game.developer]);
  useEffect(getPublisherUser, [game.publisher]);
  useEffect(getBoughtGame, [user.id, game.id]);
  useEffect(handleCarouselImages, [game.id]);
  useEffect(() => {
    getGameFileLink();
  }, [game.game_file]);

  return (
    <>
      <Box
        sx={{
          width: "70%",
          marginInline: "auto",
          display: "flex",
          flexDirection: "column",
          paddingBlock: 5,
          marginTop: 10,
          gap: 4,
        }}
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
              <Typography variant="h1">{params.title}</Typography>
              <Box
                sx={{
                  display: "flex",
                  gap: 3,
                }}
              >
                <Box
                  sx={{
                    width: "70%",
                  }}
                >
                  <Carousel
                    swipeable={true}
                    useKeyboardArrows={true}
                    showStatus={false}
                    thumbWidth={100}
                    infiniteLoop={true}
                  >
                    {carouselImages.length > 0
                      ? carouselImages.map(({ key, value }) => {
                          return (
                            <div>
                              <img
                                src={value}
                                onError={() => handleImgError(key)}
                                alt=""
                                draggable="false"
                                style={{ aspectRatio: 16 / 9 }}
                              />
                            </div>
                          );
                        })
                      : [
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
                          </div>,
                        ]}
                  </Carousel>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    width: "30%",
                  }}
                >
                  <Box
                    component={"img"}
                    src={game.banner_image}
                    onError={() => handleImgError("banner_image")}
                    alt=""
                    sx={{
                      aspectRatio: 16 / 9,
                    }}
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
                        label={genre.name}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                    ))}
                  </Box>
                  <Typography
                    sx={{
                      marginBlock: 1,
                    }}
                  >
                    {isBoughtGame ? (
                      <Button variant="contained" href={game.game_file}>
                        Download
                      </Button>
                    ) : (
                      <Button
                        onClick={handleOnClickBuy}
                        variant="contained"
                        sx={{
                          gap: 1,
                        }}
                      >
                        <AddShoppingCart />
                        R${game.price}
                      </Button>
                    )}
                  </Typography>
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
                  right: -10,
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
                      >
                        <Link
                          key={review.id}
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
                        {/* <Paper elevation={4} sx={{
                        paddingInline: 1,
                        paddingBlock: 1,
                        marginBlock: 2
                      }}> */}
                        <Typography sx={{ fontSize: 14, marginBlock: 2 }}>
                          {review.comment}
                        </Typography>
                        {/* </Paper> */}
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
                        {review.user_id === parseInt(user.id) &&
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
                                  color="error"
                                  variant="outlined"
                                  size="small"
                                  onClick={() =>
                                    handleOnDeleteReview(review.id)
                                  }
                                >
                                  Excluir
                                </Button>
                                <Button
                                  color="info"
                                  variant="contained"
                                  size="small"
                                  onClick={() => setIsUpdatingReview(true)}
                                >
                                  Alterar
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
      </Box>
    </>
  );
}
