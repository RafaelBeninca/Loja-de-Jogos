import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { useContext, useEffect, useState } from "react";
import { OriginalGame, Review, User } from "../types/types";
import UserContext from "../contexts/UserContext";
import ReviewForm from "../components/ReviewForm";
import { emptyOriginalGame } from "../utils/defaultValues";
import { Avatar, Box, Button, ThemeProvider, Typography } from "@mui/material";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "../styles/imageCarousel.css";
import Rating from "@mui/material/Rating";
import theme from "../components/Theming";

export default function Game() {
  const [game, setGame] = useState<OriginalGame>(emptyOriginalGame);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userReview, setUserReview] = useState<Review | null>(null);
  const [isUpdatingReview, setIsUpdatingReview] = useState(false);
  const [isBoughtGame, setIsBoughtGame] = useState(false);
  const [developerUser, setDeveloperUser] = useState<User>();
  const [publisherUser, setPublisherUser] = useState<User>();
  const [carouselImages, setCarouselImages] = useState<string[]>([]);
  const { getUser, loginUser, logoutUser, user } = useContext(UserContext);
  const params = useParams();
  const navigate = useNavigate();

  const loginIfToken = () => {
    getUser().then(({ user, token }) => {
      if (token) {
        loginUser(token, user);
      } else {
        logoutUser();
      }
    });
  };

  const getReviews = () => {
    axiosInstance
      .get(`/api/reviews?game_id=${game.id}`)
      .then((response) => {
        console.log(response);
        setReviews(response.data.reviews);
        setUsers(response.data.users);
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
      })
      .catch((error) => {
        console.error(error);
        navigate("/error");
      });
  };

  const getBoughtGame = () => {
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
    return users.filter((user) => parseInt(user.id) === review.user_id)[0];
  };

  const getDeveloperUser = () => {
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
    const list: string[] = [];
    for (const key in game) {
      const value = game[key as keyof OriginalGame];
      if (key.includes("preview") && typeof value === "string" && value !== "") {
        list.push(value);
      }
    }

    setCarouselImages(list);
  };

  useEffect(loginIfToken, []);
  useEffect(getGameWithTitle, []);
  useEffect(getReviews, [game.id]);
  useEffect(getDeveloperUser, [game.developer]);
  useEffect(getPublisherUser, [game.publisher]);
  useEffect(handleCarouselImages, [game.preview_image_1]);
  useEffect(getBoughtGame, [user.id, game.id]);

  return (
    <>
      <ThemeProvider theme={theme}>
        {game.id === 0 ? (
          <p>
            <b>Carregando...</b>
          </p>
        ) : (
          <Box
            sx={{
              width: "70%",
              marginInline: "auto",
              display: "flex",
              flexDirection: "column",
              paddingBlock: 5,
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
                  {carouselImages.map((imgSrc) => {
                    return (
                      <div>
                        <img
                          src={imgSrc}
                          alt=""
                          draggable="false"
                          style={{ aspectRatio: 16 / 9 }}
                        />
                      </div>
                    );
                  })}
                </Carousel>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  width: "30%"
                }}
              >
                <Box
                  component={"img"}
                  src={game.banner_image}
                  alt=""
                  sx={{
                    aspectRatio: 16 / 9,
                  }}
                />
                <Typography sx={{ fontSize: 13 }}>{game.summary}</Typography>

                {/* TODO */}
                <Typography sx={{ fontSize: 13 }}>
                  Análises: 4.5{" "}
                  <Rating
                    value={4.8}
                    precision={0.1}
                    readOnly
                    sx={{ fontSize: 12 }}
                  />{" "}
                  (100)
                </Typography>
                <Typography sx={{ fontSize: 13 }}>
                  Data de lançamento:{" "}
                  {game.release_date
                    ? getFormattedDatetime(game.release_date)
                    : "Não definida"}
                </Typography>
                <Box>
                  <Typography sx={{ fontSize: 13 }}>
                    Desenvolvedor:{" "}
                    {developerUser ? (
                      <Link to={`/partner/${developerUser.username}`}>
                        {developerUser.username}
                      </Link>
                    ) : (
                      game.developer
                    )}
                  </Typography>
                  <Typography sx={{ fontSize: 13 }}>
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
                <Typography>
                  {isBoughtGame ? (
                    <a href={game?.game_file}>Download</a>
                  ) : (
                    <Button onClick={handleOnClickBuy} variant="contained">
                      Comprar
                    </Button>
                  )}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="h2" sx={{ fontSize: 24, marginBlock: 3 }}>
                Sobre
              </Typography>
              <Typography sx={{ fontSize: 13 }}>{game.about}</Typography>
            </Box>
            <Box>
              <Typography variant="h2" sx={{ fontSize: 24, marginBlock: 3 }}>
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
                {reviews.map((review) => (
                  <Box>
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
                      <Typography sx={{ fontSize: 13, fontWeight: "bold" }}>
                        {getReviewUser(review).username}
                      </Typography>
                    </Link>
                    <Rating value={review.rating} readOnly precision={0.5} />
                    <Typography sx={{ fontSize: 13 }}>
                      Publicada: {getFormattedDatetime(review.created_at)}
                    </Typography>
                    <Typography sx={{ fontSize: 14, marginBlock: 2 }}>
                      {review.comment}
                    </Typography>
                    {review.updated_at && (
                      <Typography
                        sx={{
                          fontSize: 12,
                          fontWeight: "bold",
                          marginBottom: 2,
                        }}
                      >
                        *Editada: {getFormattedDatetime(review.updated_at)}
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
                              marginBottom: 3,
                            }}
                          >
                            <Button
                              color="error"
                              variant="outlined"
                              size="small"
                              onClick={() => handleOnDeleteReview(review.id)}
                            >
                              Deletar
                            </Button>
                            <Button
                              color="info"
                              variant="contained"
                              size="small"
                              onClick={() => setIsUpdatingReview(true)}
                            >
                              Atualizar
                            </Button>
                          </Box>
                          {!userReview && setUserReview(review)}
                        </>
                      )}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        )}
      </ThemeProvider>
    </>
  );
}
