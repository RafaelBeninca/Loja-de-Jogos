import React from "react";
import { createContext, useState } from "react";
import { User, UserContextInterface } from "../types/types";
import { emptyUser } from "../utils/defaultValues";
import axiosInstance from "../utils/axiosInstance";

interface UserProviderProps {
  children: React.ReactElement;
}

const UserContext = createContext<UserContextInterface>({
  user: emptyUser,
  getUser: async () => {
    return { user: emptyUser, token: "" };
  },
  logoutUser: () => {},
  loginUser: () => {},
  token: "",
});

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState(emptyUser);
  const [token, setToken] = useState("");

  const getUser = async () => {
    const localToken = localStorage.getItem("token") || "";

    if (localToken === "") {
      return {
        user: emptyUser,
        token: "",
      };
    }

    const data = {};

    const config = {
      headers: {
        Authorization: "Bearer " + localToken,
      },
    };

    try {
      const response = await axiosInstance.post(
        "/api/check_token",
        data,
        config
      );

      console.log(response);
      return {
        user: response.data.user,
        token: localToken,
      };
    } catch (error) {
      console.log(error);
      return {
        user: emptyUser,
        token: "",
      };
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    setToken("");

    setUser(emptyUser);
  };

  const loginUser = (newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    setUser(newUser);
  };

  return (
    <UserContext.Provider
      value={{ user, getUser, logoutUser, loginUser, token }}
    >
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
