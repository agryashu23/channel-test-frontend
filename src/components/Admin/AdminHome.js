import {
  React,
  useState,
  useEffect,
  useSelector,
  useParams,
  useNavigate,
  useDispatch,
} from "../../globals/imports";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import Menu from "../../assets/icons/menu.svg";
import ArrowBack from "../../assets/icons/arrow_back.svg";
import { fetchBusinessCredentials } from "./../../redux/slices/businessSlice";
import PaymentLoading from "../../widgets/paymentLoading";

const AdminHome = () => {
  const params = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const business = useSelector((state) => state.business);
  const myData = useSelector((state) => state.myData);
  const payment = useSelector((state) => state.payment);
  const myUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const { username } = params;
  const [activeTab, setActiveTab] = useState("");

  const dispatch = useDispatch();
  const tabs = [
    { id: 1, name: "API", href: "" },
    { id: 2, name: "Settings", href: "settings" },
    { id: 3, name: "Requests", href: "requests" },
  ];

  useEffect(() => {
    const hash = window.location.hash?.replace("#", "");
    if (["requests", "settings"].includes(hash)) {
      setActiveTab(hash);
    } else {
      setActiveTab("");
    }
  }, []);

  

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isLoggedIn && myUser?.username !== username) {
        navigate(`/get-started?redirect=/admin/${username}/home`);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [isLoggedIn, myData, username, navigate]);

  useEffect(() => {
    if(username && isLoggedIn && myUser?.username===username){
      dispatch(fetchBusinessCredentials(username))
        .unwrap()
        .then((response) => {
        });
    }
    else if(isLoggedIn && myUser?.username!==username){
      navigate(`/account/${username}/profile`);
    }
  }, [username]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const closeSidebar = () => setIsSidebarOpen(false);

  const navigateToHome = () => {
    navigate(`/account/${username}/profile`);
  };

  if (loading) {
    return (
      <div className="mx-auto text-theme-secondaryText mt-20">Loading...</div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-theme-secondaryBackground">
      <div className="h-full w-11 bg-black flex flex-col items-center pl-2 z-50">
        <div className="w-10 md:hidden flex">
          <img
            src={Menu}
            alt="menu"
            className="mt-3 h-6 w-6 cursor-pointer"
            onClick={toggleSidebar}
          />
        </div>
        <div className="w-10 mt-4 flex">
          <img
            src={ArrowBack}
            alt="back"
            className="mt-3 h-6 w-6 cursor-pointer"
            onClick={navigateToHome}
          />
        </div>
      </div>
  
      <div
        className={`h-full z-40 w-[230px] bg-theme-sidebarBackground
          transition-transform duration-300
          md:relative md:translate-x-0 md:left-0
          fixed top-0 left-11
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:z-auto`}
      >
        <AdminSidebar
          closeSidebar={closeSidebar}
          username={username}
          tabs={tabs}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />
      </div>
  
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-40 md:hidden"
          onClick={closeSidebar}
        />
      )}
      {payment.loading && (
            <div className="fixed inset-0 bg-[#202020] bg-opacity-80 z-50">
              <div className="flex justify-center items-center h-full text-center w-full text-theme-secondaryText text-lg z-60 px-6">
                <PaymentLoading />
              </div>
            </div>
          )}
  
      <div className="flex-1 bg-theme-tertiaryBackground overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};  
export default AdminHome;
