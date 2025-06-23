import React, { useState, useEffect } from "react";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import ArrowUp from "../../../assets/icons/up-arrow.svg";
import Logo from "../../../assets/icons/logo.svg";
import Add from "../../../assets/icons/add_btn.svg";
import AddLight from "../../../assets/lightIcons/create_channel_light.svg";
import ArrowDown from "../../../assets/icons/arrow_drop_down.svg";
import { useDispatch, useSelector } from "react-redux";
import { setEmbedCredentials } from "../embedSlices/embedAuthSlice";

import {
  setCreateTopicField,
  clearCreateTopic,
} from "./../../../redux/slices/createTopicSlice";
import useModal from "./../../hooks/ModalHook";
import Close from "../../../assets/icons/Close.svg";
import SidebarSkeleton from "./../../skeleton/SidebarSkeleton";
import { domainUrl } from "./../../../utils/globals";
import StorageManager from "./../utility/storage_manager";
import { getAppPrefix } from "../utility/embedHelper";

const EmbedSidebar = ({ closeSidebar, loading }) => {
  const location = useLocation();
  const { handleOpenModal } = useModal();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const myData = useSelector((state) => state.myData);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const auth = useSelector((state) => state.auth);
  const [expandedCommunityChannel, setExpandedCommunityChannel] =
    useState(false);
  const [expandedChannels, setExpandedChannels] = useState({});

  const domain = window.location.href;
  const embedHome = useSelector((state) => state.embedHome);
  const { username } = useParams();

  const handleChannelModal = () => {
    handleOpenModal("modalChannelOpen");
  };
  const handleTopicModal = (channelId) => {
    dispatch(clearCreateTopic());
    dispatch(setCreateTopicField({ field: "channel", value: channelId }));

    handleOpenModal("modalTopicOpen");
  };
  const toggleChannel = (id, username) => {
    closeSidebar();
    navigate(`/embed/channels/account/${username}/channel/${id}`);
  };

  useEffect(() => {
    if (!embedHome.channels || embedHome.channels.length === 0) return;
    const initialExpandedState = {};
    embedHome.channels.forEach((channel) => {
      initialExpandedState[channel._id] =
        channel._id === embedHome.selectedChannel;
    });
    setExpandedChannels(initialExpandedState);
  }, [embedHome.channels, embedHome.selectedChannel]);

  const toggleChannelExpanded = (channelId) => {
    if (expandedCommunityChannel === true) {
      setExpandedCommunityChannel(false);
    }
    setExpandedChannels((prevState) => ({
      ...prevState,
      [channelId]: !prevState[channelId],
    }));
  };

  const handleLogout = () => {
    closeSidebar();
    handleOpenModal("modalEmbedLogoutOpen");
  };

  const handleLogin = () => {
    const data = StorageManager.getItem("embedFetchedData");
    const dataId = JSON.parse(data);
    const channelId = dataId.selectedChannel;
    const username = dataId.username;
    closeSidebar();
    navigate(
      `/embed/channels/get-started?redirect=${getAppPrefix()}/account/${username}/channel/${channelId}`,
      {
        replace: true,
      }
    );
  };

  if (loading) {
    return <SidebarSkeleton />;
  }

  return (
    <div className="flex flex-col justify-between h-screen w-full overflow-y-auto custom-side-scrollbar">
      <div>
        <div className="w-full sm:hidden flex justify-end">
          <img
            src={Close}
            alt="close"
            className="mt-4 mb-2 mr-6 h-5 w-5 cursor-pointer"
            onClick={closeSidebar}
          />
        </div>

        <div className="ml-6 mt-4" onClick={() => navigate(`/`)}>
          <img
            src={Logo}
            alt="logo"
            className="cursor-pointer  w-8 h-8   rounded-sm object-contain"
          />
        </div>

        <div className="mt-2">
          {embedHome.channels.map((channel, channelIndex) => (
            <div key={channel._id} className="flex flex-col">
              <div className="border  border-theme-tertiaryBackground my-2"></div>
              <div
                className={`flex flex-row justify-between px-6 mb-1 items-center cursor-pointer
               ${
                 location.pathname.includes(
                   `/embed/channels/account/${channel?.user?.username}/channel/${channel._id}`
                 )
                   ? "text-theme-secondaryText bg-theme-tertiaryBackground rounded-lg mx-3 py-1"
                   : "text-theme-primaryText"
               }
                 `}
              >
                <p
                  className="text-sm font-normal font-inter text-theme-primaryText"
                  onClick={() =>
                    toggleChannel(channel._id, channel.user.username)
                  }
                >
                  {channel.name.charAt(0).toUpperCase() + channel.name.slice(1)}
                </p>
                <img
                  src={expandedChannels[channel._id] ? ArrowUp : ArrowDown}
                  onClick={() => toggleChannelExpanded(channel._id)}
                  alt={
                    expandedChannels[channel._id] ? "up-arrow" : "down-arrow"
                  }
                  className="h-7 w-7"
                />
              </div>
              {expandedChannels[channel._id] && (
                <div className="">
                  {channel.topics.map(
                    (topic, topicIndex) =>
                      (channel.visibility === "anyone" ||
                        channel.user._id === myData._id) && (
                        <div
                          key={topic._id}
                          className="flex flex-row items-center"
                        >
                          <Link
                            to={`/embed/channels/account/${channel.user.username}/channel/${channel._id}/c-id/topic/${topic._id}`}
                            className={`block ${
                              location.pathname ===
                              `/account/${channel.user.username}/channel/${channel._id}/c-id/topic/${topic._id}`
                                ? "bg-theme-tertiaryBackground rounded-lg mx-3 my-1"
                                : ""
                            } px-6 py-2.5 text-sm font-inter font-light cursor-pointer text-theme-primaryText`}
                            onClick={closeSidebar}
                          >
                            # {topic.name}
                          </Link>
                          {/* {topic.unreadCount > 0 && (
                            <div className="rounded-full w-5 h-5 text-center bg-theme-buttonEnable text-theme-secondaryText text-[10px] pt-0.5">
                              {topic.unreadCount}
                            </div>
                          )} */}
                        </div>
                      )
                  )}
                  {channel.user._id === myData._id && (
                    <div
                      className="flex flex-row items-center w-max mx-6 my-1.5 cursor-pointer  "
                      onClick={() => handleTopicModal(channel._id)}
                    >
                      <p className="text-theme-primaryText text-md">+</p>
                      <p className="text-sm font-normal font-inter ml-2 text-theme-primaryText ">
                        Add a topic
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
          <div className="border  border-theme-tertiaryBackground my-2"></div>

          {isLoggedIn && username === myData.username && (
            <div
              className="flex items-center px-6 py-2 mb-2 cursor-pointer rounded-lg "
              onClick={handleChannelModal}
            >
              <img
                src={Add}
                alt="Add Channel"
                className="dark:block hidden w-6"
              />
              <img
                src={AddLight}
                alt="Add Channel"
                className="dark:hidden w-6"
              />
              <p className="text-sm font-normal font-inter text-theme-primaryText pl-2">
                Create a new channel
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="mb-2 mt-2">
        {isLoggedIn && (
          <p
            className={`block text-sm font-normal font-inter cursor-pointer py-2 px-6 text-theme-primaryText`}
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
  );
};

export default EmbedSidebar;
