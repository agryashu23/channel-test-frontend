import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBusinessChannelsTopics,
  fetchBusinessRolesMembers,
  clearMembers,
  updateUserBusinessRole,
  removeUserBusinessMember,
} from "../../../redux/slices/businessSlice";
import { ChannelImages } from "../../constants/images";
import { useNavigate } from "react-router-dom";
import Loading from "../../../widgets/Loading";
import AdminDelete from "../../../assets/icons/admin_delete.svg";
import { showCustomToast } from "../../../widgets/toast";
import RemoveBusinessMemberModal from "./widgets/RemoveBusinessMemberModal";

const AdminRoleMembers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const business = useSelector((state) => state.business);
  const [selectedChannelId, setSelectedChannelId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);
  const [channelDropdownOpen, setChannelDropdownOpen] = useState(false);
  const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);
  const channelDropdownRef = useRef(null);
  const topicDropdownRef = useRef(null);
  const openRoleDropdownRef = useRef(null);
  const [selectedRoleMap, setSelectedRoleMap] = useState({});
  const [openRoleDropdown, setOpenRoleDropdown] = useState(null);
  const [fetchedContext, setFetchedContext] = useState({
    channelId: null,
    topicId: null,
  });
  const [removeModalData, setRemoveModalData] = useState(null); // holds { userId, channelId, topicId }

  const channelRoleOptions = ["member", "admin"];
  const topicRoleOptions = ["member", "admin"];

  useEffect(() => {
    dispatch(fetchBusinessChannelsTopics());
  }, []);

  const handleFetchMembers = async () => {
    const data = { channelId: selectedChannelId, topicId: selectedTopicId };
    const res = await dispatch(fetchBusinessRolesMembers(data)).unwrap();
    if (res) {
      const map = {};
      res.forEach((member) => {
        map[member._id] = member.role;
      });
      setSelectedRoleMap(map);
      setFetchedContext({
        channelId: selectedChannelId,
        topicId: selectedTopicId,
      }); // ✅ update context
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        channelDropdownRef.current &&
        !channelDropdownRef.current.contains(event.target)
      ) {
        setChannelDropdownOpen(false);
      }
      if (
        topicDropdownRef.current &&
        !topicDropdownRef.current.contains(event.target)
      ) {
        setTopicDropdownOpen(false);
      }
      if (
        openRoleDropdownRef.current &&
        !openRoleDropdownRef.current.contains(event.target)
      ) {
        setOpenRoleDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // useEffect(() => {
  //   return () => {
  //     dispatch(clearMembers());
  //   };
  // }, []);

  const selectedChannel = business.channels?.find(
    (c) => c._id === selectedChannelId
  );
  const availableTopics = selectedChannel?.topics || [];
  const filteredMembers = business.members;

  const handleRoleChange = (userId, role) => {
    const data = {
      userId,
      role,
      channelId: selectedChannelId,
      topicId: selectedTopicId,
    };
    dispatch(updateUserBusinessRole(data))
      .unwrap()
      .then((res) => {
        if (res) {
          showCustomToast("Role updated successfully");
        }
      });
  };

  return (
    <div className="flex flex-col pt-6  px-4 bg-theme-tertiaryBackground  w-full">
      <p className="text-theme-emptyEvent text-lg font-normal">Account</p>
      <p className="text-theme-secondaryText text-lg mt-1 font-normal">
        Members and Roles
      </p>
      <div className="border-t border-t-theme-chatDivider mt-4 mb-3 "></div>
      <p className="text-theme-emptyEvent text-xs mb-3 italic font-light">
        • Selecting a channel fetches all its members. Selecting a topic within
        that channel further filters to members of that specific topic. Removing
        members or updating their roles works contextually based on the current
        selection.
      </p>
      <div className="flex flex-row flex-wrap gap-6 mb-4">
        <div
          className="flex flex-col w-full sm:w-auto relative"
          ref={channelDropdownRef}
        >
          <p className="text-sm text-theme-secondaryText mb-2">
            Fetch by Channel
          </p>
          <div
            className="border border-theme-chatDivider rounded-md py-2 sm:px-3 px-2 text-sm 
                bg-theme-tertiaryBackground cursor-pointer flex justify-between items-center text-theme-primaryText w-full sm:w-64"
            onClick={() => setChannelDropdownOpen(!channelDropdownOpen)}
          >
            <span>{selectedChannel?.name || "Select Channel"}</span>

            <img
              src={
                channelDropdownOpen
                  ? ChannelImages.ArrowUp.default
                  : ChannelImages.ArrowDown.default
              }
              alt="dropdown"
              className="w-4 h-4 ml-2"
            />
          </div>

          {channelDropdownOpen && (
            <div className="absolute top-16 z-10 mt-0.5 w-full sm:w-64 bg-theme-secondaryBackground border border-theme-chatDivider rounded-md shadow-md max-h-60 overflow-y-auto">
              {business.channels?.map((channel) => (
                <div
                  key={channel._id}
                  className="px-3 py-2 text-sm text-theme-primaryText cursor-pointer hover:bg-theme-primaryBackground"
                  onClick={() => {
                    setSelectedChannelId(channel._id);
                    setSelectedTopicId(null);
                    setChannelDropdownOpen(false);
                  }}
                >
                  {channel.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedChannelId && (
          <div
            className="flex flex-col w-full sm:w-auto relative"
            ref={topicDropdownRef}
          >
            <p className="text-sm text-theme-secondaryText mb-2">
              Fetch by Topic
            </p>
            <div
              className="border border-theme-chatDivider rounded-md py-2 sm:px-3 px-2 text-sm 
                    bg-theme-tertiaryBackground cursor-pointer flex justify-between items-center text-theme-primaryText w-full sm:w-64"
              onClick={() => setTopicDropdownOpen(!topicDropdownOpen)}
            >
              <span>
                {availableTopics.find((t) => t._id === selectedTopicId)?.name ||
                  "Select Topic"}
              </span>
              <img
                src={
                  topicDropdownOpen
                    ? ChannelImages.ArrowUp.default
                    : ChannelImages.ArrowDown.default
                }
                alt="dropdown"
                className="w-4 h-4 ml-2"
              />
            </div>

            {topicDropdownOpen && (
              <div className="absolute z-10 top-16 mt-0.5 w-full sm:w-64 bg-theme-secondaryBackground border border-theme-chatDivider rounded-md shadow-md max-h-60 overflow-y-auto">
                <div
                  className="px-3 py-2 text-sm text-theme-primaryText cursor-pointer hover:bg-theme-primaryBackground"
                  onClick={() => {
                    setSelectedTopicId(null);
                    setTopicDropdownOpen(false);
                  }}
                >
                  Select Topic
                </div>
                {availableTopics.map((topic) => (
                  <div
                    key={topic._id}
                    className="px-3 py-2 text-sm text-theme-primaryText cursor-pointer hover:bg-theme-primaryBackground"
                    onClick={() => {
                      setSelectedTopicId(topic._id);
                      setTopicDropdownOpen(false);
                    }}
                  >
                    {topic.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div
        className="bg-theme-buttonEnable text-theme-secondaryText px-8 mt-1 py-1.5 w-max  font-normal  rounded-lg cursor-pointer"
        onClick={handleFetchMembers}
      >
        Fetch
      </div>
      <div className="border border-theme-chatDivider w-full rounded-lg my-4"></div>
      {business.loading ? (
        <div className="text-theme-secondaryText font-normal text-md text-center mx-auto mt-12 ">
          <Loading text="Fetching members..." />
        </div>
      ) : filteredMembers?.length > 0 ? (
        <div className="rounded-lg  flex flex-col sm:px-2 ">
          {filteredMembers.map((member) => (
            <div className="flex flex-col" key={member._id}>
              <div
                key={member._id}
                className="flex flex-row my-2 xs:items-center "
              >
                <div className="flex xs:flex-row flex-col justify-between xs:items-center w-full">
                  <div className="flex flex-row items-center xs:mb-0 mb-2">
                    {member.user?.logo ? (
                      <img
                        src={member.user?.logo}
                        alt="profile-icon"
                        className="rounded-md w-6 h-6 object-cover flex-shrink-0"
                      />
                    ) : member.user?.color_logo ? (
                      <div
                        className="rounded-md w-6 h-6 flex-shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: member?.user?.color_logo }}
                      >
                        <img
                          src={ChannelImages.ColorProfile.default}
                          alt="color-profile"
                          className="w-3 h-3"
                        />
                      </div>
                    ) : (
                      <img
                        src={ChannelImages.Profile.default}
                        alt="profile-icon"
                        className="rounded-md w-6 h-6 object-cover flex-shrink-0"
                      />
                    )}
                    <p
                      className="text-theme-secondaryText font-normal sm:text-md text-sm truncate w-full cursor-pointer ml-2"
                      onClick={() =>
                        navigate(`/account/${member.user?.username}/profile`)
                      }
                    >
                      {member.user?.username}
                    </p>
                  </div>
                  <div className="flex flex-row items-center space-x-3">
                    <div className="relative">
                      <div
                        className="border border-theme-chatDivider rounded-md py-1 px-2 text-sm bg-theme-tertiaryBackground cursor-pointer flex justify-between items-center text-theme-primaryText w-24"
                        ref={openRoleDropdownRef}
                        onClick={() =>
                          setOpenRoleDropdown(
                            openRoleDropdown === member._id ? null : member._id
                          )
                        }
                      >
                        <span>
                          {(selectedRoleMap[member._id] || member.role)
                            .charAt(0)
                            .toUpperCase() +
                            (selectedRoleMap[member._id] || member.role).slice(
                              1
                            )}
                        </span>
                        <img
                          src={
                            openRoleDropdown === member._id
                              ? ChannelImages.ArrowUp.default
                              : ChannelImages.ArrowDown.default
                          }
                          alt="arrow"
                          className="w-4 h-4 ml-2"
                        />
                      </div>
                      {openRoleDropdown === member._id && (
                        <div
                          className="absolute z-10 mt-1 w-24 bg-theme-secondaryBackground border border-theme-chatDivider
                       rounded-md shadow-md max-h-60 overflow-y-auto"
                          ref={openRoleDropdownRef}
                        >
                          {(fetchedContext.topicId
                            ? topicRoleOptions
                            : channelRoleOptions
                          )
                            .filter(
                              (role) =>
                                role !==
                                (selectedRoleMap[member._id] || member.role)
                            )
                            .map((role) => (
                              <div
                                key={role}
                                className="px-3 py-2 text-sm text-theme-primaryText cursor-pointer hover:bg-theme-primaryBackground"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRoleMap((prev) => ({
                                    ...prev,
                                    [member._id]: role,
                                  }));
                                  setOpenRoleDropdown(null);
                                }}
                              >
                                {role.charAt(0).toUpperCase() + role.slice(1)}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                    <img
                      src={AdminDelete}
                      alt="delete"
                      className="dark:block hidden h-5 w-5 cursor-pointer"
                      onClick={() =>
                        setRemoveModalData({
                          userId: member.user?._id,
                          channelId: selectedChannelId,
                          topicId: selectedTopicId,
                          username: member.user?.username,
                        })
                      }
                    />
                    {selectedRoleMap[member._id] &&
                      selectedRoleMap[member._id] !== member.role && (
                        <div
                          className="text-xs text-theme-secondaryText bg-theme-buttonEnable rounded-md px-2 py-1 font-light cursor-pointer"
                          onClick={() =>
                            handleRoleChange(
                              member.user._id,
                              selectedRoleMap[member._id]
                            )
                          }
                        >
                          {business.customLoading ? "Saving..." : "Save"}
                        </div>
                      )}
                  </div>
                </div>
              </div>
              <div className="border-t border-theme-chatDivider w-full rounded-lg "></div>
            </div>
          ))}
        </div>
      ) : selectedChannelId === null ? (
        <div className="text-theme-secondaryText font-normal text-md text-center mx-auto mt-12 ">
          Select a channel fetch members.
        </div>
      ) : (
        <div className="text-theme-secondaryText font-normal text-md text-center mx-auto mt-12 ">
          No members found.
        </div>
      )}
      {removeModalData && (
        <RemoveBusinessMemberModal
          userId={removeModalData.userId}
          channelId={removeModalData.channelId}
          topicId={removeModalData.topicId}
          username={removeModalData.username}
          onClose={() => setRemoveModalData(null)}
        />
      )}
    </div>
  );
};

export default AdminRoleMembers;
