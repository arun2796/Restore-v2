import { Navigate, Outlet, useLocation } from "react-router";
import { useUserinfoQuery } from "../../features/account/accountApi";

export default function RequiredAuth() {
  const { data: user, isLoading } = useUserinfoQuery();
  const location = useLocation();
  if (isLoading) return <div>Loading...</div>;

  if (!user) return <Navigate to={"/login"} state={{ from: location }} />;

  return <Outlet />;
}
