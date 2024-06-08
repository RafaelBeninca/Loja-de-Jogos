import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import UserLogin from './pages/UserLogin'
import Logout from './pages/Logout'
import UserLayout from './pages/UserLayout';
import NoPage from './pages/NoPage';
import UserHome from './pages/UserHome';
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import PartnerLayout from "./pages/PartnerLayout";
import PartnerLogin from "./pages/PartnerLogin";
import PartnerHome from "./pages/PartnerHome";
import LoginLayout from "./pages/LoginLayout";
import Profile from "./pages/Profile";
import ProfileConfig from "./pages/ProfileConfig";
import Game from "./pages/Game";

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
            <Route path="profile" element={<Profile />}/>
            <Route path="profile/config" element={<ProfileConfig />}/>
            <Route path='cart' element={<Cart />} />
            <Route path='wishlist' element={<Wishlist />} />
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
