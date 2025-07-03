import DropDown from "../../assets/icons/arrow_drop_down.svg";
import DropDownLight from "../../assets/lightIcons/arrow_drop_down_light.svg";
import ProfileIcon from "../../assets/icons/profile.svg";
import { fetchMyTopics } from "../../redux/slices/reorderTopicSlice.js";
import Pin from "../../assets/icons/Pin.svg";
import PinLight from "../../assets/icons/pin_light.svg";
import {
  setCreateTopicField,
  setCreateTopicItems,
} from "../../redux/slices/createTopicSlice";
import { fetchChannels } from "./../../redux/slices/channelItemsSlice";
import ColorProfile from "../../assets/images/color_profile.svg";

import {
  createTopicInvite,
  setTopicField,
} from "../../redux/slices/topicSlice";
import { setModalModal } from "../../redux/slices/modalSlice";
import { getAppPrefix } from "./../EmbedChannels/utility/embedHelper";
import Dots from "../../assets/icons/three_dots.svg";
import DotsLight from "../../assets/lightIcons/faqs_dots_light.svg";
import Edit from "../../assets/icons/Edit.svg";
import EditLight from "../../assets/lightIcons/edit_light.svg";
import Delete from "../../assets/icons/Delete.svg";
import DeleteLight from "../../assets/lightIcons/delete_light.svg";

import {
  React,
  useState,
  useEffect,
  useRef,
  useNavigate,
  useDispatch,
  useSelector,
  useModal,
  isEmbeddedOrExternal,
} from "../../globals/imports";
import {
  setTopicIdToDelete,
  setTopicNameToDelete,
  setTopicChannelToDelete,
} from "../../redux/slices/deleteTopicSlice.js";

const PageHeader = ({
  channelName,
  topic,
  topicId,
  toggleBottomSheet,
  // toggleSidebar,
  isOpen,
  // isSidebarOpen,
  username,
  channelId,
  setIsPinned,
}) => {
  const dispatch = useDispatch();
  const { handleOpenModal } = useModal();
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(false);
  const dropdownEditRef = useRef(null);
  const reorderTopics = useSelector((state) => state.reorderTopic);
  const channelsData = useSelector((state) => state.channelItems.channels);
  const myData = useSelector((state) => state.myData);
  // const [channelsData, setChannelsData] = useState([]);
  const myUser = useSelector((state) => state.auth.user);
  const myUserId = myUser?._id;
  const hasFetched = useRef(false);
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") !== "light"
  );

  const handleEditModal = () => {
    const transformedData = {
      ...topic,
    };
    dispatch(setCreateTopicItems(transformedData));
    dispatch(setCreateTopicField({ field: "isEdit", value: true }));
    setTimeout(() => {
      handleOpenModal("modalTopicOpen");
    }, 500);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownEditRef.current &&
        !dropdownEditRef.current.contains(event.target)
      ) {
        setIsEditDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  // useEffect(() => {
  //   dispatch(fetchChannels(username));
  // }, []);

  useEffect(() => {
    const formDataToSend = new FormData();
    dispatch(fetchMyTopics(channelId));
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const toggleEditDropdown = () => {
    setIsEditDropdownOpen(!isEditDropdownOpen);
  };

  const handleOwnerShareTopic = (id) => {
    dispatch(setModalModal({ field: "shareUsername", value: username }));
    dispatch(setModalModal({ field: "channelId", value: channelId }));
    const formDataToSend = new FormData();
    formDataToSend.append("topicId", id);
    formDataToSend.append("channelId", channelId);
    dispatch(createTopicInvite(formDataToSend))
      .unwrap()
      .then((invite) => {
        // console.log(invite.code);
        dispatch(setTopicField({ field: "code", value: invite.code }));
        setTimeout(() => {
          handleOpenModal("modalShareTopicOpen", id);
        }, 500);
      })
      .catch((error) => {
        alert(error);
      });
  };

  const toggleTopic = (newTopicId) => {
    navigate(
      `${getAppPrefix()}/account/${username}/channel/${channelId}/c-id/topic/${newTopicId}`
    );
  };

  const toggleChannel = (newChannelId) => {
    navigate(`${getAppPrefix()}/account/${username}/channel/${newChannelId}`);
  };

  const handleBrandProfile = () => {
    navigate(`${getAppPrefix()}/account/${username}/profile`);
  };

  const handleMessagePage = () => {
    navigate(`${getAppPrefix()}/account/${myData.username}/messages/list`);
  };

  const handleDeleteTopic = (topic) => {
    dispatch(setTopicIdToDelete(topic._id));
    dispatch(setTopicNameToDelete(topic.name));
    dispatch(setTopicChannelToDelete(topic.channel));
    handleOpenModal("modalDeleteTopicOpen");
  };

  const isOwner = topic.user === myData._id;

  return (
    <div className="flex flex-col w-full bg-theme-secondaryBackground border-b border-b-theme-chatDivider">
      <div
        className={`flex flex-row ${
          isEmbeddedOrExternal() ? "" : "py-3"
        }  justify-between items-center px-6 `}
      >
       
        {!isEmbeddedOrExternal() && (
          <div className="flex-row items-center flex relative">
            <p className="sm:hidden flex text-theme-secondaryText xs:text-xl text-lg sm:text-2xl font-normal font-inter tracking-wide">
              {channelName.charAt(0).toUpperCase() + channelName.slice(1)}
            </p>
            <p className="sm:flex hidden text-theme-secondaryText text-2xl font-normal font-inter tracking-wide">
              {topic.name.charAt(0).toUpperCase() + topic.name.slice(1)}
            </p>

            {isOwner && (
              <div className="relative flex items-center ml-2">
                <img
                  src={Dots}
                  alt="dots"
                  className="dark:block hidden w-6 h-6 mr-2 cursor-pointer z-20"
                  onClick={toggleEditDropdown}
                />
                <img
                  src={DotsLight}
                  alt="dots"
                  className="dark:hidden w-6 h-6 mr-2 cursor-pointer z-20"
                  onClick={toggleEditDropdown}
                />
                {isEditDropdownOpen && (
                  <div
                    ref={dropdownEditRef}
                    className="absolute top-6 -left-4 mt-1 ml-3 w-24 rounded-md shadow-lg border  border-theme-chatDivider
                                                           bg-theme-tertiaryBackground ring-1 ring-black ring-opacity-5 z-50"
                  >
                    <div
                      className="py-1"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="options-menu"
                    >
                      <div className="flex flex-row px-3 items-center">
                        <img
                          src={Edit}
                          alt="edit"
                          className="dark:block hidden w-4 h-4"
                        />
                        <img
                          src={EditLight}
                          alt="edit"
                          className="dark:hidden w-4 h-4"
                        />
                        <p
                          className="block font-light px-2 py-2 text-sm text-theme-secondaryText cursor-pointer"
                          role="menuitem"
                          onClick={() => {
                            handleEditModal(topic);
                          }}
                        >
                          Edit
                        </p>
                      </div>
                      <div
                        className="flex flex-row px-3 items-center"
                        onClick={() => handleDeleteTopic(topic)}
                      >
                        <img
                          src={Delete}
                          alt="edit"
                          className="dark:block hidden w-4 h-4"
                        />
                        <img
                          src={DeleteLight}
                          alt="edit"
                          className="dark:hidden w-4 h-4"
                        />
                        <p
                          className="block px-2 py-2 font-light text-sm   text-theme-secondaryText cursor-pointer"
                          role="menuitem"
                        >
                          Delete
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute left-0 top-6 mt-2 w-max rounded-md shadow-lg border 
      border-theme-chatDivider bg-theme-tertiaryBackground ring-1 ring-black ring-opacity-5 z-50"
              >
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  {channelsData?.map(
                    (channel) =>
                      channel.name !== channelName && (
                        <div
                          key={channel._id}
                          className="flex px-3 items-center sm:py-2 py-2 text-center 
                          text-theme-primaryText font-light cursor-pointer hover:bg-theme-sidebarHighlight"
                          onClick={() => toggleChannel(channel._id)}
                        >
                          <p className="mr-1">{channel.name}</p>
                        </div>
                      )
                  )}
                  <div className="border-t border-t-theme-chatDivider"></div>
                  <p
                    className="flex px-3 items-center sm:py-2 py-2 text-center text-theme-primaryText font-light cursor-pointer hover:bg-theme-sidebarHighlight"
                    onClick={handleBrandProfile}
                  >
                    Brand Profile
                  </p>
                  <div className="border-t border-t-theme-chatDivider"></div>
                  <p
                    className="flex px-3 items-center sm:py-2 py-2 text-center text-theme-primaryText font-light cursor-pointer hover:bg-theme-sidebarHighlight"
                    onClick={handleMessagePage}
                  >
                    Messages
                  </p>
                </div>
              </div>
            )} */}
          </div>
        )}

        <div className="flex flex-row items-center">
          <div onClick={() => setIsPinned(true)}>
            <img src={Pin} alt="pin" className="w-5 h-5 sm:mr-0 mr-3 dark:hidden block cursor-pointer"/>
            <img src={PinLight} alt="pin" className="w-5 h-5 sm:mr-0 mr-3 dark:block hidden cursor-pointer"/>
          </div>
         

        {!isEmbeddedOrExternal() && (
          <div
            className="rounded-full h-7 w-7 sm:hidden flex"
            onClick={() =>
              navigate(`${getAppPrefix()}/account/${myData.username}/profile`)
            }
          >
            {myData.logo ? (
              <img
                src={myData.logo}
                alt="profile-icon"
                className="rounded-full w-full h-full object-cover shrink-0"
              />
            ) : myData?.color_logo ? (
              <div
                className="rounded-full w-full h-full  shrink-0 flex items-center justify-center"
                style={{ backgroundColor: myData?.color_logo }}
              >
                <img
                  src={ColorProfile}
                  alt="color-profile"
                  className="w-4 h-4"
                />
              </div>
            ) : (
              <img
                src={ProfileIcon}
                alt="profile-icon"
                className="rounded-full w-full h-full object-cover shrink-0"
              />
            )}
          </div>
        )}
        </div>
     
      </div>
      {reorderTopics.myTopics.length > 0 && <div className="sm:hidden flex flex-row space-x-3 w-full overflow-x-auto pl-6 pr-2 pt-0.5 mb-0.5 pb-3">
        {reorderTopics.myTopics.map((topic) => {
          return (
            <div
              key={topic._id}
              className={`flex ${
                topic._id === topicId
                  ? "bg-theme-secondaryText text-theme-primaryBackground"
                  : "border flex-flex-row border-theme-emptyEvent text-theme-secondaryText"
              } px-3  items-center font-light
                sm:py-1.5 py-1 text-center  whitespace-nowrap rounded-full cursor-pointer`}
              onClick={() => toggleTopic(topic._id)}
            >
              <p className="mr-1 text-xs">{topic.name}</p>
              {topic.unreadCount > 0 && (
                <div className="w-4 h-4 flex items-center justify-center text-center text-xs bg-theme-sidebarColor rounded-full text-theme-secondaryText">
                  {topic.unreadCount}
                </div>
              )}
            </div>
          );
        })}
      </div>}
      {isEmbeddedOrExternal() && reorderTopics.myTopics.length > 0 && <div className="sm:flex hidden flex-row space-x-3 w-full overflow-x-auto pl-6 pr-2 pt-0.5 mb-0.5 pb-3">
        {reorderTopics.myTopics.map((topic) => {
          return (
            <div
              key={topic._id}
              className={`flex ${
                topic._id === topicId
                  ? "bg-theme-secondaryText text-theme-primaryBackground"
                  : "border flex-flex-row border-theme-emptyEvent text-theme-secondaryText"
              } px-3  items-center font-light
                sm:py-1.5 py-1 text-center  whitespace-nowrap rounded-full cursor-pointer`}
              onClick={() => toggleTopic(topic._id)}
            >
              <p className="mr-1 text-xs">{topic.name}</p>
              {topic.unreadCount > 0 && (
                <div className="w-5 h-5 flex items-center justify-center text-xs bg-theme-sidebarColor rounded-full text-theme-secondaryText">
                  {topic.unreadCount}
                </div>
              )}
            </div>
          );
        })}
      </div>}
    </div>
  );
};

export default PageHeader;
