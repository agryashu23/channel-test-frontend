import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/Close.svg";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/slices/modalSlice";
import { Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { pdfjs } from "react-pdf";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

const DocumentModal = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.modals.modalDocumentOpen);
  const document = useSelector((state) => state.modals.document);
  const fileUrl = document?.url;
  const fileName = document?.name;
  const filePages = document?.pages;
  const [numPages, setNumPages] = useState(filePages);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const handleClose = () => {
    dispatch(closeModal("modalDocumentOpen"));
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsLoading(false);
    setLoadError(false);
  };
  // const onDocumentLoadError = () => {
  //   setIsLoading(false);
  //   setLoadError(true);
  // };
  const onDocumentLoadError = () => {
    setIsLoading(false);
    setLoadError(true);
    // Auto-download and close modal
    window.open(fileUrl, "_blank");
    dispatch(closeModal("modalDocumentOpen"));
  };

  const retryLoad = () => {
    setIsLoading(true);
    setLoadError(false);
    setPageNumber(1);
  };

  if (!isOpen || !fileUrl) return null;
  const renderDocument = () => {
    const fileType = fileUrl?.split(".").pop().toLowerCase();

    switch (fileType) {
      case "pdf":
        return (
          <div className="document-viewer">
            {isLoading && !loadError && (
              <p className="text-theme-secondaryText mt-4 ml-2">Loading....</p>
            )}
            {!loadError && (
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
              >
                <Page pageNumber={pageNumber} />
              </Document>
            )}

            {numPages > 1 && !isLoading && !loadError && (
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                  disabled={pageNumber <= 1}
                  className="p-2 text-buttonText text-sm bg-primary rounded"
                >
                  Previous
                </button>
                <p className="text-theme-secondaryText font-normal font-inter">
                  Page {pageNumber} of {numPages}
                </p>
                <button
                  onClick={() =>
                    setPageNumber((prev) => Math.min(prev + 1, numPages))
                  }
                  disabled={pageNumber >= numPages}
                  className="p-2 text-buttonText text-sm bg-primary rounded-md"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        );
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return (
          <div className="image-viewer">
            <img src={fileUrl} alt={fileName} className="w-full h-auto" />
          </div>
        );
      case "docx":
      case "xlsx":
      case "pptx":
        return (
          <button
            className={`w-full py-2.5 mt-5 rounded-full text-buttonText bg-primary font-normal`}
            onClick={() => window.open(fileUrl, "_blank")}
          >
            Download File
          </button>
        );
      default:
        return (
          <p className="text-lightText mt-2 text-sm">
            Cannot preview this file type.
          </p>
        );
    }
  };

  const downloadFile = () => {
    window.open(fileUrl, "_blank");
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-40" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content className="bg-theme-secondaryBackground rounded-xl overflow-hidden overflow-x-auto overflow-y-auto custom-scrollbar shadow-xl transform h-3/4 transition-all w-[90%] md:w-max">
            <Dialog.Title></Dialog.Title>
            <div className="flex flex-col p-5">
              <div className="flex justify-between items-center mb-4">
                <div className="flex flex-row justify-start items-center w-3/4">
                  <h2 className="text-theme-secondaryText text-sm font-normal truncate overflow-hidden text-ellipsis font-inter ">
                    {fileName}
                  </h2>
                  <FontAwesomeIcon
                    icon={faDownload}
                    onClick={downloadFile}
                    className="cursor-pointer text-theme-secondaryText ml-3"
                  />
                </div>

                <img
                  src={Close}
                  alt="Close"
                  className="w-5 h-5 cursor-pointer"
                  onClick={handleClose}
                />
              </div>
              {renderDocument()}
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DocumentModal;
