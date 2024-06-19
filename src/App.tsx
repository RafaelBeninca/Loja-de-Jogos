import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import UserLogin from "./pages/UserLogin";
import UserLayout from "./layouts/UserLayout";
import NoPage from "./pages/NoPage";
import UserHome from "./pages/UserHome";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import PartnerLayout from "./layouts/PartnerLayout";
import PartnerHome from "./pages/PartnerHome";
import LoginLayout from "./layouts/LoginLayout";
import UserProfile from "./pages/UserProfile";
import ProfileConfig from "./pages/ProfileConfig";
import Game from "./pages/Game";
import GameLibrary from "./pages/GameLibrary";
import PartnerProfile from "./pages/PartnerProfile";
import UpdateGame from "./pages/UpdateGame";
import { ThemeProviderWrapper } from "./contexts/ThemeContext";
import CreateGame from "./pages/CreateGame";
import ErrorLayout from "./layouts/ErrorLayout";

export default function App() {
  return (
    <ThemeProviderWrapper>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginLayout />}>
              <Route path="login" element={<UserLogin />} />
              <Route path="signup" element={<Signup />} />
            </Route>
            <Route path="/" element={<UserLayout />}>
              <Route index element={<UserHome />} />
              <Route path="user/:username" element={<UserProfile />} />
              <Route path="partner/:username" element={<PartnerProfile />} />
              <Route path="settings/profile" element={<ProfileConfig />} />
              <Route path="cart" element={<Cart />} />
              <Route path="wishlist" element={<Wishlist />} />
              <Route path="library" element={<GameLibrary />} />
              <Route path="game/:title" element={<Game />} />
            </Route>
            <Route path="/partner" element={<PartnerLayout />}>
              <Route index element={<PartnerHome />} />
              <Route path="game/:title" element={<UpdateGame />} />
              <Route path="new-game" element={<CreateGame />} />
            </Route>
            <Route path="/" element={<ErrorLayout />}>
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </ThemeProviderWrapper>
  );
}
