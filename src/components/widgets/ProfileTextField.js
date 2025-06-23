import React from "react";

const ProfileTextField = ({ label, value, onChange, type = "text", name }) => {
  return (
    <div className="relative">
      <label className="absolute left-4 -top-2 text-xs font-light font-inter bg-theme-tertiaryBackground text-theme-secondaryText">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        name={name}
        className="w-full pt-3 pb-4 pl-4 pr-3  rounded-md border font-light font-inter border-theme-primaryText
         bg-theme-tertiaryBackground
         text-theme-secondaryText focus:border-primary focus:ring-0 focus:outline-none"
        placeholder=""
      />
    </div>
  );
};

export default ProfileTextField;
