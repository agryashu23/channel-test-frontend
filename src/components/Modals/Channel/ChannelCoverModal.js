import React, { useState, useRef } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import CloseIcon from "../../../assets/icons/Close.svg";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/slices/modalSlice";
import Compressor from "compressorjs";

const ChannelCoverModal = () => {
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modals.modalChannelCoverOpen);
  const [imageRef, setImageRef] = useState(null);
  const [croppedImageUrl, setCroppedImageUrl] = useState(null);
  const [src, setSrc] = useState(null);
  const [crop, setCrop] = useState({
    unit: "%",
    width: 50,
    aspect: 16 / 9,
    x: 25,
    y: 25,
  });

  const handleClose = () => {
    dispatch(closeModal("modalChannelCoverOpen"));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        alert(
          `The file "${file.name}" exceeds the 8  MB size limit and will not be uploaded.`
        );
        return;
      }
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        setSrc(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const onImageLoaded = (image) => {
    setImageRef(image);
  };

  const onCropComplete = (crop) => {
    makeClientCrop(crop);
  };

  const makeClientCrop = async (crop) => {
    if (imageRef && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(
        imageRef,
        crop,
        "newFile.jpeg"
      );
      setCroppedImageUrl(croppedImageUrl);
    }
  };

  const getCroppedImg = (image, crop, fileName) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }
        blob.name = fileName;
        const fileUrl = window.URL.createObjectURL(blob);
        resolve(fileUrl);
      }, "image/jpeg");
    });
  };

  if (!isOpen) return null;

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-40" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content className="bg-theme-tertiaryBackground rounded-xl overflow-hidden shadow-xl transform transition-all w-3/4 md:w-1/2 lg:w-1/3">
            <Dialog.Title></Dialog.Title>
            <div className="flex flex-col p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-theme-secondaryText text-lg font-normal">
                  Edit Cover
                </h2>
                <img
                  src={CloseIcon}
                  alt="Close"
                  className="w-4 h-4 cursor-pointer"
                  onClick={handleClose}
                />
              </div>
              <div className="relative mx-auto">
                <button
                  className="mx-auto px-3 py-2 text-sm bg-theme-secondaryText text-theme-primaryBackground rounded cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                >
                  Upload Image
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </div>
              {/* {src && <img src={src} alt="imagee" className="h-20 w-24" />} */}

              {src && (
                <ReactCrop
                  src={src}
                  crop={crop}
                  onImageLoaded={onImageLoaded}
                  onComplete={onCropComplete}
                  onChange={(newCrop) => setCrop(newCrop)}
                />
              )}
              {croppedImageUrl && (
                <img
                  src={croppedImageUrl}
                  alt="Cropped"
                  style={{ maxWidth: "100%" }}
                />
              )}
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ChannelCoverModal;
