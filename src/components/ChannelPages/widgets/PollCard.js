import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPrivatePollResponse } from "../../../redux/slices/pollSlice";
import { IoExpand } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const PollCard = ({ poll, isAdmin }) => {
  const dispatch = useDispatch();
  const [selectedChoice, setSelectedChoice] = useState("");
  const navigate = useNavigate();
  const responses = useSelector((state) => state.poll.responses);
  const pollResponse = responses.find((res) => res.pollId === poll._id);

  const voteCounts = pollResponse?.voteCounts || {};
  const totalVotes = Object.values(voteCounts).reduce((sum, v) => sum + Number(v), 0);


  const userResponded = pollResponse?.userResponded;
  const userChoice = pollResponse?.userChoice?.replace(/"/g, "");

  const isSubmitted = userResponded || Boolean(userChoice);

  const handleChoiceChange = (e) => {
    e.stopPropagation();
    setSelectedChoice(e.target.value);
  };

  const handleSubmit = () => {
    if (!selectedChoice) return;
    dispatch(createPrivatePollResponse({ pollId: poll._id, choice: selectedChoice }));
  };

  return (
    <div className="border border-theme-chatDivider rounded-lg p-3 flex flex-col mb-2 w-full xs:min-w-72 bg-theme-tertiaryBackground">
      <div className="flex flex-row items-center justify-between">
        <p className="font-normal text-theme-secondaryText">{poll.name || "Poll"}</p>
        <div className="flex flex-row space-x-2 items-center">
          <div className="cursor-pointer text-theme-secondaryText w-5 h-5" onClick={()=>navigate(`/poll/${poll._id}`)}>
            <IoExpand />
          </div>
          {/* {isAdmin && (
            <div className="flex space-x-1 cursor-pointer">
              <div className="w-1 h-1 bg-theme-primaryText rounded-full"></div>
              <div className="w-1 h-1 bg-theme-primaryText rounded-full"></div>
              <div className="w-1 h-1 bg-theme-primaryText rounded-full"></div>
            </div>
          )} */}
        </div>
      
      </div>

      <p className="text-theme-secondaryText text-sm font-light font-inter my-3">
        {poll.question}
      </p>

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
            className={`w-full mt-4 py-2.5 font-normal text-sm rounded-lg ${
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
            className="w-full mt-4 py-2.5 font-normal text-sm rounded-lg bg-theme-buttonDisable text-theme-buttonDisableText cursor-not-allowed"
            disabled
          >
            Submitted
          </button>
        </>
      )}
    </div>
  );
};

export default PollCard;
