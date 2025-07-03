import React, { forwardRef, useImperativeHandle } from "react";
import Smiley from "../../assets/icons/smiley.svg";
import ArrowDropDown from "../../assets/icons/arrow_drop_down.svg";
import ArrowDropDownLight from "../../assets/lightIcons/chat_drop_light.svg";
import ReplyIcon from "../../assets/icons/reply_icon.svg";
import EmojiPicker from "emoji-picker-react";
import ChannelCover from "../../assets/channel_images/channel_cover.svg";
import ColorProfile from "../../assets/images/color_profile.svg";
import { IoExpand } from "react-icons/io5";

import playIcon from "../../assets/images/play_button.svg";
import { format } from "date-fns";
import {
  fetchTopicChats,
  setChatField,
  pushToResource,
  toggleReaction,
  addMessage,
  reactionMessage,
  deleteMessage,
  pinChat,
} from "./../../redux/slices/chatSlice";
import { fetchTopicEventMembers } from "./../../redux/slices/eventItemsSlice";
import { pdfjs } from "react-pdf";
import Profile from "../../assets/icons/profile.svg";
import documentImage from "../../assets/images/Attachment.svg";
import {
  deleteTopicChat,
  clearChatIdToDelete,
} from "../../redux/slices/chatSlice";
import { showCustomToast } from "../../widgets/toast";

import Linkify from "react-linkify";
import socket from "../../utils/socket";
import TopicChatSkeleton from "./../skeleton/Topic/TopicChatSkeleton";
import EventCard from "./widgets/EventCard";
import { getAppPrefix } from "./../EmbedChannels/utility/embedHelper";
import { formatChatDate } from "./../../utils/methods";

import {
  useState,
  useEffect,
  useRef,
  useNavigate,
  useDispatch,
  useSelector,
  useParams,
  useModal,
} from "../../globals/imports";
import ImageFullscreenModal from "../chips/widgets/FullScreenModal";
import PinnedChat from "./PinnedChat";
import PageChatData2 from "./PageChatData2";
import TopicMembersTab from "./TopicMembersTab";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

const PageChatData = forwardRef(({ topicId, isLoggedIn, myData, onNewMessageSent, business, topic ,
  isPinned, setIsPinned,channelName,isBrandTalk,isMemberClick,channelId}, ref) => {
  const { handleOpenModal } = useModal();
  const { username } = useParams();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalStartIndex, setModalStartIndex] = useState(0);
  const myUser = useSelector((state) => state.auth.user);

  const myUserId = myUser?._id;

  const navigate = useNavigate();
  const handleClick = (document) => {
    handleOpenModal("modalDocumentOpen", document);
  };

  const [hoveredChatId, setHoveredChatId] = useState(null);
  const [hoveredMedia, setHoveredMedia] = useState({
    chatId: null,
    mediaIndex: null,
  });
  const [hoveredDocument, setHoveredDocument] = useState({
    chatId: null,
    mediaIndex: null,
  });
  const [showMediaMenu, setShowMediaMenu] = useState({
    chatId: null,
    mediaIndex: null,
  });
  const [showDocumentMenu, setShowDocumentMenu] = useState({
    chatId: null,
    mediaIndex: null,
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const dropdownRefs = useRef({});
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();
  const [openDropdownId, setOpenDropdownId] = useState(null);

  const [openUpward, setOpenUpward] = useState(false);
  const menuRef = useRef(null);
  const chatContainerRef = useRef(null);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [showNewMessageIndicator, setShowNewMessageIndicator] = useState(false);

  const reactionsData = ["❤️", "😂", "👍", "😢"];
  const Chats = useSelector((state) => state.chat.chats);
  const loading = useSelector((state) => state.chat.loading);
  const loadingMore = useSelector((state) => state.chat.loadingMore);
  const chatRefs = useRef(new Map());
  const [highlightedChatId, setHighlightedChatId] = useState(null);
  const [videoLoaded, setVideoLoaded] = useState({});
  const firstLoadDone = useRef(false);

  const scrollToChat = async (chatId) => {
    const existingChat = chatRefs.current.get(chatId);
    if (existingChat) {
      existingChat.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedChatId(chatId);
      setTimeout(() => setHighlightedChatId(null), 2500);
      return;
    }
    let found = false;
    let localSkip = skip;
    while (!found && hasMore) {
      setIsLoadingMore(true);

      try {
        const res = await dispatch(
          fetchTopicChats({ topicId, skip: localSkip })
        ).unwrap();
        localSkip += 15;

        if (res?.hasMore === false) setHasMore(false);
        setSkip(localSkip);
        await new Promise((r) => setTimeout(r, 300));
        const newlyLoadedChat = chatRefs.current.get(chatId);
        if (newlyLoadedChat) {
          newlyLoadedChat.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
          setHighlightedChatId(chatId);
          setTimeout(() => setHighlightedChatId(null), 2500);
          found = true;
        }
      } catch (error) {
        console.error("Error loading more chats", error);
        break;
      } finally {
        setIsLoadingMore(false);
      }
    }
  };

  useImperativeHandle(ref, () => {
    return { scrollToChat };
  });
  

  const isUserNearBottom = () => {
    if (!chatContainerRef.current) return false;
    const threshold = 100;
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    return scrollHeight - scrollTop - clientHeight < threshold;
  };

  const addRef = (chatId, mediaIndex, type) => {
    const key = `${type}-${chatId}-${mediaIndex}`;
    if (!dropdownRefs.current[key]) {
      dropdownRefs.current[key] = React.createRef();
    }
    return dropdownRefs.current[key];
  };

  const handleMouseEnterMedia = (chatId, mediaIndex) => {
    setHoveredMedia({ chatId, mediaIndex });
  };
  const handleMouseEnterDocument = (chatId, mediaIndex) => {
    setHoveredDocument({ chatId, mediaIndex });
  };

  const handleToggleDropdown = (id) => {
    setOpenDropdownId((prevId) => (prevId === id ? null : id));
  };

  const handleShowMediaMenu = (chatId, mediaIndex) => {
    if (
      showMediaMenu.chatId === chatId &&
      showMediaMenu.mediaIndex === mediaIndex
    ) {
      setShowMediaMenu({ chatId: null, mediaIndex: null });
    } else {
      setShowDocumentMenu({ chatId: null, mediaIndex: null });
      setShowMediaMenu({ chatId: chatId, mediaIndex: mediaIndex });
    }
  };
  const handleShowDocumentMenu = (chatId, mediaIndex) => {
    if (
      showDocumentMenu.chatId === chatId &&
      showDocumentMenu.mediaIndex === mediaIndex
    ) {
      setShowDocumentMenu({ chatId: null, mediaIndex: null });
    } else {
      setShowMediaMenu({ chatId: null, mediaIndex: null });
      setShowDocumentMenu({ chatId: chatId, mediaIndex: mediaIndex });
    }
  };

  const handleMouseLeaveMedia = () => {
    setHoveredMedia({ chatId: null, mediaIndex: null });
  };
  const handleMouseLeaveDocument = () => {
    setHoveredDocument({ chatId: null, mediaIndex: null });
  };

  const handleClickOutside = (event) => {
    let clickedInside = false;

    Object.values(dropdownRefs.current).forEach((ref) => {
      if (ref.current && ref.current.contains(event.target)) {
        clickedInside = true;
      }
    });

    if (!clickedInside) {
      setShowMediaMenu({ chatId: null, mediaIndex: null });
      setShowDocumentMenu({ chatId: null, mediaIndex: null });
    }
  };

  const previewConfig = {
    showPreview: false,
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
   
    setSkip(0);
    setHasMore(true);
    setShouldScrollToBottom(true);
    firstLoadDone.current = false;
    dispatch(fetchTopicEventMembers(topicId));
    dispatch(fetchTopicChats({ topicId, skip: 0 })).then((res) => {
      if (res.payload) {
        setSkip(15);
        setHasMore(res.payload.hasMore);
        setTimeout(() => {
          if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
              chatContainerRef.current.scrollHeight;
          }
          firstLoadDone.current = true;
        }, 200);
      }
    });
  }, [dispatch, topicId]);

  const handleScroll = () => {
    if (
      chatContainerRef.current &&
      chatContainerRef.current.scrollTop < 100 &&
      hasMore &&
      !isLoadingMore
    ) {
      setIsLoadingMore(true);
      dispatch(fetchTopicChats({ topicId, skip }))
        .then((res) => {
          if (res.payload) {
            setShouldScrollToBottom(false);
            setSkip(skip + 15);
            setHasMore(res.payload.hasMore);
          }
        })
        .finally(() => setIsLoadingMore(false));
    }
  };

  const handleManualScroll = () => {
    if (isUserNearBottom()) {
      setShowNewMessageIndicator(false);
    }
  };

  useEffect(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const onScroll = () => {
      handleScroll();
      handleManualScroll();
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [skip, hasMore, isLoadingMore]);

  useEffect(() => {
    if (!firstLoadDone.current && shouldScrollToBottom && isUserNearBottom()) {
      const timeout = setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        }
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [Chats, shouldScrollToBottom]);

  useEffect(() => {
    if (onNewMessageSent) {
      onNewMessageSent(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop =
            chatContainerRef.current.scrollHeight;
        }
      });
    }
  }, [onNewMessageSent]);

  useEffect(() => {
    const handleChatDeleted = (message) => {
      if (message?.topicId === topicId) {
        console.log(message);
        dispatch(deleteMessage(message.chatId));
      }
    };

    socket.on("chat_deleted", handleChatDeleted);
    return () => socket.off("chat_deleted", handleChatDeleted);
  }, [dispatch, topicId]);

  useEffect(() => {
    const handleReaction = (message) => {
      if (message?.topic === topicId) {
        dispatch(reactionMessage(message));
      }
    };

    socket.on("receive_reaction", handleReaction);
    return () => socket.off("receive_reaction", handleReaction);
  }, [dispatch, topicId]);

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      if (message?.topic === topicId && message?.user?.username) {
        if (myData?.username && message?.user?.username !== myData?.username) {
          dispatch(addMessage(message));
          const userAtBottom = isUserNearBottom();

          if (userAtBottom) {
            setTimeout(() => {
              if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop =
                  chatContainerRef.current.scrollHeight;
              }
            }, 100);
          } else {
            setShowNewMessageIndicator(true);
          }
        }
      }
    };

    socket.on("receive_message", handleReceiveMessage);
    return () => socket.off("receive_message", handleReceiveMessage);
  }, [dispatch, topicId, myData?.username]);

  const handleMouseLeave = () => {
    setShowReactionPicker(false);
    setShowMenu(false);
    setHoveredChatId(null);
    setShowEmojiPicker(false);
  };

  const handleshowReaction = () => {
    if (showMenu) {
      setShowMenu(false);
    }
    setShowReactionPicker(!showReactionPicker);
  };
  const handleShowMenu = () => {
    if (showReactionPicker) {
      setShowReactionPicker(false);
    }
    setShowMenu(!showMenu);
  };

  const handleReactionClick = (reaction, chatId) => {
    setShowReactionPicker(false);
    setShowEmojiPicker(false);
    const formDataToSend = new FormData();
    formDataToSend.append("reaction", reaction);
    formDataToSend.append("chatId", chatId);
    dispatch(toggleReaction(formDataToSend));
  };

  const handleReplyClick = (id, username) => {
    dispatch(setChatField({ field: "replyTo", value: id }));
    dispatch(setChatField({ field: "replyUsername", value: username }));
  };

  const handlePinChat = (id,pinned) => {
    dispatch(pinChat(id)).unwrap().then(() => {
      showCustomToast(`Chat ${pinned ? "unpinned" : "pinned"} successfully`);
    }).catch((error) => {
      console.log(error);
    });
  };

  const handleDeleteChat = (id) => {
    dispatch(setChatField({ field: "chatReplyId", value: id }));
    dispatch(setChatField({ field: "topicReplyId", value: topicId }));
    handleOpenModal("modalChatDeleteOpen");
  };
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
  useEffect(() => {
    if (showMenu) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          if (menuRef.current) {
            const rect = menuRef.current.getBoundingClientRect();
            const dropdownHeight = menuRef.current.offsetHeight;
            const spaceBelow = window.innerHeight - rect.bottom;

            const spaceAbove = rect.top;

            if (
              spaceBelow < dropdownHeight + 100 &&
              spaceAbove > dropdownHeight
            ) {
              setOpenUpward(true);
            } else {
              setOpenUpward(false);
            }
          }
        });
      }, 0);
    }
  }, [showMenu]);

  useEffect(() => {
    if (!showMenu) {
      setOpenUpward(false);
    }
  }, [showMenu]);

  const handlePushResource = (chatId, mediaId) => {
    const formDataToSend = new FormData();
    formDataToSend.append("chatId", chatId);
    formDataToSend.append("mediaId", mediaId);
 
    dispatch(pushToResource(formDataToSend))
      .unwrap()
      .then(() => {
        setShowMediaMenu({ chatId: null, mediaIndex: null });
        setShowDocumentMenu({ chatId: null, mediaIndex: null });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const isOwner = username === myData?.username;
  const isSameDate = (d1, d2) =>
    new Date(d1).toDateString() === new Date(d2).toDateString();

  if (loading) {
    return <TopicChatSkeleton />;
  }

  return (
    <>
    {isMemberClick?<div className="bg-theme-secondaryBackground w-full h-full overflow-y-auto">
      <TopicMembersTab channelId={channelId} isOwner={isOwner} topicId={topicId}/>
    </div>:
    isBrandTalk ? (
      <div className="bg-theme-primaryBackground w-full h-full overflow-y-auto">
        <PageChatData2
          topicId={topicId}
          isLoggedIn={isLoggedIn}
          myData={myData}
          user_id={topic.user._id}
          onNewMessageSent={onNewMessageSent}
          channelName={channelName}
        />
      </div>
    ):
    isPinned ? (
      <PinnedChat setIsPinned={setIsPinned} topicId={topicId} onJumpToChat={(id) => scrollToChat(id)}/>
    ) : (
      <div
      className="w-full h-full max-w-full overflow-x-hidden bg-theme-secondaryBackground pt-2 relative"
      ref={chatContainerRef}
    >
      {loadingMore && (
        <div className="text-center py-4 text-sm text-theme-secondaryText">
          Loading older messages...
        </div>
      )}

      {showNewMessageIndicator && (
        <div className="fixed bottom-28 xl:left-[40%] md:left-1/2 sm:left-1/2 xs:left-1/3 left-1/3 z-50 ">
          <button
            onClick={() => {
              if (chatContainerRef.current) {
                chatContainerRef.current.scrollTop =
                  chatContainerRef.current.scrollHeight;
              }
              setShowNewMessageIndicator(false);
            }}
            className="bg-theme-chatDivider text-xs font-light text-theme-secondaryText px-2.5 py-1.5 rounded-full shadow-lg transition-transform"
          >
            New Message ↓
          </button>
        </div>
      )}

      {Chats.map((chat, index) => {
        const isMyMessage = false;
        const ownMessage = chat.user?._id === myData?._id;
        const currentDate = chat.createdAt;
        const prevDate = index > 0 ? Chats[index - 1].createdAt : null;

        const showDateSeparator =
          !prevDate || !isSameDate(currentDate, prevDate);
        return (
          <div key={chat._id}>
            {showDateSeparator && (
              <div className="flex items-center justify-center my-2 px-2 w-full text-theme-secondaryText">
                <div className="flex-grow border-t border-theme-chatDivider"></div>
                <span className="mx-4 text-xs font-light whitespace-nowrap text-theme-emptyEvent">
                  {format(new Date(currentDate), "dd MMMM yyyy")}
                </span>
                <div className="flex-grow border-t border-theme-chatDivider"></div>
              </div>
            )}

            <div
              ref={(el) => chatRefs.current.set(chat._id, el)}
              key={chat._id}
              className={`flex flex-col relative w-full mb-2 px-0 pt-2.5  ${
                hoveredChatId === chat._id
                  ? "bg-theme-sidebarHighlight"
                  : highlightedChatId === chat._id
                  ? "flicker-highlight "
                  : ""
              }`}
              onMouseEnter={() => setHoveredChatId(chat._id)}
              onMouseLeave={handleMouseLeave}
            >
              {hoveredChatId === chat._id && (
                <span
                  className={`absolute ${
                    isMyMessage ? "xs:left-6 left-4" : "xs:right-4 right-2"
                  } flex items-center space-x-2 z-10`}
                >
                  <img
                    src={Smiley}
                    alt="emoji"
                    className="cursor-pointer w-6 h-6"
                    onClick={handleshowReaction}
                  />
                  <div
                    className="cursor-pointer relative z-20"
                    onClick={handleShowMenu}
                  >
                    <img
                      src={ArrowDropDown}
                      alt="arrow-dop-down"
                      className="dark:block hidden w-6 h-6 "
                    />
                    <img
                      src={ArrowDropDownLight}
                      alt="arrow-dop-down"
                      className="dark:hidden w-3 h-3"
                    />
                    {showMenu && (
                      <div
                        ref={menuRef}
                        className={`absolute ${
                          isMyMessage ? "left-2" : "right-0"
                        } ${openUpward ? "bottom-full mb-2" : "top-6"} 
                   w-max bg-theme-tertiaryBackground border border-theme-modalBorder 
                   shadow-lg rounded-lg z-10`}
                      >
                        <div
                          className="py-1 hover:bg-theme-primaryBackground"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          <div
                            className="relative flex flex-row px-4 items-center "
                            onClick={() =>
                              handleReplyClick(chat?._id, chat.user?.username)
                            }
                          >
                            <p className="block ml-2 py-1 font-normal text-sm text-theme-primaryText cursor-pointer">
                              Reply
                            </p>
                          </div>
                        </div>
                        {(chat.user?._id === myData?._id || isOwner) && (
                          <div
                            className="py-1 hover:bg-theme-primaryBackground"
                            role="menu"
                            aria-orientation="vertical"
                          >
                            <div
                              className="relative flex flex-row px-4 items-center"
                              onClick={() => handleDeleteChat(chat?._id)}
                            >
                              <p className="block ml-2 font-normal py-1 text-sm text-theme-primaryText cursor-pointer">
                                Delete
                              </p>
                            </div>
                          </div>
                        )}
                         {isOwner && (
                          <div
                            className="py-1 hover:bg-theme-primaryBackground"
                            role="menu"
                            aria-orientation="vertical"
                          >
                            <div
                              className="relative flex flex-row px-4 items-center"
                              onClick={() => handlePinChat(chat?._id,chat.pinned)}
                            >
                              <p className="block ml-2 font-normal py-1 text-sm text-theme-primaryText cursor-pointer">
                                {chat.pinned ? "Unpin" : "Pin"}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </span>
              )}

              {chat.replyTo !== null && (
                <div
                  className={`flex  ${
                    isMyMessage ? "justify-end pr-4" : "justify-start pl-4 "
                  } w-full mb-1 cursor-pointer`}
                  onClick={() => scrollToChat(chat.replyTo._id)}
                >
                  <div
                    className={`flex ${
                      isMyMessage ? "flex-row-reverse mr-4" : "flex-row ml-4"
                    } items-center max-w-[75%]`}
                  >
                    <img
                      src={ReplyIcon}
                      alt="logo"
                      className={` ${
                        isMyMessage ? "-scale-x-100 ml-1" : "mr-1"
                      } rounded-full w-8 h-auto object-cover `}
                    />

                    <div
                      className={`flex flex-col w-4/5 ${
                        isMyMessage ? "items-end" : "items-start"
                      }`}
                    >
                      <div className="flex flex-row items-center space-x-1">
                        {chat.replyTo?.user?.logo ? (
                          <img
                            src={chat.replyTo.user.logo}
                            alt="profile-icon"
                            className="rounded-full w-4 h-4 object-cover"
                            loading="lazy"
                          />
                        ) : chat.replyTo?.user?.color_logo ? (
                          <div
                            className="rounded-full w-4 h-4 shrink-0 flex items-center justify-center"
                            style={{
                              backgroundColor: chat.replyTo.user.color_logo,
                            }}
                          >
                            <img
                              src={ColorProfile}
                              alt="color-profile"
                              className="w-2 h-2"
                            />
                          </div>
                        ) : (
                          <img
                            src={Profile}
                            alt="profile-icon"
                            className="rounded-full w-4 h-4 object-cover"
                          />
                        )}
                        <p className="text-theme-emptyEvent font-normal text-xs truncate">
                          {chat.replyTo?.user?.username === chat?.user?.username
                            ? "You"
                            : chat.replyTo?.user?.username}
                        </p>
                      </div>

                      {/* Message Snippet */}
                      <p
                        className={`text-theme-emptyEvent mt-0.5 font-light text-xs max-w-full text-ellipsis whitespace-nowrap overflow-hidden ${
                          isMyMessage ? "text-right" : "text-left"
                        }`}
                      >
                        {chat.replyTo.content
                          ? chat.replyTo.content
                          : chat.replyTo?.media && chat.replyTo?.media?.length > 0
                          ? "Tap to see Attachment"
                          : chat.replyTo?.event
                          ? "Tap to see Event"
                          : "Tap to see Poll"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div
                className={`flex w-full relative px-2   ${
                  isMyMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex  ${
                    isMyMessage ? "flex-row-reverse" : ""
                  } w-max md:max-w-[75%] max-w-[90%] items-start`}
                >
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
                    className={`flex flex-col w-full ${
                      isMyMessage
                        ? "items-end text-right"
                        : "items-start text-left"
                    }`}
                  >
                    <p
                      className={`text-theme-emptyEvent font-light text-xs flex items-center relative`}
                    >
                      <span
                        className={`${
                          ownMessage
                            ? "text-[#FF8C4E] font-medium"
                            : "text-theme-emptyEvent"
                        }  cursor-pointer`}
                        onClick={()=>{
                          if(!business?.parameters ||  business?.parameters?.allowDM || topic?.user._id ===myUserId){
                            navigate(
                              `${getAppPrefix()}/account/${
                                chat.user?.username
                              }/profile`
                            )
                          }
                        }
                        }
                      >
                        {ownMessage ? "You" : chat.user?.username}
                      </span>
                      <span className="font-light ml-1 text-xs">
                        {formatChatDate(chat.createdAt)}
                      </span>
                    </p>

                   {chat.content &&  <Linkify componentDecorator={componentDecorator}>
                      <p
                        className={`text-theme-secondaryText text-sm font-light my-1  text-left
                          whitespace-pre-wrap break-words break-all w-full max-w-full`}
                      >
                        {chat.content}
                      </p>
                    </Linkify>}
                    {chat.event && ( <div className="mt-2">
                      <EventCard
                        width="w-max"
                        imageHeight="h-32"
                        event={chat.event}
                        color="bg-theme-tertiaryBackground"
                        openDropdownId={openDropdownId}
                        handleToggleDropdown={handleToggleDropdown}
                        btnPadding="xs:px-2 px-1"
                        spacing=""
                      />
                      </div>
                    )}

                    

                    <div
                      className={`flex flex-row overflow-x-auto w-[100%] custom-scrollbar ${
                       "justify-start"
                      }`}
                    >
                      {chat.media.map((media, index) => {
                        const videoKey = `${chat._id}-${index}`;

                        return (
                          <div
                            className="relative my-1"
                            key={`${chat._id}-${media._id}-${index}-${media.type}`}
                            onMouseEnter={() =>
                              handleMouseEnterMedia(chat._id, index)
                            }
                            onMouseLeave={handleMouseLeaveMedia}
                          >
                            {media.type === "image" ? (
                              <div className="relative h-36 mr-3">
                                <img
                                  src={media.url}
                                  alt={media.name}
                                  className="h-36 mt-1 rounded-md object-cover min-w-36 w-auto max-w-60"
                                  loading="lazy"
                                />
                                 <button
                                    className="absolute top-1 left-1 text-theme-secondaryText text-sm bg-black bg-opacity-50 p-0.5 rounded-full"
                                    onClick={() => {
                                      const images = chat.media.filter((c) => c.type === "image");
                                      setModalImages(images);
                                      setModalOpen(true);
                                      setModalStartIndex(index);
                                    }}
                                  >
                                    <IoExpand />
                                  </button>
                              </div>
                            ) : media.type === "video" ? (
                              !videoLoaded[videoKey] ? (
                                <div
                                  className="relative h-36 w-auto max-w-52 mr-3 mt-1 rounded-md bg-gray-700 cursor-pointer flex items-center justify-center"
                                  onClick={() =>
                                    setVideoLoaded((prev) => ({
                                      ...prev,
                                      [videoKey]: true,
                                    }))
                                  }
                                >
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
                              ) : (
                                <video
                                  controls
                                  className="h-36 object-cover mr-3 mt-1 rounded-md w-auto max-w-52"
                                >
                                  <source src={media.url} type="video/mp4" />
                                  Your browser does not support the video tag.
                                </video>
                              )
                            ) : null}

                            {isOwner &&
                              hoveredMedia.chatId === chat._id &&
                              hoveredMedia.mediaIndex === index && (
                                <div
                                  className="absolute top-0 right-2 cursor-pointer"
                                  onClick={() =>
                                    handleShowMediaMenu(chat._id, index)
                                  }
                                >
                                  <img
                                    src={ArrowDropDown}
                                    alt="arrow-dop-down"
                                    className="dark:block hidden w-8 h-8"
                                  />
                                  <img
                                    src={ArrowDropDownLight}
                                    alt="arrow-dop-down"
                                    className="dark:hidden w-4 h-4 "
                                  />
                                </div>
                              )}

                            {isOwner &&
                              showMediaMenu.chatId === chat._id &&
                              showMediaMenu.mediaIndex === index && (
                                <div
                                  className="absolute top-6 right-0 w-max bg-theme-tertiaryBackground border border-theme-modalBorder shadow-lg rounded-lg z-10"
                                  ref={addRef(chat._id, index, "media")}
                                >
                                  <div
                                    className="py-1"
                                    role="menu"
                                    aria-orientation="vertical"
                                  >
                                    <div
                                      className="relative flex flex-row px-4 items-center"
                                      onClick={() =>
                                        handlePushResource(chat._id, media._id)
                                      }
                                    >
                                      <p className="block ml-2 py-1 font-normal text-sm text-theme-primaryText cursor-pointer">
                                        Push to Resource
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                          </div>
                        );
                      })}
                    </div>

                    <div
                      className={`flex flex-row overflow-x-auto w-[100%] custom-scrollbar  ${
                       "justify-start"
                      }`}
                    >
                      {chat.media.map(
                        (media, index) =>
                          media.type === "document" && (
                            <div
                              className="w-max rounded-lg bg-theme-tertiaryBackground mt-1 relative mr-2 mb-1 cursor-pointer"
                              key={`${chat._id}-${media._id}-${index}-${media.type}`}
                              onClick={() => handleClick(media)}
                              onMouseEnter={() =>
                                handleMouseEnterDocument(chat._id, index)
                              }
                              onMouseLeave={handleMouseLeaveDocument}
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
                                  {parseInt(parseInt(media.size || "0")/1000)} Kb 
                                  </p>
                                </div>
                              </div>
                              {isOwner &&
                                hoveredDocument.chatId === chat._id &&
                                hoveredDocument.mediaIndex === index && (
                                  <div
                                    className="absolute top-0 right-1 cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleShowDocumentMenu(chat._id, index);
                                    }}
                                  >
                                    <img
                                      src={ArrowDropDown}
                                      alt="arrow-dop-down"
                                      className="dark:block hidden w-8 h-8 "
                                    />
                                    <img
                                      src={ArrowDropDownLight}
                                      alt="arrow-dop-down"
                                      className="dark:hidden w-4 h-4 "
                                    />
                                  </div>
                                )}
                              {isOwner &&
                                showDocumentMenu.chatId === chat._id &&
                                showDocumentMenu.mediaIndex === index && (
                                  <div
                                    className="absolute top-5 right-0 w-max bg-theme-tertiaryBackground border border-theme-modalBorder shadow-lg rounded-lg z-10"
                                    ref={addRef(chat._id, index, "document")}
                                  >
                                    <div
                                      className="py-1"
                                      role="menu"
                                      aria-orientation="vertical"
                                    >
                                      <div
                                        className="relative flex flex-row px-3 items-center"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handlePushResource(chat._id, media._id);
                                        }}
                                      >
                                        <p className="block ml-2 py-1 text-sm text-theme-primaryText cursor-pointer">
                                          Push to Resource
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                            </div>
                          )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`flex flex-row space-x-2 mb-2 ${
                  "ml-14"
                }`}
              >
                {chat.reactions?.map((reaction, index) => (
                  <div
                    key={`${reaction._id}-${index}-1`}
                    className="flex items-center bg-theme-primaryBackground rounded-full px-1 py-0.5 space-x-1 cursor-pointer"
                    onClick={() => handleReactionClick(reaction.type, chat._id)}
                  >
                    {reaction.type === "❤️" ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5 text-red-500 fill-red-500"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                                4.42 3 7.5 3c1.74 0 3.41 0.81 
                                4.5 2.09C13.09 3.81 14.76 3 
                                16.5 3 19.58 3 22 5.42 22 
                                8.5c0 3.78-3.4 6.86-8.55 
                                11.54L12 21.35z"
                        />
                      </svg>
                    ) : (
                      // Normal emoji
                      <span className="text-sm mb-0.5">{reaction.type}</span>
                    )}

                    <span className="text-xs text-theme-secondaryText pr-1">
                      {reaction.users.length}
                    </span>
                  </div>
                ))}
              </div>

              {showReactionPicker && hoveredChatId === chat._id && (
                <div
                  className={`flex items-center absolute ${
                    isMyMessage ? "left-8" : " right-10 "
                  } top-8 space-x-2 p-1
               bg-theme-tertiaryBackground rounded-full z-10 shadow-md`}
                >
                  {reactionsData.map((reaction, index) =>
                    index === reactionsData.length - 1 ? (
                      <div className="flex flex-row items-center relative" key={`${reaction}-${reaction.createdAt}-1-${index}`}>
                        <div
                          onClick={() =>
                            handleReactionClick(reaction, chat._id)
                          }
                          className={`flex items-center text-center ${
                            index === 0 ? "text-[#E63946]" : ""
                          } justify-center w-8 h-8 rounded-full hover:bg-theme-chatBackground cursor-pointer`}
                        >
                          {reaction === "❤️" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5 text-red-500 fill-red-500"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                                4.42 3 7.5 3c1.74 0 3.41 0.81 
                                4.5 2.09C13.09 3.81 14.76 3 
                                16.5 3 19.58 3 22 5.42 22 
                                8.5c0 3.78-3.4 6.86-8.55 
                                11.54L12 21.35z"
                              />
                            </svg>
                          ) : (
                            // Normal emoji
                            <span className="text-lg text-center mx-auto">
                              {reaction}
                            </span>
                          )}
                        </div>
                        <img
                          src={Smiley}
                          alt="emoji"
                          className="cursor-pointer w-6 h-6 mx-0.5"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        />
                        {showEmojiPicker && (
                          <div
                            className={`absolute top-6 ${
                              isMyMessage ? "-left-16" : "right-0"
                            } bottom-full mb-2`}
                          >
                            <EmojiPicker
                              onEmojiClick={(event, emojiObject) =>
                                handleReactionClick(event.emoji, chat._id)
                              }
                              skinTonesDisabled={true}
                              theme={
                                document.documentElement.classList.contains(
                                  "dark"
                                )
                                  ? "dark"
                                  : "light"
                              }
                              height={350}
                              searchDisabled={true}
                              lazyLoadEmojis={true}
                              previewConfig={previewConfig}
                            />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        onClick={() => handleReactionClick(reaction, chat._id)}
                        className="flex items-center text-center justify-center w-8 h-8 rounded-full hover:bg-theme-chatBackground cursor-pointer"
                      >
                        <span className="text-lg text-center mx-auto">
                          {reaction === "❤️" ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5 text-red-500 fill-red-500"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 
                                4.42 3 7.5 3c1.74 0 3.41 0.81 
                                4.5 2.09C13.09 3.81 14.76 3 
                                16.5 3 19.58 3 22 5.42 22 
                                8.5c0 3.78-3.4 6.86-8.55 
                                11.54L12 21.35z"
                              />
                            </svg>
                          ) : (
                            <span className="text-lg text-center mx-auto">
                              {reaction}
                            </span>
                          )}
                        </span>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
      
    </div>
    )}
    
     <ImageFullscreenModal
     images={modalImages}
     isOpen={modalOpen}
     startIndex={modalStartIndex}
     onClose={() => setModalOpen(false)}
   />
    </>
  );
});

export default PageChatData;
