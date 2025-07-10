import React, { useState, useEffect } from "react";
import { ChannelImages } from "../constants/images";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllEventMembers } from "../../redux/slices/eventItemsSlice";

const EventMembersTab = ({ eventId }) => {
  const dispatch = useDispatch();
  const members = useSelector((state) => state.eventItems.eventMembers);

  useEffect(() => {
    if (
      members.length === 0 ||
      (members.length > 0 && members[0].event !== eventId)
    ) {
      dispatch(fetchAllEventMembers(eventId));
    }
  }, [eventId]);

  console.log(members);

  return (
    <div className="h-full overflow-y-auto">
      <p className="text-theme-secondaryText text-md font-normal">Guest list</p>
      <p className="text-theme-emptyEvent text-sm font-light mt-2 mb-6">
        {members.length} people have registered for this event
      </p>
      {members.map((member) => (
        <div key={member._id} className="flex flex-row items-center mb-3">
          {member.user?.logo ? (
            <img
              src={member.user?.logo}
              alt="profile-icon"
              className="rounded-full w-8 h-8 object-cover"
            />
          ) : member.user?.color_logo ? (
            <div
              className="rounded-full w-8 h-8 shrink-0 flex items-center justify-center"
              style={{ backgroundColor: member?.user?.color_logo }}
            >
              <img
                src={ChannelImages.ColorProfile.default}
                alt="color-profile"
                className="w-4 h-4"
              />
            </div>
          ) : (
            <img
              src={ChannelImages.Profile.default}
              alt="profile-icon"
              className="rounded-full w-8 h-8 object-cover"
            />
          )}
          <div className="flex flex-col ml-2">
            <p className="text-theme-secondaryText text-sm font-normal">
              {member.user?.username}
            </p>
            <p className="text-theme-secondaryText text-xs font-light">
              {member.user?.email}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventMembersTab;
