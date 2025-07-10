import { setChannelOnce } from "../../../redux/slices/channelItemsSlice";
import { domainUrl } from "../../../utils/globals";
import { getAppPrefix } from "../../EmbedChannels/utility/embedHelper";
import { joinTopic, leaveTopic } from "../../../redux/slices/reorderTopicSlice";
import { showCustomToast } from "../../../widgets/toast";
import AddIcon from "../../../assets/icons/addIcon.svg";
import AddIconLight from "../../../assets/lightIcons/create_new_light.svg";
import { setModalModal } from "../../../redux/slices/modalSlice.js";
import SignOutIcon from "../../../assets/icons/sign_out.svg";
import EditLight from "../../../assets/lightIcons/edit_light.svg";
import Delete from "../../../assets/icons/Delete.svg";
import DeleteLight from "../../../assets/lightIcons/delete_light.svg";
import {
  setTopicIdToDelete,
  setTopicNameToDelete,
  setTopicChannelToDelete,
} from "../../../redux/slices/deleteTopicSlice.js";
import Dots from "../../../assets/icons/three_dots.svg";
import DotsLight from "../../../assets/lightIcons/faqs_dots_light.svg";
import Edit from "../../../assets/icons/Edit.svg";
import Invite from "../../../assets/icons/invite.svg";
import InviteLight from "../../../assets/lightIcons/invite_light.svg";
import ArrowForward from "../../../assets/icons/arrow_forward.svg";
import { ChannelImages } from "../../constants/images";
import {
  React,
  useState,
  useEffect,
  useRef,
  useNavigate,
  useDispatch,
  useSelector,
  useModal,
} from "../../../globals/imports";
import { usePaymentHandler } from "../../../utils/paymentPage";

import {
  clearCreateTopic,
  setCreateTopicField,
  setCreateTopicItems,
} from "../../../redux/slices/createTopicSlice";

const UserTopicsTab = ({
  username,
  isSubdomain,
  galleryUsername,
  channelId,
  isChannelAdmin,
}) => {
  const myData = useSelector((state) => state.myData);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownEditRef = useRef(null);

  const topics = useSelector((state) => state.reorderTopic.topics);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { handleOpenModal } = useModal();
  const { handlePayment } = usePaymentHandler();
  const myUserId = myData?._id;
  const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(null);
  const [openUpward, setOpenUpward] = useState(false);
  const DROPDOWN_HEIGHT = 85;
  useEffect(() => {
    if (isEditDropdownOpen) {
      setTimeout(() => {
        requestAnimationFrame(() => {
          if (dropdownEditRef.current) {
            const rect = dropdownEditRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            if (spaceBelow < DROPDOWN_HEIGHT && spaceAbove > DROPDOWN_HEIGHT) {
              setOpenUpward(true);
            } else {
              setOpenUpward(false);
            }
          }
        });
      }, 0);
    }
  }, [isEditDropdownOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownEditRef.current &&
        !dropdownEditRef.current.contains(event.target)
      ) {
        setIsEditDropdownOpen(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleEditDropdown = (id) => {
    setIsEditDropdownOpen(id);
  };

  const joinedTopics = topics.filter((topic) =>
    topic.members?.some((m) => m.user === myUserId && m.status === "joined")
  );

  const otherTopics = topics.filter((topic) => {
    const member = topic.members?.find((m) => m.user === myUserId);
    return !member || member.status !== "joined";
  });

  const handleEditModal = (topic) => {
    const transformedData = {
      ...topic,
    };
    dispatch(setCreateTopicItems(transformedData));
    dispatch(setCreateTopicField({ field: "isEdit", value: true }));
    setTimeout(() => {
      handleOpenModal("modalTopicOpen");
    }, 500);
  };

  const handleJoinTopic = (topicId) => {
    if (isLoggedIn) {
      dispatch(joinTopic(topicId))
        .unwrap()
        .then((response) => {
          if (
            response.success &&
            response.paywall &&
            response.paywallPrice > 0
          ) {
            const data = {
              amount: response.paywallPrice,
              currency: "INR",
              topic: response.topic._id,
              name: response.topic.name,
              channel: response.topic.channel._id,
              type: "topic",
              username: username,
            };
            handlePayment(data, "topic");
            return;
          }
          dispatch(setChannelOnce(false));
          if (response.success && response.joined) {
            navigate(`c-id/topic/${response.topic._id}`);
          } else {
            showCustomToast(response.message);
          }
        })
        .catch((error) => {
          console.log(error);
          // setJoinLoading(false);
        });
    } else {
      if (isSubdomain) {
        window.location.replace(
          `https://${domainUrl}/get-started?redirectDomain=${galleryUsername}&redirect=/account/${username}/channel/${channelId}`
        );
      } else {
        navigate(
          `${getAppPrefix()}/get-started?redirect=${getAppPrefix()}/account/${username}/channel/${channelId}`
        );
      }
    }
  };

  const handleTopicModal = (channelId) => {
    dispatch(clearCreateTopic());
    dispatch(setCreateTopicField({ field: "channel", value: channelId }));
    handleOpenModal("modalTopicOpen");
  };

  const handleLeaveTopic = (topicId) => {
    dispatch(setModalModal({ field: "topicId", value: topicId }));
    handleOpenModal("modalLeaveTopicOpen");
  };

  const handleTopic = (topicId) => {
    navigate(`c-id/topic/${topicId}`);
  };

  const renderTopicRow = (topic) => {
    const member = topic.members?.find((m) => m.user === myUserId);
    const isJoined = member?.status === "joined";
    const isRequested = member?.status === "request";
    const buttonLabel = isRequested ? "Requested" : "Join";
    const disabled = isRequested;

    return (
      <div
        key={topic._id}
        className="flex flex-row justify-between items-center bg-theme-tertiaryBackground rounded-lg px-4 py-3 my-3"
      >
        <div className="flex flex-col mr-1">
          <span className="text-theme-primaryText text-sm font-normal">
            #{topic.name}
          </span>
          {!isJoined && (
            <div className="flex flex-row items-center mt-0.5">
              <img
                className="mr-1 w-3 h-3 mt-0.5 dark:block hidden"
                loading="lazy"
                src={
                  topic.visibility === "paid"
                    ? ChannelImages.Secure.default
                    : topic.visibility === "anyone"
                    ? ChannelImages.LockOpen.default
                    : ChannelImages.Lock.default
                }
                alt="lock"
              />
              <img
                className="mr-1 w-3 h-3 mt-0.5 dark:hidden block"
                loading="lazy"
                src={
                  topic.visibility === "paid"
                    ? ChannelImages.SecureLight.default
                    : topic.visibility === "anyone"
                    ? ChannelImages.LockOpenLight.default
                    : ChannelImages.LockLight.default
                }
                alt="lock-light"
              />
              <p className="mt-1 text-xs font-light text-theme-emptyEvent">
                {topic.visibility === "paid"
                  ? `This topic requires a ₹${topic.paywallPrice} fee to join.`
                  : topic.visibility === "anyone"
                  ? "Public topic — anyone can join."
                  : "Invite-only — admin approval required."}
              </p>
            </div>
          )}
        </div>

        <button
          disabled={disabled}
          className={`text-sm px-3 py-1.5 rounded-md ${
            disabled
              ? "bg-theme-buttonDisable text-theme-buttonDisableText cursor-not-allowed"
              : "bg-theme-secondaryText text-theme-primaryBackground"
          }`}
          onClick={() => {
            handleJoinTopic(topic._id);
          }}
        >
          {buttonLabel}
        </button>
      </div>
    );
  };
  return (
    <div className="flex flex-col mx-3 mb-2">
      {!isChannelAdmin && (
        <div className="border-t my-6 border-t-theme-chatDivider"></div>
      )}

      {isChannelAdmin && (
        <div className="flex flex-row items-center justify-between mt-2 mb-6">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleTopicModal(channelId)}
          >
            <div className="rounded-lg mr-2 flex bg-theme-tertiaryBackground p-0.5 justify-center items-center">
              <img
                src={AddIcon}
                alt="Add"
                className="dark:block hidden w-5 h-5 text-theme-secondaryText"
              />
              <img
                src={AddIconLight}
                alt="Add"
                className="dark:hidden w-5 h-5 text-theme-secondaryText"
              />
            </div>
            <p className="text-theme-emptyEvent font-normal text-sm -ml-1">
              Create new
            </p>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {joinedTopics.length > 0 && (
          <div>
            <h3 className="text-md font-semibold text-theme-primaryText mb-2">
              ✅ Joined Topics
            </h3>

            {joinedTopics.map((topic) => {
              const member = topic.members?.find((m) => m.user === myUserId);
              const isJoined = member?.status === "joined";
              const isShowDesc = isJoined && member.role === "admin";

              return (
                <div
                  key={topic._id}
                  className="flex justify-between cursor-pointer items-center bg-theme-tertiaryBackground rounded-lg px-4 py-4 my-3"
                  onClick={() => handleTopic(topic._id)}
                >
                  <div className="flex flex-col mr-1">
                    <span className="text-theme-primaryText text-sm font-normal">
                      #{topic.name}
                    </span>
                    {isShowDesc && (
                      <div className="flex flex-row items-center mt-0.5">
                        <img
                          className="mr-1 w-3 h-3 mt-0.5 dark:block hidden"
                          loading="lazy"
                          src={
                            topic.visibility === "paid"
                              ? ChannelImages.Secure.default
                              : topic.visibility === "anyone"
                              ? ChannelImages.LockOpen.default
                              : ChannelImages.Lock.default
                          }
                          alt="lock"
                        />
                        <img
                          className="mr-1 w-3 h-3 mt-0.5 dark:hidden block"
                          loading="lazy"
                          src={
                            topic.visibility === "paid"
                              ? ChannelImages.SecureLight.default
                              : topic.visibility === "anyone"
                              ? ChannelImages.LockOpenLight.default
                              : ChannelImages.LockLight.default
                          }
                          alt="lock-light"
                        />
                        <p className="mt-1 text-xs font-light text-theme-emptyEvent">
                          {topic.visibility === "paid"
                            ? `This topic requires a ₹${topic.paywallPrice} fee to join.`
                            : topic.visibility === "anyone"
                            ? "Public topic — anyone can join."
                            : "Invite-only — admin approval required."}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-row xs:space-x-6 space-x-4 items-center">
                    {!isChannelAdmin && !isShowDesc && (
                      <button
                        className="border border-theme-primaryText py-1 xs:px-3 px-2 rounded-md cursor-pointer text-theme-secondaryText text-sm font-inter"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleLeaveTopic(topic._id);
                        }}
                      >
                        Exit
                      </button>
                    )}

                    {isShowDesc && (
                      <div className="relative flex items-center">
                        <img
                          src={Dots}
                          alt="dots"
                          className="dark:block hidden w-6 h-6 mr-2 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleEditDropdown(topic._id);
                          }}
                        />
                        <img
                          src={DotsLight}
                          alt="dots"
                          className="dark:hidden w-6 h-6 mr-2 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleEditDropdown(topic._id);
                          }}
                        />
                        {isEditDropdownOpen === topic._id && (
                          <div
                            ref={dropdownEditRef}
                            className={`absolute -left-4 mt-1 ml-3 w-24 rounded-md shadow-lg border border-theme-chatDivider
                            bg-theme-tertiaryBackground ring-1 ring-black ring-opacity-5 z-20
                            ${openUpward ? "bottom-full mb-2" : "top-6"}`}
                          >
                            <div
                              className="py-1"
                              role="menu"
                              aria-orientation="vertical"
                              aria-labelledby="options-menu"
                            >
                              <div className="flex flex-row px-3 items-center">
                                <img
                                  src={Edit}
                                  alt="edit"
                                  className="dark:block hidden w-4 h-4"
                                />
                                <img
                                  src={EditLight}
                                  alt="edit"
                                  className="dark:hidden w-4 h-4"
                                />
                                <p
                                  className="block font-light px-2 py-2 text-sm text-theme-secondaryText cursor-pointer"
                                  role="menuitem"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditModal(topic);
                                  }}
                                >
                                  Edit
                                </p>
                              </div>

                              {isChannelAdmin && (
                                <div
                                  className="flex flex-row px-3 items-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    dispatch(setTopicIdToDelete(topic._id));
                                    dispatch(setTopicNameToDelete(topic.name));
                                    dispatch(
                                      setTopicChannelToDelete(topic.channel)
                                    );
                                    handleOpenModal("modalDeleteTopicOpen");
                                  }}
                                >
                                  <img
                                    src={Delete}
                                    alt="delete"
                                    className="dark:block hidden w-4 h-4"
                                  />
                                  <img
                                    src={DeleteLight}
                                    alt="delete"
                                    className="dark:hidden w-4 h-4"
                                  />
                                  <p className="block px-2 py-2 font-light text-sm text-theme-secondaryText cursor-pointer">
                                    Delete
                                  </p>
                                </div>
                              )}

                              <div
                                className="flex flex-row px-3 items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(
                                    setModalModal({
                                      field: "shareUsername",
                                      value: username,
                                    })
                                  );
                                  dispatch(
                                    setModalModal({
                                      field: "type",
                                      value: "topic",
                                    })
                                  );
                                  dispatch(
                                    setModalModal({
                                      field: "topicId",
                                      value: topic._id,
                                    })
                                  );
                                  dispatch(
                                    setModalModal({
                                      field: "channelId",
                                      value: topic.channel,
                                    })
                                  );
                                  handleOpenModal("modalInviteOpen");
                                }}
                              >
                                <img
                                  src={Invite}
                                  alt="invite"
                                  className="dark:block hidden w-4 h-4"
                                />
                                <img
                                  src={InviteLight}
                                  alt="invite"
                                  className="dark:hidden w-4 h-4"
                                />
                                <p className="block px-2 py-2 font-light text-sm text-theme-secondaryText cursor-pointer">
                                  Invite
                                </p>
                              </div>

                              <div
                                className="flex flex-row px-3 items-center"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleLeaveTopic(topic._id);
                                }}
                              >
                                <img
                                  src={SignOutIcon}
                                  alt="exit"
                                  className="dark:block hidden w-4 h-4"
                                />
                                <img
                                  src={SignOutIcon}
                                  alt="exit"
                                  className="dark:hidden w-4 h-4"
                                />
                                <p className="block px-2 py-2 font-light text-sm text-theme-secondaryText cursor-pointer">
                                  Exit
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    <img
                      src={ArrowForward}
                      alt="arrow-forward"
                      className="w-5 h-5"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {otherTopics.length > 0 && (
          <div>
            <h3 className="text-md font-semibold text-theme-primaryText mb-2">
              ➕ Other Topics
            </h3>
            {otherTopics.map(renderTopicRow)}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserTopicsTab;
