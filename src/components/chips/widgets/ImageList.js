// components/ImageList.jsx
import React, { useRef, useState } from "react";
import { IoExpand } from "react-icons/io5";
import playIcon from "../../../assets/images/play_button.svg";
import ImageFullscreenModal from "./FullScreenModal";

const ImageList = ({ imageCards, isAllExclusive }) => {
  const isSingleImage = imageCards.length === 1;
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const [activeVideoId, setActiveVideoId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalStartIndex, setModalStartIndex] = useState(0);

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

  const openFullScreen = (images, index) => {
    const filtered = images.filter((card) => card.type === "image");
    if (filtered.length === 0) return;
    setModalImages(filtered);
    setModalStartIndex(index);
    setModalOpen(true);
  };

  return (
    <>
      <div
        ref={containerRef}
        className={`flex overflow-x-auto space-x-4 no-scrollbar ${
          isSingleImage ? "justify-center mr-4" : "cursor-grab"
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
                            className="w-10 h-10"
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
                      onClick={() => {
                        const images = imageCards.filter((c) => c.type === "image");
                        const startIndex = images.findIndex((img) => img.id === card.id);
                        openFullScreen(images, startIndex);
                      }}
                    >
                      <IoExpand />
                    </button>
                  </div>
                )}
              </div>
            )
        )}
      </div>

      <ImageFullscreenModal
        images={modalImages}
        isOpen={modalOpen}
        startIndex={modalStartIndex}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default ImageList;
