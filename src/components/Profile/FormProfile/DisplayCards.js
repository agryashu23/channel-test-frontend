import React from "react";
import { useSelector } from "react-redux";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { ChannelImages } from "../../constants/images";
const DisplayCards = ({
  onUnsplashClick,
  handleImagesUpload,
  handleRemoveImageCard,
  onReorderImageCards,
}) => {
  const imageCards = useSelector((state) => state.imageCards);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedCards = Array.from(imageCards);
    const [reorderedItem] = reorderedCards.splice(result.source.index, 1);
    reorderedCards.splice(result.destination.index, 0, reorderedItem);
    onReorderImageCards(reorderedCards);
  };

  return (
    <div className="flex flex-col -ml-3 mt-3 -mr-2">
      <p className="text-sm font-normal font-inter text-theme-secondaryText">
        Add hero image to your webpage
      </p>
      <p className="text-theme-emptyEvent text-xs font-inter mt-1">
        You can add up-to 5 images
      </p>

      <div className="flex flex-row mt-3">
        <div className="relative  bg-theme-chatDivider xl:px-6 px-4 py-5 rounded-xl cursor-pointer z-10">
          <div className="flex flex-row items-center">
            <img
              src={ChannelImages.Upload.default}
              loading="lazy"
              alt="Upload"
              className="dark:block hidden w-5 h-5 mr-1"
            />
            <img
              src={ChannelImages.UploadLight.default}
              alt="Upload"
              loading="lazy"
              className="dark:hidden w-4 h-5 mr-2"
            />
            <p className="text-theme-secondaryText text-xs font-light font-inter">
              Upload image
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            multiple
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImagesUpload}
          />
        </div>

        <div
          className="relative bg-theme-chatDivider px-4 py-5 rounded-xl ml-4 cursor-pointer z-20"
          onClick={onUnsplashClick}
        >
          <div className="flex flex-row items-center">
            <img
              src={ChannelImages.Unsplash.default}
              alt="Unsplash"
              loading="lazy"
              className="dark:block hidden w-5 h-5 mr-2"
            />
            <img
              src={ChannelImages.UnsplashLight.default}
              alt="Unsplash"
              loading="lazy"
              className="dark:hidden w-5 h-5 mr-2"
            />
            <p className="text-theme-secondaryText text-xs font-light font-inter">
              Select from Unsplash
            </p>
          </div>
        </div>
      </div>

      <div className="flex-grow h-full mt-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="imageCards">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-3"
              >
                {imageCards.map((image, index) => (
                  <Draggable
                    key={image.id}
                    draggableId={image.id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative flex items-center space-x-2"
                      >
                        <img
                          src={ChannelImages.DragDrop}
                          alt={image.url}
                          className="w-6 h-6 cursor-pointer"
                          {...provided.dragHandleProps}
                        />
                        <img
                          src={image.url}
                          alt={`Uploaded ${index}`}
                          className="w-full h-44 object-cover rounded-lg"
                        />
                        <div
                          className="absolute top-1 right-1 py-1 px-1 text-theme-secondaryText bg rounded-full"
                          onClick={() => handleRemoveImageCard(image.id)}
                        >
                          <img
                            src={ChannelImages.Close.default}
                            alt="close-icon"
                            className="w-5 h-5 cursor-pointer"
                          />
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
      </div>
    </div>
  );
};

export default DisplayCards;
