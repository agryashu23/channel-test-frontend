import React, { useState, useEffect } from "react";
import { useLocation, Link, useParams, useNavigate } from "react-router-dom";
import { ChannelImages } from "../constants/images";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyChannels,
  fetchCommunityChannel,
} from "./../../redux/slices/channelItemsSlice";
import {
  setCreateTopicField,
  clearCreateTopic,
} from "./../../redux/slices/createTopicSlice";
import useModal from "./../hooks/ModalHook";
import SidebarSkeleton from "./../skeleton/SidebarSkeleton";
import { domainUrl } from "./../../utils/globals";
import { postRequestAuthenticated } from "./../../services/rest";
import ThemeToggleButton from "./../../utils/theme";

const UserSidebar = ({ closeSidebar }) => {
  const location = useLocation();
  const { handleOpenModal } = useModal();
  const navigate = useNavigate();
  const [isDashboard, setIsDashboard] = useState(false);
  const [apiFetchOnce, setApiFetchOnce] = useState(false);
  const dispatch = useDispatch();
  const [expandedChannels, setExpandedChannels] = useState({});
  const myData = useSelector((state) => state.myData);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isSubdomain = useSelector((state) => state.auth.isSubdomain);
  const [expandedCommunityChannel, setExpandedCommunityChannel] =
    useState(false);
  const galleryUsername = useSelector((state) => state.galleryData.username);

  const { userChannels, loading, error, communityChannel ,fetchedChannelsOnce} = useSelector(
    (state) => state.channelItems
  );
  const { channelId, username } = useParams();


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
    navigate(`/account/${username}/channel/${id}`);
  };


  const toggleChannelExpanded = (channelId) => {
    if (expandedCommunityChannel === true) {
      setExpandedCommunityChannel(false);
    }
    setExpandedChannels((prevState) => ({
      ...prevState,
      [channelId]: !prevState[channelId],
    }));
  };

  const handleCommunityExpansion = () => {
    if (expandedCommunityChannel === false) {
      setExpandedChannels({});
    }
    setExpandedCommunityChannel(!expandedCommunityChannel);
  };

  useEffect(() => {
    if (!fetchedChannelsOnce) {
      dispatch(fetchMyChannels());
    }
  }, [fetchedChannelsOnce]);
  


  useEffect(() => {
    if (userChannels.length > 0 && channelId) {
      const initialExpandedState = {};
      userChannels.forEach((channel) => {
        initialExpandedState[channel._id] = channel._id === channelId;
      });
      setExpandedChannels(initialExpandedState);
    }
  }, [userChannels, channelId]);
  
  

  useEffect(() => {
    const checkInitialKey = async () => {
      try {
        const response = await postRequestAuthenticated(
          "/check/api/key/generated"
        );
        setApiFetchOnce(true)
        if (response.success) {
          setIsDashboard(true);
        } 
      } catch (error) {}
    };
    if(!apiFetchOnce){
      checkInitialKey();
    }
  }, []);

  // useEffect(() => {
  //   dispatch(fetchCommunityChannel());
  // }, [dispatch]);

  const handleLogout = () => {
    closeSidebar();
    handleOpenModal("modalLogoutOpen");
  };

  const handleFeedbackModal = () => {
    handleOpenModal("modalFeedbackOpen");
  };

  const handleAdminNavigation = () => {
    if (isDashboard) {
      navigate(`/admin/${myData.username}/home`);
    } else {
      navigate(`/api/integration/channels`);
    }
  };

  const handleLogin = () => {
    if (isSubdomain) {
      window.location.replace(
        `https://${domainUrl}/get-started?redirectDomain=${galleryUsername}`
      );
    } else {
      navigate("/get-started");
    }
  };

  if (loading && fetchedChannelsOnce===false) {
    return <SidebarSkeleton />;
  }

  if (error) return <p>Error loading channels: {error}</p>;
  return (
    <div className="flex flex-col justify-between h-full  w-full overflow-y-auto custom-side-scrollbar ">
      <div>
        <div className="ml-6 mt-4 flex flex-row justify-between ">
          <div onClick={() => navigate(`/`)}>
            <img
              src={ChannelImages.CLogo.default}
              alt="logo"
              loading="lazy"
              className="dark:block hidden cursor-pointer  w-9 h-9   rounded-sm object-contain"
            />
            <img
              src={ChannelImages.DarkLogo.default}
              alt="logo"
              loading="lazy"
              className="dark:hidden cursor-pointer  w-9 h-9   rounded-sm object-contain"
            />
          </div>
          <div className="w-full sm:hidden flex justify-end">
            <img
              src={ChannelImages.Close.default}
              alt="close"
              className="mt-2 mr-6 h-5 w-5 cursor-pointer"
              onClick={closeSidebar}
            />
          </div>
        </div>

        <nav className="mt-6">
          <Link
            to={`/account/${username}/welcome`}
            className={`block text-sm font-normal font-inter cursor-pointer py-2 px-6 ${
              location.pathname === `/account/${username}/welcome`
                ? "text-theme-secondaryText bg-theme-sidebarHighlight rounded-lg mx-3"
                : "text-theme-primaryText"
            }`}
            onClick={closeSidebar}
          >
            Welcome to Channels
          </Link>

          {isLoggedIn && (
            <div className="border-t  border-t-theme-sidebarDivider my-2"></div>
          )}

          {isLoggedIn && (
            <Link
              to={`/account/${myData.username}/messages/list`}
              className={`block text-sm font-normal font-inter cursor-pointer py-2 px-6 ${
                location.pathname.startsWith(
                  `/account/${myData?.username}/messages/list`
                )
                  ? "text-theme-secondaryText bg-theme-sidebarHighlight rounded-lg mx-3"
                  : "text-theme-primaryText"
              }`}
              onClick={closeSidebar}
            >
              DMs
            </Link>
          )}
          {isLoggedIn && (
            <div className="border-t  border-t-theme-sidebarDivider my-2"></div>
          )}

          {isLoggedIn && (
            <Link
              to={`/account/${myData.username}/profile`}
              className={`block text-sm font-normal font-inter cursor-pointer py-2 px-6 ${
                location.pathname === `/account/${myData?.username}/profile`
                  ? "text-theme-secondaryText bg-theme-sidebarHighlight rounded-lg mx-3"
                  : "text-theme-primaryText"
              }`}
              onClick={closeSidebar}
            >
              Profile
            </Link>
          )}

          {userChannels.map((channel, channelIndex) => (
            <div key={channel._id} className="flex flex-col">
              <div className="border-t  border-t-theme-sidebarDivider my-2"></div>
              <div
                className={`flex flex-row justify-between px-6 mb-1 items-center cursor-pointer
              ${
                location.pathname ===
                `/account/${channel?.user?.username}/channel/${channel._id}`
                  ? "text-theme-secondaryText bg-theme-sidebarHighlight rounded-lg mx-3 py-1"
                  : "text-theme-primaryText"
              } 
                `}
              >
                <p
                  className="text-sm font-normal font-inter text-theme-primaryText"
                  onClick={() =>
                    toggleChannel(channel._id, channel.user?.username)
                  }
                >
                  {channel.name.charAt(0).toUpperCase() + channel.name.slice(1)}
                </p>
                <img
                  src={expandedChannels[channel._id] ? ChannelImages.ArrowUp.default : ChannelImages.ArrowDown.default}
                  onClick={() => toggleChannelExpanded(channel._id)}
                  alt={
                    expandedChannels[channel._id] ? "up-arrow" : "down-arrow"
                  }
                  className="dark:block hidden h-7 w-7"
                />
                <img
                  src={
                    expandedChannels[channel._id]
                      ? ChannelImages.ArrowUpLight.default
                      : ChannelImages.ArrowDownLight.default
                  }
                  onClick={() => toggleChannelExpanded(channel._id)}
                  alt={
                    expandedChannels[channel._id] ? "up-arrow" : "down-arrow"
                  }
                  className="dark:hidden h-7 w-7"
                />
              </div>
              {expandedChannels[channel._id] && (
                <div className="">
                  {channel.topics.map(
                    (topic, topicIndex) =>
                      (channel.visibility === "anyone" ||
                        channel.members?.includes(myData._id) ||
                        channel.user._id === myData._id) && (
                        <div key={topic._id}>
                          <Link
                            to={`/account/${channel.user.username}/channel/${channel._id}/c-id/topic/${topic._id}`}
                            className={`block ${
                              location.pathname ===
                              `/account/${channel.user.username}/channel/${channel._id}/c-id/topic/${topic._id}`
                                ? "bg-theme-sidebarHighlight rounded-lg mx-3 my-1"
                                : ""
                            } px-6 py-2.5 text-sm font-inter font-light cursor-pointer text-theme-primaryText`}
                            onClick={closeSidebar}
                          >
                            # {topic.name}
                          </Link>
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
          <div className="border-t  border-t-theme-sidebarDivider my-2"></div>

          {isLoggedIn && (
            <div
              className="flex items-center px-6 py-2 mb-2 cursor-pointer rounded-lg "
              onClick={handleChannelModal}
            >
              <img
                src={ChannelImages.Add.default}
                alt="Add Channel"
                className="w-6 dark:block hidden"
              />
              <img
                src={ChannelImages.CreateChannel.default}
                alt="Add Channel"
                className="w-6 dark:hidden"
              />
              <p className="text-sm font-normal font-inter text-theme-primaryText pl-2">
                Create a new channel
              </p>
            </div>
          )}
        </nav>
      </div>
      <div className="pb-5 mt-12">
        {isLoggedIn && (
          <div
            className={`block text-sm font-normal font-inter cursor-pointer py-2 px-6 text-theme-primaryText`}
            onClick={handleAdminNavigation}
          >
            {isDashboard ? "Dashboard" : "Integrate Channels"}
          </div>
        )}
        <div className="border-t  border-t-theme-sidebarDivider my-2"></div>
        <div
          className={`block text-sm font-normal font-inter cursor-pointer py-2 px-6 text-theme-primaryText`}
          onClick={() => navigate("/documentation/channels")}
        >
          Documentation
        </div>
        {/* <div className="border-t  border-t-theme-sidebarDivider my-2"></div> */}
        {/* <div
          className={`flex flex-row justify-between pl-6 pr-4 mb-1 items-center cursor-pointer  ${
            location.pathname ===
            `/account/${communityChannel?.user?.username}/channel/${communityChannel?._id}`
              ? "text-theme-secondaryText bg-theme-sidebarHighlight rounded-lg mx-3 "
              : "text-theme-primaryText"
          } `}
        > */}
        {/* <Link
            to={`/account/${communityChannel?.user?.username}/channel/${communityChannel?._id}`}
            className={`block py-2.5 text-sm font-inter font-light cursor-pointer text-theme-primaryText `}
            onClick={closeSidebar}
          >
            Channels Community
          </Link>
          <img
            src={expandedCommunityChannel ? ArrowUp : ArrowDown}
            onClick={handleCommunityExpansion}
            alt={expandedCommunityChannel ? "up-arrow" : "down-arrow"}
            className="dark:block hidden h-7 w-7"
          />
          <img
            src={expandedCommunityChannel ? ArrowUpLight : ArrowDownLight}
            onClick={handleCommunityExpansion}
            alt={expandedCommunityChannel ? "up-arrow" : "down-arrow"}
            className="dark:hidden h-7 w-7"
          /> */}
        {/* </div> */}
        {/* <div>
          {expandedCommunityChannel &&
            communityChannel?.topics?.map((topic, topicIndex) => (
              <div key={topic._id}>
                <Link
                  to={`/account/${communityChannel?.user?.username}/channel/${communityChannel._id}/c-id/topic/${topic._id}`}
                  className={`block ${
                    location.pathname ===
                    `/account/${communityChannel?.user?.username}/channel/${communityChannel._id}/c-id/topic/${topic._id}`
                      ? "bg-theme-sidebarHighlight rounded-lg mx-3 my-1"
                      : ""
                  } px-6 py-2.5 text-sm font-inter font-light cursor-pointer text-theme-primaryText`}
                >
                  # {topic.name}
                </Link>
              </div>
            ))}
        </div> */}
        <div className="border-t  border-t-theme-sidebarDivider my-2"></div>
        {/* <div
          className={`block text-sm font-normal font-inter cursor-pointer py-2 px-6 text-theme-primaryText`}
          onClick={handleFeedbackModal}
        >
          Feedback
        </div> */}
        <div className="px-4">
          <ThemeToggleButton />
        </div>
        <div className="border-t  border-t-theme-sidebarDivider my-2"></div>
        <a
          href="https://calendly.com/channels_social/talk-to-us"
          target="_blank"
          rel="noopener noreferrer"
          className={`block text-sm font-normal font-inter cursor-pointer py-2 px-6 text-theme-primaryText`}
        >
          Help
        </a>
        <div className="border-t  border-t-theme-sidebarDivider my-2"></div>
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

export default UserSidebar;
