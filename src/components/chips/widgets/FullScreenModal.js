// components/ImageFullscreenModal.jsx
import React, { useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Close from "../../../assets/icons/Close.svg";

const ImageFullscreenModal = ({ images, isOpen, startIndex = 0, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(startIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(startIndex);
    }
  }, [startIndex, isOpen]);

  const handleNext = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-40" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content className="relative bg-chipBackground rounded-xl transform transition-all w-auto h-auto max-w-[80vw] max-h-[80vh] border-none shadow-none">
            <Dialog.Title className="sr-only"></Dialog.Title>
            <div className="relative flex items-center justify-center">
              {images.length > 0 && (
                <img
                  src={images[currentImageIndex]?.url}
                  alt="Full screen"
                  className="object-contain max-w-[80vw] max-h-[80vh]"
                />
              )}

              {images.length > 1 && currentImageIndex > 0 && (
                <button
                  className="absolute left-3 text-theme-secondaryText text-2xl bg-black bg-opacity-50 p-2 rounded-full"
                  onClick={handlePrevious}
                >
                  <FaArrowLeft />
                </button>
              )}

              {images.length > 1 &&
                currentImageIndex < images.length - 1 && (
                  <button
                    className="absolute right-3 text-theme-secondaryText text-2xl bg-black bg-opacity-50 p-2 rounded-full"
                    onClick={handleNext}
                  >
                    <FaArrowRight />
                  </button>
                )}

              <div
                className="absolute top-1 right-1 p-2 bg rounded-full text-2xl text-theme-secondaryText cursor-pointer"
                onClick={onClose}
              >
                <img src={Close} alt="Close" className="w-6 h-6 cursor-pointer" />
              </div>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ImageFullscreenModal;
