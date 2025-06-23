import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurationEngagement } from "./../../redux/slices/curationEngagementSlice";

const Curation = ({ curation }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChipsPage = () => {
    dispatch(setCurationEngagement(curation._id));
    navigate("/profile/chips");
  };
  return (
    <div className="flex flex-col items-start flex-shrink-0 cursor-pointer rounded-lg w-full">
      <img
        className="h-36 w-56 rounded-xl object-cover"
        src={curation.image}
        alt={curation.name}
        onClick={handleChipsPage}
      />
      <p
        className="text-theme-secondaryText text-base mt-1 w-[215px] font-inter font-normal text-left overflow-hidden"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          lineHeight: "1.5rem",
        }}
      >
        {curation.name}
      </p>
    </div>
  );
};

export default Curation;
