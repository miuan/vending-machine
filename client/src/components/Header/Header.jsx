import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectUser } from "../../app/reducers/userSlice";
import PublicHeader from "./PublicHeader";
import UserHeader from "./UserHeader";

export const Header = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  const onLogout = () => {
    dispatch(logout());
  };

  if (user && user.token) {
    return <UserHeader user={user} onLogout={onLogout} />;
  }

  return <PublicHeader />;
};

export default Header;
