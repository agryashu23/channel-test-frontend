import SummaryPage from "./FormPages/SummaryPage";
import ResourcePage from "./FormPages/ResourcePage";
import Close from "../../assets/icons/Close.svg";
import EventsPage from "./FormPages/EventsPage";
import {
  React,
  useState,
  useEffect,
  useRef,
  useSelector,
} from "../../globals/imports";

const PageForm = ({ isOpen, onClose, topic }) => {
  const modalRef = useRef(null);
  const [activeTab, setActiveTab] = useState("resources");
  const [forceOpen, setForceOpen] = useState(window.innerWidth >= 1150);
  const myData = useSelector((state) => state.myData);
  const [fetchedOnce, setFetchedOnce] = useState(false);
  const [fetchedOnceEvents, setFetchedOnceEvents] = useState(false);

  

  useEffect(() => {
    const handleResize = () => {
      setForceOpen(window.innerWidth >= 1150);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //   useEffect(() => {
  //     const handleClickOutside = (event) => {
  //       if (modalRef.current && !modalRef.current.contains(event.target)) {
  //         onClose();
  //       }
  //     };
  //     if (isOpen) {
  //       document.addEventListener("mousedown", handleClickOutside);
  //     } else {
  //       document.removeEventListener("mousedown", handleClickOutside);
  //     }
  //     return () => {
  //       document.removeEventListener("mousedown", handleClickOutside);
  //     };
  //   }, [isOpen, onClose]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "summary":
        return <SummaryPage topic={topic} />;
      case "resources":
        return <ResourcePage fetchedOnce={fetchedOnce} setFetchedOnce={setFetchedOnce} />;
      case "events":
        return <EventsPage fetchedOnceEvents={fetchedOnceEvents} setFetchedOnceEvents={setFetchedOnceEvents} />;
      default:
        return null;
    }
  };

  const shouldShowModal = !forceOpen && isOpen;
  const shouldShowSidebar = forceOpen;

  if (!shouldShowModal && !shouldShowSidebar) return null;

  return (
    <div
      className={`${
        shouldShowSidebar
          ? "xl:flex hidden w-max h-full"
          : "fixed inset-0 z-50 flex items-end justify-end"
      }`}
    >
      {shouldShowModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}
      <div
        ref={modalRef}
        className={`relative  
    border border-theme-modalBorder bg-theme-sidebarBackground
    w-full  xl:w-[380px] xs:w-[380px] xl:h-full h-[88%] pt-1 pointer-events-auto z-50`}
      >
        <button
          onClick={onClose}
          className="xl:hidden flex absolute -top-8 right-3 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 z-50"
          aria-label="Close"
        >
          <img
            src={Close}
            alt="close"
            className="w-4 h-4 text-theme-chatDivider"
          />
        </button>

        {/* <div className="text-theme-secondaryText text-center mb-3">
          {topic.name.charAt(0).toUpperCase() + topic.name.slice(1)}
        </div> */}
        <div className="flex justify-center mb-3 pr-1 border-b  border-theme-chatDivider">
          {/* {topic.payment_subscription &&
            (topic.user === myData._id ||
              topic.channel?.members?.includes(myData._id)) && (
              <button
                className={` font-normal font-inter text-sm pt-2 pb-3 px-5 ${
                  activeTab === "summary"
                    ? "border-b-2 border-theme-primaryText text-theme-primaryText"
                    : "text-theme-emptyEvent"
                } transition-colors duration-200 whitespace-nowrap`}
                onClick={() => setActiveTab("summary")}
              >
                Chat Summary
              </button>
            )} */}
          <button
            className={`  font-inter text-sm py-3 px-5 w-1/2 ${
              activeTab === "resources"
                ? "border-b-2 border-theme-primaryText text-theme-primaryText"
                : "text-theme-emptyEvent"
            }`}
            onClick={() => setActiveTab("resources")}
          >
            Resources
          </button>
          <button
            className={`  font-inter text-sm py-3 px-5 w-1/2 ${
              activeTab === "events"
                ? "border-b-2 border-theme-primaryText text-theme-primaryText"
                : "text-theme-emptyEvent"
            }`}
            onClick={() => setActiveTab("events")}
          >
            Events
          </button>
        </div>
        <div
          className="overflow-y-auto px-4  flex-grow flex flex-col h-full"
          style={{ maxHeight: "calc(100% - 64px)" }}
        >
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default PageForm;
