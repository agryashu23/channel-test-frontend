import React, { useState, useEffect, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/Close.svg";
import UpArrow from "../../../assets/icons/up_arrow.svg";
import UpArrowComment from "../../../assets/icons/uparrow.svg";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/slices/modalSlice";
import CommentChip from "./../../chips/CommentChip";
import EmojiPicker from "emoji-picker-react";
import { faSmile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setChipEngagement } from "./../../../redux/slices/chipEngagementSlice";
import CommentItem from "./CommentChipItem";
import {
  fetchChipComments,
  createChipComment,
  createChipCommentReply,
  setScroll,
  clearCommentChip,
} from "./../../../redux/slices/commentChipSlice";

const CommentChipModal = () => {
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modals.modalCommentOpen);
  const item = useSelector((state) => state.commentChip.chip);
  const { comments, status, addstatus } = useSelector(
    (state) => state.commentChip
  );
  const scrollRef = useRef(null);
  const [replyData, setReplyData] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const isScroll = useSelector((state) => state.commentChip.isScroll);
  const inputRef = useRef(null);

  const clearReplyData = () => {
    setReplyData(null);
  };

  const handleOverlayClick = () => {
    setShowEmojiPicker(false);
    dispatch(closeModal("modalCommentOpen"));
    clearCommentChip();
  };

  const onEmojiClick = (event, emojiObject) => {
    setComment((prevComment) => prevComment + event.emoji);
    inputRef.current.focus();
  };
  useEffect(() => {
    if (isOpen && item && item._id) {
      dispatch(fetchChipComments(item._id));
    }
  }, [isOpen, item._id]);

  useEffect(() => {
    if (scrollRef.current && isScroll) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments, isScroll]);

  const onCreateComment = (id) => {
    setShowEmojiPicker(false);
    dispatch(setScroll(true));
    if (!replyData) {
      const data = {
        chipId: id,
        comment: comment,
      };
      dispatch(createChipComment(data));
    } else {
      const data = {
        id: replyData._id,
        comment: comment,
        repliedToUserId: replyData.user._id,
      };
      dispatch(createChipCommentReply(data));
      setReplyData(null);
    }
    setComment("");
    dispatch(setChipEngagement(id));
  };

  const handleReplyChange = (reply) => {
    setReplyData(reply);
  };

  if (!item) {
    return <p>Loading...</p>;
  }

  const previewConfig = {
    showPreview: false,
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-black bg-opacity-70 z-50"
          onClick={handleOverlayClick}
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content
            className={`bg-theme-tertiaryBackground rounded-xl  overflow-hidden shadow-xl  h-4/5 transform transition-all w-[90%] xs:w-4/5 sm:w-1/2  lg:w-1/3`}
          >
            <Dialog.Title></Dialog.Title>
            <div className="flex flex-col h-full">
              <div
                className={`h-max pl-5 pt-5 overflow-y-auto custom-scrollbar `}
              >
                <CommentChip item={item} />
                <div className="mt-1"></div>
              </div>
              <div
                className={`w-[100%] my-4  border border-theme-chatDivider`}
                style={{ height: "1px" }}
              ></div>
              <div
                className={`${
                  comments?.length === 0 ? "min-h-[25%]" : "min-h-[50%]"
                }  space-y-3 overflow-y-auto custom-scrollbar`}
                ref={scrollRef}
              >
                {status === "loading" ? (
                  <p
                    className={`text-sm text-theme-primaryText ${
                      comments?.length === 0 ? "mt-4" : "mt-8"
                    } text-center font-light`}
                  >
                    Loading...
                  </p>
                ) : comments?.length === 0 ? (
                  <p
                    className={`text-sm text-theme-primaryText ${
                      comments.length === 0 ? "mt-4" : "mt-8"
                    } text-center font-light`}
                  >
                    Start a conversation.
                  </p>
                ) : (
                  comments?.map((item, index) => (
                    <CommentItem
                      key={item._id}
                      item={item}
                      handleChange={handleReplyChange}
                    />
                  ))
                )}
                <div className="h-2"></div>
                <div className="h-16"></div>
                <div className="absolute bottom-0 left-0 right-0 bg-commentBottom p-4">
                  <div className="flex flex-col justify-start">
                    {replyData && (
                      <div className="flex flex-row justify-between mb-2 items-center">
                        <p className="text-primaryGrey text-xs font-normal font-inter">
                          Replying to{" "}
                          <span className="text-textFieldColor">
                            {replyData.user.username}
                          </span>
                        </p>
                        <div
                          className="bg p-1 rounded-full cursor-pointer"
                          onClick={clearReplyData}
                        >
                          <img src={Close} alt="close" className="w-3 h-3 " />
                        </div>
                      </div>
                    )}
                    <div className="flex flex-row  space-x-2.5 justify-around items-center">
                      {/* {item?.user?.logo? <img src={item?.user?.logo} alt="Curation" className=" w-9 h-9 rounded-md object-cover" />:
                                    item?.user?.name && <Initicon text={item.user.name} size={42} />
                                } */}
                      <div className="relative flex items-center w-full">
                        <FontAwesomeIcon
                          icon={faSmile}
                          className="absolute left-2 bottom-1  transform -translate-y-1/2 cursor-pointer text-theme-secondaryText w-5 h-5"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        />
                        <input
                          type="text"
                          placeholder="Add your thoughts.."
                          className="pl-10 pr-3 py-2.5 rounded-3xl border border-dividerLine bg-transparent
                           text-white placeholder:text-theme-primaryText placeholder:font-light focus:outline-none w-full font-inter font-light"
                          style={{ fontSize: "15px" }}
                          value={comment}
                          ref={inputRef}
                          onClick={() => setShowEmojiPicker(false)}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        {showEmojiPicker && (
                          <div className="absolute left-0 bottom-full mb-2">
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
                      <div
                        className={`${
                          comment
                            ? "bg-theme-secondaryText"
                            : "bg-theme-chatDivider"
                        } rounded-3xl px-3 py-2.5 cursor-pointer`}
                        onClick={() => onCreateComment(item._id)}
                      >
                        {addstatus === "loading" ? (
                          <div className="w-5 h-5 border-2 border-t-transparent border-theme-chatDivider rounded-full animate-spin"></div>
                        ) : (
                          <img
                            src={comment ? UpArrowComment : UpArrow}
                            alt="up-arrow"
                            className="w-5 h-5"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CommentChipModal;
