import React, { useState, useEffect } from "react";
import Pin from "../../assets/icons/Pin.svg";
import PinLight from "../../assets/icons/pin_light.svg";
import Close from "../../assets/icons/Close.svg";
import { fetchPinnedChats } from "../../redux/slices/chatSlice";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../../widgets/Loading";
import { formatChatDate } from "./../../utils/methods";
import ColorProfile from "../../assets/images/color_profile.svg";
import playIcon from "../../assets/images/play_button.svg";
import Linkify from "react-linkify";
import EventCard from "./widgets/EventCard";
import Profile from "../../assets/icons/profile.svg";
import ChannelCover from "../../assets/channel_images/channel_cover.svg";
import documentImage from "../../assets/images/Attachment.svg";
import { unpinChat } from "../../redux/slices/chatSlice";

const PinnedChat = ({ topicId, setIsPinned, onJumpToChat }) => {
  const dispatch = useDispatch();
  const pinnedChats = useSelector((state) => state.chat.pinnedChats);
  const pinnedLoading = useSelector((state) => state.chat.pinnedLoading);
  const myData = useSelector((state) => state.myData);

  useEffect(() => {
    if (pinnedChats.length > 0 && pinnedChats[0].topic === topicId) {
      return;
    }
    dispatch(fetchPinnedChats(topicId));
  }, [topicId]);

  console.log(pinnedChats);

  const componentDecorator = (href, text, key) => (
    <a
      href={href}
      key={key}
      target="_blank"
      rel="noopener noreferrer"
      className="custom-link text-theme-buttonEnable"
    >
      {text}
    </a>
  );

  const handleUnpinChat = (id) => {
    dispatch(unpinChat(id));
  };

  const handleJumpToChat = (id) => {
    setIsPinned(false);
    setTimeout(() => {
      onJumpToChat?.(id);
    }, 100);
  };

  return (
    <div className="flex flex-col w-full h-full pt-2 overflow-y-auto">
      <div className="flex flex-row items-center justify-between px-4 pt-2 pb-3">
        <div className="flex flex-row items-center">
          <img
            src={Pin}
            alt="pin"
            className="w-5 h-5  dark:hidden block cursor-pointer"
          />
          <img
            src={PinLight}
            alt="pin"
            className="w-5 h-5  dark:block hidden cursor-pointer"
          />
          <p className="text-theme-secondaryText font-normal sm:text-[16px] text-sm ml-2">
            Pinned messages
          </p>
        </div>
        <div
          className="flex flex-row items-center w-max cursor-pointer "
          onClick={() => setIsPinned(false)}
        >
          <img src={Close} alt="close" className="w-3 h-3" />
          <p className="text-theme-emptyEvent font-light text-sm ml-1">Close</p>
        </div>
      </div>
      {pinnedLoading ? (
        <div className="flex flex-row items-center justify-center h-full">
          <Loading text="Loading pinned messages..." />
        </div>
      ) : pinnedChats.length > 0 ? (
        pinnedChats.map((chat) => (
          <div
            key={chat._id}
            className="border border-theme-chatDivider rounded-lg p-2 sm:mx-4 mx-3 cursor-pointer my-2"
            onClick={() => handleJumpToChat(chat._id)}
          >
            <div className={`flex w-full relative px-2   ${"justify-start"}`}>
              <div className={`flex w-full items-start`}>
                {chat.user?.logo ? (
                  <img
                    src={chat.user?.logo}
                    alt="profile-icon"
                    className="rounded-full w-8 h-8 object-cover mx-2 mt-0.5"
                    loading="lazy"
                  />
                ) : chat.user?.color_logo ? (
                  <div
                    className="rounded-full w-8 h-8 mx-2 shrink-0 mt-0.5 flex items-center justify-center"
                    style={{ backgroundColor: chat.user?.color_logo }}
                  >
                    <img
                      src={ColorProfile}
                      alt="color-profile"
                      className="w-5 h-5"
                    />
                  </div>
                ) : (
                  <img
                    src={Profile}
                    alt="profile-icon"
                    className="rounded-full w-8 h-8 object-cover mx-2 mt-0.5"
                  />
                )}
                <div
                  className={`flex flex-col w-full ${"items-start text-left"}`}
                >
                  <div className="flex flex-row items-center justify-between w-full">
                    <p
                      className={`text-theme-emptyEvent font-light text-xs flex items-center relative`}
                    >
                      <span
                        className={`${"text-theme-emptyEvent"}  cursor-pointer`}
                      >
                        {chat.user?._id === myData?._id
                          ? "You"
                          : chat.user?.username}
                      </span>
                      <span className="font-light ml-1 text-xs">
                        {formatChatDate(chat.createdAt)}
                      </span>
                    </p>
                    <div
                      className="bg-theme-secondaryText text-theme-primaryBackground 
                      px-2 py-1 rounded-full text-xs cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUnpinChat(chat._id);
                      }}
                    >
                      Jump
                    </div>
                  </div>

                  {chat.content && (
                    <Linkify componentDecorator={componentDecorator}>
                      <p
                        className={`text-theme-secondaryText text-sm font-light my-1  text-left
                          whitespace-pre-wrap break-words break-all w-full max-w-full`}
                      >
                        {chat.content}
                      </p>
                    </Linkify>
                  )}
                  {chat.event && (
                    <div className="mt-2">
                      <EventCard
                        width="w-max"
                        imageHeight="h-32"
                        event={chat.event}
                        color="bg-theme-tertiaryBackground"
                        openDropdownId={null}
                        handleToggleDropdown={() => {}}
                        btnPadding="xs:px-2 px-1"
                        spacing=""
                      />
                    </div>
                  )}

                  <div
                    className={`flex flex-row overflow-x-auto w-[100%] custom-scrollbar ${"justify-start"}`}
                  >
                    {chat.media.map((media, index) => {
                      return (
                        <div
                          className="relative my-1"
                          key={`${chat._id}-${media._id}-${index}-${media.type}`}
                        >
                          {media.type === "image" ? (
                            <div className="relative h-36 mr-3">
                              <img
                                src={media.url}
                                alt={media.name}
                                className="h-36 mt-1 rounded-md object-cover min-w-36 w-auto max-w-60"
                                loading="lazy"
                              />
                            </div>
                          ) : media.type === "video" ? (
                            <div className="relative h-36 w-auto max-w-52 mr-3 mt-1 rounded-md bg-gray-700 cursor-pointer flex items-center justify-center">
                              <img
                                src={media.thumbnail || ChannelCover}
                                alt="Click to load"
                                className="h-36 rounded-md object-cover w-auto max-w-60"
                              />
                              <img
                                src={playIcon}
                                alt="Play"
                                className="absolute w-12 h-12 opacity-90"
                              />
                            </div>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>

                  <div
                    className={`flex flex-row overflow-x-auto w-[100%] custom-scrollbar  ${"justify-start"}`}
                  >
                    {chat.media.map(
                      (media, index) =>
                        media.type === "document" && (
                          <div
                            className="w-max rounded-lg bg-theme-tertiaryBackground mt-1 relative mr-2 mb-1 cursor-pointer"
                            key={`${chat._id}-${media._id}-${index}-${media.type}`}
                          >
                            <div className="flex flex-row items-center justify-start w-full">
                              <img
                                src={documentImage}
                                alt="Document Icon"
                                className="h-16 w-15 object-fill  pr-3"
                              />
                              <div className="flex flex-col my-1 w-full-minus-68">
                                <p className="text-theme-secondaryText text-xs overflow-hidden text-ellipsis whitespace-nowrap font-normal">
                                  {media.name.length > 30
                                    ? `${media.name.slice(0, 30)}...`
                                    : media.name}
                                </p>
                                <p className="text-theme-primaryText mt-1 text-[10px] xs:text-xs font-light font-inter">
                                  {parseInt(parseInt(media.size || "0") / 1000)}{" "}
                                  Kb
                                </p>
                              </div>
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-row items-center justify-center h-full">
          <p className="text-theme-emptyEvent font-light text-md">
            No pinned messages
          </p>
        </div>
      )}
    </div>
  );
};

export default PinnedChat;
