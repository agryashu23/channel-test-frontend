import { React, useState } from "react";

import { useSelector } from "react-redux";
import ProfileTextField from "../../widgets/ProfileTextField";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import OtpInput from "react-otp-input";
import "./phoneInputOverrides.css";
import { useDispatch } from "react-redux";
import {
  updateWhatsAppNumber,
  saveWhatsAppNumber,
} from "../../../redux/slices/myDataSlice";
import { ChannelImages } from "../../constants/images";

const DetailsForm = ({ formData, onFieldChange, handleImageUpload }) => {
  const isDark = document.documentElement.classList.contains("dark");

  const [charCount, setCharCount] = useState(
    formData.description ? formData.description.length : 0
  );
  const [otpPage, setOtpPage] = useState(false);
  const [otpBackend, setOtpBackend] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const maxChars = 500;
  const isUsernameError = useSelector(
    (state) => state.profileData.usernameError
  );

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "description") {
      setCharCount(value.length);
      onFieldChange(name, value);
    } else if (name === "username") {
      const regex = /^[a-z0-9]*$/;
      if (regex.test(value)) {
        onFieldChange(name, value);
      }
    } else {
      onFieldChange(name, value);
    }
  };

  const handlePhoneChange = (value, countryData) => {
    const countryCode = `+${countryData.dialCode}`;
    const phoneNumber = value.slice(countryData.dialCode.length);
    const formattedNumber = `${countryCode}-${phoneNumber}`;
    const name = "contact";
    onFieldChange(name, formattedNumber);
  };

  const handleSave = () => {
    console.log(formData.contact);
    if (formData.contact.length < 13) {
      return;
    }
    dispatch(updateWhatsAppNumber(formData.contact))
      .unwrap()
      .then((response) => {
        console.log(response);
        setOtpBackend(response.otp);
        setOtpPage(true);
        setError("");
      })
      .catch((error) => {
        setError(error);
        setOtpPage(false);
      });
  };

  const handleChangeOtp = async (value) => {
    setOtp(value);
    if (value.length === 6 && value.toString() === otpBackend) {
      dispatch(saveWhatsAppNumber(formData.contact))
        .unwrap()
        .then(() => {
          setOtpPage(false);
          setOtp("");
          setError("");
        })
        .catch((error) => {
          setError(error);
        });
    } else if (value.length === 6) {
      setError("Enter Correct Otp");
    }
  };

  return (
    <div className="flex flex-col ">
      <div className="flex justify-start items-center">
        <div className="mt-2 w-16 h-16 relative">
          {formData.logo ? (<img
            src={formData.logo}
            alt=""
            className="rounded-full w-full h-full   object-cover "
            style={{ borderWidth: "2px" }}
          />):formData.color_logo?<div className="rounded-full w-full h-full shrink-0  flex items-center justify-center  object-cover "
            style={{ backgroundColor: formData?.color_logo }}
          >
            <img
              src={ChannelImages.ColorProfile.default}
              alt="color-profile"
              className="w-8 h-8"
            />
          </div>:<img src={ChannelImages.Profile.default} alt="" className="rounded-full w-full h-full   object-cover "/>}
          
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gray-800 bg-opacity-50 flex justify-center items-center rounded-b-full cursor-pointer">
            <span className="text-theme-secondaryText text-xs  cursor-pointer font-extralight">
              {formData.logo ? "Edit" : "Add"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={handleImageUpload}
            />
          </div>
        </div>
      </div>
      <form className="space-y-8 mt-5">
        {/* <ProfileTextField
          label="Full Name"
          value={formData.name}
          onChange={handleChange}
          name="name"
        /> */}
        <div className="relative">
          <label className="absolute left-4 -top-2 text-xs z-20 font-light bg-theme-tertiaryBackground text-theme-emptyEvent px-1">
            Full Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={handleChange}
            name="name"
            className="w-full pt-3 pb-4 pl-4 pr-3 text-sm rounded-md border font-extralight  border-theme-emptyEvent bg-transparent text-theme-secondaryText focus:border-theme-emptyEvent focus:ring-0 focus:outline-none"
            placeholder=""
          />
        </div>
        <div className="flex flex-col">
          <div className="relative">
            <label className="absolute left-4 -top-2 text-xs font-light bg-theme-tertiaryBackground text-theme-emptyEvent px-1">
              User name
            </label>
            <input
              type="text"
              value={formData.username}
              maxLength={40}
              onChange={handleChange}
              name="username"
              className="w-full pt-3 pb-4 pl-4 pr-3 text-sm rounded-md border font-extralight border-theme-emptyEvent bg-transparent text-theme-secondaryText focus:border-theme-emptyEvent focus:ring-0 focus:outline-none"
              placeholder=""
            />
          </div>
          {isUsernameError && (
            <p
              className={`text-theme-error  font-extralight ml-1  text-xs`}
            >
              {formData.username === ""
                ? "Username can't be empty"
                : "Username already exist."}
            </p>
          )}
        </div>
        <div className="relative">
          <label className="absolute left-4 -top-2 text-xs font-light   bg-theme-tertiaryBackground text-theme-emptyEvent px-1 z-50">
            Whatsapp Number
          </label>
          <div className="flex items-center rounded-md ">
            <PhoneInput
              country="in"
              value={formData.contact}
              onChange={handlePhoneChange}
              containerClass="custom-phone-input"
              dropdownClass="z-50"
              placeholder="Enter contact number"
              excludeCountries={["id"]}
            />
          </div>
          {/* <div className={`absolute top-3.5 cursor-pointer right-2 text-xs p-1 rounded-md  z-60
            ${formData.contact.length < 13 ? "text-theme-buttonDisableText bg-theme-buttonDisable" : "text-theme-secondaryText bg-theme-buttonEnable"}`}
            onClick={handleSave}
            >Verify</div> */}
          {error && <p className="text-theme-error text-xs ml-1 mt-1 font-extralight">{error}</p>}
          {otpPage && <OtpInput
                value={otp}
                onChange={handleChangeOtp}
                numInputs={6}
                renderSeparator={<span className="w-2"></span>}
                renderInput={(props) => (
                  <input
                    {...props}
                    style={{
                      width: "30px",
                      height: "36px",
                      border: "none",
                      borderBottom: isDark
                        ? "2px solid white"
                        : "2px solid #edecea", // bottom underline
                      backgroundColor: "transparent", // no box background
                      textAlign: "center",
                      color: isDark ? "white" : "#202020",
                      outline: "none", // removes blue highlight on focus
                      fontSize: "16px",
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                  />
                )}
              />}

        </div>

        <div className="relative">
          <label className="absolute left-4 -top-2 text-xs z-20 light  bg-theme-tertiaryBackground text-theme-emptyEvent px-1">
            Location
          </label>
          <input
            type="text"
            value={formData.location}
            onChange={handleChange}
            name="location"
            className="w-full pt-3 pb-4 pl-4 pr-3 text-sm rounded-md border font-extralight  border-theme-emptyEvent bg-transparent text-theme-secondaryText focus:border-theme-emptyEvent focus:ring-0 focus:outline-none"
            placeholder=""
          />
        </div>

        <div className="relative">
          <label
            className="absolute left-4 -top-2 text-xs font-light 
           bg-theme-tertiaryBackground text-theme-emptyEvent z-00 px-1"
          >
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={handleChange}
            name="description"
            maxLength={maxChars}
            className="w-full text-sm pt-4  pb-4 pl-4 pr-3 rounded-lg 
            border font-extralight text-sm border-theme-emptyEvent bg-transparent text-theme-secondaryText focus:border-primary focus:ring-0 focus:outline-none"
            rows="3"
            placeholder=""
          />
          <div className="text-right absolute right-2 bottom-3 text-xs text-theme-primaryText">
            {charCount}/{maxChars}
          </div>
        </div>
        {/* <ProfileTextField
          label="Custom button display text"
          value={formData.customText}
          onChange={handleChange}
          name="customText"
        />
        <ProfileTextField
          label="Custom button link"
          value={formData.customUrl}
          onChange={handleChange}
          name="customUrl"
        /> */}
        <div className="mt-1"></div>
      </form>
    </div>
  );
};

export default DetailsForm;
