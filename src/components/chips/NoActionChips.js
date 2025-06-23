import React, { useState } from "react";
import MetaCard from "../chips/widgets/MetaCard";
import GoogleMapsCard from "../chips/widgets/googleMapsCard";
import DateTimeCard from "../chips/widgets/DateTime";
import ImageList from "../chips/widgets/ImageList";
import RenderLink from "../chips/widgets/videoPlayer";
import DocumentPreview from "./widgets/DocumentPreview";
import Linkify from "react-linkify";

const NoActionChips = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 250;

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
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
    <div className="container pl-4 pb-4 w-full pt-4 rounded-lg space-y-2.5 border border-borderColor bg-chipBackground ">
      <div className="flex flex-col space-y-2.5">
        {
          <Linkify componentDecorator={componentDecorator}>
            <div className="w-full pr-1 overflow-hidden">
              <p className="text-theme-secondaryText text-sm font-light font-inter whitespace-pre-wrap break-words">
                {isExpanded
                  ? item.text
                  : `${item.text.slice(0, maxLength)}${
                      item.text.length > maxLength ? "..." : ""
                    }`}
                {item.text.length > maxLength && (
                  <span
                    onClick={toggleReadMore}
                    className="text-theme-secondaryText cursor-pointer ml-1"
                  >
                    {isExpanded ? "<- Show Less" : "Read More ->"}
                  </span>
                )}
              </p>
            </div>
          </Linkify>
        }
        {item.date.date && item.date.event && <DateTimeCard item={item.date} />}
        {item.location.text && <GoogleMapsCard item={item.location} />}
        {item.document && item.document.url !== "" && (
          <div className="mr-3">
            <DocumentPreview document={item.document} />
          </div>
        )}
        {item.link && !item.metaLink?.ogTitle && <RenderLink url={item.link} />}
        {item.image_urls.length !== 0 && (
          <ImageList imageCards={item.image_urls} />
        )}
        {item.metaLink && item.metaLink?.ogTitle !== "" && (
          <MetaCard
            title={item.metaLink.ogTitle}
            description={item.metaLink.ogDescription}
            imageUrl={item.metaLink.ogImage}
            link={item.link}
          />
        )}
      </div>
    </div>
  );
};

export default NoActionChips;
