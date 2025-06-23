import Close from "../../assets/icons/Close.svg";
import { useNavigate, React } from "../../globals/imports";

const AdminSidebar = ({
  closeSidebar,
  username,
  tabs,
  setActiveTab,
  activeTab,
}) => {
  const handleTabClick = (event, href) => {
    setActiveTab(href);
    window.history.pushState(null, "", `#${href}`);
  };
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-screen w-full overflow-y-auto custom-side-scrollbar pt-4 bg-theme-sidebarBackground">
      <div>
        <div className="w-full sm:hidden flex justify-end">
          <img
            src={Close}
            alt="close"
            className="mt-4 mb-2 mr-6 h-5 w-5 cursor-pointer"
            onClick={closeSidebar}
          />
        </div>
        <p className="text-theme-secondaryText text-lg md:text-xl lg:text-2xl font-normal mb-6 text-center">
          Admin Panel
        </p>
        {tabs.map((tab) => (
          <div key={tab.id} className="flex flex-col w-full">
            <button
              onClick={(event) => handleTabClick(event, tab.href)}
              className={` pl-6 mb-1 text-start cursor-pointer ${
                activeTab === tab.href
                  ? "text-theme-secondaryText bg-theme-sidebarHighlight rounded-lg py-2 mx-3"
                  : "text-theme-primaryText"
              }`}
              style={{ marginBottom: "-1px" }}
            >
              {tab.name}
            </button>
            <div className="border-[1px] border-theme-sidebarDivider my-4"></div>
          </div>
        ))}
        <div
          className={` font-normal font-inter cursor-pointer py-1 px-6 text-theme-primaryText`}
          onClick={() => navigate("/documentation/channels")}
        >
          Documentation
        </div>
        <div className="border  border-theme-sidebarDivider my-2"></div>
      </div>
    </div>
  );
};

export default AdminSidebar;
