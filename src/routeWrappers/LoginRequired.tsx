import React, { useContext, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import UserContext from "../contexts/UserContext";

export default function LoginRequired() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user?.id]);

  return <Outlet />;
}
