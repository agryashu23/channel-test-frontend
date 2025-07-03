import AddIcon from "../../../assets/icons/addIcon.svg";
import AddIconLight from "../../../assets/lightIcons/create_new_light.svg";
import EditIcon from "../../../assets/icons/Edit.svg";
import EditIconLight from "../../../assets/lightIcons/edit_light.svg";
import { setModalModal } from "../../../redux/slices/modalSlice.js";

import {
  clearCreateTopic,
  setCreateTopicField,
  setCreateTopicItems,
} from "../../../redux/slices/createTopicSlice";
import ArrowForward from "../../../assets/icons/arrow_forward.svg";
import Dots from "../../../assets/icons/three_dots.svg";
import DotsLight from "../../../assets/lightIcons/faqs_dots_light.svg";
import Edit from "../../../assets/icons/Edit.svg";
import Invite from "../../../assets/icons/invite.svg";
import InviteLight from "../../../assets/lightIcons/invite_light.svg";

import EditLight from "../../../assets/lightIcons/edit_light.svg";
import Delete from "../../../assets/icons/Delete.svg";
import DeleteLight from "../../../assets/lightIcons/delete_light.svg";
import Loading from "../../../widgets/Loading";

import {
  React,
  useState,
  useRef,
  useDispatch,
  useEffect,
  useSelector,
  useModal,
  useNavigate,
} from "../../../globals/imports";
import {
  setTopicIdToDelete,
  setTopicNameToDelete,
  setTopicChannelToDelete,
} from "../../../redux/slices/deleteTopicSlice.js";

const TopicsTab = ({ channelId, isOwner,username }) => {
  const { handleOpenModal } = useModal();
  const [isEditDropdownOpen, setIsEditDropdownOpen] = useState(null);
  const dropdownEditRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reorderTopics = useSelector((state) => state.reorderTopic.topics);
  const status = useSelector((state) => state.reorderTopic.status);
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

  const handleTopicModal = (channelId) => {
    dispatch(clearCreateTopic());
    dispatch(setCreateTopicField({ field: "channel", value: channelId }));
    handleOpenModal("modalTopicOpen");
  };
  const handleReorderTopicModal = (channelId) => {
    handleOpenModal("modalTopicReorderOpen", channelId);
  };
  const handleTopic = (topicId) => {
    navigate(`c-id/topic/${topicId}`);
  };

  if (status === "loading") {
    return (
      <div className="text-theme-secondaryText text-center flex mt-12 justify-center items-center">
        <Loading text="Loading topics..."/>
      </div>
    ); 
  }

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

  return (
    <div className="flex flex-col">
      {isOwner && (
        <div className="flex flex-row items-center justify-between">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => handleTopicModal(channelId)}
          >
            <div className="rounded-lg mr-2 flex bg-theme-tertiaryBackground p-0.5  justify-center items-center">
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
          {reorderTopics.length > 0 && <div className="relative flex pr-2">
            <div
              className="flex flex-col space-y-1 cursor-pointer text-sm font-light text-theme-emptyEvent"
              onClick={() => handleReorderTopicModal(channelId)}
            >
              Reorder
            </div>
          </div>}
        </div>
      )}
      <div className="mx-1">
        {reorderTopics.length === 0 ? (
          <div className="text-theme-emptyEvent text-center mt-12 justify-center items-center">
            No topics found.
          </div>
        ) : (
          reorderTopics.map((topic, index) => (
            <div
              key={topic._id}
              className="bg-theme-tertiaryBackground rounded-lg px-4 py-4 flex cursor-pointer flex-row justify-between items-center my-3 "
              onClick={() => handleTopic(topic._id)}
            >
              <p className="text-theme-primaryText text-sm font-normal mr-1">
                #{topic.name}
              </p>
              <div className="flex flex-row xs:space-x-6 space-x-4 items-center ">
                {isOwner && (
                  <div className="relative flex items-center">
                    <img
                      src={Dots}
                      alt="dots"
                      className="dark:block hidden w-6 h-6 mr-2 cursor-pointer "
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleEditDropdown(topic._id);
                      }}
                    />
                    <img
                      src={DotsLight}
                      alt="dots"
                      className="dark:hidden w-6 h-6 mr-2 cursor-pointer "
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
                          <div
                            className="flex flex-row px-3 items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(setTopicIdToDelete(topic._id));
                              dispatch(setTopicNameToDelete(topic.name));
                              dispatch(setTopicChannelToDelete(topic.channel));
                              handleOpenModal("modalDeleteTopicOpen");
                            }}
                          >
                            <img
                              src={Delete}
                              alt="edit"
                              className="dark:block hidden w-4 h-4"
                            />
                            <img
                              src={DeleteLight}
                              alt="edit"
                              className="dark:hidden w-4 h-4"
                            />
                            <p
                              className="block px-2 py-2 font-light text-sm   text-theme-secondaryText cursor-pointer"
                              role="menuitem"
                            >
                              Delete
                            </p>
                          </div>
                          <div
                            className="flex flex-row px-3 items-center"
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(setModalModal({ field: "shareUsername", value: username }));
                              dispatch(setModalModal({ field: "type", value: "topic" }));
                              dispatch(setModalModal({ field: "topicId", value: topic._id }));
                              dispatch(setModalModal({ field: "channelId", value: topic.channel }));
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
                              alt="edit"
                              className="dark:hidden w-4 h-4"
                            />
                            <p
                              className="block px-2 py-2 font-light text-sm   text-theme-secondaryText cursor-pointer"
                              role="menuitem"
                            >
                              Invite
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
          ))
        )}
      </div>
    </div>
  );
};

export default TopicsTab;
