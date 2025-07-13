import React, { useState, useEffect,useRef } from "react";
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
import Loading from "../../../widgets/Loading";

const ResourcePage = ({ fetchedOnce, setFetchedOnce }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { username, topicId } = useParams();
  const { handleOpenModal } = useModal();
  const [activeVideoId, setActiveVideoId] = useState(null);

  const [resourceChats, setResourceChats] = useState([]);
  const myData = useSelector((state) => state.myData);
  const Chats = useSelector((state) => state.chat.resourceChats);
  const loading = useSelector((state) => state.chat.resourceLoading);
  const dropdownRef = useRef(null);

  const dispatch = useDispatch();
  const [hoveredMedia, setHoveredMedia] = useState({
    mediaId: null,
    mediaIndex: null,
  });

  const myUser = useSelector((state) => state.auth.user);
  const myUserId = myUser?._id;
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
    if (myUserId && fetchedOnce === false) {
      dispatch(fetchResourceChats(topicId));
      setFetchedOnce(true);
    }
  }, [topicId, myUserId, fetchedOnce]);

  const handleFilterItems = (name) => {
    setFilterItems((prevItems) =>
      prevItems.includes(name)
        ? prevItems.filter((item) => item !== name)
        : [...prevItems, name]
    );
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setShowMediaMenu({ chatId: null, mediaIndex: null });
      }
    };
    if (showMediaMenu.chatId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMediaMenu]);


  useEffect(() => {
    let filteredChats = Chats?.filter((chat) =>
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
      const query = searchQuery.toLowerCase();
      filteredChats = filteredChats
        .map((chat) => {
          const matchUsername = chat.user?.username
            ?.toLowerCase()
            .includes(query);
          const matchDate = new Date(chat.createdAt)
            .toLocaleString()
            .toLowerCase()
            .includes(query);

          const filteredMedia = chat.media.filter((media) =>
            media.name?.toLowerCase().includes(query)
          );
          if (filteredMedia.length > 0 || matchUsername || matchDate) {
            return {
              ...chat,
              media:
                filteredMedia.length > 0
                  ? filteredMedia
                  : chat.media.filter((media) => media.resource),
            };
          }
          return null;
        })
        .filter((chat) => chat !== null && chat.media.length > 0);
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
        console.error(error);
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
          placeholder="Search with file name, sender's username or date"
          className={` pl-9 pr-3 py-3 mb-2 bg bg-transparent text-theme-secondaryText 
            placeholder-textFieldColor border-[1px] border-theme-sidebarDivider ${"rounded-lg"} text-sm
            placeholder:text-xs placeholder:text-theme-emptyEvent placeholder:font-light
            placeholder:text-left focus:outline-none w-full font-inter font-light flex `}
          value={searchQuery}
          onChange={handleInputChange}
        />
      </div>

      {loading ? (
        <div className="mt-4 flex justify-center items-center">
          <Loading text="Loading Resources..." />
        </div>
      ) : resourceChats.length === 0 ? (
        <div className="text-theme-primaryText mt-20 text-center font-light text-sm">
          No Resources found...
        </div>
      ) : (
        resourceChats.map((chat, index) => (
          <div
            className="flex flex-col mt-4 space-y-2"
            key={`${chat._id}-${index}`}
          >
            {/* Header only once per chat */}
            <div className="text-theme-emptyEvent font-extralight text-xs">
              {chat.user?.username} •{" "}
              {new Date(chat.createdAt).toLocaleString()}
            </div>

            {/* Grouped media display */}
            <div className="flex flex-row flex-wrap gap-3">
              {chat.media.map((media, mediaIndex) => (
                <div
                  className="relative flex flex-col"
                  key={`${media._id}-${mediaIndex}`}
                  onMouseEnter={() =>
                    handleMouseEnterMedia(media._id, mediaIndex)
                  }
                  onMouseLeave={handleMouseLeaveMedia}
                >
                  {/* Media thumbnails */}
                  {media.type === "image" ? (
                    <img
                      src={media.url}
                      alt={media.name}
                      className="h-36 w-36 rounded-md object-cover"
                      loading="lazy"
                    />
                  ) : media.type === "video" ? (
                    <div className="relative h-36 w-56">
                      {activeVideoId === media._id ? (
                        <video
                          controls
                          className="h-36 w-full object-cover rounded-md"
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
                    <div className="w-56 rounded-lg bg-theme-secondaryBackground  flex items-center">
                      <img
                        src={documentImage}
                        alt="doc"
                        className="h-14 w-10 object-cover rounded-l-md cursor-pointer"
                        onClick={() => handleClick(media)}
                      />
                      <div className="flex flex-col ml-2 overflow-hidden">
                        <p className="text-theme-secondaryText text-xs font-normal truncate">
                          {media.name}
                        </p>
                        <p className="text-theme-primaryText text-[10px] mt-1 font-light font-inter">
                          {parseInt(parseInt(media.size || "0") / 1000)} Kb
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {/* Hover menu trigger */}
                  {isOwner &&
                    hoveredMedia.mediaId === media._id &&
                    hoveredMedia.mediaIndex === mediaIndex && (
                      <div
                        className="absolute top-2 right-2 cursor-pointer"
                        onClick={() =>
                          handleShowMediaMenu(chat._id, mediaIndex)
                        }
                      >
                        <img
                          src={ArrowDropDown}
                          alt="menu"
                          className="w-6 h-6"
                        />
                      </div>
                    )}

                  {/* Dropdown menu */}
                  {isOwner &&
                    showMediaMenu.chatId === chat._id &&
                    showMediaMenu.mediaIndex === mediaIndex && (
                      <div 
                      ref={dropdownRef}
                      className="absolute top-10 -right-10 w-max bg-theme-tertiaryBackground border border-theme-modalBorder shadow-lg rounded-lg z-10">
                        <div className="py-1">
                          <div
                            className="flex flex-row px-4 items-center"
                            onClick={() =>
                              handleRemoveResource(chat._id, media._id)
                            }
                          >
                            <p className="ml-2 py-1 text-sm text-theme-primaryText cursor-pointer">
                              Remove from Resource
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ResourcePage;
