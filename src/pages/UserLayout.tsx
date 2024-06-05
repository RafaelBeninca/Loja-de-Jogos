import { useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import UserContext from "../contexts/UserContext";

export default function UserLayout() {
    const { user, token } = useContext(UserContext)

    return (
    <>
        <nav>
        <ul>
            <li>
                <Link to="/">Home</Link>
            </li>
            {token ?
                <li>
                    <Link to='/logout'>Logout</Link>
                </li> :
                <>
                    <li>
                        <Link to="/login">Login as user</Link>
                    </li>
                    <li>
                        <Link to="/partner/login">Login as partner</Link>
                    </li>
                </>
            }
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
            {token && 
            <li>
                <a href="/profile"><img src={user.profile_picture} alt="" width={'50px'} height={'50px'}/></a>
            </li>
            }
        </ul>
        </nav>

        <Outlet />
    </>
    )
}