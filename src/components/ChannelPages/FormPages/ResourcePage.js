import React, { useState, useEffect } from "react";
import Close from "../../../assets/icons/Close.svg";
import Search from "../../../assets/icons/search.svg";
import { useSelector, useDispatch } from "react-redux";
import ArrowDropDown from "../../../assets/icons/arrow_drop_down.svg";
import { useParams } from "react-router-dom";
import {
  fetchResourceChats,
  removeFromResource,
} from "../../../redux/slices/chatSlice";
import documentImage from "../../../assets/images/Attachment.svg";
import { FaPlay } from "react-icons/fa";

import useModal from "./../../hooks/ModalHook";

const ResourcePage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { username, topicId } = useParams();
  const { handleOpenModal } = useModal();
  const [activeVideoId, setActiveVideoId] = useState(null);

  const [resourceChats, setResourceChats] = useState([]);
  const myData = useSelector((state) => state.myData);
  const Chats = useSelector((state) => state.chat.resourceChats);
  const dispatch = useDispatch();
  const [hoveredMedia, setHoveredMedia] = useState({
    mediaId: null,
    mediaIndex: null,
  });
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [filterItems, setFilterItems] = useState([]);

  const handleClick = (document) => {
    handleOpenModal("modalDocumentOpen", document);
  };

  const handleMouseEnterMedia = (mediaId, mediaIndex) => {
    setHoveredMedia({ mediaId, mediaIndex });
  };
  const handleShowMediaMenu = (chatId, mediaIndex) => {
    if (
      showMediaMenu.chatId === chatId &&
      showMediaMenu.mediaIndex === mediaIndex
    ) {
      setShowMediaMenu({ chatId: null, mediaIndex: null });
    } else {
      setShowMediaMenu({ chatId: chatId, mediaIndex: mediaIndex });
    }
  };

  const handleMouseLeaveMedia = () => {
    setHoveredMedia({ mediaId: null, mediaIndex: null });
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  useEffect(() => {
    dispatch(fetchResourceChats(topicId));
  }, [topicId]);

  // const handleRefilterChats = () => {
  //   const resourceChat = resourceChats.filter((chat) =>
  //     chat.media.some((media) => filterItems.includes(media.type))
  //   );
  //   setResourceChats(resourceChat);
  // };

  const handleFilterItems = (name) => {
    setFilterItems((prevItems) =>
      prevItems.includes(name)
        ? prevItems.filter((item) => item !== name)
        : [...prevItems, name]
    );
  };

  useEffect(() => {
    let filteredChats = Chats.filter((chat) =>
      chat.media.some((media) => media.resource === true)
    );
    if (filterItems.length > 0) {
      filteredChats = filteredChats
        .map((chat) => ({
          ...chat,
          media: chat.media.filter((media) => filterItems.includes(media.type)),
        }))
        .filter((chat) => chat.media.length > 0);
    }
    if (searchQuery.trim() !== "") {
      filteredChats = filteredChats
        .map((chat) => ({
          ...chat,
          media: chat.media.filter((media) =>
            media.name.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((chat) => chat.media.length > 0);
    }
    setResourceChats(filteredChats);
  }, [Chats, filterItems, searchQuery]);

  const handleRemoveResource = (chatId, mediaId) => {
    const formDataToSend = new FormData();
    formDataToSend.append("chatId", chatId);
    formDataToSend.append("mediaId", mediaId);
    dispatch(removeFromResource(formDataToSend))
      .unwrap()
      .then(() => {
        setShowMediaMenu(false);
        const updatedResourceChats = resourceChats
          .map((chat) => {
            if (chat._id === chatId) {
              return {
                ...chat,
                media: chat.media.filter((media) => media._id !== mediaId),
              };
            }
            return chat;
          })
          .filter((chat) => chat.media.length > 0);

        setResourceChats(updatedResourceChats);
      })
      .catch((error) => {
        console.error("Issue in pushing to resources. Please try again.");
      });
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    // handleSearchMedia();
  };
  const isOwner = username === myData?.username;

  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-around space-x-4">
        <div
          className={`rounded-full text-xs  font-light border border-theme-sidebarDivider text-center w-full py-1.5 cursor-pointer ${
            filterItems.includes("image")
              ? "bg-theme-secondaryText text-theme-primaryBackground"
              : "text-theme-secondaryText"
          }`}
          onClick={() => handleFilterItems("image")}
        >
          Images
        </div>
        <div
          className={`rounded-full text-xs  font-light border border-theme-sidebarDivider text-center w-full py-1.5 cursor-pointer ${
            filterItems.includes("document")
              ? "bg-theme-secondaryText text-theme-primaryBackground"
              : "text-theme-secondaryText"
          }`}
          onClick={() => handleFilterItems("document")}
        >
          Documents
        </div>
        <div
          className={`rounded-full text-xs border font-light border-theme-sidebarDivider text-center w-full py-1.5 cursor-pointer ${
            filterItems.includes("video")
              ? "bg-theme-secondaryText text-theme-primaryBackground"
              : "text-theme-secondaryText"
          }`}
          onClick={() => handleFilterItems("video")}
        >
          Videos
        </div>
        {/* <div
          className={`rounded-full text-xs border border-theme-chatBackground px-3.5 py-1.5 cursor-pointer ${
            filterItems.contains("Custom")
              ? "bg-theme-secondaryText text-theme-primaryBackground"
              : "text-theme-chatBackground"
          }`}
          onClick={() => setFilterItems("Custom")}
        >
          Custom Label
        </div> */}
      </div>
      <div className="mt-3 relative w-full ">
        <img
          src={Search}
          alt="search"
          className="absolute left-3 top-3.5 text-textFieldColor w-5 h-5"
        />
        {searchQuery && (
          <img
            src={Close}
            alt="Close"
            className="absolute top-4 right-2 cursor-pointer  w-4 h-4"
            onClick={handleClear}
          />
        )}
        <input
          type="text"
          placeholder="Search with file name, sender's name or date"
          className={` pl-9 pr-3 py-3 mb-2 bg bg-transparent text-theme-secondaryText 
            placeholder-textFieldColor border-[1px] border-theme-sidebarDivider ${"rounded-lg"} text-sm
            placeholder:text-xs placeholder:text-theme-emptyEvent placeholder:font-light
            placeholder:text-left focus:outline-none w-full font-inter font-light flex `}
          value={searchQuery}
          onChange={handleInputChange}
        />
      </div>

      {resourceChats.length === 0 ? (
        <div className="text-theme-primaryText mt-20 text-center font-light text-sm">
          No Resources found...
        </div>
      ) : (
        resourceChats.map((chat, index) => (
          <div
            className="flex flex-col mt-2 h-full  overflow-y-auto custom-scrollbar"
            key={`${chat._id}-${index}-${chat._id}`}
          >
            {chat.media.map(
              (media, index) =>
                media.resource === true && (
                  <div
                    className="flex flex-row space-x-2 mt-2 overflow-x-auto w-full custom-scrollbar"
                    key={`${media._id}-${index}`}
                  >
                    <div
                      className="relative flex flex-col"
                      onMouseEnter={() =>
                        handleMouseEnterMedia(media._id, index)
                      }
                      onMouseLeave={handleMouseLeaveMedia}
                    >
                      <div className="text-theme-emptyEvent font-extralight text-xs mb-1">
                        {chat.user?.username}{" "}
                        {new Date(chat.createdAt).toLocaleString()}
                      </div>
                      {media.type === "image" ? (
                        <div className="relative h-40">
                          <img
                            src={media.url}
                            alt={media.name}
                            className="h-36 rounded-md object-cover w-auto max-w-52 flex-shrink-0"
                            loading="lazy"
                          />
                        </div>
                      ) : media.type === "video" ? (
                        <div className="relative h-36 max-w-52">
                          {activeVideoId === media._id ? (
                            <video
                              controls
                              className="h-36 object-cover rounded-md w-full"
                            >
                              <source src={media.url} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          ) : (
                            <div className="relative w-full h-full">
                              <img
                                src={media.thumbnail || media.url}
                                alt="video thumbnail"
                                className="w-full h-full object-cover rounded-md"
                                loading="lazy"
                              />
                              <button
                                className="absolute inset-0 flex items-center justify-center text-theme-secondaryText text-2xl bg-black bg-opacity-50 rounded-md"
                                onClick={() => setActiveVideoId(media._id)}
                              >
                                <FaPlay className="w-10 h-10" />
                              </button>
                            </div>
                          )}
                        </div>
                      ) : media.type === "document" ? (
                        <div className="w-full rounded-lg bg-theme-secondaryBackground relative mt-2 ">
                          <div className="flex flex-row items-center justify-start w-full">
                            <img
                              src={documentImage}
                              alt="Document Icon"
                              className="h-14 w-15 object-fill pr-3 cursor-pointer "
                              onClick={() => handleClick(media)}
                            />
                            <div className="flex flex-col my-1  w-full-minus-68">
                              <p className="text-theme-secondaryText text-xs overflow-hidden text-ellipsis whitespace-nowrap font-normal">
                                {media.name}
                              </p>
                              <p className="text-theme-primaryText mt-1  text-[10px] xs:text-xs font-light font-inter">
                                {media.size} Kb
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : null}
                      {isOwner &&
                        hoveredMedia.mediaId === media._id &&
                        hoveredMedia.mediaIndex === index && (
                          <div
                            className={`absolute ${
                              media.type === "document"
                                ? "top-4 right-1"
                                : "top-3 right-5"
                            }  cursor-pointer`}
                            onClick={() => handleShowMediaMenu(chat._id, index)}
                          >
                            <img
                              src={ArrowDropDown}
                              alt="arrow-dop-down"
                              className="w-8 h-8"
                            />
                          </div>
                        )}
                      {isOwner &&
                        showMediaMenu.chatId === chat._id &&
                        showMediaMenu.mediaIndex === index && (
                          <div
                            className="absolute top-10 right-0 w-max bg-theme-tertiaryBackground border
           border-theme-modalBorder shadow-lg rounded-lg  z-10"
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
                                  handleRemoveResource(chat._id, media._id)
                                }
                              >
                                {/* <img src={ReplyIcon} alt="reply" /> */}
                                <p
                                  className="block ml-2 py-2 text-sm text-theme-primaryText cursor-pointer"
                                  role="menuitem"
                                >
                                  Remove from Resource
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                )
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default ResourcePage;
