import React from "react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import documentImage from "../../../assets/images/Attachment.svg";
import { pdfjs } from "react-pdf";
import useModal from "./../../hooks/ModalHook";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

const DocumentPreview = ({ document }) => {
  const { handleOpenModal } = useModal();

  const handleClick = () => {
    handleOpenModal("modalDocumentOpen", document);
  };

  return (
    <div
      className=" w-full rounded-lg border border-theme-chatDivider cursor-pointer h-max"
      onClick={handleClick}
    >
      <div className="flex flex-row items-center justify-start w-full">
        <img
          src={documentImage}
          alt="Document Icon"
          className="h-14 w-15 object-fill"
        />
        <div className="flex flex-col my-1 ml-3 w-full-minus-68">
          <p className="text-theme-secondaryText text-xs overflow-hidden text-ellipsis whitespace-nowrap font-normal">
            {document.name}
          </p>
          <p className="text-theme-primaryText mt-1  text-[10px] xs:text-xs font-light font-inter">
            {document.pages}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;
