import { Link, useNavigate } from "react-router-dom";
import { OriginalGame, Review } from "../types/types";
import axiosInstance from "../utils/axiosInstance";
import { useContext, useState } from "react";
import { emptyUserReview } from "../utils/defaultValues";
import { Avatar, Box, Button, Rating, Typography } from "@mui/material";
import UserContext from "../contexts/UserContext";
import TextField from "@mui/material/TextField";

interface ReviewFormProps {
  game: OriginalGame;
  userReview?: Review;
  setIsUpdatingReview?: (arg0: boolean) => void;
  getReviews: () => void;
}

export default function ReviewForm({
  game,
  userReview = emptyUserReview,
  setIsUpdatingReview,
  getReviews,
}: ReviewFormProps) {
  const [newReview, setNewReview] = useState<Review>({
    id: userReview.id,
    user_id: userReview.user_id,
    game_id: userReview.game_id,
    rating: userReview.rating,
    comment: userReview.comment,
    created_at: userReview.created_at,
    updated_at: userReview.updated_at,
  });
  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const isUpdatingReview = userReview.id !== 0;

  const createReview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!game) return;

    const config = {
      headers: {
        Authorization: "Bearer " + (localStorage.getItem("token") || ""),
      },
    };

    const data = {
      game_id: game.id,
      comment: newReview.comment,
      rating: newReview.rating,
    };

    axiosInstance
      .post(`/api/reviews`, data, config)
      .then((response) => {
        console.log(response);
        alert("Review criada com sucesso!");
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

  const updateReview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const config = {
      headers: {
        Authorization: "Bearer " + (localStorage.getItem("token") || ""),
      },
    };

    const body = {
      rating: newReview.rating,
      comment: newReview.comment,
    };

    axiosInstance
      .patch(`/api/reviews?review_id=${newReview.id}`, body, config)
      .then((response) => {
        console.log(response);
        alert("Review alterada com sucesso!");
        setIsUpdatingReview!(false);
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

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Link
          to={`/user/${user.username}`}
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
          <Avatar src={user.profile_picture} alt="" />
          <Typography sx={{ fontSize: 13, fontWeight: "bold" }}>
            {user.username}
          </Typography>
        </Link>
        {isUpdatingReview && (
          <Button
            sx={{ fontSize: 36, width: "fit-content", padding: 0 }}
            size="small"
            onClick={() => setIsUpdatingReview?.(false)}
          >
            &times;
          </Button>
        )}
      </Box>
      <form onSubmit={isUpdatingReview ? updateReview : createReview}>
        <Rating
          value={newReview.rating}
          onChange={(e, newValue) =>
            setNewReview({ ...newReview, rating: newValue! })
          }
        />
        <TextField
          multiline
          fullWidth
          name="comment"
          id="comment"
          placeholder="Digite sua análise aqui..."
          label="Análise"
          value={newReview.comment}
          maxRows={15}
          sx={{
            display: "block",
            marginBlock: 2,
          }}
          onChange={(e) =>
            setNewReview({ ...newReview, comment: e.target.value })
          }
        />
        <Button
          type="submit"
          variant="contained"
          sx={{
            marginBlock: 2,
          }}
        >
          {isUpdatingReview ? "Atualizar" : "Criar"}
        </Button>
      </form>
    </Box>
  );
}
