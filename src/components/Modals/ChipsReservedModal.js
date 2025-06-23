import React, { useState, useEffect } from "react";
import Close from "../../assets/icons/Close.svg";
import ArrowBack from "../../assets/icons/arrow_back.svg";
import { useSelector, useDispatch } from "react-redux";
import Linkify from "react-linkify";
import GoogleMapsCard from "../chips/widgets/googleMapsCard";
import DateTimeCard from "../chips/widgets/DateTime";
import ImageList from "../chips/widgets/ImageList";
import RenderLink from "../chips/widgets/videoPlayer";
import {
  setLocationField,
  setDateField,
  setDocumentField,
  setChipField,
  setImageField,
  setAllImagesField,
} from "../../redux/slices/chipSlice";
import DocumentPreview from "./../chips/widgets/DocumentPreview";
import ReservedImages from "./widgets/ReservedImages";

const ChipsReservedModal = ({
  onBack,
  handleClose,
  postButton,
  handleSave,
  Chipstatus,
}) => {
  const [selectedOption, setSelectedOption] = useState("userdetails");
  const dispatch = useDispatch();
  const chipData = useSelector((state) => state.chip);
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 250;

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  const handleLocationExclusiveChange = (e) => {
    dispatch(setLocationField({ field: "exclusive", value: e.target.checked }));
  };
  const handleDateExclusiveChange = (e) => {
    dispatch(setDateField({ field: "exclusive", value: e.target.checked }));
  };
  const handleDocumentExclusiveChange = (e) => {
    dispatch(setDocumentField({ field: "exclusive", value: e.target.checked }));
  };
  const handleLinkExclusiveChange = (e) => {
    dispatch(
      setChipField({ field: "link_exclusive", value: e.target.checked })
    );
  };
  const handleTextExclusiveChange = (e) => {
    dispatch(
      setChipField({ field: "text_exclusive", value: e.target.checked })
    );
  };
  const handleImageExclusiveChange = (index) => {
    dispatch(
      setImageField({
        field: index,
        value: !chipData.image_urls[index].exclusive,
      })
    );
  };
  const handleAllImagesExclusiveChange = (e) => {
    const isChecked = e.target.checked;
    dispatch(setAllImagesField({ value: isChecked }));
  };

  const onHandleClose = () => {
    onBack();
    handleClose();
  };

  const componentDecorator = (href, text, key) => (
    <a
      href={href}
      key={key}
      target="_blank"
      rel="noopener noreferrer"
      className="custom-link text-metaLink"
    >
      {text}
    </a>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-4 pr-4">
        <div className="flex flex-row space-x-3">
          <img
            src={ArrowBack}
            alt="arrow-back"
            className="cursor-pointer"
            onClick={onBack}
          />
          <h2 className="text-theme-secondaryText text-lg font-normal font-inter">
            Select reserved notes
          </h2>
        </div>
        <img
          src={Close}
          alt="Close"
          className="w-6 h-6 cursor-pointer"
          onClick={onHandleClose}
        />
      </div>
      <p className=" text-textColor text-sm font-light  pr-4 leading-5">
        Content marked as reserved will be hidden to the viewers and only be
        shown after you collect
      </p>
      <div className="flex flex-row space-x-8 mt-4">
        <div className="flex items-center space-x-2">
          <input
            id="user-details"
            type="radio"
            value="userdetails"
            checked={selectedOption === "userdetails"}
            onChange={() => setSelectedOption("userdetails")}
            className="relative float-left h-5 w-5 appearance-none rounded-full border-2 border-disabledColor checked:border-primary
            checked:after:absolute checked:after:left-1/2 checked:after:top-1/2 checked:after:h-2.5 checked:after:w-2.5 
            checked:after:rounded-full checked:after:border-primary checked:after:bg-primary checked:after:[transform:translate(-50%,-50%)]"
          />
          <label
            htmlFor="user-details"
            className="text-sm text-theme-secondaryText font-light cursor-pointer"
          >
            User details
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="payment"
            type="radio"
            value="payment"
            checked={selectedOption === "payment"}
            onChange={() => setSelectedOption("payment")}
            disabled
            className=" h-5 w-5 cursor-not-allowed relative float-left appearance-none rounded-full border-[3px] border-disabledColor checked:border-primary"
          />
          <label
            htmlFor="payment"
            className="text-sm font-light text-disabledColor"
          >
            Payment <span className="italic">(coming soon)</span>
          </label>
        </div>
      </div>
      <div
        className={`my-4 border border-borderColor mr-5`}
        style={{ height: "1px" }}
      ></div>
      <div className="flex flex-col space-y-6">
        {chipData.text && (
          <div className="flex items-center space-x-4 mr-2">
            <input
              type="checkbox"
              id="textExclusive"
              checked={chipData.text_exclusive}
              onChange={handleTextExclusiveChange}
              className="custom-checkbox"
            />
            <Linkify componentDecorator={componentDecorator}>
              <p className="text-primaryGrey pr-1 text-sm font-light font-inter whitespace-pre-wrap overflow-hidden overflow-wrap break-word">
                {isExpanded
                  ? chipData.text
                  : `${chipData.text.slice(0, maxLength)}${
                      chipData.text.length > maxLength ? "..." : ""
                    }`}
                {chipData.text.length > maxLength && (
                  <span
                    onClick={toggleReadMore}
                    className="text-primary cursor-pointer ml-1"
                  >
                    {isExpanded ? "<- Show Less" : "Read More ->"}
                  </span>
                )}
              </p>
            </Linkify>
          </div>
        )}
        {chipData.date.date && chipData.date.event && (
          <div className="flex items-center space-x-4 mr-4">
            <input
              type="checkbox"
              id="dateExclusive"
              checked={chipData.date.exclusive}
              onChange={handleDateExclusiveChange}
              className="custom-checkbox"
            />
            <DateTimeCard item={chipData.date} />
          </div>
        )}
        {chipData.location.text && (
          <div className="flex items-center space-x-4 mr-4">
            <input
              type="checkbox"
              id="locationExclusive"
              checked={chipData.location.exclusive}
              onChange={handleLocationExclusiveChange}
              className="custom-checkbox"
            />
            <a
              href={chipData.location.text}
              className="text-metaLink text-Link text-sm font-light font-inter"
            >
              {chipData.location.text}
            </a>
          </div>
        )}
        {chipData.link && (
          <div className="flex items-center space-x-4 mr-4">
            <input
              type="checkbox"
              id="linkExclusive"
              checked={chipData.link_exclusive}
              onChange={handleLinkExclusiveChange}
              className="custom-checkbox"
            />
            <a
              href={chipData.link}
              className="text-metaLink text-Link text-sm font-light font-inter"
            >
              {chipData.link.length > 100
                ? `${chipData.link.substring(0, 100)}...`
                : chipData.link}
            </a>
          </div>
        )}
        {chipData.image_urls.length > 0 && (
          <div className="flex items-center space-x-4 mr-4">
            <input
              type="checkbox"
              id="imageExclusive"
              checked={chipData.image_urls.every((image) => image.exclusive)}
              onChange={handleAllImagesExclusiveChange}
              className="custom-checkbox"
            />
            <ReservedImages
              imageCards={chipData.image_urls}
              onUncheckImage={handleImageExclusiveChange}
            />
          </div>
        )}
        {chipData.document && chipData.document.url && (
          <div className="flex items-center space-x-4 mr-4">
            <input
              type="checkbox"
              id="documentExclusive"
              checked={chipData.document.exclusive}
              onChange={handleDocumentExclusiveChange}
              className="custom-checkbox"
            />
            <DocumentPreview document={chipData.document} />
          </div>
        )}
        <div className="mr-4 mb-1">
          <button
            className={`w-full  py-2.5 mt-3 rounded-full ${postButton} font-normal`}
            onClick={handleSave}
          >
            {Chipstatus === "loading"
              ? "Please wait..."
              : "Post with reserved notes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChipsReservedModal;
