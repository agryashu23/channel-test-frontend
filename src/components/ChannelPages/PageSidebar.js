import ArrowUp from "../../assets/icons/up-arrow.svg";
import ArrowDown from "../../assets/icons/arrow_drop_down.svg";
import PoweredBy from "../../assets/icons/poweredby.svg";
import Close from "../../assets/icons/Close.svg";
import { React, useState, useEffect, useNavigate } from "../../globals/imports";

const channels = [
  { id: "1", name: "games", pages: ["general", "resources", "updates"] },
  { id: "2", name: "sports", pages: ["general", "news", "events"] },
];

const PageSidebar = ({ channelName, pageName, closeSidebar }) => {
  const navigate = useNavigate();
  const [expandedChannels, setExpandedChannels] = useState(
    Array.from({ length: channels.length }, () => false)
  );
  const [selectedPages, setSelectedPages] = useState({});

  useEffect(() => {
    const decodedPageName = decodeURIComponent(pageName || "");
    const channelIndex = channels.findIndex(
      (channel) => channel.name === channelName
    );
    const pageIndex =
      channelIndex !== -1
        ? channels[channelIndex].pages.findIndex(
            (page) => page === decodedPageName
          )
        : -1;
    setExpandedChannels((prev) =>
      prev.map((_, i) => (i === channelIndex ? true : prev[i]))
    );
    setSelectedPages({ [channelIndex]: pageIndex });
  }, [channelName, pageName]);

  const toggleChannel = (index, channelName) => {
    setExpandedChannels((prev) =>
      prev.map((isExpanded, i) => (i === index ? !isExpanded : isExpanded))
    );
    // if (!expandedChannels[index]) {
    //   const firstPage = channels[index].pages[0];
    //   navigate(`/channel/${channelName}/page/${encodeURIComponent(firstPage)}`);
    // }
  };

  const handlePageSelect = (channelIndex, pageIndex, channelName, pageName) => {
    setSelectedPages((prev) => ({
      ...prev,
      [channelIndex]: pageIndex,
    }));
    navigate(`/channel/${channelName}/page/${encodeURIComponent(pageName)}`);
  };

  return (
    <div className="w-full h-full bg-theme-primaryBackground pt-2 flex flex-col relative ">
      {window.innerWidth < 640 && (
        <img
          src={Close}
          alt="close"
          className="sm:hidden flex mt-3 mb-6 ml-6 h-4 w-4 cursor-pointer"
          onClick={closeSidebar}
        />
      )}
      <div className="overflow-y-auto mb-12 custom-scrollbar">
        <h1 className="text-sm font-normal font-inter text-theme-primaryText px-6 py-1 ">
          Profile
        </h1>
        {channels.map((channel, channelIndex) => (
          <div className="flex flex-col">
            <div className="border  border-theme-tertiaryBackground my-3"></div>
            <div
              className="flex flex-row justify-between px-6 mb-3 items-center cursor-pointer"
              onClick={() => toggleChannel(channelIndex, channel.name)}
            >
              <p className="text-md font-normal font-inter text-theme-primaryText">
                {channel.name.charAt(0).toUpperCase() + channel.name.slice(1)}
              </p>
              <img
                src={expandedChannels[channelIndex] ? ArrowUp : ArrowDown}
                alt={expandedChannels[channelIndex] ? "up-arrow" : "down-arrow"}
                className="h-6 w-6"
              />
            </div>
            {expandedChannels[channelIndex] && (
              <div>
                {channel.pages.map((page, pageIndex) => (
                  <div key={`page-${channelIndex}-${pageIndex}`}>
                    <div
                      onClick={() =>
                        handlePageSelect(
                          channelIndex,
                          pageIndex,
                          channel.name,
                          page
                        )
                      }
                      className={`${
                        selectedPages[channelIndex] === pageIndex
                          ? "bg-theme-tertiaryBackground p-3 rounded-lg mx-3"
                          : "px-6"
                      } text-theme-primaryText text-sm font-normal font-inter py-3 cursor-pointer`}
                    >
                      {page}{" "}
                    </div>
                    {pageIndex !== channel.pages.length - 1 && (
                      <div
                        className={`border  mx-4 border-theme-tertiaryBackground my-1`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <img
        src={PoweredBy}
        alt="powered-by"
        className="h-8 absolute bottom-2 left-2"
      />
    </div>
  );
};

export default PageSidebar;
