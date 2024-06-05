import { useContext } from "react";
import { Outlet, Link } from "react-router-dom";
import UserContext from "../contexts/UserContext";

export default function PartnerLayout() {
    const { user, token } = useContext(UserContext)

    return (
    <>
        <nav>
        <ul>
            <li>
                <Link to="/partner">Home</Link>
            </li>
            <li>
                <Link to='/logout'>Logout</Link>
            </li>
            {token && 
            <li>
                <a href="/profile"><img src={user.profile_picture} alt="" width={'50px'} height={'50px'} /></a>
            </li>
            }
        </ul>
        </nav>

        <Outlet />
    </>
    )
}