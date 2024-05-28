import { useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import UserContext from "../contexts/UserContext";

export default function Layout() {
  const { user, token } = useContext(UserContext)
  
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            {token ?
              <Link to='/logout'>Logout</Link> :
              <Link to="/login">Login</Link>
            }
          </li>
          {!token &&
            <li>
              <Link to='/signup'>Signup</Link>
            </li>
          }
          {token &&
            <li>
              <Link to='/cart'>Cart</Link>
            </li>
          }
          {token &&
            <li>
              <Link to='/wishlist'>Wishlist</Link>
            </li>
          }
          <li>
            token: {token}
          </li>
          <li>
            <ul>
              <li>id: {user.id}</li>
              <li>username: {user.username}</li>
              <li>email: {user.email_address}</li>
              <li><img src={user.profile_picture} alt="" width={'100px'} height={'100px'} /></li>
            </ul>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
}