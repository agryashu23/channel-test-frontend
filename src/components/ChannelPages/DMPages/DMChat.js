import React, { useState, useRef, useEffect } from "react";
import Smiley from "../../../assets/icons/smiley.svg";
import SendButton from "../../../assets/icons/send_btn.svg";
import AddButton from "../../../assets/icons/add_btn.svg";
import AddButtonLight from "../../../assets/lightIcons/chat_light.svg";
import ProfileIcon from "../../../assets/icons/profile.svg";
import Close from "../../../assets/icons/Close.svg";
import Media from "../../../assets/icons/media.svg";
import Document from "../../../assets/icons/document.svg";
import ColorProfile from "../../../assets/images/color_profile.svg";
import ArrowBack from "../../../assets/icons/arrow_back.svg";
import ArrowBackLight from "../../../assets/lightIcons/arrow_back_light.svg";
import EmojiPicker from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import PdfImage from "../../../assets/images/pdf_img.svg";
import Delete from "../../../assets/icons/Delete.svg";
import socket, { connectSocketWithUser } from "../../../utils/socket";
import Compressor from "compressorjs";
import { isEmbeddedOrExternal } from "./../../../services/rest";
import { getAppPrefix } from "./../../EmbedChannels/utility/embedHelper";

import {
  setDMChatField,
  addDMMediaItem,
  removeDMMediaItem,
  clearDMChat,
  createDMChat,
  clearDMMedia,
  markDMLastSeen,
} from "../../../redux/slices/dmSlice.js";
import useModal from "./../../hooks/ModalHook";
import { useParams, useNavigate } from "react-router-dom";
import DMChatData from "./DMChatData";
import { postRequestUnAuthenticated } from "./../../../services/rest";
import TopicChatSkeleton from "../../skeleton/Topic/TopicChatSkeleton.js";

const DMChat = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const { username, user } = useParams();
  const [globalLoading, setGlobalLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [receiver, setReceiver] = useState({});
  const [data, setData] = useState("");
  const [fileObjects, setFileObjects] = useState([]);
  const inputRef = useRef(null);
  const addMenuRef = useRef(null);
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const emojiRef = useRef(null);
  const chatContainerRef = useRef(null);
  const Chats = useSelector((state) => state.dmChat.chats);
  const dmChat = useSelector((state) => state.dmChat);
  const myData = useSelector((state) => state.myData);
  const { handleOpenModal } = useModal();
  const previousChatLength = useRef(0);
  const addMenuButtonRef = useRef(null);
  const emojiButtonRef = useRef(null);

  const navigate = useNavigate();
  const newMessageScrollRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      setGlobalLoading(true);
      try {
        const response = await postRequestUnAuthenticated(
          "/fetch/user/details",
          { username: user }
        );
        if (response.success) {
          setReceiver(response.user);
        } else {
          setReceiver({});
        }
      } catch (error) {
        setReceiver({});
      } finally {
        setGlobalLoading(false);
      }
    };
    if(!receiver?._id){
      fetchUser();
    }
  }, [receiver]);


  // const handleCheckboxChange = () => {
  //   setIsChecked((prev) => !prev);
  // };

  useEffect(() => {
    setFileObjects([]);
    handleReplyClear();
    dispatch(clearDMMedia());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        addMenuRef.current &&
        !addMenuRef.current.contains(event.target) &&
        addMenuButtonRef.current &&
        !addMenuButtonRef.current.contains(event.target)
      ) {
        setShowAddMenu(false);
      }
      if (
        emojiRef.current &&
        !emojiRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const onEmojiClick = (event, emojiObject) => {
    const emoji = event.emoji;
    dispatch(
      setDMChatField({ field: "content", value: dmChat.content + emoji })
    );
    inputRef.current.focus();
  };

  const previewConfig = {
    showPreview: false,
  };
  const handleRemoveMedia = (index, id) => {
    dispatch(removeDMMediaItem(index));
    setFileObjects(fileObjects.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (receiver?._id && myData?._id) {
      dispatch(markDMLastSeen(receiver._id));
    }
  }, [receiver?._id, myData?._id]);

  const handleMediaChange = (event) => {
    const files = Array.from(event.target.files);
    const maxFileSize = 20 * 1024 * 1024;

    if (files.length <= 10) {
      const newFiles = []; // Array to hold files, including compressed images
      const promises = files.map((file) => {
        return new Promise((resolve, reject) => {
          if (file.size > maxFileSize) {
            alert(
              `The file "${file.name}" exceeds the 20 MB size limit and will not be uploaded.`
            );
            return resolve(null); // Skip the file
          }

          if (
            file.size >= 8 * 1024 * 1024 &&
            file.size <= maxFileSize &&
            file.type.startsWith("image")
          ) {
            // If the file is an image and larger than 8MB, compress it
            new Compressor(file, {
              quality: 0.5,
              maxWidth: 1920,
              maxHeight: 1080,
              success(result) {
                const newFile = {
                  id: uuidv4(),
                  url: URL.createObjectURL(result),
                  name: result.name,
                  type: result.type.startsWith("video") ? "video" : "image",
                  size: result.size,
                };
                dispatch(addDMMediaItem(newFile)); // Dispatch compressed image
                newFiles.push(result); // Add compressed image to newFiles
                resolve();
              },
              error(err) {
                alert("Image compression failed: " + err);
                reject(err);
              },
            });
          } else {
            const newFile = {
              id: uuidv4(),
              url: URL.createObjectURL(file),
              name: file.name,
              type: file.type.startsWith("video") ? "video" : "image",
              size: file.size,
            };
            dispatch(addDMMediaItem(newFile)); // Dispatch the original file
            newFiles.push(file); // Add original file to newFiles
            resolve();
          }
        });
      });

      Promise.all(promises)
        .then(() => {
          setFileObjects((prevFiles) => [...prevFiles, ...newFiles]);
          setShowAddMenu(false);
        })
        .catch((err) => {
          console.error("Error processing files:", err);
          setShowAddMenu(false);
        });
    } else {
      alert("You can upload up to 10 files only.");
      setShowAddMenu(false);
    }
  };

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    const maxFileSize = 16 * 1024 * 1024;

    const updatedFiles = [];

    const processFile = (file) => {
      return new Promise((resolve, reject) => {
        if (file.size > maxFileSize) {
          alert(`File "${file.name}" exceeds the 16 MB size limit.`);
          return resolve(null);
        }

        const objectUrl = URL.createObjectURL(file);
        const fileExtension = file.name.split(".").pop().toLowerCase();

        if (fileExtension === "pdf") {
          const reader = new FileReader();
          reader.onload = () => {
            const newFile = {
              id: uuidv4(),
              name: file.name,
              url: objectUrl,
              type: "document",
              size: file.size,
            };
            dispatch(addDMMediaItem(newFile));
            updatedFiles.push(file);
            resolve(file);
          };
          reader.onerror = () => {
            console.error(`Error reading PDF file "${file.name}".`);
            reject(file);
          };
          reader.readAsArrayBuffer(file);
        } else {
          const newFile = {
            id: uuidv4(),
            name: file.name,
            url: objectUrl,
            type: "document",
            size: file.size,
          };
          dispatch(addDMMediaItem(newFile));
          updatedFiles.push(file);
          resolve(file);
        }
      });
    };

    const filePromises = files.map((file) => processFile(file));
    await Promise.all(filePromises);

    setFileObjects((prevFiles) => [...prevFiles, ...updatedFiles]);
    setShowAddMenu(false);
  };
  useEffect(() => {
    if (myData?._id) {
      connectSocketWithUser(myData._id);
    }
  
    return () => {
      socket.disconnect(); // optional cleanup
    };
  }, [myData?._id]);

  

  useEffect(() => {
    if (dmChat.media.length > 0 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [dmChat.media]);

  useEffect(() => {
    if (myData?._id && receiver?._id) {
      socket.emit("join_dm_room", receiver._id);
      return () => {
        socket.emit("leave_dm_room", receiver._id);
      };
    }
  }, [receiver?._id, myData?._id]);

  const handleSendChat = () => {
    const extractLinks = (text) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      return text.match(urlRegex) || [];
    };
    setLoading(true);

    const links = extractLinks(dmChat.content);
    const formDataToSend = new FormData();
    formDataToSend.append("content", dmChat.content);
    formDataToSend.append("receiver", receiver._id);
    formDataToSend.append("media", JSON.stringify(dmChat.media));
    formDataToSend.append("replyTo", dmChat.replyTo || null);
    formDataToSend.append("links", JSON.stringify(links));
    fileObjects.forEach((file) => {
      formDataToSend.append("files", file);
    });

    dispatch(createDMChat(formDataToSend))
      .unwrap()
      .then(() => {
        dispatch(clearDMChat());
        setLoading(false);
        setFileObjects([]);
        if (newMessageScrollRef.current) {
          newMessageScrollRef.current();
        }
        if (inputRef.current) {
          inputRef.current.style.height = "inherit";
        }
      })
      .catch((error) => {
        setLoading(false);

        alert(error);
        setFileObjects([]);
      });
  };

  //   useEffect(() => {
  //     if (myData.username && topicId) {
  //       socket.emit("join_topic", { username: myData.username, topicId });
  //       return () => {
  //         socket.emit("leave_topic", { username: myData.username, topicId });
  //       };
  //     }
  //   }, [topicId, myData.username]);

  const handleReplyClear = () => {
    dispatch(setDMChatField({ field: "replyTo", value: null }));
    dispatch(setDMChatField({ field: "replyUsername", value: "" }));
  };

  const handleNavigationBack = () => {
    if (myData.username) {
      navigate(`${getAppPrefix()}/account/${myData.username}/messages/list`, {
        replace: true,
      });
    }
  };

  const autoExpand = (field) => {
    field.style.height = "inherit";
    field.style.height = `${field.scrollHeight}px`;
  };

  if (globalLoading) {
    return <TopicChatSkeleton />;
  }

  return (
    <div
      className={`relative flex flex-col ${
        isEmbeddedOrExternal()
          ? "h-full-height-48"
          : "sm:h-full-height-64 h-full-height-84"
      }`}
    >
      {/* Header */}
      <div className="flex flex-row py-2 justify-start items-center px-2 border-b border-theme-chatDivider">
        <div className="flex flex-row items-center">
          <img
            src={ArrowBack}
            alt="arrow-back"
            className="dark:block hidden text-theme-secondaryText w-5 h-5 cursor-pointer mr-3"
            onClick={handleNavigationBack}
          />
          <img
            src={ArrowBackLight}
            alt="arrow-back"
            className="dark:hidden text-theme-secondaryText w-5 h-5 cursor-pointer mr-3"
            onClick={handleNavigationBack}
          />
          {receiver.logo ? (
            <img
              src={receiver.logo}
              alt="profile-icon"
              className="rounded-full w-6 h-6 object-cover mr-2"
            />
          ) : receiver?.color_logo ? (
            <div
              className="rounded-full w-6 h-6 mr-2 shrink-0 flex items-center justify-center"
              style={{ backgroundColor: receiver?.color_logo }}
            >
              <img src={ColorProfile} alt="color-profile" className="w-3 h-3" />
            </div>
          ) : (
            <img
              src={ProfileIcon}
              alt="profile-icon"
              className="rounded-full w-6 h-6 object-cover mr-2"
            />
          )}
          <p
            className="sm:py-2 py-0 flex text-theme-secondaryText text-md font-normal font-inter tracking-wide cursor-pointer"
            onClick={() => navigate(`${getAppPrefix()}/account/${user}/profile`)}
          >
            {user}
          </p>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex flex-col flex-grow overflow-hidden">
        {/* Chat Container */}
        <div
          className="bg-theme-secondaryBackground w-full h-full overflow-y-auto pt-1 flex-grow"
          ref={chatContainerRef}
        >
          <DMChatData
            receiver={user}
            sender={myData?._id}
            onNewMessageSent={(fn) => (newMessageScrollRef.current = fn)}
          />
        </div>

        {/* Media Preview */}
        {dmChat.media.length > 0 && (
          <div className="w-full bg-theme-chatDivider flex flex-row space-x-5 overflow-x-auto custom-scrollbar flex-shrink-0 z-50 pl-4 pr-2 pt-4 pb-2">
            {dmChat.media.map((item, index) => (
              <div
                key={item.id}
                className="bg-theme-tertiaryBackground rounded-lg p-2 relative"
              >
                <div className="flex flex-col">
                  <div
                    className="absolute -top-2 -right-1 cursor-pointer bg-theme-emptyEvent rounded-full p-1"
                    onClick={() => handleRemoveMedia(index, item?._id)}
                  >
                    <img src={Delete} alt="delete" className="w-4 h-4" />
                  </div>
                  {item.type === "image" ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="rounded-lg h-24 max-w-32 w-auto object-cover"
                    />
                  ) : item.type === "video" ? (
                    <video
                      controls
                      className="w-auto h-24 object-cover max-w-32 rounded-t-xl"
                    >
                      <source src={item.url} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={PdfImage}
                      alt="pdf"
                      className="rounded-lg h-24 max-w-32 w-auto"
                    />
                  )}
                  <p className="text-theme-secondaryText mt-1 font-normal text-xs truncate max-w-24">
                    {item.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reply Banner */}
        {dmChat.replyTo && dmChat.replyUsername && (
          <div className="text-theme-secondaryText bg-theme-chatDivider mt-1 py-1 px-4 text-sm font-light w-full flex flex-row justify-between items-center">
            <p>Replying to {dmChat.replyUsername}</p>
            <div
              className="p-2 rounded-full bg-theme-secondaryBackground cursor-pointer"
              onClick={handleReplyClear}
            >
              <img src={Close} alt="close-icon" className="w-3 h-3" />
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="flex flex-row items-center px-2 pt-3 pb-4 space-x-2 bg-theme-secondaryBackground border-t border-t-theme-chatDivider">
          <div className="relative flex flex-row items-center w-full px-2">
            <div className="flex flex-row items-center w-full">
              <div
                ref={addMenuButtonRef}
                onClick={(e) => {
                  e.preventDefault();
                  setShowAddMenu((prev) => !prev);
                }}
                className="cursor-pointer"
              >
                <img
                  src={AddButton}
                  alt="add-btn"
                  className="dark:block hidden w-8 h-8"
                />
                <img
                  src={AddButtonLight}
                  alt="add-btn"
                  className="dark:hidden w-8 h-8"
                />
              </div>

              {showAddMenu && (
                <div
                  className="absolute bottom-12 left-2 mb-2 bg-theme-tertiaryBackground border border-theme-modalBorder shadow-lg rounded-lg p-3 z-50"
                  onClick={(e) => e.stopPropagation()}
                  ref={addMenuRef}
                >
                  <div className="relative flex flex-row items-center space-x-2 px-1 py-2 cursor-pointer">
                    <img src={Media} alt="media" className="w-5 h-5 mr-1" />
                    <p className="block text-theme-emptyEvent" role="menuitem">
                      Media
                    </p>
                    <input
                      type="file"
                      accept="image/*,video/*"
                      multiple
                      onChange={handleMediaChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      ref={fileInputRef}
                    />
                  </div>

                  <div className="relative flex flex-row items-center space-x-2 px-1 py-2 cursor-pointer">
                    <img src={Document} alt="doc" className="w-5 h-5 mr-1" />
                    <p className="block text-theme-emptyEvent" role="menuitem">
                      Document
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      multiple
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      ref={fileInputRef}
                    />
                  </div>
                </div>
              )}
              <img
                src={Smiley}
                alt="emoji"
                ref={emojiButtonRef}
                className={`absolute ${
                  dmChat.content || dmChat.media.length > 0
                    ? "right-12"
                    : "right-2"
                } cursor-pointer w-8 h-8`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEmojiPicker((prev) => !prev);
                }}
              />
              <textarea
                placeholder="Type your message"
                className="pl-3 bg-transparent pr-14 py-2 rounded-3xl text-theme-secondaryText placeholder:text-theme-emptyEvent placeholder:font-light focus:outline-none w-full font-inter font-light resize-none"
                style={{ fontSize: "15px", overflow: "hidden" }}
                value={dmChat.content}
                rows={1}
                ref={inputRef}
                onClick={() => setShowEmojiPicker(false)}
                onChange={(e) => {
                  setData(e.target.value);
                  dispatch(
                    setDMChatField({ field: "content", value: e.target.value })
                  );
                  autoExpand(e.target);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (
                      dmChat.content.trim() !== "" ||
                      dmChat.media.length > 0
                    ) {
                      setShowEmojiPicker(false);
                      handleSendChat();
                    }
                  }
                }}
              />
            </div>

            {(data.length > 0 || dmChat.content || dmChat.media.length > 0) && (
              <div className="relative">
                {loading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 border-[3px] border-gray-300 mr-6 border-t-black rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <img
                    src={SendButton}
                    alt="send-btn"
                    className="w-9 h-9 cursor-pointer"
                    onClick={handleSendChat}
                  />
                )}
              </div>
            )}

            {showEmojiPicker && (
              <div
                className="absolute right-0 bottom-full mb-2 custom-emoji-wrapper"
                ref={emojiRef}
              >
                <EmojiPicker
                  onEmojiClick={onEmojiClick}
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
        </div>
      </div>
    </div>
  );
};

export default DMChat;
