import { React, useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/Close.svg";
import AddIcon from "../../../assets/icons/addIcon.svg";
import AddIconLight from "../../../assets/lightIcons/add_light.svg";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../../../redux/slices/modalSlice";
import {
  pushChipToCuration,
  clearItems,
  updateItemField,
  fetchCurations,
} from "../../../redux/slices/pushItemsSlice";
import useModal from "./../../hooks/ModalHook";

const PushtoCurationModal = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const isOpen = useSelector((state) => state.modals.modalPushtoCurationOpen);
  const dispatch = useDispatch();
  const pushItems = useSelector((state) => state.pushItems);

  const selectedCurationId = useSelector(
    (state) => state.pushItems.selectedCurationId
  );
  const { handleOpenModal } = useModal();
  const { curations } = useSelector((state) => state.pushItems);

  const handleClose = () => {
    dispatch(clearItems());
    handleClear();
    dispatch(closeModal("modalPushtoCurationOpen"));
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCurations());
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleChange = (id) => {
    dispatch(updateItemField({ field: "selectedCurationId", value: id }));
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  const handleCurationOpenModal = () => {
    handleOpenModal("modalCurationOpen");
  };

  const handlePushtoCuration = () => {
    const formDataToSend = new FormData();
    formDataToSend.append("id", pushItems.id);
    formDataToSend.append("curationId", selectedCurationId);
    dispatch(pushChipToCuration(formDataToSend))
      .unwrap()
      .then(() => {
        handleClose();
      })
      .catch((error) => {
        alert(error);
      });
  };

  const filteredCurations = curations.filter((curation) =>
    curation.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-50" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content className="bg-theme-tertiaryBackground rounded-xl overflow-hidden shadow-xl transform transition-all min-h-[20%] max-h-[80%]  w-[90%] xs:w-3/4 sm:w-1/2 md:w-2/5 lg:w-[35%] xl:w-[30%]">
            <Dialog.Title />
            <div className="flex flex-col p-5 h-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-theme-secondaryText text-lg font-normal font-inter">
                  Push Chip
                </h2>
                <img
                  src={Close}
                  alt="Close"
                  className="w-4 h-4 cursor-pointer"
                  onClick={handleClose}
                />
              </div>
              <div
                className="flex flex-row mt-2 cursor-pointer w-max"
                onClick={handleCurationOpenModal}
              >
                <div className="bg-theme-primaryBackground rounded-full p-1">
                  <img
                    src={AddIcon}
                    alt="add"
                    className="dark:block hidden w-4 h-4"
                  />
                  <img
                    src={AddIconLight}
                    alt="add"
                    className="dark:hidden w-4 h-4"
                  />
                </div>
                <p className="text-theme-secondaryText ml-2 tracking-wide text-sm  font-light font-inter">
                  Create a new curation
                </p>
              </div>
              <h2 className="mt-5 text-theme-primaryText text-sm font-light font-inter mb-1">
                Choose Curation
              </h2>
              <div className="mt-1.5 relative w-full">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute left-3 top-[42%] transform -translate-y-1/2 text-theme-primaryText w-3.5 h-3.5"
                />
                {searchQuery && (
                  <img
                    src={Close}
                    alt="Close"
                    className="absolute top-1/2 right-2 cursor-pointer transform -translate-y-1/2 w-5 h-5"
                    onClick={handleClear}
                  />
                )}
                <input
                  type="text"
                  placeholder="Search"
                  className={` pl-10 pr-3 py-3 mb-2 border border-theme-chatDivider bg-transparent text-theme-secondaryText 
                    placeholder:text-theme-primaryText ${"rounded-lg"}
                                placeholder:text-left focus:outline-none w-full font-inter font-normal flex `}
                  style={{ fontSize: "15px" }}
                  value={searchQuery}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mt-4 overflow-y-auto custom-scrollbar max-h-60">
                {filteredCurations?.map(
                  (curation, index) =>
                    curation._id !== pushItems.existingCurationId && (
                      <div key={index} className="flex flex-col mb-4">
                        <div
                          className={`flex flex-row items-center cursor-pointer ${
                            selectedCurationId === curation._id
                              ? "border border-primary rounded-lg p-2"
                              : "pl-2"
                          }`}
                          onClick={() => handleChange(curation._id)}
                        >
                          <img
                            src={curation.image}
                            alt=""
                            className="w-14 h-10 rounded-lg"
                          />
                          <p className="ml-3 text-theme-secondaryText text-sm font-normal ">
                            {curation.name}
                          </p>
                        </div>
                        {selectedCurationId !== curation._id && (
                          <div className="border-t border-theme-chatDivider w-full mt-2"></div>
                        )}
                      </div>
                    )
                )}
              </div>

              {selectedCurationId !== "" && (
                <button
                  className={`w-full mt-3 py-2.5 font-normal text-sm rounded-lg bg-theme-secondaryText text-theme-primaryBackground`}
                  onClick={handlePushtoCuration}
                >
                  Save to Curation
                </button>
              )}
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PushtoCurationModal;
