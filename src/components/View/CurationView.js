import { React, useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import useModal from "./../hooks/ModalHook";

import { setCurationField } from "../../redux/slices/curationSlice";
import { setChipField } from "../../redux/slices/chipSlice";
import {
  setCurationIdToDelete,
  setProfileCategoryToDelete,
} from "../../redux/slices/deleteCurationSlice";

import {
  fetchCuration,
  saveCuration,
  fetchChips,
  shareCuration,
  clearItems,
} from "./../../redux/slices/curationPageSlice";
import { domainUrl } from "./../../utils/globals";
import { setCurationEngagement } from "./../../redux/slices/curationEngagementSlice";
import ProfileItemsSkeleton from "./../skeleton/profileItemsSkeleton";
import ProfileChips from "./../chips/ProfileChips";
import Chips from "./../chips/Chips";
import { ChannelImages } from "../constants/images";

const CurationView = () => {
  const [isSavedMessageVisible, setSavedMessageVisible] = useState(false);
  const [savedMessage, setSavedMessage] = useState("");

  const { curId } = useParams();
  const location = useLocation();
  const owner = location.state?.owner ?? false;
  const dispatch = useDispatch();
  const myData = useSelector((state) => state.myData);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const curation = useSelector((state) => state.curationPage.curation);
  const chips = useSelector((state) => state.curationPage.chips);
  const chipstatus = useSelector((state) => state.curationPage.chips);
  const isOwner = myData?._id === curation?.user?._id;
  const { handleOpenModal } = useModal();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const openLoginModal = () => {
    handleOpenModal("modalLoginOpen");
  };

  const handleShareOpen = () => {
    handleOpenModal("modalShareOpen");
    dispatch(setCurationEngagement(curation._id));
    dispatch(shareCuration(curation._id));
  };
  const handleChipOpen = () => {
    if (isLoggedIn) {
      dispatch(setChipField({ field: "curation", value: curId }));
      handleOpenModal("modalChipOpen");
      dispatch(fetchChips(curId));
    } else {
      openLoginModal();
    }
  };

  useEffect(() => {
    if (curId) {
      clearItems();
      dispatch(fetchCuration(curId));
      dispatch(fetchChips(curId));
    }
  }, [curId, dispatch]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };
  useEffect(() => {
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const isSaved = curation.saved_by?.includes(myData._id);

  const handleSaved = () => {
    if (isLoggedIn) {
      //   const updatedSavedBy = isSaved
      //   ? curation.saved_by.filter(id => id !== myData._id)
      //   : [...curation.saved_by, myData._id];
      // dispatch(setCurationField({ field: 'saved_by', value: updatedSavedBy }));
      dispatch(saveCuration(curId));
      // .unwrap()
      // .catch((err) => {
      //   dispatch(setCurationField({ field: 'saved_by', value: curation.saved_by }));
      //   console.error('Error saving curation:', err);
      // });

      setSavedMessageVisible(true);
      if (isSaved) {
        setSavedMessage("Unsaved!");
      } else {
        setSavedMessage("Saved!");
      }
      setTimeout(() => {
        setSavedMessageVisible(false);
      }, 1000);
      dispatch(setCurationEngagement(curation._id));
    } else {
      openLoginModal();
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleDeleteModal = () => {
    if (isLoggedIn) {
      setIsDropdownOpen(false);
      dispatch(setCurationIdToDelete(curId));
      dispatch(setProfileCategoryToDelete(curation.profile_category));
      handleOpenModal("modalCurationDeleteOpen");
    } else {
      openLoginModal();
    }
  };

  const handleEditModal = () => {
    if (isLoggedIn) {
      dispatch(setCurationField({ field: "type", value: "edit" }));
      dispatch(setCurationField({ field: "name", value: curation.name }));
      dispatch(
        setCurationField({ field: "visibility", value: curation.visibility })
      );
      dispatch(setCurationField({ field: "image", value: curation.image }));
      dispatch(
        setCurationField({ field: "description", value: curation.description })
      );
      dispatch(
        setCurationField({ field: "category", value: curation.category })
      );
      dispatch(setCurationField({ field: "_id", value: curation._id }));
      setIsDropdownOpen(false);
      handleOpenModal("modalCurationOpen");
    } else {
      openLoginModal();
    }
  };

  const handleNavigationHome = () => {
    navigate("/");
  };

  const handleEmptyCuration = () => {
    if (myData._id === curation.user._id) {
      dispatch(setChipField({ field: "curation", value: curation._id }));
      handleOpenModal("modalChipOpen");
    } else {
      handleNavigationHome();
    }
  };

  const isEditable = curation?.visibility === "anyone" || isOwner;

  return (
    <div className="flex flex-col px-4 pt-4 bg-theme-chatDivider w-full h-full overflow-y-auto custom-scrollbar">
      {/* <div className="flex flex-row justify-between items-center mt-3 relative"> */}
      <div className="flex flex-row items-center space-x-3 w-full">
        <p className="sm:text-3xl  text-xl text-theme-secondaryText font-normal font-familjen-grotesk">
          {curation.name}
        </p>
        {/* {!owner && (
          <div className="relative">
            {" "}
            {isSavedMessageVisible && (
              <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg text-white text-xs rounded-lg px-2 py-1">
                {savedMessage}
              </div>
            )}
            <div
              className={`${
                isSaved ? "bg-iconColor" : "bg-primary"
              } px-2 py-0.5 rounded-xl ml-2 cursor-pointer`}
              onClick={handleSaved}
            >
              <img
                src={isSaved ? SavedIcon : SaveIcon}
                alt="save"
                className="h-5 w-5"
              />
            </div>
          </div>
        )} */}
        {isEditable && (
          <img
            src={ChannelImages.AddIcon.default}
            alt="add-icon"
            className="dark:block hidden cursor-pointer"
            onClick={handleChipOpen}
          />
        )}
        {isEditable && (
          <img
            src={ChannelImages.AddIconLight.default}
            alt="add-icon"
            className="dark:hidden cursor-pointer"
            onClick={handleChipOpen}
          />
        )}
        <img
          src={ChannelImages.ShareIcon.default}
          alt="save"
          className="dark:block hidden cursor-pointer "
          onClick={handleShareOpen}
        />
        <img
          src={ChannelImages.ShareIconLight.default}
          alt="save"
          className="dark:hidden cursor-pointer "
          onClick={handleShareOpen}
        />
        <div className="relative flex pl-2  ">
          {isOwner && (
            <div
              className="flex flex-col space-y-1 cursor-pointer"
              onClick={toggleDropdown}
            >
              <div className="w-1 h-1 bg-primary rounded-full"></div>
              <div className="w-1 h-1 bg-primary rounded-full"></div>
              <div className="w-1 h-1 bg-primary rounded-full"></div>
            </div>
          )}
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-28 rounded-md shadow-lg border border-dividerLine bg-chipBackground ring-1 ring-black ring-opacity-5 z-50"
            >
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <div
                  className="flex flex-row px-4 items-center"
                  onClick={handleEditModal}
                >
                  <img
                    src={ChannelImages.Edit.default}
                    alt="edit"
                    className="dark:block hidden w-4 h-4"
                  />
                  <img
                    src={ChannelImages.EditLight.default}
                    alt="edit"
                    className="dark:hidden w-4 h-4"
                  />
                  <p
                    className="block ml-1 py-2 text-sm text-textFieldColor cursor-pointer"
                    role="menuitem"
                  >
                    Edit
                  </p>
                </div>
                <div
                  className="flex flex-row px-4 items-center"
                  onClick={handleDeleteModal}
                >
                  <img
                    src={ChannelImages.Delete.default}
                    alt="delete"
                    className="dark:block hidden w-4 h-4"
                  />
                  <img
                    src={ChannelImages.DeleteLight.default}
                    alt="delete"
                    className="dark:hidden w-4 h-4"
                  />
                  <p
                    className="block  ml-1 py-2 text-sm text-deleteIcon cursor-pointer"
                    role="menuitem"
                  >
                    Delete
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* </div> */}

        {/* {!owner && <div>
                  <button className=" px-4 py-2 rounded-lg text-lightText text-xs" onClick={toggleSortPanel}>Sort</button>
                  <button className="ml-2 mr-2 py-2 rounded-lg text-lightText text-xs" onClick={toggleFilterPanel}>Filter</button>
                </div>} */}
      </div>
      {curation.description && (
        <p className="text-theme-primaryText text-sm mt-2 mb-1 w-full lg:w-3/4 font-normal font-inter">
          {curation.description}
        </p>
      )}
      {curation?.user?.username && (
        <a
          href={`https://${domainUrl}/account/${curation.user.username}/profile`}
          className="text-theme-secondaryText font-normal text-sm  underline mb-8 w-max"
          style={{ textUnderlineOffset: "2px" }}
        >
          {curation.user.name}
        </a>
      )}
      {chipstatus === "loading" ? (
        <ProfileItemsSkeleton />
      ) : chips.length > 0 ? (
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 300: 1, 500: 2, 800: 3, 1060: 4 }}
        >
          <Masonry gutter="18px">
            {chips?.map((item, index) =>
              myData._id === item.user._id ? (
                <ProfileChips key={item._id} item={item} />
              ) : (
                <Chips key={item._id} item={item} />
              )
            )}
          </Masonry>
        </ResponsiveMasonry>
      ) : (
        <div className="flex items-center justify-center mt-20">
          <div
            className="container rounded-md bg pl-4 pr-4 pt-3 pb-3 flex flex-col min-w-fit max-w-72 ml-auto mb-36"
            style={{ marginRight: "auto" }}
          >
            <h3 className=" text-textColor text-sm">
              (. ❛ ᴗ ❛.) Seems like this curation is empty
            </h3>
            <div className="mt-2 rounded-md bg-chipBackground pl-5 pt-4 pb-4 cursor-pointer">
              <p
                className=" text-textColor text-xs font-light"
                onClick={handleEmptyCuration}
              >
                {myData?._id === curation?.user?._id ||
                curation.visibility === "anyone"
                  ? "Add a Chip ->"
                  : `Explore more ->`}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurationView;
