import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/close.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faCheck } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addImageCard } from "../../../redux/slices/imageCardsSlice";
import { v4 as uuidv4 } from "uuid";
import { hostUrl } from "./../../../utils/globals";

const ProfileUnsplashModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const handleClose = () => {
    onClose();
    setSearchQuery("");
    setImages([]);
    setSelectedImages([]);
  };
  const handleOverlayClick = (e) => {
    e.stopPropagation();
    handleClose();
  };

  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const imageCard = useSelector((state) => state.imageCards);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${hostUrl}/api/photos/search?keyword=${encodeURIComponent(
          searchQuery
        )}&limit=8`
      );
      const data = response.data;
      if (data.success) {
        setImages(
          data.data.slice(0, 8).map((image) => ({
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
    setSelectedImages((prevSelectedImages) => {
      if (prevSelectedImages.includes(url)) {
        return prevSelectedImages.filter((imageUrl) => imageUrl !== url);
      } else if (prevSelectedImages.length + imageCard.length < 5) {
        return [...prevSelectedImages, url];
      } else {
        alert("You can select up to 5 images only.");
        return prevSelectedImages;
      }
    });
  };

  const handleConfirmSelection = () => {
    selectedImages.forEach((url) => {
      dispatch(
        addImageCard({
          id: uuidv4(),
          url: url,
          source: "unsplash",
        })
      );
    });
    handleClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-black bg-opacity-70 z-40"
          onClick={handleOverlayClick}
        />
        <div
          id="unsplash-modal"
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <Dialog.Content className="bg-chipBackground rounded-xl overflow-hidden shadow-xl transform transition-all w-3/4 h-3/4 lg:w-1/4 sm:w-1/2 pt-5 pl-5 flex flex-col">
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
                  className="pl-10 pr-3 py-3 rounded-xl bg text-theme-secondaryText placeholder-textFieldColor placeholder:font-light focus:outline-none w-full font-inter font-normal"
                  style={{ fontSize: "15px" }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                className="ml-3 rounded-lg bg-primary text-buttonText py-2 text-sm mr-2 font-light px-2"
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
                      {selectedImages.includes(image.url) && (
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
            {selectedImages.length > 0 && (
              <div className="sticky bottom-0 left-0 w-full px-5 py-2 bg-chipBackground">
                <button
                  className="w-full py-2.5 rounded-full text-primary bg-chipBackground border border-primary font-normal"
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

export default ProfileUnsplashModal;
