import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../assets/icons/Close.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCheck } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUnsplashImage } from "../../redux/slices/curationSlice";
import { closeModal } from "../../redux/slices/modalSlice";
import { hostUrl } from "./../../utils/globals";
import { postRequestUnAuthenticated } from "./../../services/rest";

const Unsplash = () => {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeModal("modalCurationUnsplashOpen"));
    setSelectedImage(null);
    setImages([]);
    setSearchQuery("");
  };
  const isOpen = useSelector((state) => state.modals.modalCurationUnsplashOpen);

  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOverlayClick = (e) => {
    e.stopPropagation();
    handleClose();
  };

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await postRequestUnAuthenticated(
        `/channel/unsplash/search?keyword=${encodeURIComponent(
          searchQuery
        )}&limit=8`
      );
      if (response.success) {
        setImages(
          response.data.slice(0, 8).map((image) => ({
            ...image,
            thumbnailUrl: image.url + "?w=200&h=200&fit=crop",
          }))
        );
      } else {
        console.log("No success or no data");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = (e) => {
    e.preventDefault();
    fetchImages();
  };

  const toggleImageSelection = (url) => {
    const newSelectedImage = selectedImage === url ? null : url;
    setSelectedImage(newSelectedImage);
  };

  const handleConfirmSelection = () => {
    if (selectedImage) {
      dispatch(setSelectedUnsplashImage(selectedImage));
      handleClose();
      setSelectedImage(null);
      setImages([]);
      setSearchQuery("");
    }
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-black bg-opacity-70 z-50"
          onClick={handleOverlayClick}
        />
        <div className="fixed z-50 inset-0 flex items-center justify-center">
          <Dialog.Content
            className="bg-theme-tertiaryBackground rounded-xl overflow-hidden shadow-xl transform transition-all w-[85%] h-3/4 lg:w-2/5 sm:w-1/2 pt-5 pl-5 pr-3 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <Dialog.Title />

            <div className="flex justify-between items-center mb-4 pr-3">
              <h2 className="text-theme-secondaryText text-lg font-normal fonr-inter">
                Unsplash
              </h2>
              <img
                src={Close}
                alt="Close"
                className="w-6 h-6 cursor-pointer"
                onClick={handleClose}
              />
            </div>
            <div className="flex flex-row items-center mb-4">
              <div className="relative w-full">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute top-1/2 ml-3 transform -translate-y-1/2 text-theme-secondaryText w-4 h-4"
                />
                <input
                  type="text"
                  placeholder="Search"
                  className="pl-10 pr-3 py-3 rounded-xl bg-transparent border text-theme-secondaryText  border-theme-chatDivider 
                  placeholder:text-theme-primaryText placeholder:font-light focus:outline-none w-full font-inter font-normal"
                  style={{ fontSize: "15px" }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                className={` py-2 px-2 ml-2 mr-1 rounded-lg ${
                  searchQuery !== ""
                    ? "text-theme-primaryBackground bg-theme-secondaryText"
                    : "text-theme-buttonDisableText text-theme-opacity-40 bg-theme-buttonDisable bg-theme-opacity-10"
                }  font-normal`}
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="text-center text-theme-secondaryText mt-5">
                  Loading...
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 mt-4 mr-3">
                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="relative cursor-pointer"
                      onClick={() => toggleImageSelection(image.url)}
                    >
                      <img
                        src={image.url}
                        alt={image.name}
                        className="w-full h-44 object-cover rounded-lg"
                      />
                      <p className="text-theme-secondaryText text-xs mt-1">
                        {image.name}
                      </p>
                      {selectedImage === image.url && (
                        <div className="absolute top-0 right-0 rounded-full border items-center border-white bg-selectedColor w-5 h-5">
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="absolute top-0 right-0 w-4 h-4"
                            style={{ color: "white" }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {selectedImage && (
              <div className="sticky bottom-0 left-0 w-full px-5 py-2 bg-chipBackground">
                <button
                  className="w-full py-2.5 rounded-full text-theme-secondaryText bg-transparent 
                  border border-theme-secondaryText font-normal"
                  onClick={handleConfirmSelection}
                >
                  Confirm selection
                </button>
              </div>
            )}
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Unsplash;
