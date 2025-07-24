import { Outlet } from "react-router-dom";
import { Footers } from "../UI/Footer";
import { Headers } from "../UI/Headers";

export const AppLayout = () => {
  return (
    <>
      <Headers />
      
      <main className="main-content">
        <Outlet />
      </main>
      
      <Footers />
    </>
  );
};
