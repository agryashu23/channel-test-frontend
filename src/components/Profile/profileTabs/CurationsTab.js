import React, { useState, useRef } from "react";
import ProfileView from "./../Widgets/ProfileView";

import { useDispatch, useSelector } from "react-redux";

import {
  updateItemsOrderCategory,
  clearReorderItems,
} from "../../../redux/slices/pushItemsSlice";
import useModal from "./../../hooks/ModalHook";
import { ChannelImages } from "../../constants/images";

const CurationsTab = ({ isOwner,  gallery = false }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownOpen2, setIsDropdownOpen2] = useState(false);
  const [reorderItems, setReorderItems] = useState(false);
  const pushItems = useSelector((state) => state.pushItems);
  const { items } = useSelector((state) => state.profileItems);


  const dispatch = useDispatch();

  const dropdownRef = useRef(null);
  const dropdownRef2 = useRef(null);
  const { handleOpenModal } = useModal();

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
    if (dropdownRef2.current && !dropdownRef2.current.contains(event.target)) {
      setIsDropdownOpen2(false);
    }
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleDropdown2 = () => {
    setIsDropdownOpen2(!isDropdownOpen2);
  };

  const handleCategoryOpenModal = () => {
    setIsDropdownOpen(false);
    handleOpenModal("modalCreateCategoryOpen");
  };

  const handleCategoryReorderModal = () => {
    setIsDropdownOpen2(false);
    handleOpenModal("modalCategoryReorderOpen");
  };
  const handleReorderItems = () => {
    setIsDropdownOpen2(false);
    setReorderItems(true);
  };

  const handleCurationOpenModal = () => {
    setIsDropdownOpen(false);
    handleOpenModal("modalCurationOpen");
  };
  const handleChipOpen = () => {
    setIsDropdownOpen(false);
    handleOpenModal("modalChipOpen");
  };

  const handleSaveChanges = () => {
    const items = pushItems.reorderItems;
    dispatch(updateItemsOrderCategory(items))
      .unwrap()
      .then(() => {
        setReorderItems(false);
        dispatch(clearReorderItems());
      })
      .catch((error) => {
        alert(error);
      });
  };
  const handleResetChanges = () => {
    setReorderItems(false);
  };

  return (
    <div className="flex flex-col" onClick={handleClickOutside}>
      <div className="relative flex flex-row justify-between w-full items-center">
        {isOwner && items.length > 0 && reorderItems === false && (
          <div
            className="flex items-center cursor-pointer"
            onClick={toggleDropdown}
          >
            <div className="rounded-lg mr-2 flex bg-transparent p-1  justify-center items-center">
              <img
                src={ChannelImages.AddIcon.default}
                alt="Add"
                className="dark:block hidden w-4 h-4 text-theme-secondaryText"
              />
              <img
                src={ChannelImages.AddIconLight.default}
                alt="Add"
                className="dark:hidden w-5 h-5 text-theme-secondaryText"
              />
            </div>
            <p className="text-theme-emptyEvent font-normal text-sm -ml-1">
              Create new
            </p>
          </div>
        )}
        <div className="relative flex pr-2">
          {isOwner && reorderItems === false && items.length > 1 && (
            <div
              className="flex flex-col space-y-1 cursor-pointer text-sm font-light text-theme-emptyEvent"
              onClick={toggleDropdown2}
            >
              Reorder
            </div>
          )}
          {isDropdownOpen2 && (
            <div
              ref={dropdownRef2}
              className="absolute right-0 top-6 w-max rounded-md shadow-lg border border-theme-chatDivider bg-theme-tertiaryBackground ring-1 ring-black ring-opacity-5 z-50"
            >
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <div
                  className="flex flex-row px-4 items-center"
                  onClick={handleCategoryReorderModal}
                >
                  {/* <img src={ShareIcon} alt="edit" className="w-4 h-4" /> */}
                  <p
                    className="block ml-1 py-2 text-sm text-theme-secondaryText cursor-pointer font-light"
                    role="menuitem"
                  >
                    Reorder Category
                  </p>
                </div>
                <div
                  className="flex flex-row px-4 items-center"
                  onClick={handleReorderItems}
                >
                  {/* <img src={ShareIcon} alt="edit" className="w-4 h-4" /> */}
                  <p
                    className="block  ml-1 py-2 text-sm text-theme-secondaryText cursor-pointer font-light"
                    role="menuitem"
                  >
                    Reorder Items
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-full left-0 mt-1 ml-3 w-28 rounded-md shadow-lg border  border-theme-chatDivider
             bg-theme-tertiaryBackground ring-1 ring-black ring-opacity-5 z-50"
          >
            <div
              className="py-1"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="options-menu"
            >
              <div
                className="flex flex-row px-3 items-center"
                onClick={handleChipOpen}
              >
                <img
                  src={ChannelImages.ChipIcon.default}
                  alt="edit"
                  loading="lazy"
                  className="dark:block hidden w-4 h-4"
                />
                <img
                  src={ChannelImages.ChipIconLight.default}
                  alt="edit"
                  loading="lazy"
                  className="dark:hidden w-4 h-4"
                />
                <p
                  className="block px-2 py-2 text-sm text-theme-secondaryText cursor-pointer"
                  role="menuitem"
                >
                  Chip
                </p>
              </div>
              <div
                className="flex flex-row px-3 items-center"
                onClick={handleCurationOpenModal}
              >
                <img
                  src={ChannelImages.CurationIcon.default}
                  alt="edit"
                  loading="lazy"
                  className="dark:block hidden w-4 h-4"
                />
                <img
                  src={ChannelImages.CurationIconLight.default}
                  alt="edit"
                  loading="lazy"
                  className="dark:hidden w-4 h-4"
                />
                <p
                  className="block px-2 py-2 text-sm   text-theme-secondaryText cursor-pointer"
                  role="menuitem"
                >
                  Curation
                </p>
              </div>
              <div
                className="flex flex-row px-3 items-center"
                onClick={handleCategoryOpenModal}
              >
                <img
                  src={ChannelImages.CategoryIcon.default}
                  alt="edit"
                  loading="lazy"
                  className="dark:block hidden w-4 h-4"
                />
                <img
                  src={ChannelImages.CategoryIconLight.default}
                  alt="edit"
                  loading="lazy"
                  className="dark:hidden w-4 h-4"
                />
                <p  
                  className="block px-2 py-2 text-sm   text-theme-secondaryText cursor-pointer"
                  role="menuitem"
                >
                  Category
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      {reorderItems === true && (
        <div className="flex flex-row justify-between items-center w-full">
          <div
            className="text-theme-primaryBackground bg-theme-secondaryText cursor-pointer rounded-full px-3 py-1.5 text-sm font-normal ml-2"
            onClick={handleSaveChanges}
          >
            Save Reordering
          </div>
          <div
            className="text-theme-primaryText underline  cursor-pointer rounded-full px-3 py-1.5 text-sm font-normal ml-2"
            onClick={handleResetChanges}
          >
            Cancel
          </div>
        </div>
      )}

      <ProfileView
        gallery={gallery}
        owner={isOwner}
        enableReorder={reorderItems}
      />
    </div>
  );
};

export default CurationsTab;
