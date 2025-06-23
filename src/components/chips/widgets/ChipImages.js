import React, { useRef } from "react";
import Close from "../../../assets/icons/Close.svg";

const ChipImages = ({ imageCards, onRemoveImage }) => {
  const isSingleImage = imageCards.length === 1;
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

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

  return (
    <div
      ref={containerRef}
      className={`flex overflow-x-auto space-x-4 mt-3  no-scrollbar max-w-full ${
        isSingleImage ? "justify-center mr-4" : "cursor-grabbing"
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
    >
      {imageCards
        .filter((card) => card.url)
        .map((card, index) => (
          <div
            key={index}
            className={`relative ${
              isSingleImage ? "w-full" : "min-w-[180px] max-w-full"
            } bg rounded-xl shadow-md overflow-hidden `}
          >
            {card.type === "video" ? (
              <video controls className="w-full h-44 object-cover rounded-t-xl">
                <source src={card.url} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={card.url}
                alt={`carousel-${index}`}
                className="w-full h-44 object-cover rounded-t-xl"
              />
            )}
            <div className="absolute right-1 top-1 bg-[#edecea] bg-opacity-70 rounded-full w-5 h-5 flex justify-center items-center p-1 shadow-lg">
              <img
                src={Close}
                alt="close"
                className="w-3 h-3 cursor-pointer"
                onClick={() => onRemoveImage(index, card.id)}
              />
            </div>
          </div>
        ))}
    </div>
  );
};

export default ChipImages;
