import React,{useState,useRef, useEffect} from "react";
import { ChannelImages } from "../constants/images";
import { useDispatch, useSelector } from "react-redux";
import { fetchBusinessChannelsTopics } from "../../redux/slices/businessSlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { clearNewsletterFields, getNewsletterLimit, sendNewsletter, updateNewsletterField } from "../../redux/slices/newsletterSlice";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import NewsletterUnsplash from "../Modals/Unsplash/NewsletterUnsplash";
import NewsletterPreviewModal from "./widgets/NewsletterPreviewModal";
import { useNavigate, useParams } from "react-router-dom";
import { setAdminNotification } from "../../redux/slices/notificationSlice";
import useModal from "../hooks/ModalHook";


const blockTypes = {
  HEADER: "header",
  TEXT: "text",
  IMAGE: "image",
  BUTTON: "button"
};

const AdminNewsletter =()=>{
    const [channelDropdownOpen, setChannelDropdownOpen] = useState(false);
    const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);
    const channelDropdownRef = useRef(null);
    const topicDropdownRef = useRef(null);
    const dispatch = useDispatch();
    const params = useParams();
    const business = useSelector((state) => state.business);
    const newsletter = useSelector((state) => state.newsletter);
    const [isDateNow, setIsDateNow] = useState(false);
    const [isUnsplashOpen,setIsUnsplashOpen] = useState(false);
    const [localImageFiles, setLocalImageFiles] = useState({});
    const [unsplashTargetId, setUnsplashTargetId] = useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const navigate = useNavigate();
    const { handleOpenModal } = useModal();
    const {username} = params;

    useEffect(() => {
      dispatch(getNewsletterLimit());
      dispatch(fetchBusinessChannelsTopics());
  }, []);

  const handleSendNewsletter=()=>{
    if(!isEnabled){
      return;
    }
    // if(newsletter.limit===newsletter.totalLimit){
    //   navigate(`/admin/${username}/account/billing`);
    //   return;
    // }
    const formData = new FormData();
    formData.append("subject",newsletter.subject);
    formData.append("channel",newsletter.channel);
    formData.append("topic",newsletter.topic);
    formData.append("date",newsletter.date);
    formData.append("isDateNow",isDateNow);
    formData.append("time",newsletter.time);
    formData.append("contentBlocks",JSON.stringify(newsletter.contentBlocks));
    if(localImageFiles){
      Object.entries(localImageFiles).forEach(([blockId, file]) => {
          formData.append(`images[${blockId}]`, file);
        });
    }
    dispatch(sendNewsletter(formData))
      .unwrap()
      .then((res) => {
        setIsPreviewOpen(false);
        dispatch(clearNewsletterFields());
        setLocalImageFiles({});
        setIsPreviewOpen(false);
        setUnsplashTargetId(null);
        if(res.success && res.limitReached){
          dispatch(setAdminNotification(res));
          handleOpenModal("modalNotificationOpen");
        }
      })
      .catch((error) => {
        alert(error.message || String(error));
      });
  }

    const selectedChannel = business.channels?.find(
    (c) => c._id === newsletter?.channel
    );
    const availableTopics = selectedChannel?.topics || [];

    const addBlock = (type) => {
      if (type === blockTypes.HEADER && newsletter.contentBlocks.some((b) => b.type === blockTypes.HEADER)) return;
  
      const newBlock = {
        id: `${type}-${Date.now()}`,
        type,
        content: "",
        link: "",
        preview: "",
      };
      dispatch(updateNewsletterField({ field: "contentBlocks", value: [...newsletter.contentBlocks, newBlock] }));
    };


    const handleDragEnd = (result) => {
      if (!result.destination) return;
      const newBlocks = Array.from(newsletter.contentBlocks);
      const [reorderedItem] = newBlocks.splice(result.source.index, 1);
      newBlocks.splice(result.destination.index, 0, reorderedItem);
      dispatch(updateNewsletterField({ field: "contentBlocks", value: newBlocks }));
    };

    const updateBlockContent = (id, content) => {
      const newBlocks = newsletter.contentBlocks.map(block => 
        block.id === id ? { ...block, content } : block
      );
      dispatch(updateNewsletterField({ field: "contentBlocks", value: newBlocks }));
    };
    const updateBlockLink = (id, link) => {
      const newBlocks = newsletter.contentBlocks.map((block) =>
        block.id === id ? { ...block, link } : block
      );
      dispatch(updateNewsletterField({ field: "contentBlocks", value: newBlocks }));
    };

    const deleteBlock = (id) => {
      const updatedBlocks = newsletter.contentBlocks.filter(block => block.id !== id);
      dispatch(updateNewsletterField({ field: "contentBlocks", value: updatedBlocks }));
    };

    const handleImageUpload = (event, blockId) => {
      const file = event.target.files[0];
      if (!file) return;
  
      if (file.size > 16 * 1024 * 1024) {
        alert(`The file "${file.name}" exceeds 16 MB.`);
        return;
      }
  
      const reader = new FileReader();
      reader.onloadend = () => {
        const newBlocks = newsletter.contentBlocks.map((block) =>
          block.id === blockId ? { ...block, preview: reader.result } : block
        );
        dispatch(updateNewsletterField({ field: "contentBlocks", value: newBlocks }));
        setLocalImageFiles((prev) => ({ ...prev, [blockId]: file }));
      };
      reader.readAsDataURL(file);
    };
  
    const handleUnsplashSelect = (url, blockId) => {
      const newBlocks = newsletter.contentBlocks.map((block) =>
        block.id === blockId ? { ...block, preview: url } : block
      );
      dispatch(updateNewsletterField({ field: "contentBlocks", value: newBlocks }));
      setLocalImageFiles((prev) => {
        const copy = { ...prev };
        delete copy[blockId];
        return copy;
      });
      setIsUnsplashOpen(false);
      setUnsplashTargetId(null);
    };

    const renderBlock = (block, index,provided) => {
      switch (block.type) {
        case blockTypes.HEADER:
          return (
            <div className="flex flex-row items-center space-x-2">
              <img
                src={ChannelImages.DragDrop}
                alt="drag-drop"
                className="w-6 h-5 flex-shrink-0 "
                {...provided.dragHandleProps}
              />
              <div className="w-full p-4 rounded-lg border bg-transparent border-theme-chatDivider flex flex-col">
                <p className="text-sm text-theme-secondaryText font-normal">Header</p>
                <textarea
                rows="1"
                value={block.content}
                placeholder="Enter title of the newsletter"
                onChange={(e) => updateBlockContent(block.id, e.target.value)}
                className="mt-2 bg-transparent border-b border-theme-chatDivider focus:outline-none placeholder:text-sm placeholder:text-theme-emptyEvent
                font-normal text-theme-secondaryText"
              />
              </div>
             
              <div className="rounded-full p-1 bg-theme-chatDivider ml-1" onClick={() => deleteBlock(block.id)} >
                <img src={ChannelImages.Delete.default} alt="delete" className="w-4 h-4 dark:block hidden" /> 
                <img src={ChannelImages.DeleteLight.default} alt="delete" className="w-4 h-4 dark:hidden block" /> 
              </div>
            </div>
          );
        case blockTypes.TEXT:
          return (
            <div className="flex flex-row items-center space-x-2">
              <img
                src={ChannelImages.DragDrop}
                alt="drag-drop"
                className="w-6 h-5 flex-shrink-0 "
                {...provided.dragHandleProps}
              />
              <div className="w-full p-4 rounded-lg border bg-transparent border-theme-chatDivider flex flex-col">
                <p className="text-sm text-theme-secondaryText font-normal">Text</p>
                <textarea
                rows="1"
                value={block.content}
                placeholder="Enter description"
                onChange={(e) => updateBlockContent(block.id, e.target.value)}
                className="mt-2 bg-transparent border-b border-theme-chatDivider focus:outline-none placeholder:text-sm placeholder:text-theme-emptyEvent
                font-normal text-theme-secondaryText"
              />
              </div>
              <div className="rounded-full p-1 bg-theme-chatDivider ml-1" onClick={() => deleteBlock(block.id)} >
                <img src={ChannelImages.Delete.default} alt="delete" className="w-4 h-4 dark:block hidden" /> 
                <img src={ChannelImages.DeleteLight.default} alt="delete" className="w-4 h-4 dark:hidden block" /> 
              </div>
            </div>
          );
        case blockTypes.IMAGE:
          return (
            <div className="flex flex-row items-center space-x-2">
            <img
              src={ChannelImages.DragDrop}
              alt="drag-drop"
              className="w-6 h-5 flex-shrink-0 "
              {...provided.dragHandleProps}
            />
            <div className="w-full p-4 rounded-lg border bg-transparent border-theme-chatDivider flex flex-col">
              <p className="text-sm text-theme-secondaryText font-normal">Image</p>
              {!block.preview && <div className="flex flex-row mt-3">
                    <div className="relative  bg-theme-chatDivider w-1/2 px-2 py-4 rounded-xl cursor-pointer">
                      <div className="flex flex-col items-center justify-center">
                        <img
                          src={ChannelImages.Upload.default}
                          alt="Upload"
                          className="dark:block hidden w-5 h-5 mb-2"
                        />
                        <img
                          src={ChannelImages.UploadLight.default}
                          alt="Upload"
                          className="dark:hidden w-4 h-4 mb-2"
                        />
                        <p className="text-theme-secondaryText text-sm font-light font-inter">
                          Upload image
                        </p>
                        <input
                          type="file"
                          accept="image/*"
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          onChange={(e) => handleImageUpload(e, block.id)}
                        />
                      </div>
                    </div>
                      <div
                        className="w-1/2 py-4 px-2 rounded-xl ml-4 cursor-pointer bg-theme-chatDivider"
                        onClick={() => {
                          setUnsplashTargetId(block.id);
                          setIsUnsplashOpen(true);
                        }}
                      >
                        <div className="flex flex-col items-center">
                          <img
                            src={ChannelImages.Unsplash.default}
                            alt="Unsplash"
                            className="dark:block hidden w-5 h-5 mb-2"
                          />
                          <img
                            src={ChannelImages.UnsplashLight.default}
                            alt="Unsplash"
                            className="dark:hidden w-5 h-5 mb-2"
                          />
                          <p className="text-theme-secondaryText text-sm text-center font-light font-inter">
                            Select from Unsplash
                          </p>
                        </div>
                    </div>
                  </div>}
                  {block.preview && (
                      <img src={block.preview} alt="preview" className="mt-3 rounded-lg w-full max-h-40 object-cover" />
                    )}
            </div>
            <div className="rounded-full p-1 bg-theme-chatDivider ml-1" onClick={() => deleteBlock(block.id)} >
              <img src={ChannelImages.Delete.default} alt="delete" className="w-4 h-4 dark:block hidden" /> 
              <img src={ChannelImages.DeleteLight.default} alt="delete" className="w-4 h-4 dark:hidden block" /> 
            </div>
          </div>
          );
        case blockTypes.BUTTON:
          return (
            <div className="flex flex-row items-center space-x-2">
              <img
                src={ChannelImages.DragDrop}
                alt="drag-drop"
                className="w-6 h-5 flex-shrink-0 "
                {...provided.dragHandleProps}
              />
              <div className="w-full p-4 rounded-lg border bg-transparent border-theme-chatDivider flex flex-col">
                <p className="text-sm text-theme-secondaryText font-normal">Enter button text</p>
                <input
                type="text"
                value={block.content}
                placeholder="Enter button text"
                onChange={(e) => updateBlockContent(block.id, e.target.value)}
                className="mt-2 bg-transparent border-b border-theme-chatDivider focus:outline-none placeholder:text-sm placeholder:text-theme-emptyEvent
                font-normal text-theme-secondaryText"
              />
              <input
                type="text"
                value={block.link}
                placeholder="Add link"
                onChange={(e) => updateBlockLink(block.id, e.target.value)}
                className="mt-4 bg-transparent border-b border-theme-chatDivider focus:outline-none placeholder:text-sm placeholder:text-theme-emptyEvent
                font-normal text-theme-secondaryText"
              />
              </div>
              <div className="rounded-full p-1 bg-theme-chatDivider ml-1" onClick={() => deleteBlock(block.id)} >
                <img src={ChannelImages.Delete.default} alt="delete" className="w-4 h-4 dark:block hidden" /> 
                <img src={ChannelImages.DeleteLight.default} alt="delete" className="w-4 h-4 dark:hidden block" /> 
              </div>
            </div>
          );
        default:
          return null;
      }
    };
    
    const ReadOnlyDateInput = React.forwardRef(
        ({ value, onClick, placeholder }, ref) => (
          <input
            readOnly
            value={value}
            onClick={onClick}
            ref={ref}
            placeholder={placeholder}
            className="w-full py-1 text-sm pr-10 font-light rounded bg-transparent
           border-b-2 border-theme-chatDivider placeholder-font-light placeholder-text-sm 
           text-theme-secondaryText focus:outline-none placeholder:text-emptyEvent"
          />
        )
    );

    const isEnabled = newsletter.contentBlocks.length > 0 && (isDateNow || (newsletter.date
     && newsletter.time)); 

    const postButtonClass = `${isEnabled ? "bg-theme-buttonEnable text-theme-secondaryText" : "bg-theme-buttonDisable text-theme-emptyEvent"}`

  return (
  <div className="flex flex-col pt-6 px-6 bg-theme-tertiaryBackground overflow-y-auto ">
      <p className="text-theme-emptyEvent text-lg font-normal">Newsletter</p>
      <p className="text-theme-secondaryText text-lg mt-1 font-normal">
          Builder
      </p>
      <div className="border-t border-t-theme-chatDivider mt-4 mb-3 "></div>
      <div className="mt-2 bg-theme-pricingBackground rounded-lg sm:p-6 p-4 flex flex-col lg:w-1/2 w-full">
          <p className="text-theme-emptyEvent font-normal text-sm">Newsletter for {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}<span className="text-theme-secondaryText ml-2">
            {newsletter.limit}/{newsletter.totalLimit} left</span></p>
          <p className="text-theme-emptyEvent font-normal text-sm mt-6">Send to members of:</p>
      <div className="flex flex-row flex-wrap gap-6 my-3">
        <div className="flex flex-col w-full sm:w-auto relative" ref={channelDropdownRef}>
          <p className="text-sm text-theme-emptyEvent mb-2 font-light">Channel</p>
          <div
            className="border-2 border-theme-chatDivider rounded-md py-2 sm:px-4 px-2 text-sm 
             cursor-pointer flex justify-between items-center text-theme-primaryText w-max"
            onClick={() => setChannelDropdownOpen(!channelDropdownOpen)}
          >
            <span>
              {newsletter?.channel === "all"
                ? "All Channels"
                : selectedChannel?.name || "Unknown"}
            </span>
            <img
              src={
                channelDropdownOpen
                  ? ChannelImages.ArrowUp.default
                  : ChannelImages.ArrowDown.default
              }
              alt="dropdown"
              className="w-5 h-5 ml-2"
            />
          </div>
      
          {channelDropdownOpen && (
            <div className="absolute top-16 z-10 mt-0.5 w-max bg-theme-secondaryBackground border border-theme-chatDivider rounded-md shadow-md max-h-60 overflow-y-auto">
              <div
                className="px-3 py-2 text-sm text-theme-primaryText cursor-pointer hover:bg-theme-primaryBackground"
                onClick={() => {
                  dispatch(updateNewsletterField({ field: "channel", value: "all" }));
                  dispatch(updateNewsletterField({ field: "topic", value: "all" }));
                  setChannelDropdownOpen(false);
                }}
              >
                All Channels
              </div>
              {business.channels?.map((channel) => (
                <div
                  key={channel._id}
                  className="px-3 py-2 text-sm text-theme-primaryText cursor-pointer hover:bg-theme-primaryBackground"
                  onClick={() => {
                    dispatch(updateNewsletterField({ field: "channel", value: channel._id }));
                    dispatch(updateNewsletterField({ field: "topic", value: "all" }));
                    setChannelDropdownOpen(false);
                  }}
                >
                  {channel.name}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col w-full sm:w-auto relative" ref={topicDropdownRef}>
          <p className="text-sm text-theme-emptyEvent mb-2 font-light">Topic</p>
          <div
            className={`border-2 border-theme-chatDivider rounded-md py-2 sm:px-4 px-2 text-sm  cursor-pointer flex justify-between items-center 
              text-theme-primaryText w-max ${newsletter?.channel === "all" ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => {
              if (newsletter?.channel !== "all") setTopicDropdownOpen(!topicDropdownOpen);
            }}
          >
            <span>
              {newsletter?.topic === "all"
                ? "All Topics"
                : availableTopics.find((t) => t._id === newsletter?.topic)?.name || "Unknown"}
            </span>
            <img
              src={
                topicDropdownOpen
                  ? ChannelImages.ArrowUp.default
                  : ChannelImages.ArrowDown.default
              }
              alt="dropdown"
              className="w-5 h-5 ml-2"
            />
          </div>
      
          {topicDropdownOpen && (
            <div className="absolute z-10  top-16 mt-0.5 w-max bg-theme-secondaryBackground border border-theme-chatDivider 
            rounded-md shadow-md max-h-60 overflow-y-auto">
              <div
                className="px-3 py-2 text-sm text-theme-primaryText cursor-pointer hover:bg-theme-primaryBackground"
                onClick={() => {
                  dispatch(updateNewsletterField({ field: "topic", value: "all" }));
                  setTopicDropdownOpen(false);
                }}
              >
                All Topics
              </div>
              {availableTopics.map((topic) => (
                <div
                  key={topic._id}
                  className="px-3 py-2 text-sm text-theme-primaryText cursor-pointer hover:bg-theme-primaryBackground"
                  onClick={() => {
                    dispatch(updateNewsletterField({ field: "topic", value: topic._id }));
                    setTopicDropdownOpen(false);
                  }}
                >
                  {topic.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="text-theme-emptyEvent font-normal text-sm mt-4">Subject (optional):</p>
      <input
        type="text"
        value={newsletter.subject}
        placeholder="Enter subject for newsletter"
        onChange={(e) => dispatch(updateNewsletterField({ field: "subject", value: e.target.value }))}
        className="w-full py-1 text-sm pr-10 font-light rounded bg-transparent
        border-b-2 border-theme-chatDivider placeholder-font-light placeholder-text-sm 
        text-theme-secondaryText focus:outline-none placeholder:text-emptyEvent mt-2"
        />
      <div className="flex flex-row space-x-3 items-center mt-4 mb-3">
        <p className="text-theme-emptyEvent font-normal text-sm ">When</p>
        <div className={`rounded-full px-3 py-1 text-xs border-2 border-theme-chatDivider 
          ${isDateNow?"bg-theme-secondaryText text-theme-primaryBackground":"text-theme-primaryText"}`} onClick={()=>{
            if(isDateNow){
              dispatch(updateNewsletterField({ field: "date", value: "" }));
              dispatch(updateNewsletterField({ field: "time", value: "" }));
            }
            setIsDateNow(!isDateNow);
          }}>now</div>
      </div>
      {!isDateNow && <div className="flex flex-row justify-between items-center w-full">
        <div className="relative ">
          <DatePicker
            selected={newsletter.date}
            onChange={(date) => {
              dispatch(updateNewsletterField({ field: "date", value: date.toISOString() }));
            }}
            dateFormat="dd/MM/yyyy"
            placeholderText="Date"
            customInput={<ReadOnlyDateInput />}
            popperPlacement="top-start"
          />
         <img
            src={ChannelImages.Event.default}
            alt="event"
            style={{ position: "absolute", top: "2px", right: "0" }}
            className="dark:block hidden w-5 h-5 "
          />
          <img
            src={ChannelImages.EventLight.default}
            alt="event"
            style={{ position: "absolute", top: "2px", right: "0" }}
            className="dark:hidden w-5 h-5 "
          />
         
        </div>
          <div className="relative  w-[45%] mb-0.5">
            <DatePicker
              selected={newsletter.time}
              onChange={(date) => {
                dispatch(updateNewsletterField({ field: "time", value: date.toISOString() }));
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="Time"
              dateFormat="h:mm aa"
              placeholderText="Start Time"
              customInput={<ReadOnlyDateInput />}
            />
            <img
              src={ChannelImages.Time.default}
              alt="Time"
              className="dark:block hidden absolute right-0 top-1/2 transform -translate-y-1/2 text-theme-primaryText"
            />
            <img
              src={ChannelImages.TimeLight.default}
              alt="Time"
              className="dark:hidden absolute right-0 top-1/2 transform -translate-y-1/2 text-theme-primaryText"
            />
            {newsletter.time && (
              <button
                onClick={() => {
                  dispatch(updateNewsletterField({ field: "time", value: null }));
                }}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 text-sm text-gray-400"
              >
                ×
              </button>
            )}
      </div>
      </div>}
        <div className={`mt-5 rounded-lg ${postButtonClass} py-3 w-full text-sm font-normal text-center`} 
        disabled={!isEnabled}
        onClick={handleSendNewsletter}>{newsletter.limit===newsletter.totalLimit?"Upgrade":"Preview and Send"}</div>
      </div>
      <div className="flex flex-row space-x-4 mt-6 text-theme-emptyEvent">
      {!newsletter.contentBlocks.some((b) => b.type === blockTypes.HEADER) && (
        <div onClick={() => addBlock(blockTypes.HEADER)} className="cursor-pointer px-3 py-1 border border-theme-chatDivider rounded-full text-sm">+ Header</div>
      )}
      <div onClick={() => addBlock(blockTypes.TEXT)} className="cursor-pointer px-3 py-1 border border-theme-chatDivider rounded-full text-sm">+ Text</div>
      <div onClick={() => addBlock(blockTypes.IMAGE)} className="cursor-pointer px-3 py-1 border border-theme-chatDivider rounded-full text-sm">+ Media</div>
      <div onClick={() => addBlock(blockTypes.BUTTON)} className="cursor-pointer px-3 py-1 border border-theme-chatDivider rounded-full text-sm">+ Button</div>
    </div>
      <p className="text-theme-emptyEvent font-normal text-sm mt-8 underline cursor-pointer pb-1 tracking-wide"
      onClick={() => setIsPreviewOpen(true)} 
      >Preview</p>
      <div className="w-3/5">
      <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="contentBlocks">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="mt-6 space-y-4">
            {newsletter.contentBlocks.map((block, index) => (
              <Draggable key={block.id} draggableId={block.id} index={index}>
                {(provided) => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    className=""
                  >
                    {renderBlock(block, index,provided)}
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
      <div className="h-6"></div>
      {isUnsplashOpen && (
        <NewsletterUnsplash
          isOpen={isUnsplashOpen}
          setIsOpen={setIsUnsplashOpen}
          targetBlockId={unsplashTargetId}
          onSelect={handleUnsplashSelect}
        />
      )}
      {isPreviewOpen && (
  <NewsletterPreviewModal isOpen={isPreviewOpen} setIsOpen={setIsPreviewOpen} />
  )}
  </div>
)
};

export default AdminNewsletter;