import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import DragDrop from "../../../assets/icons/dragdrop.png";
import Instagram from "../../../assets/links/Instagram.svg";
import Youtube from "../../../assets/links/Youtube.svg";
import Linkedin from "../../../assets/links/Linkedin.svg";
import Spotify from "../../../assets/links/Spotify.svg";
import Github from "../../../assets/links/Github.svg";
import Behance from "../../../assets/links/Behance.svg";
import ThreadsLight from "../../../assets/lightIcons/threads_light.svg";
import Threads from "../../../assets/links/Threads.svg";
import Facebook from "../../../assets/links/Facebook.svg";
import Twitter from "../../../assets/links/Twitter.svg";
import DarkOther from "../../../assets/lightIcons/browser_light.svg";
import Buymecoffee from "../../../assets/links/Buymecoffee.png";
import Others from "../../../assets/links/Subtract.svg";

const initialLinks = [
  {
    id: "1",
    title: "Instagram",
    url: "https://www.instagram.com/",
    image:
      "https://chips-social.s3.ap-south-1.amazonaws.com/links/Instagram.svg",
    value: "",
  },
  {
    id: "2",
    title: "Youtube",
    url: "https://www.youtube.com/c/",
    image: "https://chips-social.s3.ap-south-1.amazonaws.com/links/Youtube.svg",
    value: "",
  },
  {
    id: "3",
    title: "Linkedin",
    url: "https://www.linkedin.com/in/",
    image:
      "https://chips-social.s3.ap-south-1.amazonaws.com/links/linkedin.svg",
    value: "",
  },
  {
    id: "4",
    title: "Spotify",
    url: "https://open.spotify.com/account/",
    image: "https://chips-social.s3.ap-south-1.amazonaws.com/links/Spotify.svg",
    value: "",
  },
  {
    id: "5",
    title: "Github",
    url: "https://github.com/",
    image: "https://chips-social.s3.ap-south-1.amazonaws.com/links/Github.svg",
    value: "",
  },
  {
    id: "6",
    title: "Behance",
    url: "https://www.behance.net/",
    image: "https://chips-social.s3.ap-south-1.amazonaws.com/links/Behance.svg",
    value: "",
  },
  {
    id: "7",
    title: "Threads",
    url: "https://www.threads.net/",
    image: "https://chips-social.s3.ap-south-1.amazonaws.com/links/threads.svg",
    value: "",
  },
  {
    id: "8",
    title: "Facebook",
    url: "https://www.facebook.com/",
    image:
      "https://chips-social.s3.ap-south-1.amazonaws.com/links/Facebook.svg",
    value: "",
  },
  {
    id: "9",
    title: "Twitter",
    url: "https://twitter.com/",
    image: "https://chips-social.s3.ap-south-1.amazonaws.com/links/X.svg",
    value: "",
  },
  {
    id: "10",
    title: "Buymecoffee",
    url: "https://www.buymeacoffee.com/",
    image:
      "https://chips-social.s3.ap-south-1.amazonaws.com/links/Buy+Me+Coffee.svg",
    value: "",
  },
];

const LinkForm = ({ formLinks, otherLink, onFieldChange }) => {
  const imageMap = {
    Instagram,
    Youtube,
    Linkedin,
    Spotify,
    Github,
    Behance,
    Threads,
    Facebook,
    Twitter,
    Buymecoffee,
  };

  const [links, setLinks] = useState(initialLinks);
  const [other, setOthers] = useState(otherLink);
  useEffect(() => {
    setOthers(otherLink);
  }, [otherLink]);

  useEffect(() => {
    if (formLinks && formLinks.length > 0) {
      setLinks(formLinks);
    } else {
      setLinks(initialLinks);
    }
  }, [formLinks]);

  const handleInputChange = (id, value) => {
    const updatedLinks = links.map((link) =>
      link.id === id ? { ...link, value } : link
    );
    setLinks(updatedLinks);
    onFieldChange("links", updatedLinks);
  };

  const handleClearLink = (id) => {
    const updatedLinks = links.map((link) =>
      link.id === id ? { ...link, value: "" } : link
    );
    setLinks(updatedLinks);
    onFieldChange("links", updatedLinks);
  };

  const handleOtherLinkChange = (value) => {
    setOthers(value);
    onFieldChange("otherLink", value);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(links);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setLinks(items);
    onFieldChange("links", items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="links">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {links.map((link, index) => (
              <Draggable key={link.id} draggableId={link.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="flex items-center space-x-4 mt-5 mb-2"
                  >
                    <img
                      src={DragDrop}
                      alt={link.title}
                      className="w-6 h-6 cursor-pointer"
                      {...provided.dragHandleProps}
                    />
                    <div className="flex-grow relative">
                      <input
                        type="text"
                        placeholder="@username"
                        value={link.value}
                        onChange={(e) =>
                          handleInputChange(link.id, e.target.value)
                        }
                        className="w-full pl-12 pr-2 pt-2.5 pb-2.5 -ml-2 placeholder:text-sm placeholder:font-light
                             placeholder:text-theme-primaryText  rounded-3xl border font-normal border-theme-emptyEvent bg-transparent
                              text-theme-secondaryText focus:border-primary focus:ring-0 focus:outline-none"
                      />
                      {/* <img
                        src={imageMap[link.title]}
                        alt={link.title}
                        className="rounded-full w-8 h-8 absolute left-0 bottom-1.5"
                      /> */}
                      {link.title === "Threads" ? (
                        <>
                          <img
                            src={ThreadsLight}
                            className="dark:hidden rounded-full w-8 h-8 absolute left-0 bottom-1.5"
                            alt={link.value}
                            loading="lazy"
                          />
                          <img
                            src={imageMap[link.title]}
                            className="hidden dark:block rounded-full w-8 h-8 absolute left-0 bottom-1.5"
                            alt={link.value}
                            loading="lazy"
                          />
                        </>
                      ) : (
                        <img
                          src={imageMap[link.title]}
                          className="rounded-full w-8 h-8 absolute left-0 bottom-1.5"
                          alt={link.value}
                          loading="lazy"
                        />
                      )}
                    </div>
                    {link.value && (
                      <button
                        className=""
                        onClick={() => handleClearLink(link.id)}
                      >
                        <span className="text-xs font-light -ml-2 text-theme-secondaryText">
                          X
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            <div className="flex flex-col mt-4 mb-2 ml-9">
              <span className="text-theme-secondaryText text-sm font-inter font-light">
                if we missed something
              </span>
              <div className="flex items-center space-x-4 mt-1 mb-2">
                <div className="flex-grow relative">
                  <input
                    type="text"
                    value={other ?? ""}
                    placeholder="https://"
                    onChange={(e) => handleOtherLinkChange(e.target.value)}
                    className="w-full pl-12 pr-2  pt-2.5 pb-2.5 -ml-2 placeholder:text-sm placeholder:font-light placeholder:text-theme-primaryText 
                            rounded-3xl border font-normal border-theme-emptyEvent bg-transparent text-theme-secondaryText focus:border-primary focus:ring-0 focus:outline-none"
                  />

                  <img
                    src={Others}
                    alt="other-link"
                    loading="lazy"
                    className="rounded-full w-8 h-8 absolute left-0 bottom-1.5 dark:block hidden"
                  />
                  <img
                    src={DarkOther}
                    alt="other-link"
                    loading="lazy"
                    className="rounded-full w-8 h-8 absolute left-0 bottom-1.5 dark:hidden"
                  />
                </div>
                {other && (
                  <button
                    className=""
                    onClick={() => handleOtherLinkChange("")}
                  >
                    <span className="text-xs font-light -ml-2 text-textFieldColor">
                      X
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default LinkForm;
