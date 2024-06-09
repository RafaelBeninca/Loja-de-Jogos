import { Outlet, Link } from "react-router-dom";

export default function LoginLayout() {
    return (
    <>
        <nav>
        <ul>
            <li>
                <Link to="/">Home</Link>
            </li>
        </ul>
        </nav>

        <Outlet />
    </>
    )
}