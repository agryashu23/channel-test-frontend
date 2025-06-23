// Card.js
import React from "react";

const Card = ({ image, title, description }) => {
  return (
    <div className="w-48 h-48 rounded-lg shadow-md bg-primary p-4">
      <img
        src={image}
        alt={title}
        className="w-full h-24 object-cover rounded-t-lg mb-4"
      />
      <h2 className="text-lg font-semibold text-theme-secondaryText">
        {title}
      </h2>
      <p className="text-sm text-gray-300">{description}</p>
    </div>
  );
};

export default Card;
