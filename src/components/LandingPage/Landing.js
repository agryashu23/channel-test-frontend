import React, { useState, useEffect } from "react";
import { Outlet, useParams } from "react-router-dom";
import Menu from "../../assets/icons/menu.svg";
import UserSidebar from "./../Sidebar/UserSidebar";
import { fetchBusinessCredentials } from "../../redux/slices/businessSlice";
import { useSelector ,useDispatch} from "react-redux";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const business = useSelector((state) => state.business);
  const auth = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const closeSidebar = () => setIsSidebarOpen(false);
  const {username} = useParams();

 

  useEffect(() => {
    const isMobile = window.innerWidth < 640;
    if (isSidebarOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  return (
    <div className="flex flex-col w-full">
      <div className="w-full  bg-theme-secondaryBackground sm:hidden flex">
        <img
          src={Menu}
          alt="close"
          className="mt-3  ml-6 h-6 w-6 cursor-pointer"
          onClick={toggleSidebar}
        />
      </div>
      <div className="flex flex-row sm:h-screen w-[100%] h-full-height-36">
        <div
          className={`fixed top-0 left-0 h-full transition-transform 
            duration-300 z-40 sm:relative sm:translate-x-0  sm:flex ${
              isSidebarOpen ? "translate-x-0 " : "-translate-x-full "
            } lg:w-[248px]  md:w-1/4 sm:w-[30%] w-[250px]  bg-theme-sidebarBackground`}
        >
          <UserSidebar closeSidebar={closeSidebar} />
        </div>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"
            onClick={closeSidebar}
          ></div>
        )}

        <div className="lg:w-full-minus-250 md:w-3/4 sm:w-[70%] w-full h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Landing;
