import React, { useContext, useEffect, useState } from "react";
import UserContext from "../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import { FormUser } from "../types/types";
import UserImageInput from "../components/UserImageInput";
import { MarginTwoTone } from "@mui/icons-material";

export default function ProfileConfig() {
  const { user, getUser, loginUser } = useContext(UserContext);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formUser, setFormUser] = useState<FormUser>({
    username: "",
    email_address: "",
    password: "",
    profile_picture: "",
    summary: "",
  });
  const navigate = useNavigate();

  const loginIfToken = () => {
    getUser().then(({ user, token }) => {
      if (token) {
        setIsLoggedIn(true);
        loginUser(token, user);
      } else {
        setIsLoggedIn(false);
        navigate("/logout");
      }
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();

    if (formUser.username) formData.append("username", formUser.username);
    if (formUser.email_address)
      formData.append("email_address", formUser.email_address);
    if (formUser.password) formData.append("password", formUser.password);
    if (formUser.summary) formData.append("summary", formUser.summary);

    if (formUser.profile_picture && formUser.profile_picture instanceof File) {
      formData.append("profile_picture", formUser.profile_picture);
    }

    const config = {
      headers: {
        Authorization: "Bearer " + (localStorage.getItem("token") || ""),
        "Content-type": "multipart/form-data",
      },
    };

    axiosInstance
      .patch("/api/users", formData, config)
      .then((response) => {
        console.log(response);
        loginUser(response.data.token, response.data.user);

        alert("Informações alteradas com sucesso!");
        navigate(`/user/${user.username}`);
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

  const onDeleteAccount = () => {
    if (
      confirm(
        "Tem certeza que deseja excluir sua conta? (essa ação é irreversível)"
      )
    ) {
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
      .delete("/api/users", config)
      .then((response) => {
        console.log(response);

        alert("Conta deletada com sucesso!");
        navigate("/logout");
      })
      .catch((error) => {
        console.error(error);

        if (error.response.status === 401) {
          navigate("/logout");
        }
        if (error.response.status === 403) {
          console.error("Usuário não tem permissão para excluir essa conta");
        } else {
          alert(`${error.response.data}. \n\nTente novamente.`);
        }
      });
  };

  useEffect(loginIfToken, []);
  useEffect(
    () =>
      setFormUser({
        username: user.username,
        email_address: user.email_address,
        password: "",
        profile_picture: "",
        summary: user.summary,
      }),
    [isLoggedIn]
  );

  return (
    <>
      {isLoggedIn && (
        <div style={{marginTop: "10rem"}}>
          <form onSubmit={onSubmit} encType="multipart/form-data">
            <UserImageInput
              name="Profile Picture"
              id="profile_picture"
              setUser={setFormUser}
              user={formUser}
              defaultImage={user.profile_picture}
              required={false}
            />
            <br />
            <br />
            <input
              type="text"
              placeholder="Nome de usuário"
              required
              value={formUser.username}
              onChange={(e) =>
                setFormUser({ ...formUser, username: e.target.value })
              }
            />
            <br />
            <br />

            <input
              type="text"
              placeholder="Email"
              required
              value={formUser.email_address}
              onChange={(e) =>
                setFormUser({ ...formUser, email_address: e.target.value })
              }
            />
            <br />
            <br />

            <input
              type="password"
              placeholder="Senha"
              value={formUser.password}
              onChange={(e) =>
                setFormUser({ ...formUser, password: e.target.value })
              }
            />
            <br />
            <br />
            <textarea
              placeholder="Sobre você"
              value={formUser.summary}
              onChange={(e) =>
                setFormUser({ ...formUser, summary: e.target.value })
              }
            />
            <br />
            <br />
            <button type="submit">Alterar informações</button>
            <br />
            <br />
            <br />
          </form>
          <button type="button" onClick={onDeleteAccount}>
            Excluir Conta
          </button>
        </div>
      )}
    </>
  );
}
