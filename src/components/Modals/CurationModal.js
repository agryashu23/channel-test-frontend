import { React, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import Close from "../../assets/icons/Close.svg";
import Upload from "../../assets/icons/Upload.svg";
import UploadLight from "../../assets/lightIcons/upload_light.svg";
import Unsplash from "../../assets/icons/Unsplash.svg";
import UnsplashLight from "../../assets/lightIcons/unsplash_light.svg";
import { postRequestAuthenticated } from "./../../services/rest";
import { useSelector, useDispatch } from "react-redux";
import {
  setCurationField,
  clearCuration,
} from "../../redux/slices/curationSlice";
import { updateCuration } from "../../redux/slices/profileItemsSlice";
import useModal from "./../hooks/ModalHook";
import { closeModal } from "../../redux/slices/modalSlice";
import { createCuration } from "../../redux/slices/profileItemsSlice";
import { updateCurationPage } from "../../redux/slices/curationPageSlice";
import Compressor from "compressorjs";

const CurationModal = () => {
  // const categories = [
  //   "Technology",
  //   "Art & Design",
  //   "Entertainment",
  //   "Travel",
  //   "Fashion & Lifestyle",
  //   "Food",
  //   "Education",
  //   "Social Impact",
  // ];
  const { handleOpenModal } = useModal();

  const handleOpen = () => {
    handleOpenModal("modalCurationUnsplashOpen");
  };

  const handleClose = () => {
    dispatch(clearCuration());
    setFile(null);
    setError("");
    dispatch(closeModal("modalCurationOpen"));
  };

  const curationImages = {
    Technology:
      "https://chips-social.s3.ap-south-1.amazonaws.com/curationImages/Technology.jpg",
    "Art & Design":
      "https://chips-social.s3.ap-south-1.amazonaws.com/curationImages/Art%2520%2526%2520Design.jpg",
    Entertainment:
      "https://chips-social.s3.ap-south-1.amazonaws.com/curationImages/Entertainment.jpg",
    Travel:
      "https://chips-social.s3.ap-south-1.amazonaws.com/curationImages/Travel.jpg",
    "Fashion & Lifestyle":
      "https://chips-social.s3.ap-south-1.amazonaws.com/curationImages/Fashion%2520%2526%2520Lifestyle.jpg",
    Food: "https://chips-social.s3.ap-south-1.amazonaws.com/curationImages/Food.jpg",
    Education:
      "https://chips-social.s3.ap-south-1.amazonaws.com/curationImages/Education.jpg",
    "Social Impact":
      "https://chips-social.s3.ap-south-1.amazonaws.com/curationImages/Community.jpg",
    NoCategory:
      "https://chips-social.s3.ap-south-1.amazonaws.com/curationImages/empty_curation.png",
  };

  const [error, setError] = useState("");
  const [file, setFile] = useState(null);

  const dispatch = useDispatch();
  const curation = useSelector((state) => state.curation);
  const Curationstatus = useSelector(
    (state) => state.profileItems.curationstatus
  );

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        alert(
          `The file "${file.name}" exceeds the 20 MB size limit and will not be uploaded.`
        );
        return;
      }

      if (file.size >= 7 * 1024 * 1024) {
        new Compressor(file, {
          quality: 0.5,
          maxWidth: 1920,
          maxHeight: 1080,
          success(result) {
            setFile(result);
            const reader = new FileReader();
            reader.onloadend = () => {
              dispatch(
                setCurationField({ field: "image", value: reader.result })
              );
              dispatch(
                setCurationField({ field: "imageSource", value: "upload" })
              );
            };
            reader.readAsDataURL(result);
          },
          error(err) {
            alert("Image compression failed: " + err);
          },
        });
      } else {
        setFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          dispatch(setCurationField({ field: "image", value: reader.result }));
          dispatch(setCurationField({ field: "imageSource", value: "upload" }));
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleCategorySelect = (category) => {
    dispatch(setCurationField({ field: "category", value: category }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name") {
      setCharCount(value.length);
    }
    if (name === "description") {
      setDescCount(value.length);
    }
    dispatch(setCurationField({ field: name, value }));
  };

  const checkCurationName = async (name) => {
    if (name !== "") {
      try {
        const response = await postRequestAuthenticated(
          "/check/curation/name",
          { name }
        );
        if (response.success) {
          dispatch(
            setCurationField({ field: "curationNameError", value: false })
          );
          return true;
        } else {
          dispatch(
            setCurationField({ field: "curationNameError", value: true })
          );
          return false;
        }
      } catch (error) {
        console.error("Error checking curation name:", error);
        dispatch(setCurationField({ field: "curationNameError", value: true }));
        return false;
      }
    } else {
      dispatch(setCurationField({ field: "curationNameError", value: true }));
      return false;
    }
  };

  const handleCreateCuration = async (e) => {
    e.preventDefault();
    setError("");

    const isNameUnique = await checkCurationName(curation.name);
    if (!isNameUnique) {
      return;
    }

    if (curation.name.trim !== "") {
      const formDataToSend = new FormData();
      formDataToSend.append("name", curation.name.trim());
      formDataToSend.append("visibility", curation.visibility);
      formDataToSend.append("description", curation.description);
      formDataToSend.append("category", curation.category);
      formDataToSend.append("profile_category", curation.profile_category);
      if (file && curation.imageSource === "upload") {
        formDataToSend.append("file", file);
      } else if (curation.image && curation.imageSource === "unsplash") {
        formDataToSend.append("image", curation.image);
      } else {
        const encodedCategory = curation.category
          ? curation.category
          : "NoCategory";
        const imageUrl = curationImages[encodedCategory];
        formDataToSend.append("image", imageUrl);
      }
      dispatch(createCuration(formDataToSend))
        .unwrap()
        .then(() => {
          handleClose();
          dispatch(clearCuration());
          setFile(null);
          setError("");
        })
        .catch((error) => {
          alert(error);
        });
    }
  };
  const handleEditCuration = async (e) => {
    e.preventDefault();
    setError("");
    if (curation.name.trim !== "") {
      const formDataToSend = new FormData();
      formDataToSend.append("id", curation._id);
      formDataToSend.append("name", curation.name.trim());
      formDataToSend.append("visibility", curation.visibility);
      formDataToSend.append("description", curation.description);
      formDataToSend.append("category", curation.category);
      if (file && curation.imageSource === "upload") {
        formDataToSend.append("file", file);
      } else if (curation.image && curation.imageSource === "unsplash") {
        formDataToSend.append("image", curation.image);
      } else if (curation.image) {
        formDataToSend.append("image", curation.image);
      } else {
        const encodedCategory = curation.category
          ? curation.category
          : "NoCategory";
        const imageUrl = curationImages[encodedCategory];
        formDataToSend.append("image", imageUrl);
      }
      dispatch(updateCuration(formDataToSend))
        .unwrap()
        .then((curation) => {
          handleClose();
          dispatch(updateCurationPage(curation));
          dispatch(clearCuration());
          setFile(null);
          setError("");
        })
        .catch((error) => {
          alert(error);
        });
    }
  };
  const curationNameError = useSelector(
    (state) => state.curation.curationNameError
  );

  const handleImageClear = () => {
    dispatch(setCurationField({ field: "image", value: null }));
    dispatch(setCurationField({ field: "imageSource", value: "" }));
  };

  const [charCount, setCharCount] = useState(0);
  const [descCount, setDescCount] = useState(0);
  const maxChars = 50;
  const maxDesc = 250;
  const isNameEmpty = curation.name.trim() === "";
  const buttonClass = isNameEmpty
    ? "text-theme-buttonDisableText text-theme-opacity-40 bg-theme-buttonDisable bg-theme-opacity-10"
    : "bg-theme-secondaryText text-theme-primaryBackground";
  const isOpen = useSelector((state) => state.modals.modalCurationOpen);

  // console.log(curationNameError);

  return (
    <Dialog.Root open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-70 z-50" />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Dialog.Content className="bg-theme-secondaryBackground rounded-xl overflow-hidden shadow-xl transform transition-all min-h-[20%] max-h-[80%] overflow-y-auto custom-scrollbar w-[90%] xs:w-3/4 sm:w-1/2 md:w-2/5 lg:w-[35%] xl:w-[30%]">
            <Dialog.Title />
            <div className="flex flex-col p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-theme-secondaryText text-lg font-normal fonr-inter">
                  {curation.type === "edit" ? "Edit Curation" : "New curation"}
                </h2>
                <img
                  src={Close}
                  alt="Close"
                  className="w-4 h-4 cursor-pointer"
                  onClick={handleClose}
                />
              </div>
              <div className="mb-5">
                <div className="flex flex-row justify-between">
                  <p className="text-theme-secondaryText text-sm font-light font-inter">
                    What are you curating?
                  </p>
                  <div className="text-theme-primaryText text-xs font-light font-inter">
                    {charCount}/50
                  </div>
                </div>
                <input
                  id="curation-name"
                  className="w-full mt-3 p-1 rounded bg-chipBackground 
                   placeholder:font-light placeholder:text-sm  text-sm font-light
                   focus:outline-none bg-transparent border-b border-theme-chatDivider  text-theme-secondaryText  placeholder:text-theme-emptyEvent"
                  type="text"
                  name="name"
                  value={curation.name}
                  onChange={handleChange}
                  maxLength={maxChars}
                  autoComplete="off"
                  placeholder="Name of this curation"
                />
                {curationNameError && (
                  <p
                    className={`text-theme-error  font-light ml-1 font-inter text-xs`}
                  >
                    {curation.name === ""
                      ? "Name can't be empty"
                      : "Curation name already exist."}
                  </p>
                )}
              </div>
              <div className="mb-5 mt-1">
                <p className="text-theme-secondaryText text-sm font-light font-inter">
                  Who can add content to this curation?
                </p>
                <div className="flex flex-row mt-3 items-center space-x-6">
                  <label
                    className={`${
                      curation.visibility === "anyone"
                        ? "text-theme-secondaryText"
                        : "text-theme-primaryText"
                    } text-sm font-light flex items-center`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value="anyone"
                      className="mr-2  custom-radio"
                      checked={curation.visibility === "anyone"}
                      onChange={handleChange}
                    />
                    <span>Anyone</span>
                  </label>
                  <label
                    className={`${
                      curation.visibility === "invite"
                        ? "text-theme-secondaryText"
                        : "text-theme-primaryText"
                    } text-sm font-light flex items-center`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value="invite"
                      className="mr-2 custom-radio"
                      checked={curation.visibility === "invite"}
                      onChange={handleChange}
                    />
                    <span>Invite only</span>
                  </label>
                  <label
                    className={`${
                      curation.visibility === "me"
                        ? "text-theme-secondaryText"
                        : "text-theme-primaryText"
                    } text-sm font-light flex items-center`}
                  >
                    <input
                      type="radio"
                      name="visibility"
                      value="me"
                      className="mr-2 custom-radio"
                      checked={curation.visibility === "me"}
                      onChange={handleChange}
                    />
                    <span>Only me</span>
                  </label>
                </div>
              </div>
              <div className="relative mb-2">
                <p className="text-theme-secondaryText text-sm font-light font-inter mb-2">
                  Description for your curation
                </p>
                <textarea
                  value={curation.description}
                  onChange={handleChange}
                  name="description"
                  maxLength={maxDesc}
                  className="w-full text-sm pt-3 font-inter pb-4 pl-4 pr-3 rounded-lg border
                   font-light border-theme-chatDivider bg-transparent text-theme-secondaryText focus:border-primary
                    focus:ring-0 focus:outline-none placeholder:text-theme-emptyEvent placeholder:text-sm placeholder:font-light"
                  rows="4"
                  placeholder="Add a description (optional)"
                />
                <div className="text-theme-primaryText absolute right-2 bottom-3 text-xs text-textfieldBorder">
                  {descCount}/{maxDesc}
                </div>
              </div>
              <div className="mb-4 mt-1">
                <p className="text-theme-secondaryText text-sm font-light font-inter">
                  Add cover image to this curation
                </p>
                {!curation.image && (
                  <div className="flex flex-row mt-2">
                    <div className="relative border border-theme-chatDivider w-1/2 px-2 py-4 rounded-xl cursor-pointer">
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
                        <p className="text-theme-secondaryText text-xs font-light font-inter">
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
                      className="w-1/2 py-4 px-1 border xs:px-2 rounded-xl ml-4 cursor-pointer border-theme-chatDivider"
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
                        <p className="text-theme-secondaryText text-xs text-center font-light font-inter">
                          Select from Unsplash
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {curation.image && (
                  <div className="relative mt-2">
                    <img
                      src={curation.image}
                      alt="curation-image"
                      className="w-full h-36 object-cover rounded-xl"
                    />

                    <div className="absolute right-1 top-1 bg-[#edecea] bg-opacity-70 rounded-full w-5 h-5 flex justify-center items-center p-1 shadow-lg">
                      <img
                        src={Close}
                        alt="close"
                        className="w-3 h-3 cursor-pointer"
                        onClick={handleImageClear}
                      />
                    </div>
                  </div>
                )}
              </div>
              {/* <div className="mb-4">
                <div className="flex flex-row justify-between items-center">
                  <p className="text-theme-secondaryText text-sm font-light font-inter">
                    Publish on explore tab
                  </p>
                  {curation.category && (
                    <img
                      src={Close}
                      alt="close"
                      className="w-4 h-4 cursor-pointer"
                      onClick={() =>
                        dispatch(
                          setCurationField({ field: "category", value: "" })
                        )
                      }
                    />
                  )}
                </div>
                <p className="text-primaryGrey text-xs font-inter my-1 mb-3">
                  Where people can find this curation (optional)
                </p>
                <div className="flex flex-wrap gap-3">
                  {categories.map((tag, index) => (
                    <button
                      key={index}
                      className={`px-3 py-2 rounded-full text-xs font-light ${
                        curation.category === tag
                          ? "bg-primary text-buttonText font-normal"
                          : "bg-categoryBackground text-primary"
                      }`}
                      onClick={() => handleCategorySelect(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div> */}
              <div className="my-2 text-errorLight font-light text-sm">
                {error}
              </div>
              <button
                className={`w-full mt-3 py-2.5 font-normal text-sm rounded-lg ${buttonClass}`}
                disabled={isNameEmpty}
                onClick={
                  curation.type === "edit"
                    ? handleEditCuration
                    : handleCreateCuration
                }
              >
                {Curationstatus === "loading"
                  ? "Please wait..."
                  : curation.type === "edit"
                  ? "Save Changes"
                  : "Create new curation"}
              </button>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CurationModal;
