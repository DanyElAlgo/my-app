import { Outlet } from "react-router";
import NavBar from "./nav-bar";

function Layout() {
  return (
    <div>
      <NavBar />
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
