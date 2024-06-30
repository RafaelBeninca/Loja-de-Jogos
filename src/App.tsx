import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { ThemeProviderWrapper } from "./contexts/ThemeContext";
const UserLogin = React.lazy(() => import("./pages/UserLogin"));
const UserLayout = React.lazy(() => import("./layouts/UserLayout"));
const NoPage = React.lazy(() => import("./pages/NoPage"));
const UserHome = React.lazy(() => import("./pages/UserHome"));
const Signup = React.lazy(() => import("./pages/Signup"));
const Cart = React.lazy(() => import("./pages/Cart"));
const Wishlist = React.lazy(() => import("./pages/Wishlist"));
const PartnerLayout = React.lazy(() => import("./layouts/PartnerLayout"));
const PartnerHome = React.lazy(() => import("./pages/PartnerHome"));
const LoginLayout = React.lazy(() => import("./layouts/LoginLayout"));
const UserProfile = React.lazy(() => import("./pages/UserProfile"));
const ProfileConfig = React.lazy(() => import("./pages/ProfileConfig"));
const Game = React.lazy(() => import("./pages/Game"));
const GameLibrary = React.lazy(() => import("./pages/GameLibrary"));
const PartnerProfile = React.lazy(() => import("./pages/PartnerProfile"));
const UpdateGame = React.lazy(() => import("./pages/UpdateGame"));
const CreateGame = React.lazy(() => import("./pages/CreateGame"));
const ErrorLayout = React.lazy(() => import("./layouts/ErrorLayout"));
const GameRouteWrapper = React.lazy(
  () => import("./routeWrappers/GameRouteWrapper")
);
import LoginRequired from "./routeWrappers/LoginRequired";
import RoutesWrapper from "./routeWrappers/RoutesWrapper";

export default function App() {
  return (
    <ThemeProviderWrapper>
      <UserProvider>
        <BrowserRouter>
          <RoutesWrapper>
            <Routes>
              <Route path="/" element={<LoginLayout />}>
                <Route path="login" element={<UserLogin />} />
                <Route path="signup" element={<Signup />} />
              </Route>
              <Route path="/" element={<UserLayout />}>
                <Route index element={<UserHome />} />
                <Route path="user/:username" element={<UserProfile />} />
                <Route path="game/:title" element={<GameRouteWrapper />}>
                  <Route index element={<Game />} />
                </Route>

                <Route element={<LoginRequired />}>
                  <Route
                    path="partner/:username"
                    element={<PartnerProfile />}
                  />
                  <Route path="settings/profile" element={<ProfileConfig />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="wishlist" element={<Wishlist />} />
                  <Route path="library" element={<GameLibrary />} />
                </Route>
              </Route>
              <Route path="/partner" element={<PartnerLayout />}>
                <Route element={<LoginRequired />}>
                  <Route index element={<PartnerHome />} />
                  <Route path="game/:title" element={<GameRouteWrapper />}>
                    <Route index element={<UpdateGame />} />
                  </Route>
                  <Route path="new-game" element={<CreateGame />} />
                </Route>
              </Route>
              <Route path="/" element={<ErrorLayout />}>
                <Route path="*" element={<NoPage />} />
              </Route>
            </Routes>
          </RoutesWrapper>
        </BrowserRouter>
      </UserProvider>
    </ThemeProviderWrapper>
  );
}
