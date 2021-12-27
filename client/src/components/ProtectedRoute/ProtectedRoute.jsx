import React from "react";
import { useSelector } from "react-redux";
import { Redirect, Route } from "react-router-dom";
import { selectUser } from "../../app/reducers/userSlice";

export const ProtectRoute = ({ path, role, exact, children }) => {
  const user = useSelector(selectUser);

  if (role && !user?.roles.find((r) => r.name === role) && !user?.roles.find((r) => r.name === "admin")) {
    return <Redirect to={`/login?path=${path}&role=${role}`} />;
  }

  if (!user?.token) {
    return <Redirect to={`/login?path=${path}`} />;
  }

  return <Route path={path} exact={exact} children={children} />;
};

export default ProtectRoute;
