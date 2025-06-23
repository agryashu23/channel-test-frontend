import React, { useState, useEffect, useRef } from "react";
import ProfileIcon from "../../../assets/icons/chipEmptyIcon.svg";
import { useParams, useNavigate, Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getAppPrefix } from "./../../EmbedChannels/utility/embedHelper";
import DropDown from "../../../assets/icons/arrow_drop_down.svg";
import DropDownLight from "../../../assets/lightIcons/arrow_drop_down_light.svg";
import { isEmbeddedOrExternal } from "./../../../services/rest";

const PageDM = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const channels = useSelector((state) => state.channelItems.channels);
  const myData = useSelector((state) => state.myData);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleChannel = (newChannelId) => {
    navigate(`${getAppPrefix()}/account/${username}/channel/${newChannelId}`);
  };

  const handleBrandProfile = () => {
    navigate(`${getAppPrefix()}/account/${username}/profile`);
  };

  const handleMessagePage = () => {
    navigate(`${getAppPrefix()}/account/${myData.username}/messages/list`);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <div
      className={`flex flex-col w-full ${
        isEmbeddedOrExternal() ? "h-full" : "sm:h-full h-full-height-36"
      }  bg-theme-secondaryBackground`}
    >
      {!isEmbeddedOrExternal() && (
        <div className="flex flex-row py-2 justify-start items-center px-6 border-b border-theme-chatDivider relative">
          <p
            className="sm:py-2 py-0 flex text-theme-secondaryText text-2xl font-normal font-inter tracking-wide cursor-pointer"
            onClick={() =>
              navigate(`${getAppPrefix()}/account/${username}/messages/list`)
            }
          >
            Messages
          </p>
          {isEmbeddedOrExternal() && (
            <img
              src={DropDown}
              alt="arrow-right"
              className="dark:block hidden w-6 h-6 ml-1 cursor-pointer "
              onClick={toggleDropdown}
            />
          )}
          {isEmbeddedOrExternal() && (
            <img
              src={DropDownLight}
              alt="arrow-right"
              className="dark:hidden w-6 h-6 ml-1 cursor-pointer "
              onClick={toggleDropdown}
            />
          )}

          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute left-6 top-8 mt-2 w-max rounded-md shadow-lg border 
      border-theme-chatDivider bg-theme-tertiaryBackground ring-1 ring-black ring-opacity-5 z-50"
            >
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                {channels.map((channel) => (
                  <div
                    key={channel._id}
                    className="flex px-3 items-center sm:py-2 py-2 text-center text-theme-primaryText font-light cursor-pointer"
                    onClick={() => toggleChannel(channel._id)}
                  >
                    <p className="mr-1">{channel.name}</p>
                  </div>
                ))}
                <div className="border-t border-theme-sidebarDivider"></div>
                <p
                  className="flex px-3 items-center sm:py-2 py-2 text-center text-theme-primaryText font-light cursor-pointer"
                  onClick={handleBrandProfile}
                >
                  Brand Profile
                </p>
                <div className="border-t border-theme-sidebarDivider"></div>
                <p
                  className="flex px-3 items-center sm:py-2 py-2 text-center text-theme-primaryText font-light cursor-pointer"
                  onClick={handleMessagePage}
                >
                  Messages
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default PageDM;
