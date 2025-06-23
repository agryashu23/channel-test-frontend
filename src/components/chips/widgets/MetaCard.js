import React from "react";
// import Logo from "../../../assets/icons/chips.png";

const MetaCard = ({ title, description, imageUrl, link }) => {
  // const isValidUrl = imageUrl && imageUrl.startsWith("https://");
  const fallbackImage =
    "https://www.netsuite.com/portal/assets/img/business-articles/data-warehouse/social-metadata.jpg";

  const handleImageError = (event) => {
    event.target.src = fallbackImage; // Set fallback image if the main image fails to load
  };
  return (
    <div className="max-w-md bg rounded-xl border border-theme-chatDivider overflow-hidden mr-4 p-1">
      <a href={link} className="block">
        <div className="px-1.5 py-1.5">
          <div className="text-sm font-normal font-inter text-theme-buttonEnable">
            {title}
          </div>
          <p className="mt-1 text-theme-primaryText text-xs font-normal font-inter">
            {description.length > 100
              ? `${description.slice(0, 100)}...`
              : description}
          </p>
        </div>
        <div className="px-1 py-1">
          <img
            className="w-full rounded-md max-h-44 object-cover"
            src={imageUrl || fallbackImage}
            alt={title} // Use the title as a more descriptive alt text
            onError={handleImageError} // Handle the error case
          />
        </div>
      </a>
    </div>
  );
};
export default MetaCard;
