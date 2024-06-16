import { Link, useNavigate } from "react-router-dom";
import { GameAverage, OriginalGame, Review } from "../types/types";
import axiosInstance from "../utils/axiosInstance";
import MoreIcon from "@mui/icons-material/MoreVert";
import {
  Box,
  Card,
  IconButton,
  Menu,
  MenuItem,
  Rating,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";

export interface PartnerHomeGameListProps {
  games: OriginalGame[];
  updateCallback: () => void;
}

export default function PartnerHomeGameList({
  games,
  updateCallback,
}: PartnerHomeGameListProps) {
  const [gameMoreAnchorEl, setGameMoreAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [selectedGame, setSelectedGame] = useState<OriginalGame | null>(null);
  const [gamesAverage, setGamesAverage] = useState<GameAverage[]>();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const isGameMenuOpen = Boolean(gameMoreAnchorEl);

  const getGamesAverage = () => {
    axiosInstance
      .get(`/api/reviews?creator_id=${user.id}`)
      .then((response) => {
        console.log(response);
        setGamesAverage(response.data.avgs);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onDelete = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (confirm("Tem certeza que deseja excluir esse jogo?")) {
      // Continuar
    } else {
      // Cancelar
      return;
    }

    const config = {
      headers: {
        Authorization: "Bearer " + (localStorage.getItem("token") || ""),
      },
    };
    axiosInstance
      .delete(`/api/games?game_id=${selectedGame?.id}`, config)
      .then((response) => {
        console.log(response);
        setGameMoreAnchorEl(null);
        setSelectedGame(null);
        updateCallback();

        alert(`Jogo deletado com sucesso.`);
      })
      .catch((error) => {
        console.log(error);
        setGameMoreAnchorEl(null);
        setSelectedGame(null);

        if (error.response.status === 401) {
          navigate("/logout");
        }
        if (error.response.status === 403) {
          console.error("Usuário não tem permissão para excluir esse jogo");
        } else {
          alert(`${error.response.data}. \n\nTente novamente.`);
        }
      });
  };

  const handleGameMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    game: OriginalGame
  ) => {
    event.stopPropagation();
    event.preventDefault();
    setSelectedGame(game);
    setGameMoreAnchorEl(event.currentTarget);
  };

  const handleGameMenuClose = (e: object) => {
    e.preventDefault();
    e.stopPropagation();
    setGameMoreAnchorEl(null);
    setSelectedGame(null);
  };

  const gameMenuId = "primary-search-game-menu";
  const renderGameMenu = (
    <Menu
      anchorEl={gameMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={gameMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isGameMenuOpen}
      onClose={(e) => handleGameMenuClose(e)}
    >
      <MenuItem>
        <Typography onClick={onDelete} color={"error"} fontSize={"medium"}>
          Excluir
        </Typography>
      </MenuItem>
    </Menu>
  );

  useEffect(getGamesAverage, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {games.map((game) => (
        <Link
          to={`/partner/game/${game.title}`}
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
        >
          <Card
            key={game.id}
            sx={{
              display: "flex",
              gap: 3,
              padding: 2,
            }}
            elevation={2}
          >
            <Box
              component={"img"}
              src={game.banner_image}
              alt=""
              sx={{
                width: "60%",
                aspectRatio: 16 / 9,
              }}
            />
            <Box
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="h2">{game.title}</Typography>
                {gamesAverage && (
                  <Typography
                    sx={{
                      fontSize: 14,
                      marginBottom: 1
                    }}
                  >
                    {gamesAverage
                      .filter(({ title }) => title === game.title)[0]
                      .avg.toPrecision(2) + " "}
                    <Rating
                      value={
                        gamesAverage.filter(
                          ({ title }) => title === game.title
                        )[0].avg
                      }
                      readOnly
                      precision={0.1}
                      size="small"
                      sx={{
                        position: "relative",
                        top: 4,
                      }}
                    />
                    (
                    {
                      gamesAverage.filter(
                        ({ title }) => title === game.title
                      )[0].num_of_reviews
                    }
                    )
                  </Typography>
                )}
                <Typography>{game.summary}</Typography>
              </Box>
              <Typography variant="h2" component="p">
                R${game.price}
              </Typography>

              {/* <Box
              sx={{
                display: "flex",
                gap: 1,
              }}
            >
              <Button
                color="info"
                variant="contained"
                onClick={() => onUpdate(game)}
              >
                Update
              </Button>
              <Button
                color="error"
                variant="outlined"
                onClick={() => onDelete(game.id)}
              >
                Delete
              </Button>
            </Box> */}
              <IconButton
                size="large"
                aria-label="show more"
                aria-haspopup="true"
                color="inherit"
                onClick={(e) => handleGameMenuOpen(e, game)}
                sx={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                }}
              >
                <MoreIcon />
              </IconButton>
              {renderGameMenu}
            </Box>
          </Card>
        </Link>
      ))}
    </Box>
  );
}
