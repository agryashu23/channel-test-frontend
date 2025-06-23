import { React, useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/Close.svg";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../../../redux/slices/modalSlice";
import DragDrop from "../../../assets/icons/dragdrop.png";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  updateReorderTopics,
  clearItems,
  setReorderTopicField,
  clearReorderTopics,
} from "../../../redux/slices/reorderTopicSlice";
import useModal from "./../../hooks/ModalHook";
import {
  fetchTopics,
  updateTopicsOrder,
} from "../../../redux/slices/reorderTopicSlice.js";

const TopicReorderModal = () => {
  const isOpen = useSelector((state) => state.modals.modalTopicReorderOpen);
  const reorderTopics = useSelector((state) => state.reorderTopic);
  const reorderStatus = useSelector((state) => state.reorderTopic.reorderStatus);
  const dispatch = useDispatch();
  const channelId = useSelector((state) => state.modals.channelId);
  const [newTopics, setNewTopics] = useState([]);

  const handleClose = () => {
    dispatch(clearItems());
    setNewTopics(reorderTopics.topics);
    dispatch(closeModal("modalTopicReorderOpen"));
  };

  // useEffect(() => {
  //   if (isOpen) {
  //     dispatch(fetchTopics(channelId));
  //   }
  // }, [isOpen, channelId, dispatch]);

  useEffect(() => {
    if (reorderTopics.topics.length > 0) {
      setNewTopics(reorderTopics.topics);
    }
  }, [reorderTopics]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(newTopics);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setNewTopics(items);
  };

  const handleUpdateTopics = () => {
    if (newTopics.length > 0) {
      const formDataToSend = new FormData();
      formDataToSend.append("topicItems", JSON.stringify(newTopics));
      formDataToSend.append("channelId", channelId);
      dispatch(updateTopicsOrder(formDataToSend))
        .unwrap()
        .then(() => handleClose())
        .catch((error) => {
          alert(error);
        });
    }
  };

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-50" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content className="bg-theme-tertiaryBackground rounded-xl overflow-hidden shadow-xl 
          transform transition-all overflow-y-auto custom-scrollbar min-h-[20%] max-h-[80%] w-[90%] xs:w-3/4 sm:w-1/2 md:w-2/5 lg:w-[35%] xl:w-[30%]">
            <Dialog.Title />
            <div className="flex flex-col p-5 h-full">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-theme-secondaryText text-lg font-normal font-inter">
                  Reorder Topics
                </h2>
                <img
                  src={Close}
                  alt="Close"
                  className="w-4 h-4 cursor-pointer"
                  onClick={handleClose}
                />
              </div>
              <div className="text-theme-primaryText text-sm font-light font-inter mb-3">
                Drag topics to change their order
              </div>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="topics">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="mt-4"
                    >
                      {newTopics.map((topic, index) => (
                        <Draggable
                          key={topic._id}
                          draggableId={topic._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex flex-row w-full mb-4 items-center focus:outline-none"
                              style={{
                                ...provided.draggableProps.style,
                                position: "static",
                              }}
                            >
                              <img
                                src={DragDrop}
                                alt="Drag"
                                className="w-6 h-6 cursor-pointer"
                              />
                              <div
                                className="border ml-1 border-profileBorder py-2 px-4 rounded-full 
                               text-theme-secondaryText w-full font-light tracking-wide text-base focus:outline-none focus:border-none focus:ring-0"
                              >
                                {topic.name}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>

              <button
                className="w-full mt-3 py-2.5 font-normal text-sm rounded-full bg-theme-secondaryText text-theme-primaryBackground"
                onClick={handleUpdateTopics}
              >
                {reorderStatus === "loading" ? "Saving order..." : "Save Order"}
              </button>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default TopicReorderModal;
