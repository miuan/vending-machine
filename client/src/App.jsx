import React from "react";
import { Route, Switch } from "react-router-dom";
import Header from "./components/Header/Header";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import UserRoleEdit from "./pages/admin/UserRoles/UserRolesEdit";
import UserRolesList from "./pages/admin/UserRoles/UserRolesList";
import UsersList from "./pages/admin/Users/UsersList";
import Home from "./pages/public/Home/Home";
import ForgottenPassword from "./pages/public/Login/ForgottenPassword";
import ForgottenPasswordReset from "./pages/public/Login/ForgottenPasswordReset";
import Login from "./pages/public/Login/Login";
import { PassportCallback } from "./pages/public/Login/PassportCallback";
import Register from "./pages/public/Login/Register";
import VerifyUser from "./pages/public/Login/VerifyUser";
import ProductManagerEdit, { ProductManagerEditAPI } from "./pages/seller/ProductManager/ProductManagerEdit";
import ProductManagerList from "./pages/seller/ProductManager/ProductManagerList";
import SellerDashboard from "./pages/seller/SellerDashboard/SellerDashboard";
import UserDashboard from "./pages/user/UserDashboard/UserDashboard";

export default function App() {
  return (
    <>
      <Header />
      {/*
              A <Switch> looks through all its children <Route>
              elements and renders the first one whose path
              matches the current URL. Use a <Switch> any time
              you have multiple routes, but you want only one
              of them to render at a time
            */}
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/login">
          <Login api={true} />
        </Route>
        <Route path="/login/facebook">
          <PassportCallback type={"facebook"} />
        </Route>
        <Route path="/login/github">
          <PassportCallback type={"github"} />
        </Route>
        <Route path="/login/google">
          <PassportCallback type={"google"} />
        </Route>
        <Route path="/register">
          <Register api={true} />
        </Route>

        <Route path="/forgotten-password/:token" component={ForgottenPasswordReset} />
        <Route exact path="/forgotten-password">
          <ForgottenPassword />
        </Route>

        <Route path="/verify-user/:verifyToken" component={VerifyUser} />

        <ProtectedRoute path="/user/products">
          <UserDashboard />
        </ProtectedRoute>
        <Route path="/user/info">{/* <UserInfo /> */}</Route>

        <ProtectedRoute path="/admin/users" role={"admin"}>
          <UsersList adminMode={true} />
        </ProtectedRoute>
        <ProtectedRoute path="/admin/roles" role={"admin"}>
          <UserRolesList adminMode={true} />
        </ProtectedRoute>
        <ProtectedRoute path="/user/roles/:id" role={"admin"} children={<UserRoleEdit />} />

        <ProtectedRoute role={"seller"} path="/seller" exact children={<SellerDashboard />} />
        <ProtectedRoute role={"seller"} path="/seller/api/product-manager/:id" children={<ProductManagerEdit api={true} />} />
        <ProtectedRoute role={"seller"} path="/seller/gql/product-manager/:id" children={<ProductManagerEdit />} />
        <ProtectedRoute role={"seller"} path="/seller/api/product-manager" children={<ProductManagerList api />} />
        <ProtectedRoute role={"seller"} path="/seller/gql/product-manager" children={<ProductManagerList />} />
      </Switch>
    </>
  );
}
