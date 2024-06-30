import { Outlet, useParams } from "react-router-dom";

export default function GameRouteWrapper() {
  const { title } = useParams();

  return <Outlet key={`game-${title}`} />;
}
