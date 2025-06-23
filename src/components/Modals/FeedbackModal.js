import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../assets/icons/Close.svg";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/slices/modalSlice";
import AddImage from "../../assets/icons/add_image.svg";
import AddImageLight from "../../assets/lightIcons/upload_light.svg";
import { postRequestUnAuthenticatedWithFile } from "./../../services/rest";

const FeedbackModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modals.modalFeedbackOpen);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileObjects, setFileObjects] = useState([]);
  const [files, setFiles] = useState([]);
  const myData = useSelector((state) => state.myData);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  if (!isOpen) return null;

  const handleClose = () => {
    clearData();

    dispatch(closeModal("modalFeedbackOpen"));
  };

  const handleMediaUpload = (event) => {
    const selectedFiles = Array.from(event.target.files);
    const maxFileSize = 6 * 1024 * 1024; // 16 MB

    if (selectedFiles.length + fileObjects.length > 5) {
      alert("You can upload up to 5 files only.");
      return;
    }

    const validFiles = [];
    const validUrls = [];

    for (let file of selectedFiles) {
      if (file.size > maxFileSize) {
        alert(
          `The file "${file.name}" exceeds the 6 MB size limit and will not be uploaded.`
        );
        continue;
      }
      validFiles.push(file);
      validUrls.push(URL.createObjectURL(file));
    }

    setFileObjects((prev) => [...prev, ...validFiles]);
    setFiles((prev) => [...prev, ...validUrls]);
  };

  const clearData = () => {
    setFileObjects([]);
    setFiles([]);
    setDescription("");
  };

  const onRemoveImage = (index) => {
    setFileObjects((prev) => {
      const newFileObjects = [...prev];
      newFileObjects.splice(index, 1);
      return newFileObjects;
    });

    setFiles((prev) => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index]);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const handleSubmit = async () => {
    if (isEmptyData) {
      return;
    }
    setLoading(true);
    const formDataToSend = new FormData();
    formDataToSend.append("text", description);
    if (isLoggedIn) {
      formDataToSend.append("email", myData.email);
    }
    fileObjects.forEach((file, index) => {
      formDataToSend.append("files", file);
    });
    console.log(fileObjects);

    const response = await postRequestUnAuthenticatedWithFile(
      "/post/query",
      formDataToSend
    );
    console.log(response);
    if (response.success) {
      setLoading(false);
      handleClose();
    } else {
      setLoading(false);
      alert(response.message);
    }
  };

  const isEmptyData = description.trim() === "" && files.length === 0;
  const postButtonClass = isEmptyData
    ? "text-theme-buttonDisableText text-theme-opacity-40 bg-theme-buttonDisable bg-theme-opacity-10"
    : "bg-theme-secondaryText text-theme-primaryBackground";

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-40" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content className="bg-theme-tertiaryBackground rounded-xl overflow-hidden shadow-xl transform transition-all w-3/4 md:w-1/2 lg:w-1/3">
            <Dialog.Title className="sr-only">Feedback</Dialog.Title>
            <div className="flex flex-col p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-theme-secondaryText text-lg font-normal font-inter">
                  Feedback
                </h2>
                <img
                  src={Close}
                  alt="Close"
                  className="w-4 h-4 cursor-pointer"
                  onClick={handleClose}
                />
              </div>
              <div className="mt-2 text-theme-secondaryText font-normal text-sm font-inter">
                We’d love to hear from you!
              </div>
              <div className="mt-1 text-theme-description font-normal text-sm font-inter">
                Share your thoughts, ideas, or issues to help us improve
                Channels.
              </div>
              <div className="relative mt-6">
                <label
                  htmlFor="description"
                  className="absolute left-4 -top-2 text-xs font-light font-inter
               bg-theme-tertiaryBackground text-theme-primaryText px-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  name="description"
                  className="w-full text-sm pt-4 font-inter pb-4 pl-4 pr-3 rounded-lg 
                border font-light border-theme-chatDivider bg-transparent text-theme-secondaryText focus:border-primary focus:ring-0 focus:outline-none"
                  rows="5"
                  placeholder=""
                />
              </div>
              {files.length > 0 && (
                <div className="flex flex-row space-x-3 overflow-x-auto custom-scrollbar w-full mt-4">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="relative min-w-32 bg-gray-200 bg-theme-dark rounded-xl shadow-md overflow-hidden flex-shrink-0"
                    >
                      <img
                        src={file}
                        alt={`carousel-${index}`}
                        className="w-full h-32 object-cover rounded-t-xl"
                      />
                      <button
                        type="button"
                        className="absolute right-2 top-2 bg-black bg-opacity-50 rounded-full w-6 h-6 flex justify-center items-center"
                        onClick={() => onRemoveImage(index)}
                        aria-label="Remove Image"
                      >
                        <img src={Close} alt="Remove" className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex flex-row mt-4 justify-start items-center ml-1 relative">
                <img
                  src={AddImage}
                  alt="add-image"
                  className="dark:block hidden w-4 h-4 mr-2"
                />
                <img
                  src={AddImageLight}
                  alt="add-image"
                  className="dark:hidden w-4 h-4 mr-2"
                />
                <label className="flex items-center text-theme-secondaryText text-sm font-light cursor-pointer">
                  Add Image
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleMediaUpload}
                  />
                </label>
              </div>
              <button
                className={`w-full py-2.5 mt-5 rounded-lg ${postButtonClass} font-normal`}
                onClick={handleSubmit}
                disabled={isEmptyData}
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default FeedbackModal;
