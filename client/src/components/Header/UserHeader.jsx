import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";

const AdminMenu = () => (
  <>
    <Dropdown.Divider />
    <Dropdown.Item href="/admin/users">Users</Dropdown.Item>
    <Dropdown.Item href="/admin/roles">Roles</Dropdown.Item>
  </>
);

const SellerMenu = () => (
  <>
    <Dropdown.Divider />
    <Dropdown.Item href="/seller">Seller manager</Dropdown.Item>
  </>
);

const UserHeader = ({ user, onLogout }) => {
  const isAdmin = user.roles.some((r) => r.name === "admin");
  const isSeller = user.roles.some((r) => r.name === "seller");

  return (
    <div className="header-light transparent scroll-light container">
      <div className="row">
        <div className="col-md-2">
          <Dropdown>
            <Dropdown.Toggle variant="normal" id="dropdown-basic">
              Menu
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href="/">Home</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="header-text col-md-8">
          <div>This Header only for anybody who is logged in</div>
        </div>
        <div className="col-md-2">
          <Dropdown>
            <Dropdown.Toggle variant="normal" id="dropdown-basic">
              {isAdmin ? "Admin" : isSeller ? "Seller" : "User"}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item href={"/user/products"}>Buy a product</Dropdown.Item>
              {(isAdmin || isSeller) && <SellerMenu />}
              {isAdmin && <AdminMenu />}
              <Dropdown.Divider />
              <Dropdown.Item>
                <Link className="" to="/" onClick={onLogout}>
                  Logout
                </Link>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
