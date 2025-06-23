import React, { useState } from "react";
import Upvote from "../../../assets/icons/upvote.svg";
import Upvoted from "../../../assets/icons/upvoted.svg";
import ReplyLine from "../../../assets/icons/reply_line.svg";
import { formatDistanceToNowStrict } from "date-fns";
import CommentChipReplyItem from "./CommentChipReplyItem";
import Profile from "../../../assets/icons/profile.svg";
import {
  toggleCommentUpvote,
  setScroll,
} from "./../../../redux/slices/commentChipSlice";
import { useDispatch, useSelector } from "react-redux";
import { setChipEngagement } from "./../../../redux/slices/chipEngagementSlice";

const CommentItem = ({ item, handleChange }) => {
  const [showreply, setShowReply] = useState(false);
  const dispatch = useDispatch();
  const myData = useSelector((state) => state.myData);

  const handleShowReply = () => {
    if (showreply) {
      setShowReply(false);
    } else {
      setShowReply(true);
    }
  };

  const toggleUpvoteComment = (id) => {
    dispatch(setScroll(false));
    dispatch(toggleCommentUpvote(id));
    dispatch(setChipEngagement(item.chipId));
  };

  const upvoted = item?.upvotes?.includes(myData?._id);
  const chipId = item?.chipId;

  if (!item) {
    return <p>Loading..</p>;
  }
  let timeAgo = "";
  if (item.createdAt) {
    try {
      timeAgo = formatDistanceToNowStrict(new Date(item.createdAt), {
        addSuffix: true,
      });
    } catch (error) {
      console.error("Invalid date:", item.createdAt);
      timeAgo = "Unknown time";
    }
  }
  return (
    <div className="flex flex-row items-start space-x-2 w-full px-5">
      <img
        src={item.user?.logo ? item.user?.logo : Profile}
        alt="Curation"
        className=" w-8 h-8 rounded-lg object-cover"
      />
      <div className="flex flex-col  ">
        <div className="flex flex-row items-end">
          <p className="text-theme-secondaryText font-normal text-[11px] font-inter">
            {item.user?.username}
          </p>
          <p className="text-theme-primaryText font-light pl-2 text-[10px] font-inter">
            {timeAgo}
          </p>
        </div>
        <p className="text-theme-secondaryText font-light text-xs mt-0.5">
          {item.comment}
        </p>
        <div className="flex flex-row items-center pt-2 pb-2">
          <div className="flex flex-row items-center cursor-pointer">
            <img
              src={upvoted ? Upvoted : Upvote}
              alt="Upvote"
              className="mr-1 h-4 w-4"
              onClick={() => toggleUpvoteComment(item._id)}
            />
            <p className="text-theme-secondaryText text-xs font-normal">
              {item.upvotes?.length ?? 0}
            </p>
          </div>
          <p
            className="text-theme-primaryText ml-4 text-xs font-normal font-inter cursor-pointer"
            onClick={() => handleChange(item)}
          >
            Reply
          </p>
        </div>
        {item.replies.length > 0 && (
          <div
            className="pt-1  flex flex-row items-center  cursor-pointer"
            onClick={handleShowReply}
          >
            <img src={ReplyLine} alt="reply" />
            <p className="text-theme-primaryText font-normal text-xs pl-2">
              {showreply
                ? "hide replies"
                : `view ${item.replies?.length} more replies`}
            </p>
          </div>
        )}
        {showreply &&
          item.replies.map((item2, index) => (
            <CommentChipReplyItem
              key={item2._id}
              item={item2}
              handleChange={handleChange}
              chipId={chipId}
              comment={item}
            />
          ))}
      </div>
    </div>
  );
};

export default CommentItem;
