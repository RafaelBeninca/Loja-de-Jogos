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
});

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(emptyUser);

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

    setUser(null);
  };

  const loginUser = (newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken);

    setUser(newUser);
  };

  return (
    <UserContext.Provider value={{ user, getUser, logoutUser, loginUser }}>
      {children}
    </UserContext.Provider>
  );
}

export default UserContext;
