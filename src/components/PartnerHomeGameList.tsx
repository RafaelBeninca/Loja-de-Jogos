import { Link, useNavigate } from "react-router-dom";
import { GameAverage, GameGenre, OriginalGame } from "../types/types";
import axiosInstance from "../utils/axiosInstance";
import MoreIcon from "@mui/icons-material/MoreVert";
import {
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
  Rating,
  Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";

export interface PartnerHomeGameListProps {
  games: OriginalGame[];
  setGames: (games: OriginalGame[]) => void;
  updateCallback: () => void;
}

export default function PartnerHomeGameList({
  games,
  setGames,
  updateCallback,
}: PartnerHomeGameListProps) {
  const [gameMoreAnchorEl, setGameMoreAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [partnerGenres, setPartnerGenres] = useState<GameGenre[]>([]);
  const [selectedGame, setSelectedGame] = useState<OriginalGame | null>(null);
  const [gamesAverage, setGamesAverage] = useState<GameAverage[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [dialogText, setDialogText] = useState("");
  const { user, logoutUser } = useContext(UserContext);
  const navigate = useNavigate();

  const isGameMenuOpen = Boolean(gameMoreAnchorEl);

  const getGamesAverage = () => {
    if (!user.id) return;

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

  const onDelete = () => {
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
        navigate("/partner", {
          state: { alert: "Jogo deletado com sucesso." },
        });
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
        setGameMoreAnchorEl(null);
        setSelectedGame(null);

        if (error.response.status === 401) {
          logoutUser();
          navigate("/");
        }
        if (error.response.status === 403) {
          console.error("Usuário não tem permissão para excluir esse jogo");
        } else {
          setShowDialog(true);
          setDialogText("Erro.");
        }
      });
  };

  const getPartnerGenres = () => {
    if (!user.id) return;

    axiosInstance
      .get(`/api/genres?creator_id=${user.id}`)
      .then((response) => {
        console.log(response);
        setPartnerGenres(response.data.game_genres);
      })
      .catch((error) => {
        console.error(error);
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
    const event = e as React.MouseEvent<MouseEvent>;

    event.preventDefault();
    event.stopPropagation();
    setGameMoreAnchorEl(null);
    setSelectedGame(null);
  };

  const handleImgError = (game: OriginalGame, fieldName: string) => {
    axiosInstance
      .get(`/api/games?game_title=${game.title}&&field_name=${fieldName}`)
      .then((response) => {
        setGames(
          games.map((oldGame) =>
            oldGame.id === game.id
              ? { ...game, [fieldName]: response.data.url }
              : oldGame
          )
        );
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
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
      <MenuItem>
        <Typography
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowDeleteDialog(true);
          }}
          color={"error"}
          fontSize={"medium"}
        >
          Excluir
        </Typography>
      </MenuItem>
    </Menu>
  );

  useEffect(getGamesAverage, []);
  useEffect(getPartnerGenres, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {games.map((game, index) => (
        <Link
          to={`/partner/game/${game.title}`}
          style={{
            textDecoration: "none",
            color: "inherit",
          }}
          key={index}
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
              src={game.banner_image ? game.banner_image : ""}
              onError={() => handleImgError(game, "banner_image")}
              alt=""
              sx={{
                width: "60%",
                aspectRatio: 16 / 9,
                borderRadius: 1,
              }}
            />
            <Box
              sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                justifyContent: "space-between",
                width: "40%",
              }}
            >
              <Box>
                <Typography variant="h2">{game.title}</Typography>
                {gamesAverage && (
                  <Typography
                    sx={{
                      fontSize: 14,
                      marginBottom: 1,
                    }}
                  >
                    {gamesAverage
                      .find(({ title }) => title === game.title)
                      ?.avg.toPrecision(2) + " "}
                    <Rating
                      value={
                        gamesAverage.find(({ title }) => title === game.title)
                          ?.avg
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
                      gamesAverage.find(({ title }) => title === game.title)
                        ?.num_of_reviews
                    }
                    )
                  </Typography>
                )}
                <Typography>{game.summary}</Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0.6,
                }}
              >
                <Typography variant="h2" component="p">
                  R${game.price.toFixed(2)}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    gap: 1,
                  }}
                >
                  {partnerGenres
                    .find(
                      ({ title, genres }) =>
                        game.title === title && genres.length > 0
                    )
                    ?.genres.map((genre, index) => (
                      <Chip
                        key={index}
                        label={genre.name}
                        size="small"
                        variant="outlined"
                        color="secondary"
                      />
                    ))}
                </Box>
              </Box>
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
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-delete-dialog-title">
          Tem certeza que deseja deletar este jogo?
        </DialogTitle>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>Não</Button>
          <Button
            onClick={() => {
              setShowDeleteDialog(false);
              onDelete();
            }}
          >
            Sim
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
