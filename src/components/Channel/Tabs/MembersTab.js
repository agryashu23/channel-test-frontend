import {
  fetchMembers,
  setReorderTopicField,
} from "../../../redux/slices/reorderTopicSlice";
import {
  React,
  useEffect,
  useDispatch,
  useSelector,
  useModal,
} from "../../../globals/imports";

const MembersTab = ({ channelId, isOwner }) => {
  const dispatch = useDispatch();
  const { handleOpenModal } = useModal();
  const reorderMembers = useSelector((state) => state.reorderTopic.members);
  const myData = useSelector((state) => state.myData);
  const memberStatus = useSelector((state) => state.reorderTopic.memberStatus);

  useEffect(() => {
    dispatch(fetchMembers(channelId));
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
      <div className="text-theme-secondaryText text-center mt-12 justify-center items-center">
        Loading...
      </div>
    );
  }

  if (reorderMembers.length === 0) {
    return (
      <div className="text-theme-secondaryText text-center mt-12 justify-center items-center">
        No members found.
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {reorderMembers.map(
        (member, index) =>
          member.username !== myData.username && (
            <div className="flex flex-col">
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
                  {member.logo ? (
                    <img
                      src={member.logo}
                      alt="logo"
                      className="rounded-full w-10 h-10"
                    />
                  ) : (
                    <div className="rounded-full w-10 h-10 bg-theme-emptyEvent"></div>
                  )}
                  <div className="flex flex-col ml-2 justify-between">
                    {member.name && (
                      <p className="text-theme-profileColor mt-1  text-[10px] font-normal">
                        {member.name}
                      </p>
                    )}
                    <p className="text-theme-secondaryText font-normal text-sm mr-2">
                      {member.username}
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
    </div>
  );
};

export default MembersTab;
