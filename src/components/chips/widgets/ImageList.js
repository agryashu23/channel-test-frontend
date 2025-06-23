import React, { useRef, useState } from "react";
import { FaPlay, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/Close.svg";
import { IoExpand } from "react-icons/io5";
import playIcon from "../../../assets/images/play_button.svg";

const ImageList = ({ imageCards, isAllExclusive }) => {
  const isSingleImage = imageCards.length === 1;
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [fullScreenImages, setFullScreenImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openFullScreen = (images, startIndex) => {
    const filteredImages = images.filter((card) => card.type === "image");

    // Prevent opening modal if there are no images
    if (filteredImages.length === 0) {
      return;
    }

    setFullScreenImages(filteredImages);
    setCurrentImageIndex(startIndex);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleMouseDown = (e) => {
    isDragging.current = true;
    startX.current = e.pageX - containerRef.current.offsetLeft;
    scrollLeft.current = containerRef.current.scrollLeft;
    containerRef.current.classList.add("dragging");
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    containerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
    containerRef.current.classList.remove("dragging");
  };

  const handleVideoClick = (cardId) => {
    setActiveVideoId(cardId);
  };

  const handleNextImage = () => {
    if (currentImageIndex < fullScreenImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className={`flex overflow-x-auto space-x-4  no-scrollbar ${
          isSingleImage ? "justify-center mr-4" : " cursor-grab"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
      >
        {imageCards.map(
          (card, index) =>
            (!card.exclusive || isAllExclusive) && (
              <div
                key={card.id}
                className={`${
                  isSingleImage ? "w-full" : "min-w-[210px] max-w-full"
                } bg rounded-xl shadow-md overflow-hidden object-contain`}
              >
                {card.type === "video" ? (
                  <div className="relative w-full h-52">
                    {activeVideoId === card.id ? (
                      <video
                        controls
                        className="w-full h-52 object-cover rounded-t-xl"
                      >
                        <source src={card.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="w-full h-full relative">
                        <img
                          src={card.thumbnail}
                          alt="video-thumbnail"
                          className="w-full h-52 object-cover rounded-t-xl"
                          loading="lazy"
                        />
                        <button
                          className="absolute inset-0 flex items-center justify-center text-theme-secondaryText text-2xl bg-black bg-opacity-50 rounded-t-xl"
                          onClick={() => handleVideoClick(card.id)}
                        >
                          <img
                            src={playIcon}
                            alt="Play"
                            className=" w-10 h-10 "
                          />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={card.url}
                      alt="carousel"
                      className="w-full h-52 object-cover rounded-t-xl"
                      loading="lazy"
                    />
                    <button
                      className="absolute top-1 right-1 text-theme-secondaryText text-xl bg-black bg-opacity-50 p-2 rounded-full"
                      onClick={() =>
                        openFullScreen(
                          imageCards.filter((card) => card.type === "image"),
                          imageCards
                            .filter((card) => card.type === "image")
                            .findIndex((img) => img.id === card.id)
                        )
                      }
                    >
                      <IoExpand />
                    </button>
                  </div>
                )}
              </div>
            )
        )}
      </div>

      <Dialog.Root open={isModalOpen} onOpenChange={closeModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-40" />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <Dialog.Content className="relative bg-chipBackground rounded-xl  transform transition-all w-auto h-auto max-w-[80vw] max-h-[80vh] border-none shadow-none">
              <Dialog.Title></Dialog.Title>
              <div className="relative flex items-center justify-center">
                {fullScreenImages.length > 0 && (
                  <img
                    src={fullScreenImages[currentImageIndex]?.url}
                    alt="Full screen"
                    className="object-contain max-w-[80vw] max-h-[80vh]"
                  />
                )}
                {fullScreenImages.length > 1 && (
                  <>
                    {currentImageIndex > 0 && (
                      <button
                        className="absolute left-3 text-theme-secondaryText text-2xl bg-black bg-opacity-50 p-2 rounded-full"
                        onClick={handlePreviousImage}
                      >
                        <FaArrowLeft />
                      </button>
                    )}
                    {currentImageIndex < fullScreenImages.length - 1 && (
                      <button
                        className="absolute right-3 text-theme-secondaryText text-2xl bg-black bg-opacity-50 p-2 rounded-full"
                        onClick={handleNextImage}
                      >
                        <FaArrowRight />
                      </button>
                    )}
                  </>
                )}
                <div
                  className="absolute top-1 right-1 p-2 bg rounded-full  text-2xl text-theme-secondaryText cursor-pointer"
                  onClick={closeModal}
                >
                  <img
                    src={Close}
                    alt="Close"
                    className="w-6 h-6 cursor-pointer"
                  />
                </div>
              </div>
            </Dialog.Content>
          </div>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};

export default ImageList;
