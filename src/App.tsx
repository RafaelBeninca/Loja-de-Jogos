import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import UserLogin from './pages/UserLogin'
import Logout from './pages/Logout'
import UserLayout from './layouts/UserLayout';
import NoPage from './pages/NoPage';
import UserHome from './pages/UserHome';
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import PartnerLayout from "./layouts/PartnerLayout";
import PartnerLogin from "./pages/PartnerLogin";
import PartnerHome from "./pages/PartnerHome";
import LoginLayout from "./layouts/LoginLayout";
import UserProfile from "./pages/UserProfile";
import ProfileConfig from "./pages/ProfileConfig";
import Game from "./pages/Game";
import GameLibrary from "./pages/GameLibrary";
import PartnerProfile from "./pages/PartnerProfile";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LoginLayout />}>
            <Route path='login' element={<UserLogin />} />
            <Route path='logout' element={<Logout />} />
            <Route path='signup' element={<Signup />} />
            <Route path='partner/login' element={<PartnerLogin />} />
            <Route path='*' element={<NoPage />} />
          </Route>
          <Route path='/' element={<UserLayout />}>
            <Route index element={<UserHome />} />
            <Route path="user/:username" element={<UserProfile />}/>
            <Route path="partner/:username" element={<PartnerProfile />}/>
            <Route path="settings/profile" element={<ProfileConfig />}/>
            <Route path='cart' element={<Cart />} />
            <Route path='wishlist' element={<Wishlist />} />
            <Route path='library' element={<GameLibrary />} />
            <Route path='game/:title' element={<Game />} />
          </Route>
          <Route path='/partner' element={<PartnerLayout />}>
            <Route index element={<PartnerHome />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
