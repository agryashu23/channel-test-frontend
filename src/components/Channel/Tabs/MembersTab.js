import {
  fetchChannelMembers,
  setReorderTopicField,
} from "../../../redux/slices/reorderTopicSlice";
import {
  React,
  useEffect,
  useDispatch,
  useSelector,
  useModal,
} from "../../../globals/imports";
import{ ChannelImages} from "../../constants/images";
import { useState } from "react";
import Loading from "../../../widgets/Loading";

const MembersTab = ({ channelId, isOwner }) => {
  const dispatch = useDispatch();
  const { handleOpenModal } = useModal();
  const reorderMembers = useSelector((state) => state.reorderTopic.channelMembers);
  const myData = useSelector((state) => state.myData);
  const memberStatus = useSelector((state) => state.reorderTopic.memberStatus);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    dispatch(fetchChannelMembers(channelId));
  }, [channelId, dispatch]);

  const handleRemoveMember = (user, channelId) => {
    dispatch(
      setReorderTopicField({ field: "removeChannelId", value: channelId })
    );
    dispatch(setReorderTopicField({ field: "removeUser", value: user }));
    handleOpenModal("modalRemoveMemberOpen");
  };

  if (memberStatus === "loading") {
    return (
      <div className="text-theme-secondaryText flex text-center mt-12 justify-center items-center">
       <Loading text="Loading Members..."/>
      </div>
    );
  }

  const filteredMembers = reorderMembers.filter(
    (member) => member.user.username !== myData.username
  );

  const totalPages = Math.ceil(filteredMembers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentMembers = filteredMembers.slice(startIndex, startIndex + pageSize);

  if (filteredMembers.length === 0) {
    return (
      <div className="text-theme-secondaryText text-center mt-12 justify-center items-center">
        No members found.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {currentMembers.map(
        (member, index) =>
          member.user.username !== myData.username && (
            <div className="flex flex-col" key={member._id}>
              <div className="rounded-lg px-2 py-3 flex flex-row justify-between items-center ">
                <div
                  className="flex flex-row items-start justify-start w-max cursor-pointer"
                  onClick={() => {
                    window.open(
                      `https://${member.username}.channels.social`,
                      "_blank",
                      "noopener,noreferrer"
                    );
                  }}
                >
                  
                   {member.user.logo ? (
                    <img
                      src={member.user.logo}
                      alt="Profile"
                      className="rounded-full w-10 h-10  object-cover"
                      style={{ borderWidth: "2px" }}
                    />
                  ) : member.user.color_logo ? (
                    <div
                      className="rounded-full w-10 h-10 shrink-0  flex items-center justify-center"
                      style={{ backgroundColor: member.user?.color_logo }}
                    >
                      <img
                        src={ChannelImages.ColorProfile.default}
                        alt="color-profile"
                        className="w-6 h-6"
                      />
                    </div>
                  ) : (
                    <img
                      src={ChannelImages.ProfileIcon.default}
                      alt="Profile"
                      className="rounded-full w-10 h-10 bg-theme-chatDivider border border-theme-secondaryText p-6 object-cover"
                    />
                  )}
                  <div className="flex flex-col ml-2 justify-between">
                    {member.user.name && (
                      <p className="text-theme-profileColor mt-1  text-[10px] font-normal">
                        {member.user.name}
                      </p>
                    )}
                    <p className="text-theme-secondaryText font-normal text-sm mr-2">
                      {member.user.username}
                    </p>
                  </div>
                </div>
                <div className="flex flex-row ">
                  {isOwner && (
                    <div
                      className="bg-theme-tertiaryBackground rounded-md p-2 text-theme-primaryText text-sm font-light cursor-pointer"
                      onClick={() => handleRemoveMember(member, channelId)}
                    >
                      Remove
                    </div>
                  )}
                </div>
              </div>
              <div className="border-t border-t-theme-chatDivider w-full px-4"></div>
            </div>
          )
      )}
       {totalPages > 1 && <div className="flex justify-center items-center mt-4 gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded text-sm font-light bg-theme-tertiaryBackground text-theme-primaryText disabled:opacity-40"
        >
          Prev
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === index + 1
                ? "bg-theme-primaryBackground text-theme-primaryText"
                : "bg-theme-buttonDisable text-theme-buttonDisableText"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded text-sm font-light bg-theme-tertiaryBackground text-theme-primaryText disabled:opacity-40"
        >
          Next
        </button>
      </div>}
    </div>
  );
};

export default MembersTab;
