import { Outlet } from 'react-router-dom'
import NavBar from "./NavBar"


function RootLayout() {
  return (
      <>
          <NavBar />
          <Outlet />
    </>
  );
}
export default RootLayout;