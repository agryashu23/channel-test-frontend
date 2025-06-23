import React from "react";
import useModal from "./../../hooks/ModalHook";

const EmptyItemsCard = () => {
  const { handleOpenModal } = useModal();

  const handleCurationOpenModal = () => {
    handleOpenModal("modalCurationOpen");
  };
  const handleCategoryOpenModal = () => {
    handleOpenModal("modalCreateCategoryOpen");
  };
  const handleChipOpen = () => {
    handleOpenModal("modalChipOpen");
  };

  return (
    <div className="flex flex-col space-y-4 mt-4 w-full">
      <div className="bg-theme-tertiaryBackground p-4 rounded-lg  xl:w-1/2 lg:w-3/4 w-full">
        <div className="flex sm:flex-row flex-col w-full">
          <img
            src="https://chips-social.s3.ap-south-1.amazonaws.com/channelsWebsite/emptyChipCard.svg"
            alt="chip-profile"
            className="xs:h-44 h-36 w-auto bg-emptyChip rounded-lg  object-contain"
          />
          <div className="flex flex-col justify-between ml-4 xs:mt-0 mt-1">
            <p className=" text-theme-secondaryText text-sm font-light font-inter">
              Organise and share links, media, and more within customisable
              Chips. Each Chip serves as a building block for your digital
              space, making it easy to curate and present content in a visually
              engaging way.
            </p>
            <button
              className="mt-4 border w-max border-theme-secondaryText py-2 px-4
               rounded-lg text-theme-secondaryText font-normal text-sm font-inter sm:mx-0 mx-auto"
              onClick={handleChipOpen}
            >
              Create a Chip
            </button>
          </div>
        </div>
      </div>
      <div className="bg-theme-tertiaryBackground p-4  rounded-lg items-end justify-end xl:w-1/2 lg:w-3/4 w-full ml-auto">
        <div className="flex sm:flex-row flex-col w-full">
          <img
            src="https://d3i6prk51rh5v9.cloudfront.net/channelsWebsite/emptyCurationCard.svg"
            alt="curation-profile"
            className="h-44 w-auto bg-emptyChip rounded-lg  object-contain"
          />
          <div className="flex flex-col justify-between ml-4 xs:mt-0 mt-1">
            <p className=" text-theme-secondaryText text-sm font-light font-inter">
              Curations are collections of Chips that bring together related
              content. Create and organise these collections to showcase your
              interests, projects, or anything that inspires you, all in one
              cohesive place.
            </p>
            <button
              className="mt-4 border w-max border-theme-secondaryText py-2 px-4
               rounded-lg text-theme-secondaryText font-normal text-sm font-inter sm:mx-0 mx-auto"
              onClick={handleCurationOpenModal}
            >
              Build a Curation
            </button>
          </div>
        </div>
      </div>
      <div className="bg-theme-tertiaryBackground p-4  rounded-lg xl:w-1/2 lg:w-3/4 w-full">
        <div className="flex sm:flex-row flex-col w-full">
          <img
            src="https://d3i6prk51rh5v9.cloudfront.net/channelsWebsite/emptyCategoryCard.svg"
            alt="category-profile"
            className="h-44 w-auto bg-emptyChip rounded-lg  object-contain"
          />
          <div className="flex flex-col justify-between ml-4 xs:mt-0 mt-1">
            <p className=" text-theme-secondaryText text-sm font-light font-inter">
              Chips and curations can be organised under different categories.
              This will help your viewers easily navigate through your profile.
              Each category creates an easy to access tab on the top of your
              page, with About being the default.
            </p>
            <button
              className="mt-4 border w-max border-theme-secondaryText py-2 px-4
               rounded-lg text-theme-secondaryText font-normal text-sm font-inter sm:mx-0 mx-auto"
              onClick={handleCategoryOpenModal}
            >
              Start with Category
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyItemsCard;
