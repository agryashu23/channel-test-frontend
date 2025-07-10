import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPublicPollResponse, fetchPollData } from "../../redux/slices/pollSlice";
import Logo from "../../assets/icons/logo.svg";
import DarkLogo from "../../assets/lightIcons/logo_light.svg";
import Delete from "../../assets/icons/Delete.svg";
import DeleteLight from "../../assets/lightIcons/delete_light.svg";
import EmptyChatIcon from "../../assets/icons/empty_chat.svg";
import ArrowBack from "../../assets/icons/arrow_back.svg";
import ArrowBackLight from "../../assets/lightIcons/arrow_back_light.svg";
import Loading from "../../widgets/Loading";
import { useNavigate, useParams } from "react-router-dom";
import useModal from "../hooks/ModalHook";
import { setModalModal } from "../../redux/slices/modalSlice";

const PollFullPage = () => {
  const dispatch = useDispatch();
  const { pollId } = useParams();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [selectedChoice, setSelectedChoice] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { handleOpenModal } = useModal();

  const myUser = useSelector((state) => state.auth.user);
  const { poll, status, responses } = useSelector((state) => state.poll);
  const myUserId = myUser?._id;
  const pollResponse = responses.find((res) => res.pollId === pollId) || {};
  const voteCounts = pollResponse.voteCounts || {};
  const totalVotes = Object.values(voteCounts).reduce((sum, v) => sum + Number(v), 0);
  const userChoice = pollResponse?.userChoice?.replace(/"/g, "");
  const userResponded = pollResponse?.userResponded;
  const isSubmitted = userResponded || Boolean(userChoice);
  const isAdmin = poll?.isAdmin;

  useEffect(() => {
    if (pollId) {
      dispatch(fetchPollData({ pollId, userId: myUserId}));
    }
  }, [pollId]);

  useEffect(() => {
    const handleClickOutsideDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutsideDropdown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideDropdown);
    };
  }, []);

  const handleChoiceChange = (e) => setSelectedChoice(e.target.value);

  const handleSubmit = () => {
    if (selectedChoice && poll?._id && poll.type==="public") {
      dispatch(createPublicPollResponse({ pollId: poll._id, choice: selectedChoice,userId:myUserId }));
    }
    else if(selectedChoice && poll?._id && poll.type==="private"){
        if(!myUserId){
            navigate(`/get-started?redirect=/poll/${pollId}`)
        }
        else{
            dispatch(createPublicPollResponse({ pollId: poll._id, choice: selectedChoice,userId:myUserId }));
        }
    }
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleDeletePollModal = () => {
    toggleDropdown();
    dispatch(setModalModal({ field: "pollId", value: pollId }));
    handleOpenModal("modalPollDeleteOpen");
  };

  if(status!=="loading" && poll && poll.visibility==="topic" &&  !poll.isTopicMembership ){
    return (
          <div className="flex flex-col items-center justify-center h-full">
            <img
              src={EmptyChatIcon}
              alt="event-private"
              className="h-32 w-auto mb-1"
            />
            <p className="text-theme-secondaryText font-light text-md">
              This poll is private.
            </p>
            <button
              className="mt-4 bg-theme-secondaryText text-theme-primaryBackground rounded-md px-4 py-2"
              onClick={() => navigate(-1)}
            >
              Return to Home
            </button>
          </div>
        );
  }

  return (
    <div className="h-screen flex xs:flex-row flex-col bg-theme-primaryBackground px-3 py-3 items-start">
      <img src={Logo} alt="logo" className="dark:block hidden w-9 h-9" />
      <img src={DarkLogo} alt="logo" className="dark:hidden w-9 h-9" />

      <div className="flex sm:flex-row flex-col items-start mx-auto xs:space-x-3 h-full">
        <div className="sm:mt-8 mt-4 flex flex-row items-center space-x-1 cursor-pointer" onClick={() => navigate(-1)}>
          <img src={ArrowBack} alt="back" className="dark:block hidden w-4 h-4" />
          <img src={ArrowBackLight} alt="back" className="dark:hidden w-4 h-4" />
          <p className="text-xs text-theme-secondaryText font-light">Back</p>
        </div>

        <div className="flex flex-col flex-1 xs:p-4 p-2 h-full justify-center overflow-y-auto rounded-lg">
          {status === "loading" ? (
            <div className="p-6 mt-12">
              <Loading text="Loading poll data..." />
            </div>
          ) : !poll?._id ? (
            <div className="p-6 mt-12">
              <p className="text-theme-secondaryText text-sm">Poll not found or deleted</p>
            </div>
          ) : (
            <div className="border border-theme-chatDivider rounded-lg xs:p-5 p-3 bg-theme-tertiaryBackground min-w-[300px]">
              <div className="flex justify-between items-center">
                <p className="font-normal text-theme-secondaryText">{poll.name || "Poll"}</p>
                {isAdmin && (
                  <div className="relative flex">
                    <div className="flex space-x-1 cursor-pointer" onClick={toggleDropdown}>
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-theme-primaryText rounded-full" />
                      ))}
                    </div>
                    {isDropdownOpen && (
                      <div ref={dropdownRef} className="absolute top-4 right-0 bg-theme-tertiaryBackground border border-theme-chatDivider rounded-md shadow-md z-50">
                        <div className="px-4 py-2 flex items-center cursor-pointer" onClick={handleDeletePollModal}>
                          <img src={Delete} alt="delete" className="dark:block hidden w-4 h-4" />
                          <img src={DeleteLight} alt="delete" className="dark:hidden w-4 h-4" />
                          <p className="ml-2 text-sm text-theme-secondaryText">Delete</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <p className="text-theme-secondaryText text-sm font-light my-3">{poll.question}</p>

              {!isSubmitted ? (
                <>
                  <div className="flex flex-col space-y-3">
                      {poll.choices?.map((choice) => (
                        <label
                            key={choice}
                            className="text-theme-primaryText text-sm font-light flex items-center"
                        >
                            <input
                            type="radio"
                            name={`poll-choice-${poll._id}`}
                            value={choice}
                            className="mr-2 custom-radio"
                            checked={selectedChoice === choice}
                            onChange={handleChoiceChange}
                            />
                            <span>{choice}</span>
                        </label>
                        ))}

                  </div>
                  <button
                    className={`w-full mt-4 py-2.5 text-sm rounded-lg ${
                      !selectedChoice
                        ? "bg-theme-buttonDisable text-theme-buttonDisableText cursor-not-allowed"
                        : "bg-theme-secondaryText text-theme-primaryBackground"
                    }`}
                    disabled={!selectedChoice}
                    onClick={handleSubmit}
                  >
                    Submit
                  </button>
                </>
              ) : (
                <>
                  <div className="flex flex-col space-y-3">
                   {poll.choices?.map((choice) => {
                        const votes = Number(voteCounts[choice] || 0);
                        const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
                        const isMyChoice = choice === userChoice;

                        return (
                            <div key={choice} className="text-theme-primaryText text-sm">
                            <div className="flex justify-between items-center">
                                <span>
                                {choice}
                                {isMyChoice && (
                                    <span className="text-xs ml-1 text-theme-emptyEvent">(your choice)</span>
                                )}
                                </span>
                                {(poll.showResults==="afterVote" || isAdmin)&&<span>{votes} vote{Number(votes) !== 1 ? "s" : ""}</span>
                                }
                            </div>
                            {(poll.showResults==="afterVote" || isAdmin)&&
                            <div className="w-full bg-theme-buttonDisable h-2 rounded-full mt-2 overflow-hidden">
                            <div
                                className="h-2 rounded-full bg-theme-buttonEnable transition-all duration-300"
                                style={{ width: `${percent}%` }}
                            ></div>
                            </div>
                            }
                            </div>
                        );
                        })}
                  </div>
                  <button
                    className="w-full mt-4 py-2.5 text-sm rounded-lg bg-theme-buttonDisable text-theme-buttonDisableText cursor-not-allowed"
                    disabled
                  >
                    Submitted
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PollFullPage;
