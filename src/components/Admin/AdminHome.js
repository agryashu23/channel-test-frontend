import {
  React,
  useState,
  useEffect,
  useSelector,
  useParams,
  useNavigate,
  useDispatch,
} from "../../globals/imports";
import AdminSidebar from "./AdminSidebar";
import Menu from "../../assets/icons/menu.svg";
import ArrowBack from "../../assets/icons/arrow_back.svg";
import APITab from "./Tabs/APITab";
import SettingsTab from "./Tabs/SettingsTab";
import { fetchbusinessCredentials } from "./../../redux/slices/businessSlice";
import RequestTab from "./Tabs/RequestTab";

const AdminHome = () => {
  const params = useParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const business = useSelector((state) => state.business);
  const myData = useSelector((state) => state.myData);
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
    dispatch(fetchbusinessCredentials());
  }, [dispatch]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isLoggedIn && myData?.username !== username) {
        navigate(`/get-started?redirect=/admin/${username}/home`);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [isLoggedIn, myData, username, navigate]);

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
    <div className="flex flex-row w-full h-screen bg-theme-secondaryBackground">
      <div className="h-full w-11 bg-black flex flex-col items-center pl-2">
        <div className="w-10 sm:hidden flex">
          <img
            src={Menu}
            alt="close"
            className="mt-3  h-6 w-6 cursor-pointer"
            onClick={toggleSidebar}
          />
        </div>
        <div className="w-10 mt-4 flex">
          <img
            src={ArrowBack}
            alt="close"
            className="mt-3  h-6 w-6 cursor-pointer text-secondaryText"
            onClick={navigateToHome}
          />
        </div>
      </div>

      <div className="flex flex-row h-screen w-full-minus-44 ">
        <div
          className={`fixed top-0 left-0 h-full transition-transform duration-300 z-40 sm:relative sm:translate-x-0  sm:flex ${
            isSidebarOpen ? "translate-x-0 " : "-translate-x-full "
          } lg:w-[250px]  md:w-1/4 sm:w-[30%] w-[250px]  bg-theme-primaryBackground`}
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
          <div className="fixed inset-0 bg-black bg-opacity-40 z-30 sm:hidden"></div>
        )}

        <div className="lg:w-full-minus-250 md:w-3/4 sm:w-[70%] w-full h-full">
          {activeTab === "" ? (
            <APITab />
          ) : activeTab === "settings" ? (
            <SettingsTab />
          ) : activeTab === "requests" ? (
            <RequestTab apiKey={business.apiKey} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
