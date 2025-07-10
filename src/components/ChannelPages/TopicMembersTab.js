import {
  setReorderTopicField,
  fetchTopicMembers,
  fetchTopicRequests,
} from "../../redux/slices/reorderTopicSlice";
import {
  acceptTopicRequest,
  declineTopicRequest,
} from "../../redux/slices/businessSlice";
import {
  React,
  useEffect,
  useDispatch,
  useSelector,
  useModal,
} from "../../globals/imports";
import { ChannelImages } from "../constants/images";
import { useState } from "react";
import Loading from "../../widgets/Loading";

const TopicMembersTab = ({ isAdmin, topicId, topic, business }) => {
  const dispatch = useDispatch();
  const { handleOpenModal } = useModal();
  const reorderMembers = useSelector(
    (state) => state.reorderTopic.topicMembers
  );
  const reorderRequests = useSelector(
    (state) => state.reorderTopic.topicRequests
  );
  const reorderPage = useSelector((state) => state.reorderTopic);
  const myData = useSelector((state) => state.myData);
  const memberStatus = useSelector((state) => state.reorderTopic.memberStatus);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [memberType, setMemberType] = useState("joined");

  useEffect(() => {
    if (memberType === "joined") {
      dispatch(fetchTopicMembers(topicId));
    }
    if (memberType === "requests") {
      dispatch(fetchTopicRequests(topicId));
    }
  }, [topicId, memberType]);

  const handleRemoveMember = (user, topicId) => {
    dispatch(setReorderTopicField({ field: "removeTopicId", value: topicId }));
    dispatch(setReorderTopicField({ field: "removeUser", value: user }));
    handleOpenModal("modalRemoveTopicMemberOpen");
  };

  const handleAcceptTopicRequest = (user, topicId) => {
    const formDataToSend = new FormData();
    formDataToSend.append("topicId", topicId);
    formDataToSend.append("userId", user._id);
    formDataToSend.append("email", user.email);
    dispatch(acceptTopicRequest(formDataToSend));
  };

  const handleDeclineTopicRequest = (user, topicId) => {
    const formDataToSend = new FormData();
    formDataToSend.append("topicId", topicId);
    formDataToSend.append("userId", user._id);
    formDataToSend.append("email", user.email);
    dispatch(declineTopicRequest(formDataToSend));
  };

  const filteredMembers = reorderMembers.filter(
    (member) => member?.user?.username !== myData.username
  );

  const filteredRequests = reorderRequests.filter(
    (request) => request?.user?.username !== myData.username
  );
  const filteredUsers =
    memberType === "joined" ? filteredMembers : filteredRequests;

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentMembers = filteredUsers.slice(startIndex, startIndex + pageSize);

  if (memberStatus === "loading") {
    return (
      <div className="text-theme-secondaryText flex text-center mt-12 justify-center items-center">
        <Loading text="Loading Members..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col mt-8">
      {topic?.visibility === "invite" && isAdmin && (
        <div className="flex my-2 items-center border border-theme-chatDivider rounded-md overflow-hidden w-max mx-auto">
          <button
            type="button"
            onClick={() => setMemberType("joined")}
            className={`px-6 py-2 text-sm font-inter font-light transition-colors duration-200 ${
              memberType === "joined"
                ? "bg-theme-secondaryText text-theme-primaryBackground"
                : "bg-transparent text-theme-secondaryText"
            }`}
          >
            Joined
          </button>
          <button
            type="button"
            onClick={() => setMemberType("requests")}
            className={`px-6 py-2 text-sm font-inter font-light transition-colors duration-200 ${
              memberType === "requests"
                ? "bg-theme-secondaryText text-theme-primaryBackground"
                : "bg-transparent text-theme-secondaryText"
            }`}
          >
            Requests
          </button>
        </div>
      )}
      {memberStatus !== "loading" && currentMembers.length === 0 && (
        <div className="text-theme-secondaryText text-center mt-12 justify-center items-center">
          No {memberType === "joined" ? "members" : "requests"} found.
        </div>
      )}
      {memberStatus !== "loading" &&
        currentMembers.length > 0 &&
        currentMembers.map(
          (member, index) =>
            member.user.username !== myData.username && (
              <div className="flex flex-col" key={member._id}>
                <div className="rounded-lg px-2 py-3 flex flex-row justify-between items-center ">
                  <div
                    className="flex flex-row items-start justify-start w-max cursor-pointer"
                    onClick={() => {
                      if (
                        business &&
                        business.parameters &&
                        !business.parameters.allowDm
                      ) {
                        window.open(
                          `https://channels.social/account/${member.user.username}/profile`,
                          "_blank",
                          "noopener,noreferrer"
                        );
                      }
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
                      <p className="text-theme-profileColor mt-1  text-[10px] font-normal">
                        {member.user?.name}
                      </p>
                      <p className="text-theme-secondaryText font-normal text-sm mr-2">
                        {member.user.username}
                      </p>
                    </div>
                  </div>
                  {isAdmin && (
                    <div className="flex flex-row items-center">
                      <div
                        className="bg-theme-tertiaryBackground rounded-md p-2 text-theme-primaryText text-sm font-light cursor-pointer"
                        onClick={() =>
                          memberType === "joined"
                            ? handleRemoveMember(member, topicId)
                            : handleAcceptTopicRequest(member?.user, topicId)
                        }
                      >
                        {memberType === "joined" ? "Remove" : "Accept"}
                      </div>
                      {memberType === "requests" && (
                        <div
                          className="ml-3"
                          onClick={() =>
                            handleDeclineTopicRequest(member?.user, topicId)
                          }
                        >
                          <img
                            src={ChannelImages.Delete.default}
                            alt="close"
                            className="w-5 h-5 dark:block hidden"
                          />
                          <img
                            src={ChannelImages.DeleteLight.default}
                            alt="close_light"
                            className="w-5 h-5 dark:hidden block"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className="border-t border-t-theme-chatDivider w-full px-4"></div>
              </div>
            )
        )}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-4 gap-2">
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
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded text-sm font-light bg-theme-tertiaryBackground text-theme-primaryText disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TopicMembersTab;
