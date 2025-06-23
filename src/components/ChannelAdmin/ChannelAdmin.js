import Menu from "../../assets/icons/menu.svg";
import BusinessRequest from "./widgets/BusinessRequest";
import { fetchAdminEmails } from "./../../redux/slices/adminSlice";
import {
  React,
  useState,
  useEffect,
  useNavigate,
  useDispatch,
  useSelector,
} from "../../globals/imports";

const sections = [
  { id: "businessRequest", title: "Business Requests" },
  // Add more sections here if needed
];

const ChannelAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("businessRequest");
  const [isAdmin, setIsAdmin] = useState(false);
  const myData = useSelector((state) => state.myData);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const admin = useSelector((state) => state.admin);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isLoggedIn || !myData?._id || !myData?.email) return;

    const fetchEmails = async () => {
      try {
        const result = await dispatch(fetchAdminEmails()).unwrap();
        if (result.includes(myData.email)) {
          setIsAdmin(true);
        } else {
          navigate(`/get-started?redirect=/channels/admin/panel`);
        }
      } catch (error) {
        console.error(error);
        alert("Failed to fetch admin emails.");
      }
    };

    fetchEmails();
  }, [isLoggedIn, myData._id]);

  const renderContent = () => {
    switch (selectedTab) {
      case "businessRequest":
        return <BusinessRequest />;
      default:
        return <div>Select a section</div>;
    }
  };

  if (admin.requestLoading) {
    return (
      <div className="text-theme-secondaryText text-md font-normal mx-auto text-center mt-20">
        Loading...
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-theme-secondaryText text-center mt-20 txt-lg">
        Access Denied
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-white text-gray-800 relative">
      <img
        src={Menu}
        alt="menu"
        className="md:hidden flex mt-3 ml-3 h-6 w-6 cursor-pointer"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <aside
        className={`fixed md:relative top-0 left-0 h-full bg-gray-50 border-r border-gray-200 transform transition-transform duration-300 ease-in-out z-40
        ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 w-64 py-6 overflow-y-auto`}
      >
        <h1 className="text-2xl font-bold mb-8 px-4 mt-1">Admin Panel</h1>
        <ul className="space-y-3">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => setSelectedTab(section.id)}
                className={`text-left w-full px-4 ${
                  selectedTab === section.id
                    ? "text-blue-600 font-semibold"
                    : "text-theme-primaryText"
                }`}
              >
                {section.title}
              </button>
              <div className="border-t border-gray-200 mt-4"></div>
            </li>
          ))}
        </ul>
      </aside>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <main className="flex-1 sm:px-8 px-2 py-8 overflow-y-auto">
        {renderContent()}
      </main>
    </div>
  );
};

export default ChannelAdmin;
