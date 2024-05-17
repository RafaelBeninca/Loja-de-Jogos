import { useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import UserContext from "../contexts/UserContext";

export default function Layout() {
  // const { token } = useContext(UserContext)
  const token = localStorage.getItem('token') || ''
  const { user } = useContext(UserContext)

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
          <li>
            {token}
          </li>
          <li>
            <ul>
              <li>{user.id}</li>
              <li>{user.username}</li>
              <li>{user.email_address}</li>
              <li>{user.created_at}</li>
              <li>{user.updated_at}</li>
            </ul>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  )
}