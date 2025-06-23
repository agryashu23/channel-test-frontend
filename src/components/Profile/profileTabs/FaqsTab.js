import React, { useState, useEffect, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
 

import {
  setFaqData,
  createFaq,
  clearFaqData,
  fetchFaqs,
  updateFaqsOrder,
  updateReorderItems,
  clearReorderItems,
  updateFaq,
} from "../../../redux/slices/faqsSlice";
import { useDispatch, useSelector } from "react-redux";
import useModal from "./../../hooks/ModalHook";
import Loading from "../../../widgets/Loading";
import { ChannelImages } from "../../constants/images";

const FaqItem = ({
  id,
  question,
  answer,
  index,
  isReorder,
  provided,
  toggleEditFaq,
  dropdownRef,
  isDropdownOpen,
  setIsDropdownOpen,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const { handleOpenModal } = useModal();
  const dispatch = useDispatch();

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(false);
    }
  };
  const toggleDropdown = (id) => {
    // if (isDropdownOpen === id) {
    //   setIsDropdownOpen(null);
    // } else {
    setIsDropdownOpen(id);
    // }
  };
  const handleDeleteFaq = (id) => {
    dispatch(setFaqData({ field: "faq_id", value: id }));
    handleOpenModal("modalFaqDeleteOpen");
  };
  const handleEditFaq = (id, question, answer) => {
    setIsDropdownOpen(!isDropdownOpen);

    dispatch(setFaqData({ field: "question", value: question }));
    dispatch(setFaqData({ field: "answer", value: answer }));
    dispatch(setFaqData({ field: "faq_id", value: id }));
    toggleEditFaq();
  };

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className="flex flex-row items-center"
    >
      {isReorder && (
        <img
          src={ChannelImages.DragDrop}
          alt="drag-drop"
          className="w-6 h-5 flex-shrink-0 mr-3 mt-3"
          {...provided.dragHandleProps}
        />
      )}
      <div
        className="bg-theme-tertiaryBackground p-4 mt-6 rounded-lg flex flex-col cursor-pointer w-full"
        onClick={handleClickOutside}
      >
        <div className="flex flex-row relative  items-center justify-start">
          <img
            src={ChannelImages.Dots.default}
            alt="dots"
            className="dark:block hidden w-6 h-6 mr-2"
            onClick={() => toggleDropdown(id)}
          />
          <img
            src={ChannelImages.DotsLight.default}
            alt="dots"
            className="dark:hidden w-6 h-6 mr-2"
            onClick={() => toggleDropdown(id)}
          />
          {isDropdownOpen === id && (
            <div
              ref={dropdownRef}
              className="absolute top-6 left-0 mt-1 ml-3 w-28 rounded-md shadow-lg border  border-theme-chatDivider
             bg-theme-tertiaryBackground ring-1 ring-black ring-opacity-5 z-50"
            >
              <div
                className="py-1"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <div className="flex flex-row px-3 items-center">
                  <img
                    src={ChannelImages.Edit.default}
                    alt="edit"
                    className="dark:block hidden w-4 h-4"
                  />
                  <img
                    src={ChannelImages.EditLight.default}
                    alt="edit"
                    className="dark:hidden w-4 h-4"
                  />
                  <p
                    className="block font-light px-2 py-2 text-sm text-theme-secondaryText cursor-pointer"
                    role="menuitem"
                    onClick={() => handleEditFaq(id, question, answer)}
                  >
                    Edit
                  </p>
                </div>
                <div
                  className="flex flex-row px-3 items-center"
                  onClick={() => handleDeleteFaq(id)}
                >
                  <img
                    src={ChannelImages.Delete.default}
                    alt="edit"
                    className="dark:block hidden w-4 h-4"
                  />
                  <img
                    src={ChannelImages.DeleteLight.default}
                    alt="edit"
                    className="dark:hidden w-4 h-4"
                  />
                  <p
                    className="block px-2 py-2 font-light text-sm   text-theme-secondaryText cursor-pointer"
                    role="menuitem"
                  >
                    Delete
                  </p>
                </div>
              </div>
            </div>
          )}
          <div
            onClick={() => setIsOpen(!isOpen)}
            className="flex flex-row justify-between w-full"
          >
            <button className="w-full text-left text-theme-secondaryText font-normal">
              {question}
            </button>
            <img src={isOpen ? ChannelImages.DropUp.default : ChannelImages.DropDown.default} alt="drop-down" />
          </div>
        </div>
        {isOpen && (
          <div className="text-theme-emptyEvent text-sm mt-2 font-light font-inter ml-8">
            {answer}
          </div>
        )}
      </div>
    </div>
  );
};

const FaqsTab = ({ username, isOwner }) => {
  const [isCreateFaq, setIsCreateFaq] = useState(false);
  const [isReorder, setIsReorder] = useState(false);
  const [isEditFaq, setIsEditFaq] = useState(false);
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(null);
  const Faq = useSelector((state) => state.faqs);
  const {
    faqs: initialFaqs,
    status,
    updatestatus,
  } = useSelector((state) => state.faqs);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (initialFaqs.length === 0) {
      dispatch(fetchFaqs(username));
    }
  }, [username, initialFaqs.length]);

  useEffect(() => {
    setItems(initialFaqs);
  }, [initialFaqs]);

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsDropdownOpen(null);
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(items);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setItems(reorderedItems);
    dispatch(updateReorderItems(reorderedItems));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFaqData({ field: name, value: value }));
  };

  const handleResizeChange = (event) => {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
    handleChange(event);
  };

  const toggleCreateFaq = () => {
    setIsCreateFaq(true);
  };
  const toggleEditFaq = () => {
    setIsEditFaq(true);
  };
  const closeFaq = () => {
    setIsCreateFaq(false);
    setIsEditFaq(false);
    dispatch(setFaqData({ field: "question", value: "" }));
    dispatch(setFaqData({ field: "answer", value: "" }));
  };
  const handleSaveReorder = () => {
    const items = Faq.reorderItems;
    if (items.length > 0) {
      dispatch(updateFaqsOrder(items))
        .unwrap()
        .then(() => {
          setIsReorder(false);
          dispatch(clearReorderItems());
        })
        .catch((error) => {
          alert(error);
        });
    } else {
      setIsReorder(false);
    }
  };

  const handleCreateFaq = () => {
    const formDataToSend = new FormData();
    formDataToSend.append("question", Faq.question);
    formDataToSend.append("answer", Faq.answer);
    dispatch(createFaq(formDataToSend))
      .unwrap()
      .then(() => {
        dispatch(clearFaqData());
        closeFaq();
      })
      .catch((error) => {
        alert(error);
      });
  };
  const handleEditFaq = () => {
    const formDataToSend = new FormData();
    formDataToSend.append("question", Faq.question);
    formDataToSend.append("answer", Faq.answer);
    formDataToSend.append("_id", Faq.faq_id);
    dispatch(updateFaq(formDataToSend))
      .unwrap()
      .then(() => {
        dispatch(clearFaqData());
        closeFaq();
      })
      .catch((error) => {
        alert(error);
      });
  };

  const postButtonClass =
    Faq.question === "" || Faq.answer === ""
      ? "text-theme-buttonDisableText bg-theme-buttonDisable "
      : " bg-theme-secondaryText text-theme-primaryBackground";

   if (status === "loading") {
     return (
       <div className="text-theme-primaryText text-md font-normal mt-12 items-center flex justify-center">
        <Loading text="Loading..."/>
       </div>
     );
   }
  return (
    <div className="flex flex-col" onClick={handleClickOutside}>
      {items.length > 0 &&
        isReorder === false &&
        isEditFaq === false &&
        isLoggedIn &&
        !isCreateFaq && (
          <div className="flex flex-row justify-between items-center mt-2 mb-4">
            <div
              className="flex items-center cursor-pointer"
              onClick={toggleCreateFaq}
            >
              <div className="rounded-lg mr-1 flex bg-theme-tertiaryBackground p-1  justify-center items-center">
                <img
                  src={ChannelImages.AddIcon.default}
                  alt="Add"
                  className="dark:block hidden w-4 h-4 text-theme-secondaryText"
                />
                <img
                  src={ChannelImages.CreateNewLight.default}
                  alt="Add"
                  className="dark:hidden w-4 h-4 text-theme-secondaryText"
                />
              </div>
              <p className="text-theme-emptyEvent font-light text-sm ">
                Create new
              </p>
            </div>
            <div
              className="flex flex-col space-y-1 cursor-pointer text-sm font-light text-theme-emptyEvent"
              onClick={() => setIsReorder(true)}
            >
              Reorder
            </div>
          </div>
        )}
      {isReorder && (
        <div className="flex flex-row justify-between items-center mt-2 mb-4">
          <div
            className="rounded-md text-sm  text-theme-primaryBackground bg-theme-secondaryText cursor-pointer  px-4 py-1"
            onClick={handleSaveReorder}
          >
            {updatestatus === "loading" ? "saving.." : "Save"}
          </div>
          <div
            className="space-y-1 cursor-pointer underline text-sm font-light text-theme-emptyEvent"
            onClick={() => {
              setIsReorder(false);
              setItems(initialFaqs);
            }}
          >
            Cancel
          </div>
        </div>
      )}
      <div className="w-full border border-theme-chatDivider p-4 rounded-xl ">
        <div className="text-theme-secondaryText text-xl font-medium font-familjen-grotesk ">
          FAQs
        </div>
        {items.length === 0 && isLoggedIn && isOwner && !isCreateFaq ? (
          <div className="rounded-lg bg-theme-tertiaryBackground p-4 flex xs:flex-row flex-col mt-2 xs:space-y-0 space-y-3">
            <img
              src={ChannelImages.FAQCover.default}
              alt="faq_cover"
              className="sm:h-28 h-40 w-auto object-cover rounded-lg"
            />
            <div className="flex flex-col xs:ml-3 ml-0 justify-between">
              <p className="text-theme-secondaryText text-xs font-light font-inter">
                Everyone could use a little more clarity!
                <br />
                Add a set of Frequently Asked Questions (FAQs) about your brand
                or community to provide quick, straightforward answers to common
                queries. Whether it's about what you do, who you are, or how
                people can engage, FAQs are a great way to help others
                understand and connect with your vision effortlessly.
              </p>
              <div
                className="mt-2 border border-theme-primaryText text-theme-secondaryText  text-center xs:w-max w-full rounded-md
           px-2 py-1.5 text-xs font-light cursor-pointer"
                onClick={toggleCreateFaq}
              >
                Create first FAQ
              </div>
            </div>
          </div>
        ) : items.length === 0 && !isCreateFaq? (
          <div className="text-center text-theme-secondaryText">
            No Faqs Found.
          </div>
        ) : null}
        {(isCreateFaq || isEditFaq) && (
          <div className="bg-theme-tertiaryBackground rounded-lg px-5 py-3 flex flex-col mt-6">
            <input
              id="question"
              className="w-full mt-3 p-1 rounded bg-chipBackground 
                   placeholder:font-light placeholder:text-sm text-sm font-light
                   focus:outline-none bg-transparent border-b border-theme-chatDivider  text-theme-secondaryText  placeholder:text-theme-emptyEvent"
              type="text"
              name="question"
              value={Faq.question}
              onChange={handleChange}
              placeholder="Enter question here"
              autoComplete="off"
            />
            <textarea
              id="answer"
              className="w-full mt-4 p-1 rounded bg-chipBackground  resize-none
                   placeholder:font-light placeholder:text-sm text-sm font-light
                   focus:outline-none bg-transparent border-b border-theme-chatDivider  text-theme-secondaryText  placeholder:text-theme-emptyEvent"
              type="text"
              name="answer"
              value={Faq.answer}
              rows="1"
              onChange={handleResizeChange}
              placeholder="Write the answer"
              autoComplete="off"
            />
            <div className="justify-end flex flex-row mt-6 space-x-6">
              <div
                className={`${postButtonClass} 
          text-sm font-normal py-2 px-10 rounded-md cursor-pointer `}
                onClick={(e) => {
                  e.preventDefault();
                  isEditFaq ? handleEditFaq() : handleCreateFaq();
                }}
              >
                {updatestatus === "loading" ? "saving.." : "Save"}
              </div>
              <div
                className="border rounded-md border-theme-primaryText text-theme-secondaryText cursor-pointer
              text-sm font-normal py-2 px-6"
                onClick={(e) => {
                  e.preventDefault();
                  closeFaq();
                }}
              >
                Discard
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-col">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="faqs">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {items.map((faq, index) => (
                    <Draggable
                      key={faq._id}
                      draggableId={faq._id}
                      index={index}
                    >
                      {(draggableProvided) => (
                        <FaqItem
                          id={faq._id}
                          question={faq.question}
                          answer={faq.answer}
                          index={index}
                          isReorder={isReorder}
                          provided={draggableProvided}
                          toggleEditFaq={toggleEditFaq}
                          dropdownRef={dropdownRef}
                          isDropdownOpen={isDropdownOpen}
                          setIsDropdownOpen={setIsDropdownOpen}
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default FaqsTab;
