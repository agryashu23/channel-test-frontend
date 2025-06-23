import React from "react";

const EmptyProfileCard = ({ handleClick }) => {
  return (
    <div className="h-full w-full flex flex-col lg:ml-0 md:ml-8 bg-theme-welcomeProfile lg:p-5 p-4 rounded-lg">
      <div className="flex xl:flex-row flex-col justify-between">
        <div className="flex flex-col">
          <p className="text-theme-secondaryText font-normal md:text-lg font-inter tracking-tight">
            Visuals are more effective than words
          </p>
          <p className="text-theme-primaryText text-xs mt-1 font-light font-inter tracking-tight">
            Show them what your profile is all about with relevant images
          </p>
        </div>
        <button
          onClick={handleClick}
          className="mt-3 border w-max text-theme-secondaryText px-3 py-2 rounded-lg border-theme-secondaryText font-normal text-xs font-inter"
        >
          Add Images
        </button>
      </div>
      <img
        src="https://chips-social.s3.ap-south-1.amazonaws.com/channelsWebsite/profileEmptyCard.svg"
        alt="profile"
        className="rounded-lg h-48 md:h-52 lg:h-64 mt-4 bg-theme-onboardBackground w-full object-cover"
      />
      <div className="pt-2" />
    </div>
  );
};

export default EmptyProfileCard;
