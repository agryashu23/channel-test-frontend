import React, { useState, useEffect } from "react";
import ArrowForward from "../../assets/icons/arrow_forward.svg";
import ArrowForwardDark from "../../assets/icons/arrow_forward_dark.svg";
import ArrowDropDown from "../../assets/icons/arrow_drop_down.svg";
import ArrowDropUp from "../../assets/icons/arrow_drop_up.svg";
import Upload from "../../assets/icons/Upload.svg";
import UploadLight from "../../assets/lightIcons/upload_light.svg";
import Unsplash from "../../assets/icons/Unsplash.svg";
import UnsplashLight from "../../assets/lightIcons/unsplash_light.svg";
import Close from "../../assets/icons/Close.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  updateNewsletterField,
  testNewsletter,
  sendNewsletter,
  getTestNewsletterLimit,
  getNewsletterLimit,
} from "./../../redux/slices/newsletterSlice";
import useModal from "./../hooks/ModalHook";
import ItemsNewsletter from "./ItemsNewsletter";
import { validateEmail } from "./../../utils/methods";
import { useNavigate, useParams } from "react-router-dom";

const NewsletterForm = () => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { handleOpenModal } = useModal();
  const [emailError, setEmailError] = useState("");

  const newsletter = useSelector((state) => state.newsletter);
  const { letterstatus, records, recordStatus } = useSelector(
    (state) => state.newsletter
  );
  const myData = useSelector((state) => state.myData);
  const [showDropdown, setShowDropdown] = useState(false);

  const { username } = useParams();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (myData.username !== username) {
        navigate(`/profile/${username}/404`);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [myData.username, username, navigate]);

  // const handleNavigateHome = (value) => {
  //   navigate(`/`);
  // };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateNewsletterField({ field: name, value }));
  };

  const handleOpen = () => {
    handleOpenModal("modalNewsletterUnsplashOpen");
  };

  useEffect(() => {
    dispatch(getNewsletterLimit());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTestNewsletterLimit());
  }, [dispatch]);

  const handleImageClear = () => {
    dispatch(updateNewsletterField({ field: "image", value: null }));
    dispatch(updateNewsletterField({ field: "imageSource", value: "" }));
    setFile(null);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        dispatch(
          updateNewsletterField({ field: "image", value: reader.result })
        );
        dispatch(
          updateNewsletterField({ field: "imageSource", value: "upload" })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTestNewsletter = () => {
    if (!validateEmail(newsletter.email)) {
      setEmailError("Please enter a valid email address.");
    } else if (newsletter.description === "") {
      alert("Description can't be empty!");
    } else {
      setEmailError("");
      const formDataToSend = new FormData();
      formDataToSend.append("email", newsletter.email);
      formDataToSend.append("description", newsletter.description);
      formDataToSend.append("items", JSON.stringify(newsletter.selectedItems));
      if (file && newsletter.imageSource === "upload") {
        formDataToSend.append("file", file);
      } else if (newsletter.image && newsletter.imageSource === "unsplash") {
        formDataToSend.append("image", newsletter.image);
      }
      dispatch(testNewsletter(formDataToSend))
        .unwrap()
        .then((value) => {
          dispatch(updateNewsletterField({ field: "email", value: "" }));
        })
        .catch((error) => {
          dispatch(updateNewsletterField({ field: "email", value: "" }));
          alert(error);
        });
    }
  };
  const handleSubscribersNewsletter = () => {
    if (newsletter.description === "") {
      alert("Description can't be empty!");
    } else {
      const formDataToSend = new FormData();
      formDataToSend.append("description", newsletter.description);
      formDataToSend.append("items", JSON.stringify(newsletter.selectedItems));
      if (file && newsletter.imageSource === "upload") {
        formDataToSend.append("file", file);
      } else if (newsletter.image && newsletter.imageSource === "unsplash") {
        formDataToSend.append("image", newsletter.image);
      }
      dispatch(sendNewsletter(formDataToSend))
        .unwrap()
        .then(() => {
          dispatch(updateNewsletterField({ field: "description", value: "" }));
          dispatch(updateNewsletterField({ field: "image", value: null }));
          dispatch(updateNewsletterField({ field: "email", value: "" }));
          dispatch(
            updateNewsletterField({ field: "selectedItems", value: [] })
          );
          dispatch(getNewsletterLimit());
        })
        .catch((error) => {
          alert(error);
        });
    }
  };

  const handleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const isNameEmpty = newsletter.description?.trim() === "";
  const buttonClass = isNameEmpty
    ? "bg text-primaryGrey"
    : "bg-primary text-buttonText";

  const getDaysLeftInCurrentMonth = () => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth(); // 0-based index for months
    const totalDaysInMonth = new Date(
      currentYear,
      currentMonth + 1,
      0
    ).getDate(); // Get the total days in the current month
    const daysLeft = totalDaysInMonth - currentDate.getDate(); // Subtract the current day from the total
    return daysLeft;
  };

  return (
    <div className="flex flex-col pt-2 pr-4">
      {/* <div
        className="flex items-center cursor-pointer "
        onClick={handleNavigateHome}
      >
        <img
          src={ArrowBack}
          alt="arrow-back"
          className="text-primary font-normal text-lg font-inter"
        />
        <p className="ml-2 text-lightText text-xs font-light font-inter">
          Back to Home
        </p>
      </div> */}
      <div className="flex sm:flex-row flex-col">
        <div className="flex flex-col lg:w-1/3 md:w-2/5">
          <h1 className="text-white text-xl xs:text-2xl mt-5 sm:text-3xl font-medium font-familjen-grotesk tracking-wide ">
            Newsletter
          </h1>
          <div
            className={`relative  w-max px-3 mt-2.5 bg-chipBackground  ${
              showDropdown
                ? "border-t border-l border-r rounded-t-lg py-1.5"
                : "border rounded-full py-1"
            } border-dividerLine items-center flex flex-row justify-between`}
          >
            <div className="text-white text-sm font-light font-inter tracking-wide">
              {recordStatus === "loading" || records.length === 0
                ? "Loading..."
                : records[0].month}
            </div>
            <div className="flex items-center ml-5">
              <div
                className={`${
                  records.length > 0 && records[0].sent === 0
                    ? "text-errorLight"
                    : "text-primary"
                }  text-[13px] font-light font-inter`}
              >
                {recordStatus === "loading" || records.length === 0
                  ? ""
                  : records[0].sent + "/1 sent"}
              </div>
              {
                <img
                  src={showDropdown ? ArrowDropUp : ArrowDropDown}
                  alt="dropdown-toggle"
                  className="w-5 h-5 ml-1.5 cursor-pointer"
                  onClick={handleDropdown}
                />
              }
            </div>
            {showDropdown && (
              <div
                className="absolute  w-full top-[100%] bg-chipBackground border-b border-l border-r border-dividerLine
               -left-[1px] px-3 rounded-b-lg z-10"
                style={{
                  width: "calc(100% + 1.5px)",
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 6px 8px -1px rgba(0, 0, 0, 0.1)",
                }}
              >
                {records.map((record, index) => {
                  // Skip the first record (it's already displayed above)
                  if (index !== 0) {
                    return (
                      <div key={index} className="flex flex-col">
                        <div
                          className="w-full border-t my-1 border-borderColor"
                          style={{ height: "1px" }}
                        ></div>
                        <div className="flex flex-row justify-between items-center cursor-default rounded-md py-2">
                          <div className="text-white text-sm font-light font-inter tracking-wide">
                            {record.month}
                          </div>
                          <div
                            className={`text-primaryGrey text-[13px] font-light font-inter`}
                          >
                            {record.sent + "/1 sent"}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  const daysLeft = getDaysLeftInCurrentMonth();
                  return (
                    <p className="text-primaryGrey italic text-xs font-light font-inter py-1.5">
                      renews in {daysLeft} days
                    </p>
                  ); // Skip the first record from the dropdown
                })}
              </div>
            )}
          </div>

          <div className="mt-6">
            <label className="text-neutral-50 text-sm font-light font-inter">
              Description*
            </label>
            <textarea
              value={newsletter.description}
              onChange={handleChange}
              name="description"
              placeholder="Tell your audience what this newsletter is about"
              className="w-full mt-2 p-3 rounded-md bg-primaryBackground border border-lightText focus:outline-none text-white
           text-sm placeholder:text-sm placeholder:font-light placeholder:text-lightText"
              rows="10"
            />
          </div>
          <div className="mt-4">
            <p className="text-neutral-50 text-sm font-light font-inter">
              Add cover image to this newsletter
              <span className="italic !font-thin"> (optional)</span>
            </p>
            {!newsletter.image && (
              <div className="flex flex-row mt-3">
                <div className="relative bg-curationUnsplash w-1/2 px-2 py-5 rounded-xl cursor-pointer">
                  <div className="flex flex-col items-center justify-center">
                    <img
                      src={Upload}
                      alt="Upload"
                      className="dark:block hidden w-5 h-5 mb-2"
                    />
                    <img
                      src={UploadLight}
                      alt="Upload"
                      className="dark:hidden w-5 h-5 mb-2"
                    />
                    <p className="text-primary text-xs font-light font-inter">
                      Upload image
                    </p>
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>
                <div
                  className="bg-curationUnsplash w-1/2 py-5 px-1 xs:px-2 rounded-xl ml-4 cursor-pointer"
                  onClick={handleOpen}
                >
                  <div className="flex flex-col items-center">
                    <img
                      src={Unsplash}
                      alt="Unsplash"
                      className="dark:block hidden w-5 h-5 mb-2"
                    />
                    <img
                      src={UnsplashLight}
                      alt="Unsplash"
                      className="dark:hidden w-5 h-5 mb-2"
                    />
                    <p className="text-primary text-xs text-center font-light font-inter">
                      Select from Unsplash
                    </p>
                  </div>
                </div>
              </div>
            )}
            {newsletter.image && (
              <div className="relative mt-3">
                <img
                  src={newsletter.image}
                  alt="curation-image"
                  className="w-full h-44 object-cover rounded-xl"
                />
                <div className="absolute right-0 top-0 bg rounded-full w-6 h-6 flex justify-center items-center border">
                  <img
                    src={Close}
                    alt="close"
                    className="w-4 h-4 cursor-pointer"
                    onClick={handleImageClear}
                  />
                </div>
              </div>
            )}
            <div className="mt-6 sm:flex hidden flex-col">
              <div className="flex flex-row justify-between mb-2">
                <p className="text-neutral-50 text-sm font-light font-inter ">
                  Send test newsletter
                </p>
                <p className="text-primaryGrey text-xs font-light font-inter ">
                  Sent {5 - newsletter.tested_times}/5
                </p>
              </div>
              <div className="flex items-center relative">
                <input
                  value={newsletter.email}
                  onChange={handleChange}
                  name="email"
                  type="email"
                  placeholder="Enter email id to test newsletter"
                  className="w-full pl-4 py-3.5 pr-4 rounded-full bg-primaryBackground border border-lightText text-white
                            text-sm md:placeholder:text-sm   placeholder:text-xs placeholder:font-light placeholder:text-lightText focus:outline-none"
                />
                <div
                  className={`text-white p-1.5 absolute right-2 rounded-full cursor-pointer ${
                    newsletter.email === "" ? "bg" : "bg-primary"
                  } `}
                  onClick={handleTestNewsletter}
                >
                  <img
                    src={newsletter.email ? ArrowForward : ArrowForwardDark}
                    alt="arrow-right"
                  />
                </div>
              </div>
              <p className="text-errorLight text-xs mt-1 pl-2">{emailError}</p>
              <button
                className={` mt-6 py-3 lg:w-1/2 sm:w-4/5 w-3/4  font-normal text-sm rounded-full ${buttonClass}`}
                disabled={isNameEmpty}
                onClick={handleSubscribersNewsletter}
              >
                {letterstatus === "loading"
                  ? "Loading..."
                  : "Send to all subscribers"}
              </button>
            </div>
          </div>
        </div>
        <div className="flex sm:flex-row flex-col lg:w-2/3 md:w-3/5">
          <div
            className="sm:flex hidden border h-screen mx-5  border-borderColor"
            style={{ width: "0.1px" }}
          ></div>
          <div
            className="sm:hidden flex border w-full my-5  border-borderColor"
            style={{ height: "0.1px" }}
          ></div>
          <div className="flex flex-col lg:pl-2 w-full pr-2 overflow-y-auto custom-scrollbar h-screen">
            <p className="text-neutral-50 text-sm font-light font-inter mb-1">
              Select content that you would like to add to this newsletter
            </p>
            <p className="text-primaryGrey text-xs font-light font-inter  mb-5">
              Selected {newsletter.selectedItems.length}/5
            </p>
            <ItemsNewsletter />
          </div>
          <div className="mt-6 sm:hidden flex flex-col">
            <div className="flex flex-row justify-between mb-2">
              <p className="text-neutral-50 text-sm font-light font-inter ">
                Send test newsletter
              </p>
              <p className="text-primaryGrey text-xs font-light font-inter ">
                Sent {5 - newsletter.tested_times}/5
              </p>
            </div>
            <div className="flex items-center relative">
              <input
                value={newsletter.email}
                onChange={handleChange}
                name="email"
                type="email"
                placeholder="Enter email id to test newsletter"
                className="w-full pl-4 py-3.5 pr-4 rounded-full bg-primaryBackground border border-lightText text-white
                            text-sm md:placeholder:text-sm   placeholder:text-xs placeholder:font-light placeholder:text-lightText focus:outline-none"
              />
              <div
                className={`text-white p-1.5 absolute right-2 rounded-full cursor-pointer ${
                  newsletter.email === "" ? "bg" : "bg-primary"
                } `}
                onClick={handleTestNewsletter}
              >
                <img
                  src={newsletter.email ? ArrowForward : ArrowForwardDark}
                  alt="arrow-right"
                />
              </div>
            </div>
            <p className="text-errorLight text-xs mt-1 pl-2">{emailError}</p>
            <button
              className={` mt-6 py-3 lg:w-1/2 sm:w-4/5 w-3/4  font-normal text-sm rounded-full ${buttonClass}`}
              disabled={isNameEmpty}
              onClick={handleSubscribersNewsletter}
            >
              {letterstatus === "loading"
                ? "Loading..."
                : "Send to all subscribers"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterForm;
