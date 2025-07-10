import React , {useState} from "react";
import Close from "../../assets/icons/Close.svg";
import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import { ChannelImages } from "../constants/images";
import { useDispatch, useSelector } from "react-redux";

const AdminSidebar = ({
  closeSidebar,
}) => {
  const myUser = useSelector((state) => state.auth.user);

  const accountTabs=[
    {name:"Subscription and billing",href:`/admin/${myUser?.username}/account/billing`},
    {name:"Members and Roles",href:`/admin/${myUser?.username}/account/members/roles`},
    {name:"Payments",href:`/admin/${myUser?.username}/account/payments`},
    {name:"Customizations",href:`/admin/${myUser?.username}/account/customizations`}
  ];

  const requestTabs=[
    {name:"Channels",href:`/admin/${myUser?.username}/requests/channels`},
    {name:"Topics",href:`/admin/${myUser?.username}/requests/topics`},
    {name:"Events",href:`/admin/${myUser?.username}/requests/events`},
  ];

  const adminTabs=[
    {name:"API",href:`/admin/${myUser?.username}/panel/api`},
    {name:"Settings",href:`/admin/${myUser?.username}/panel/settings`}
  ];

  const navigate = useNavigate();
  const location = useLocation();
  const [dropdowns,setDropdowns] = useState([]);


  const toggleDropdown = (value) => {
    setDropdowns((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const renderTabLinks = (tabs) =>
    tabs.map((tab,index) => (
      <div className="flex flex-col">
      <Link
        key={tab.href}
        to={tab.href}
        className={`block text-sm font-normal font-inter cursor-pointer px-4 py-2 ml-3 ${
          location.pathname === tab.href
            ? "text-theme-secondaryText bg-theme-sidebarHighlight rounded-lg mx-3"
            : "text-theme-primaryText"
        }`}
        onClick={closeSidebar}
      >
        {tab.name}
      </Link>
      <div className={`border-[1px] border-theme-sidebarDivider my-2`}></div>
      </div>
    ));

  return (
    <div className="flex flex-col h-screen w-full overflow-y-auto custom-side-scrollbar pt-4 bg-theme-sidebarBackground flex-shrink-0">
      <div>
        <div className="w-full sm:hidden flex justify-end">
          <img
            src={Close}
            alt="close"
            className="mt-4 mb-2 mr-6 h-5 w-5 cursor-pointer"
            onClick={closeSidebar}
          />
        </div>
        <p className="text-theme-secondaryText text-lg md:text-xl lg:text-2xl font-normal mb-6 text-start ml-4">
          Dashboard
        </p>
        <Link
          to={`/admin/${myUser?.username}/profile`}
          className={`block text-sm font-normal font-inter cursor-pointer py-2 px-4 ${
            location.pathname === `/admin/${myUser?.username}/profile`
              ? "text-theme-secondaryText bg-theme-sidebarHighlight rounded-lg mx-3"
              : "text-theme-primaryText"
          }`}
          onClick={closeSidebar}
        >
          Profile
        </Link>
        <div className="border-[1px] border-theme-sidebarDivider my-3"></div>


        <div className="flex flex-row justify-between items-center cursor-pointer pl-4 pr-3" onClick={() =>toggleDropdown("account")}>
          <p
            className="text-sm font-normal text-theme-primaryText  tracking-wide"
          >
            Account
          </p>
          <img
            src={!dropdowns.includes("account") ? ChannelImages.ArrowDown.default : ChannelImages.ArrowUp.default}
            alt="up-arrow"
            className="dark:block hidden h-7 w-7"
          />
          <img
           src={!dropdowns.includes("account") ? ChannelImages.ArrowDownLight.default : ChannelImages.ArrowUpLight.default}
            alt="down-arrow"
            className="dark:hidden h-7 w-7"
          />
        </div>
        <div className={`border-[1px] border-theme-sidebarDivider mt-4 ${dropdowns.includes("account")?"mb-2":"mb-3"}`}></div>
        {dropdowns.includes("account") && <div>{renderTabLinks(accountTabs)}</div>}
        <div className="flex flex-row justify-between items-center cursor-pointer pl-4 pr-3" onClick={() =>toggleDropdown("request")}>
          <p
            className="text-sm font-normal text-theme-primaryText tracking-wide"
          >
            Requests
          </p>
          <img
            src={!dropdowns.includes("request") ? ChannelImages.ArrowDown.default : ChannelImages.ArrowUp.default}
            alt="up-arrow"
            className="dark:block hidden h-7 w-7"
          />
          <img
           src={!dropdowns.includes("request") ? ChannelImages.ArrowDownLight.default : ChannelImages.ArrowUpLight.default}
            alt="down-arrow"
            className="dark:hidden h-7 w-7"
          />
        </div>
        <div className={`border-[1px] border-theme-sidebarDivider mt-4 ${dropdowns.includes("request")?"mb-2":"mb-3"}`}></div>
        {dropdowns.includes("request") && <div>{renderTabLinks(requestTabs)}</div>}
        <Link
          to={`/admin/${myUser?.username}/analytics`}
          className={`block text-sm font-normal font-inter cursor-pointer py-2 px-4 ${
            location.pathname === `/admin/${myUser?.username}/analytics`
              ? "text-theme-secondaryText bg-theme-sidebarHighlight rounded-lg mx-3"
              : "text-theme-primaryText"
          }`}
          onClick={closeSidebar}
        >
          Analytics
        </Link>
        <div className="border-[1px] border-theme-sidebarDivider mt-2 mb-3"></div>
        {/* <div className={`border-[1px] border-theme-sidebarDivider mt-4 ${dropdowns.includes("admin")?"mb-2":"mb-3"}`}></div> */}

        <div className="flex flex-row justify-between items-center cursor-pointer pl-4 pr-3" onClick={() =>toggleDropdown("admin")}>
          <p
            className="text-sm font-normal text-theme-primaryText  tracking-wide"
          >
            Admin Panel
          </p>
          <img
            src={!dropdowns.includes("admin") ? ChannelImages.ArrowDown.default : ChannelImages.ArrowUp.default}
            alt="up-arrow"
            className="dark:block hidden h-7 w-7"
          />
          <img
           src={!dropdowns.includes("admin") ? ChannelImages.ArrowDownLight.default : ChannelImages.ArrowUpLight.default}
            alt="down-arrow"
            className="dark:hidden h-7 w-7"
          />
        </div>
        <div className={`border-[1px] border-theme-sidebarDivider mt-4 ${dropdowns.includes("admin")?"mb-2":"mb-3"}`}></div>
        {dropdowns.includes("admin") && <div>{renderTabLinks(adminTabs)}</div>}
        <Link
          to={`/admin/${myUser?.username}/notifications`}
          className={`block text-sm font-normal font-inter cursor-pointer py-2 px-4 ${
            location.pathname === `/admin/${myUser?.username}/notifications`
              ? "text-theme-secondaryText bg-theme-sidebarHighlight rounded-lg mx-3"
              : "text-theme-primaryText"
          }`}
          onClick={closeSidebar}
        >
          Notifications
        </Link>
        <div className="border-[1px] border-theme-sidebarDivider mt-2 mb-4"></div>
        <div
          className={` font-normal text-sm cursor-pointer py-1 pl-4 pr-3 text-theme-primaryText`}
          onClick={() => navigate("/documentation/channels")}
        >
          Documentation
        </div>
        <div className="border  border-theme-sidebarDivider my-3"></div>
      </div>
    </div>
  );
};

export default AdminSidebar;
