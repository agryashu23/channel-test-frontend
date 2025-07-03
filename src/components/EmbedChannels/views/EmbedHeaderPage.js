import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  useParams,
  useNavigate,
  useLocation,
  matchPath,
} from "react-router-dom";
import { fetchChannel } from "../../../redux/slices/channelSlice";
import ProfileIcon from "../../../assets/icons/profile.svg";
import ColorProfile from "../../../assets/images/color_profile.svg";

import DropDown from "../../../assets/icons/arrow_drop_down.svg";
import DropDownLight from "../../../assets/lightIcons/arrow_drop_down_light.svg";
import { getAppPrefix } from "./../utility/embedHelper";
import { fetchChannels } from "./../../../redux/slices/channelItemsSlice";
import { fetchMyData } from "./../../../redux/slices/myDataSlice";
import useModal from "./../../hooks/ModalHook";
import ThemeToggleButton from "./../../../utils/theme";

const EmbedHeaderPage = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const { handleOpenModal } = useModal();

  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  // const [channelsData, setChannelsData] = useState([]);
  const hasFetched = useRef(false);

  const [username, setUsername] = useState("");
  const [channelId, setChannelId] = useState("");
  const dispatch = useDispatch();

  const channel = useSelector((state) => state.channel);
  const myData = useSelector((state) => state.myData);
  const business = useSelector((state) => state.business);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const channelsData = useSelector((state) => state.channelItems.channels);
  const myUser = useSelector((state) => state.auth.user);
  const myUserId = myUser?._id;
  const channelName = channel.name;

  useEffect(() => {
    if (!myData._id) {
      dispatch(fetchMyData());
    }
  }, [myData._id]);

  useEffect(() => {
    const interval = setInterval(() => {
      const data = localStorage.getItem("embedFetchedData");
      if (data) {
        const dataId = JSON.parse(data);
        setUsername(dataId.username);
        setChannelId(dataId.selectedChannel);
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (channelId) {
      const formData = new FormData();
      formData.append("id",channelId);
      formData.append("user_id",myUserId);
      dispatch(fetchChannel(formData));
    }
  }, [channelId]);

  useEffect(() => {
    if (username && !hasFetched.current) {
      dispatch(fetchChannels({username:username, user_id:myUserId || null}))
        .unwrap()
        .then((channels) => {
          hasFetched.current = true;
        })
        .catch((error) => {
          alert(error);
        });
    }
  }, [username, dispatch]);

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

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleChannel = (channel) => {
    toggleDropdown();
    if (channel.members?.includes(myData?._id)) {
      navigate(
        `${getAppPrefix()}/account/${username}/channel/${channel._id}/c-id/topic/${
          channel.topics[0]._id
        }`
      );
    } else {
      navigate(`${getAppPrefix()}/account/${username}/channel/${channel._id}`);
    }
  };

  const handleBrandProfile = () => {
    toggleDropdown();
    navigate(`${getAppPrefix()}/account/${username}/profile`);
  };

  const handleMessagePage = () => {
    toggleDropdown();
    if (myData.username) {
      navigate(`${getAppPrefix()}/account/${myData.username}/messages/list`);
    }
  };

  const isTopicPage =
    matchPath(
      `${getAppPrefix()}/account/:username/channel/:channelId/c-id/topic/:topicId`,
      location.pathname
    ) ||
    matchPath(
      `${getAppPrefix()}/account/:username/channel/:channelId`,
      location.pathname
    );
  const isMessagePage = matchPath(
    `${getAppPrefix()}/account/:username/messages/*`,
    location.pathname
  );
  const isProfilePage = matchPath(
    `${getAppPrefix()}/account/:username/profile`,
    location.pathname
  );
  const handleLogout = () => {
    toggleDropdown();
    handleOpenModal("modalEmbedLogoutOpen");
  };

  const handleLogin = () => {
    const data = localStorage.getItem("embedFetchedData");
    const dataId = JSON.parse(data);
    const channelId = dataId.selectedChannel;
    const username = dataId.username;
    toggleDropdown();
    navigate(
      `${getAppPrefix()}/get-started?redirect=${getAppPrefix()}/account/${username}/channel/${channelId}`,
      {
        replace: true,
      }
    );
  };
  if (isProfilePage) return null;

  const parameters = business?.parameters; 

  return (
    <div className="flex flex-row py-3 justify-between items-center px-6 w-full bg-theme-secondaryBackground h-14">
      <div className="flex-row items-center flex relative " ref={dropdownRef}>
        <p className="flex text-theme-secondaryText xs:text-xl text-lg sm:text-2xl font-normal font-inter ">
          {(() => {
            const rawText = isTopicPage
              ? channelName.charAt(0).toUpperCase() + channelName.slice(1)
              : isMessagePage
              ? "Messages"
              : "Channels";

            return rawText.length > 40 ? `${rawText.slice(0, 40)}...` : rawText;
          })()}
        </p>

        <img
          src={DropDown}
          alt="arrow-right"
          className="dark:block hidden w-6 h-6 ml-0.5 cursor-pointer "
          onClick={toggleDropdown}
        />
        <img
          src={DropDownLight}
          alt="arrow-right"
          className="dark:hidden w-6 h-6 ml-0.5 cursor-pointer "
          onClick={toggleDropdown}
        />

        {isDropdownOpen && (
          <div
            className="absolute left-0 top-6 mt-2 w-max rounded-md shadow-lg border 
      border-theme-chatDivider bg-theme-tertiaryBackground ring-1 ring-black ring-opacity-5 z-50"
          >
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              {channelsData.map((channel) => {
                const shouldShow =
                  isMessagePage ||
                  isProfilePage ||
                  channel.name !== channelName;

                return shouldShow ? (
                  <div
                    key={channel._id}
                    className={`flex border-b border-theme-chatDivider px-3 items-center sm:py-2 py-2 text-center
                     text-theme-primaryText font-normal cursor-pointer hover:bg-theme-sidebarHighlight `}
                    onClick={() => toggleChannel(channel)}
                  >
                    <p className="mr-1 text-sm">{channel.name}</p>
                  </div>
                ) : null;
              })}
              <p
                className="flex px-3 items-center text-sm sm:py-2 py-2 text-center text-theme-primaryText 
                font-normal cursor-pointer hover:bg-theme-sidebarHighlight"
                onClick={handleBrandProfile}
              >
                Brand Profile
              </p>
              <div className="border-t border-t-theme-chatDivider"></div>
             {(!parameters || parameters?.allowDM)  && <p
                className="flex px-3 items-center text-sm sm:py-2 py-2 text-center
                 text-theme-primaryText font-normal cursor-pointer hover:bg-theme-sidebarHighlight"
                onClick={handleMessagePage}
              >
                Messages
              </p>}
              <div className="border-t border-t-theme-chatDivider"></div>
              {/* <ThemeToggleButton /> */}

              <div className="border-t border-t-theme-chatDivider"></div>

              {isLoggedIn && (
                <p
                  className="flex px-3 items-center text-sm sm:py-2 py-1.5 text-center text-theme-primaryText
                   font-normal  cursor-pointer hover:bg-theme-sidebarHighlight"
                  onClick={handleLogout}
                >
                  Logout
                </p>
              )}
              {!isLoggedIn && (
                <p
                  onClick={handleLogin}
                  className={`block text-sm font-normal font-inter cursor-pointer py-2 px-6  text-theme-primaryText`}
                >
                  Login
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      {myData?.username && (
        <div
          className="rounded-full h-7 w-7  sm:hidden flex cursor-pointer"
          onClick={() =>
            navigate(`/embed/channels/account/${myData?.username}/profile`)
          }
        >
          {/* <img
            src={myData.logo ? myData.logo : ProfileIcon}
            alt="profile"
            className="w-full h-full object-cover cursor-pointer"
          /> */}
          {myData?.logo ? (
            <img
              src={myData.logo}
              alt="profile-icon"
              className="rounded-full w-full h-full object-cover cursor-pointer shrink-0"
            />
          ) : myData?.color_logo ? (
            <div
              className="rounded-full w-full h-full shrink-0 flex items-center justify-center"
              style={{ backgroundColor: myData?.color_logo }}
            >
              <img src={ColorProfile} alt="color-profile" className="w-4 h-4" />
            </div>
          ) : (
            <img
              src={ProfileIcon}
              alt="profile-icon"
              className="rounded-full w-full h-full object-cover cursor-pointer shrink-0"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default EmbedHeaderPage;
