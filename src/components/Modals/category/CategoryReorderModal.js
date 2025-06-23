import { React, useState, useEffect } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../../assets/icons/Close.svg";
import { useSelector, useDispatch } from "react-redux";
import { closeModal } from "../../../redux/slices/modalSlice";
import DragDrop from "../../../assets/icons/dragdrop.png";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  clearItems,
  fetchCategories,
  updateCategoriesOrder,
} from "../../../redux/slices/pushItemsSlice";

const CategoryReorderModal = () => {
  const isOpen = useSelector((state) => state.modals.modalCategoryReorderOpen);
  const dispatch = useDispatch();
  const pushItems = useSelector((state) => state.pushItems);
  const [newCategories, setNewCategories] = useState([]);

  const handleClose = () => {
    dispatch(clearItems());
    dispatch(closeModal("modalCategoryReorderOpen"));
  };

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCategories());
    }
  }, [isOpen]);

  useEffect(() => {
    if (pushItems.categories.length > 0) {
      setNewCategories(
        pushItems.categories.filter((category) => category.name)
      );
    }
  }, [pushItems.categories]);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(newCategories);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setNewCategories(items);
  };

  const handleUpdateCategories = () => {
    if (newCategories.length !== 0) {
      dispatch(updateCategoriesOrder(newCategories))
        .unwrap()
        .then(() => {
          handleClose();
        })
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
          <Dialog.Content
            className="bg-theme-tertiaryBackground rounded-xl overflow-hidden shadow-xl transform transition-all 
          overflow-y-auto custom-scrollbar min-h-[20%] max-h-[80%]  w-[90%] xs:w-3/4 sm:w-1/2 md:w-2/5 lg:w-[35%] xl:w-[30%]"
          >
            <Dialog.Title />
            <div className="flex flex-col p-5 h-full">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-theme-secondaryText text-lg font-normal font-inter">
                  Reorder categories
                </h2>
                <img
                  src={Close}
                  alt="Close"
                  className="w-4 h-4 cursor-pointer"
                  onClick={handleClose}
                />
              </div>
              <div className="text-theme-primaryText text-sm font-light font-inter mb-3">
                Drag categories to change order
              </div>

              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="categories">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="mt-4 "
                    >
                      {newCategories?.map((category, index) => (
                        <Draggable
                          key={category._id}
                          draggableId={category._id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex flex-row w-full mb-5 items-center"
                              style={{
                                ...provided.draggableProps.style,
                                position: "static",
                              }}
                            >
                              <img
                                src={DragDrop}
                                alt={category.name}
                                className="w-6 h-6 cursor-pointer"
                                {...provided.dragHandleProps}
                              />
                              <div
                                className="border ml-1 border-profileBorder py-2 px-4 rounded-full text-sm  
                               text-theme-secondaryText w-full font-normal tracking-wide focus:outline-none focus:border-none focus:ring-0"
                              >
                                {category.name}
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
                className={`w-full mt-3 py-2.5 font-normal text-sm rounded-lg bg-theme-secondaryText text-theme-primaryBackground`}
                onClick={handleUpdateCategories}
              >
                Save order
              </button>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CategoryReorderModal;
