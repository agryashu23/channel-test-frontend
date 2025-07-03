import Smiley from "../../assets/icons/smiley.svg";
import ArrowDropDown from "../../assets/icons/arrow_drop_down.svg";
import EmptyChatIcon from "../../assets/icons/empty_chat.svg";
import ReplyIcon from "../../assets/icons/reply_icon.svg";
import EmojiPicker from "emoji-picker-react";
import StorageManager from "../EmbedChannels/utility/storage_manager";
import ArrowDropDownLight from "../../assets/lightIcons/chat_drop_light.svg";
import ColorProfile from "../../assets/images/color_profile.svg";

import {
  fetchBrandChats,
  setChatField,
  pushToResource,
  toggleReaction,
  addMessage,
} from "./../../redux/slices/chatSlice";
import { pdfjs } from "react-pdf";
import Profile from "../../assets/icons/profile.svg";
import documentImage from "../../assets/images/Attachment.svg";
import { deleteTopicChat, addBrandMessage } from "../../redux/slices/chatSlice";
import Linkify from "react-linkify";
import socket from "../../utils/socket";
import TopicChatSkeleton from "./../skeleton/Topic/TopicChatSkeleton";
import EventCard from "./widgets/EventCard";
import { formatChatDate } from "./../../utils/methods";

import {
  React,
  useState,
  useEffect,
  useRef,
  useNavigate,
  useDispatch,
  useSelector,
  useParams,
  useModal,
} from "../../globals/imports";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

const PageChatData2 = ({
  topicId,
  isLoggedIn,
  myData,
  onNewMessageSent,
  user_id,
  channelName,
}) => {
  const { handleOpenModal } = useModal();
  const { username } = useParams();
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

  const reactionsData = ["❤️", "😂", "👍", "😢"];
  const Chats = useSelector((state) => state.chat.brandChats);
  const loading = useSelector((state) => state.chat.brandLoading);
  const chatRefs = useRef(new Map());
  const [highlightedChatId, setHighlightedChatId] = useState(null);
  const chatContainerRef = useRef(null);

  const scrollToChat = (chatId) => {
    const chatElement = chatRefs.current.get(chatId);
    if (chatElement) {
      chatElement.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedChatId(chatId);
      setTimeout(() => setHighlightedChatId(null), 2500);
    }
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
    dispatch(fetchBrandChats(user_id));
  }, [dispatch, topicId]);

  useEffect(() => {
    const handleChatDeleted = (message) => {
      if (message?.topicId === topicId) {
        dispatch(deleteTopicChat(message.chatId));
      }
    };
    socket.on("chat_deleted", handleChatDeleted);

    return () => {
      socket.off("chat_deleted", handleChatDeleted);
    };
  }, [dispatch, topicId, myData?.username]);

  useEffect(() => {
    const handleIncomingDM = (message) => {
      if (message?.sender?._id === myData?._id) return;

      dispatch(addBrandMessage(message));
    };

    socket.on("dm_message", handleIncomingDM);

    return () => {
      socket.off("dm_message", handleIncomingDM);
    };
  }, [dispatch, myData?._id]);

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      }
    }, 100); // allow DOM render delay

    return () => clearTimeout(timeout);
  }, [Chats]);

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

  const handleReactionClick = (reaction, chatId) => {
    // setReactions((prevReactions) => {
    //   const newReactions = { ...prevReactions };
    //   if (!newReactions[chatId]) {
    //     newReactions[chatId] = {};
    //   }
    //   if (newReactions[chatId][reaction]) {
    //     delete newReactions[chatId][reaction];
    //   } else {
    //     newReactions[chatId][reaction] = 1;
    //   }
    //   return newReactions;
    // });
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
        console.error("Issue in pushing to resources. Please try again.");
      });
  };

  const isOwner = username === myData?.username;

  if (loading) {
    return <TopicChatSkeleton />;
  }

  return (
    <div
      className="w-full h-full max-w-full overflow-x-hidden rounded-t-2xl  bg-theme-secondaryBackground pt-4"
      ref={chatContainerRef}
    >
      {Chats.length > 0 &&
        Chats.map((chat) => {
          const isMyMessage = chat.sender?._id === myData?._id;
          return (
            <div
              ref={(el) => chatRefs.current.set(chat._id, el)}
              key={chat._id}
              className={`flex flex-col relative w-full mb-2 px-0 py-1 ${
                hoveredChatId === chat._id
                  ? "bg-theme-primaryBackground bg-opacity-20"
                  : highlightedChatId === chat._id
                  ? "flicker-highlight"
                  : ""
              }`}
              onMouseEnter={() => setHoveredChatId(chat._id)}
              onMouseLeave={handleMouseLeave}
            >
              {hoveredChatId === chat._id && (
                <span
                  className={`absolute ${
                    isMyMessage ? "left-6" : "right-4"
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
                      className="dark:block hidden w-8 h-8 "
                    />
                    <img
                      src={ArrowDropDownLight}
                      alt="arrow-dop-down"
                      className="dark:hidden w-4 h-4 "
                    />
                    {showMenu && (
                      <div
                        className={`absolute ${
                          isMyMessage ? "left-2" : "right-0"
                        } top-6  w-max bg-theme-tertiaryBackground border
                     border-theme-modalBorder shadow-lg rounded-lg z-10`}
                      >
                        <div
                          className="py-1"
                          role="menu"
                          aria-orientation="vertical"
                          aria-labelledby="options-menu"
                        >
                          <div
                            className="relative flex flex-row px-4 items-center"
                            onClick={() =>
                              handleReplyClick(chat?._id, chat.sender?.username)
                            }
                          >
                            <p className="block ml-2 py-2 font-normal text-sm text-theme-primaryText cursor-pointer">
                              Reply
                            </p>
                          </div>
                        </div>
                        {chat.sender._id === myData._id && (
                          <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                          >
                            <div
                              className="relative flex flex-row px-4 items-center"
                              onClick={() => handleDeleteChat(chat?._id)}
                            >
                              <p className="block ml-2 font-normal py-2 text-sm text-theme-primaryText cursor-pointer">
                                Delete
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
                      } rounded-full w-8 h-auto object-cover overflow-visible`}
                    />

                    <div
                      className={`flex flex-col w-4/5 ${
                        isMyMessage ? "items-end" : "items-start"
                      }`}
                    >
                      <div className="flex flex-row items-center space-x-1">
                        {chat.replyTo.user?.logo ? (
                          <img
                            src={chat.replyTo.user.logo}
                            alt="profile-icon"
                            className="rounded-full w-4 h-4 object-cover"
                            loading="lazy"
                          />
                        ) : chat.replyTo.user?.color_logo ? (
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
                          {chat.replyTo?.user?.username ===
                          chat.sender?.username
                            ? "You"
                            : chat.replyTo.user?.username}
                        </p>
                      </div>

                      <p
                        className={`text-theme-emptyEvent mt-0.5 font-light text-xs max-w-full text-ellipsis whitespace-nowrap overflow-hidden ${
                          isMyMessage ? "text-right" : "text-left"
                        }`}
                      >
                        {chat.replyTo.content
                          ? chat.replyTo.content
                          : chat.replyTo.media
                          ? "Tap to see Attachment"
                          : chat.replyTo.event
                          ? "Tap to see Event"
                          : "Tap to see Poll"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div
                className={`flex w-full relative px-2 ${
                  isMyMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex ${
                    isMyMessage ? "flex-row-reverse" : ""
                  } w-max sm:max-w-[60%] max-w-[80%] items-start`}
                >
                  
                  {chat.sender?.logo ? (
                    <img
                      src={chat.sender?.logo}
                      alt="profile-icon"
                      className="rounded-full w-8 h-8 object-cover mx-2 mt-0.5"
                    />
                  ) : chat.sender?.color_logo ? (
                    <div
                      className="rounded-full w-8 h-8 mx-2 shrink-0 mt-0.5 flex items-center justify-center"
                      style={{ backgroundColor: chat.sender?.color_logo }}
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
                    <p className="text-theme-emptyEvent font-normal text-sm flex items-center relative ">
                      <span
                        className="cursor-pointer"
                        // onClick={() =>
                        //   navigate(
                        //     `${getAppPrefix()}/account/${
                        //       myData.username
                        //     }/messages/${chat.sender.username}`
                        //   )
                        // }
                      >
                        {isMyMessage ? "You" : chat.sender?.username}
                        <span className="font-light ml-1 text-xs">
                          {formatChatDate(chat.createdAt)}
                        </span>
                      </span>
                    </p>

                    <Linkify componentDecorator={componentDecorator}>
                      <p
                        className={`text-theme-secondaryText text-sm font-light my-1 text-left
      whitespace-pre-wrap break-words break-all w-full max-w-full`}
                      >
                        {chat.content}
                      </p>
                    </Linkify>

                    {chat.event && (
                      <EventCard
                        width="w-max"
                        imageHeight="h-32"
                        chatId={chat._id}
                        event={chat.event}
                        color="bg-theme-tertiaryBackground"
                        openDropdownId={openDropdownId}
                        handleToggleDropdown={handleToggleDropdown}
                        btnPadding="px-2"
                        spacing="space-x-4"
                      />
                    )}

                    <div className="flex flex-row overflow-x-auto w-[100%] custom-scrollbar">
                      {chat.media.map((media, index) => (
                        <div
                          className="relative"
                          key={media._id}
                          onMouseEnter={() =>
                            handleMouseEnterMedia(chat._id, index)
                          }
                          onMouseLeave={handleMouseLeaveMedia}
                        >
                          {media.type === "image" ? (
                            <div className="relative h-36 mr-3">
                              <img
                                key={index}
                                src={media.url}
                                alt={media.name}
                                className="h-36 mt-1 rounded-md object-cover w-auto max-w-60"
                              />
                            </div>
                          ) : media.type === "video" ? (
                            <video
                              controls
                              className="h-36 object-cover mr-3 mt-1 rounded-md w-auto max-w-52"
                            >
                              <source src={media.url} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          ) : null}

                          {/* {isOwner &&
                            hoveredMedia.chatId === chat._id &&
                            hoveredMedia.mediaIndex === index && (
                              <div
                                className="absolute top-0 right-1 cursor-pointer"
                                onClick={() =>
                                  handleShowMediaMenu(chat._id, index)
                                }
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
                            )} */}

                          {/* {isOwner &&
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
                                    <p className="block ml-2 py-2 font-normal text-sm text-theme-primaryText cursor-pointer">
                                      Push to Resource
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )} */}
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-row overflow-x-auto w-4/5 custom-scrollbar overflow-y-hidden">
                      {chat.media.map(
                        (media, index) =>
                          media.type === "document" && (
                            <div
                              className="w-max rounded-lg bg-theme-tertiaryBackground mt-1.5 relative mr-3"
                              onMouseEnter={() =>
                                handleMouseEnterDocument(chat._id, index)
                              }
                              onMouseLeave={handleMouseLeaveDocument}
                            >
                              <div className="flex flex-row items-center justify-start w-full">
                                <img
                                  src={documentImage}
                                  alt="Document Icon"
                                  className="h-14 w-15 object-fill cursor-pointer pr-3"
                                  onClick={() => handleClick(media)}
                                />
                                <div className="flex flex-col my-1 w-full-minus-68">
                                  <p className="text-theme-secondaryText text-xs overflow-hidden text-ellipsis whitespace-nowrap font-normal">
                                    {media.name}
                                  </p>
                                  <p className="text-theme-primaryText mt-1 text-[10px] xs:text-xs font-light font-inter">
                                    {media.size} Kb
                                  </p>
                                </div>
                              </div>
                              {/* {isOwner &&
                                hoveredDocument.chatId === chat._id &&
                                hoveredDocument.mediaIndex === index && (
                                  <div
                                    className="absolute top-0 right-1 cursor-pointer"
                                    onClick={() =>
                                      handleShowDocumentMenu(chat._id, index)
                                    }
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
                                )} */}
                              {/* {isOwner &&
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
                                        onClick={() =>
                                          handlePushResource(
                                            chat._id,
                                            media._id
                                          )
                                        }
                                      >
                                        <p className="block ml-2 py-1 text-xs text-theme-primaryText cursor-pointer">
                                          Push to Resource
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )} */}
                            </div>
                          )
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`flex flex-row space-x-2 mb-2 ${
                  isMyMessage ? "ml-auto mr-4 justify-end" : "ml-10"
                }`}
              >
                {chat.reactions?.map((reaction, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-theme-chatBackground rounded-full px-1 py-0.5 space-x-1 cursor-pointer"
                    onClick={() => handleReactionClick(reaction.type, chat._id)}
                  >
                    <span className="text-sm mb-0.5">{reaction.type}</span>
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
               bg-theme-tertiaryBackground rounded-full z-10`}
                >
                  {reactionsData.map((reaction, index) =>
                    index === reactionsData.length - 1 ? (
                      <div className="flex flex-row items-center relative">
                        <div
                          key={index}
                          onClick={() =>
                            handleReactionClick(reaction, chat._id)
                          }
                          className={`flex items-center text-center ${
                            index === 0 ? "text-theme-[#E63946]" : ""
                          } justify-center w-8 h-8 rounded-full hover:bg-theme-chatBackground cursor-pointer`}
                        >
                          <span className="text-lg text-center mx-auto">
                            {reaction}
                          </span>
                        </div>
                        <img
                          src={Smiley}
                          alt="emoji"
                          className="cursor-pointer w-6 h-6 mx-0.5"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        />
                        {showEmojiPicker && (
                          <div className="absolute top-6 right-0 bottom-full mb-2">
                            <EmojiPicker
                              onEmojiClick={(event, emojiObject) =>
                                handleReactionClick(event.emoji, chat._id)
                              }
                              skinTonesDisabled={true}
                              theme={"dark"}
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
                        key={index}
                        onClick={() => handleReactionClick(reaction, chat._id)}
                        className="flex items-center text-center justify-center w-8 h-8 rounded-full hover:bg-theme-chatBackground cursor-pointer"
                      >
                        <span className="text-lg text-center mx-auto">
                          {reaction}
                        </span>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
      {Chats.length === 0 && (
        <div className="flex flex-col h-full justify-center items-center mx-auto w-3/4 pb-10">
          <img
            src={EmptyChatIcon}
            alt="emptyChatIcon"
            className="sm:h-36 h-28"
          />
          <p className="text-theme-emptyEvent font-normal text-sm text-center mt-2 ">
            Start your conversation with {channelName}
          </p>
        </div>
      )}
    </div>
  );
};

export default PageChatData2;
