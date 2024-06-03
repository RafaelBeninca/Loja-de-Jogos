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
            <>
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
            </>
            }
        </ul>
        </nav>

        <Outlet />
    </>
    )
}