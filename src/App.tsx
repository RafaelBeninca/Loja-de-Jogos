import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login'
import Logout from './pages/Logout'
import Layout from './pages/Layout';
import NoPage from './pages/NoPage';
import Home from './pages/Home';
import { UserProvider } from "./contexts/UserContext";
import Signup from "./pages/Signup";
import Cart from "./pages/Cart";

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='logout' element={<Logout />} />
            <Route path='signup' element={<Signup />} />
            <Route path='cart' element={<Cart />} />
            <Route path='*' element={<NoPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
