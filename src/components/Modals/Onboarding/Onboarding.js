// import React, { useState } from "react";
// import * as Dialog from "@radix-ui/react-dialog";
// import Tick from "../../../assets/icons/successTick.svg";
// import LinkOnboard from "../../../assets/onboarding/link_onboard.svg";
// import ProfileOnboard from "../../../assets/onboarding/personal_details_image.svg";
// import DomainOnboard from "../../../assets/onboarding/domain_image.svg";
// import Instagram from "../../../assets/links/Instagram.svg";
// import Youtube from "../../../assets/links/Youtube.svg";
// import Linkedin from "../../../assets/links/Linkedin.svg";
// import Spotify from "../../../assets/links/Spotify.svg";
// import Github from "../../../assets/links/Github.svg";
// import Behance from "../../../assets/links/Behance.svg";
// import Threads from "../../../assets/links/Threads.svg";
// import Facebook from "../../../assets/links/Facebook.svg";
// import Twitter from "../../../assets/links/Twitter.svg";
// import Buymecoffee from "../../../assets/links/Buymecoffee.png";
// import ProfileSvg from "../../../assets/images/profile.svg";
// import OnboardTextField from "./OnboardTextField";
// import { useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   postRequestAuthenticated,
//   postRequestUnAuthenticated,
//   postRequestAuthenticatedWithFile,
// } from "./../../../services/rest";
// import {
//   getUserData,
//   setAuthCookies,
//   getAuthToken,
// } from "./../../../services/cookies";
// import { updateUser } from "../../../redux/slices/authSlice";
// import { closeModal } from "../../../redux/slices/modalSlice";
// import { updateMyField } from "../../../redux/slices/myDataSlice";
// import { domainUrl } from "./../../../utils/globals";
// import Profile from "../../../assets/icons/profile.svg";
// import { getCsrfToken } from "../../../services/csrfToken";

// const initialLinks = [
//   {
//     id: "1",
//     title: "Instagram",
//     url: "https://www.instagram.com/",
//     image:
//       "https://chips-social.s3.ap-south-1.amazonaws.com/links/Instagram.svg",
//     value: "",
//   },
//   {
//     id: "2",
//     title: "Youtube",
//     url: "https://www.youtube.com/c/",
//     image: "https://chips-social.s3.ap-south-1.amazonaws.com/links/Youtube.svg",
//     value: "",
//   },
//   {
//     id: "3",
//     title: "Linkedin",
//     url: "https://www.linkedin.com/in/",
//     image:
//       "https://chips-social.s3.ap-south-1.amazonaws.com/links/linkedin.svg",
//     value: "",
//   },
//   {
//     id: "4",
//     title: "Spotify",
//     url: "https://open.spotify.com/account/",
//     image: "https://chips-social.s3.ap-south-1.amazonaws.com/links/Spotify.svg",
//     value: "",
//   },
//   {
//     id: "5",
//     title: "Github",
//     url: "https://github.com/",
//     image: "https://chips-social.s3.ap-south-1.amazonaws.com/links/Github.svg",
//     value: "",
//   },
//   {
//     id: "6",
//     title: "Behance",
//     url: "https://www.behance.net/",
//     image: "https://chips-social.s3.ap-south-1.amazonaws.com/links/Behance.svg",
//     value: "",
//   },
//   {
//     id: "7",
//     title: "Threads",
//     url: "https://www.threads.net/",
//     image: "https://chips-social.s3.ap-south-1.amazonaws.com/links/threads.svg",
//     value: "",
//   },
//   {
//     id: "8",
//     title: "Facebook",
//     url: "https://www.facebook.com/",
//     image:
//       "https://chips-social.s3.ap-south-1.amazonaws.com/links/Facebook.svg",
//     value: "",
//   },
//   {
//     id: "9",
//     title: "Twitter",
//     url: "https://twitter.com/",
//     image: "https://chips-social.s3.ap-south-1.amazonaws.com/links/X.svg",
//     value: "",
//   },
//   {
//     id: "10",
//     title: "Buymecoffee",
//     url: "https://www.buymeacoffee.com/",
//     image:
//       "https://chips-social.s3.ap-south-1.amazonaws.com/links/Buy+Me+Coffee.svg",
//     value: "",
//   },
// ];

// const OnboardingModal = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const isOpen = useSelector((state) => state.modals.modalOnboardOpen);
//   const auth = useSelector((state) => state.auth);
//   const [boardindex, setIndex] = useState(0);
//   const [file, setFile] = useState(null);
//   const [links, setLinks] = useState(initialLinks);
//   const [formData, setFormData] = useState({
//     logo: ProfileSvg,
//     contact: "",
//     location: "",
//     description: "",
//     customText: "",
//     customUrl: "",
//   });
//   const [isUsername, setIsUsername] = useState(null);
//   const [domainName, setDomainName] = useState("");

//   const [isUsernameLoading, setUsernameLoading] = useState(false);
//   const [charCount, setCharCount] = useState(0);
//   const maxChars = 500;
//   const csrfToken = getCsrfToken();

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "description") {
//       setCharCount(value.length);
//     }
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };
//   const handleClose = () => {
//     dispatch(closeModal("modalOnboardOpen"));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     handleClose();
//     navigate(`/account/${auth.user.username}`);
//   };

//   const handleSkip = () => {
//     if (boardindex === 0) {
//       setIndex(1);
//     } else if (boardindex === 1) {
//       setIndex(2);
//     } else {
//       handleClose();
//       setIndex(0);
//       navigate(`/account/${auth.user.username}`);
//     }
//   };

//   const handleDomainChange = (e) => {
//     const value = e.target.value;
//     const regex = /^[a-z0-9]*$/;
//     if (regex.test(value)) {
//       setDomainName(value);
//     }
//   };

//   const checkUsername = async () => {
//     if (domainName !== "") {
//       try {
//         setUsernameLoading(true);
//         const response = await postRequestUnAuthenticated("/check/username", {
//           username: domainName,
//         });
//         setIsUsername(response.success);
//         return response.success;
//       } catch (error) {
//         console.error("Error checking username", error);
//         return false;
//       } finally {
//         setUsernameLoading(false);
//       }
//     }
//     return false;
//   };

//   const handleClaimDomain = async (e) => {
//     e.preventDefault(); // Prevent default form submission behavior
//     const isAvailable = await checkUsername(); // Wait for checkUsername to complete and get the result

//     if (domainName !== "" && isAvailable) {
//       try {
//         const response = await postRequestAuthenticated("/claim/username", {
//           username: domainName,
//         });
//         // console.log(response);
//         if (response.success === true) {
//           const currentUser = getUserData();
//           if (currentUser) {
//             currentUser.username = domainName;
//             setAuthCookies(getAuthToken(), currentUser);
//           }
//           dispatch(updateUser({ username: domainName }));
//           dispatch(updateMyField({ name: "username", value: domainName }));
//           setIndex(1);
//         } else {
//           setIsUsername(false);
//         }
//       } catch (error) {
//         console.error("Error claiming domain", error);
//       }
//     }
//   };

//   const handleLinks = async (e) => {
//     try {
//       const response = await postRequestAuthenticated("/update/links", {
//         links: links,
//       });
//       // console.log(response);
//       if (response.success === true) {
//         setIndex(2);
//       } else {
//         alert("Please try again");
//       }
//     } catch (error) {
//       console.error("Error updating links", error);
//     }
//   };
//   const handleSaveOnboard = async (e) => {
//     e.preventDefault();
//     const formDataToSend = new FormData();
//     formDataToSend.append("contact", formData.contact);
//     formDataToSend.append("location", formData.location);
//     formDataToSend.append("description", formData.description);
//     formDataToSend.append("customText", formData.customText);
//     formDataToSend.append("customUrl", formData.customUrl);
//     if (file) {
//       formDataToSend.append("file", file);
//     }

//     try {
//       const response = await postRequestAuthenticatedWithFile(
//         "/update/details/profile",
//         formDataToSend
//       );
//       // console.log(response);
//       if (response.success === true) {
//         handleClose();
//         navigate(`/profile/${response.user.username}`);
//       } else {
//         alert("Please try again");
//       }
//     } catch (error) {
//       console.error("Error updating profile", error);
//     }
//   };

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData((prevData) => ({
//           ...prevData,
//           logo: reader.result,
//         }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };
//   const imageMap = {
//     Instagram,
//     Youtube,
//     Linkedin,
//     Spotify,
//     Github,
//     Behance,
//     Threads,
//     Facebook,
//     Twitter,
//     Buymecoffee,
//   };

//   const handleInputChange = (id, value) => {
//     setLinks((prevLinks) =>
//       prevLinks.map((link) => (link.id === id ? { ...link, value } : link))
//     );
//   };

//   if (!isOpen) return null;

//   return (
//     <Dialog.Root open={isOpen}>
//       <Dialog.Portal>
//         <Dialog.Overlay
//           className="fixed inset-0 bg-black bg-opacity-70"
//           onClick={(e) => e.stopPropagation()}
//         />
//         <div className="fixed inset-0 z-10 flex items-center justify-center">
//           <Dialog.Content className="bg-onboardingBackground rounded-xl overflow-hidden shadow-xl transform transition-all  lg:w-1/2 w-[90%] sm:w-4/5 h-[95%] sm:h-2/3">
//             <Dialog.Title></Dialog.Title>
//             <div className="flex sm:flex-row flex-col h-full">
//               <div className="sm:hidden flex-col sm:w-2/5 pr-3 pt-4 justify-between">
//                 <div className="flex items-start w-full">
//                   <img
//                     src={
//                       boardindex === 0
//                         ? DomainOnboard
//                         : boardindex === 1
//                         ? LinkOnboard
//                         : ProfileOnboard
//                     }
//                     alt="LinkOnboard"
//                     className="w-full h-52 "
//                   />
//                 </div>
//               </div>
//               <div className="sm:hidden h-2 bg-primaryBackground"></div>
//               {boardindex === 0 ? (
//                 <div className="flex flex-col bg-chipBackground h-full  sm:w-3/5 w-full  py-6 px-6 sm:px-8">
//                   <p className="text-theme-secondaryText text-3xl font-medium tracking-wide font-familjen-grotesk">
//                     First things first,
//                     <br />
//                     claim your domain
//                   </p>
//                   <p className="text-theme-secondaryText text-sm font-extralight ml-0.5 mt-1 font-inter">
//                     before anyone else takes it.
//                   </p>
//                   <div className="relative flex items-center mt-5 border border-profileBorder rounded-md p-2 bg-chipBackground ">
//                     <input
//                       type="text"
//                       className="flex px-3 py-2 text-theme-secondaryText font-normal font-inter bg-chipBackground focus:outline-none rounded-l-md placeholder:text-theme-secondaryText placeholder:text-sm placeholder:font-light placeholder:font-inter"
//                       placeholder="Your domain name"
//                       value={domainName}
//                       maxLength={40}
//                       onChange={handleDomainChange}
//                     />
//                     <div className="absolute right-2 flex flex-row items-center">
//                       <span className="border-l border-gray-500 h-6 mr-2"></span>
//                       <span className=" text-textfieldBorder text-sm font-light">
//                         .{domainUrl}
//                       </span>
//                     </div>
//                   </div>
//                   {isUsernameLoading ? (
//                     <div></div>
//                   ) : (
//                     <div className="flex flex-row items-center mt-1">
//                       {isUsername && (
//                         <img src={Tick} alt="Tick" className="w-5 h-5" />
//                       )}
//                       <p
//                         className={`${
//                           isUsername
//                             ? "text-theme-secondaryText"
//                             : "text-errorLight"
//                         } font-light ml-1 font-inter text-xs`}
//                       >
//                         {isUsername
//                           ? "Available"
//                           : isUsername === false
//                           ? "Username already exist."
//                           : ""}
//                       </p>
//                     </div>
//                   )}
//                   <button
//                     className={`w-full py-2.5 mt-6 rounded-full ${
//                       domainName !== ""
//                         ? "text-buttonText  bg-primary"
//                         : "text-primaryGrey bg"
//                     }  font-normal`}
//                     onClick={handleClaimDomain}
//                   >
//                     Claim Link
//                   </button>
//                   <p
//                     className="sm:hidden text-center mt-6  text-viewAll text-xs font-inter font-light cursor-pointer"
//                     onClick={handleSkip}
//                   >
//                     Skip for now ->
//                   </p>
//                 </div>
//               ) : boardindex === 1 ? (
//                 <div className="flex flex-col bg-chipBackground h-88px sm:h-full sm:w-1/2 w-full  overflow-y-auto custom-scrollbar">
//                   <p className="text-theme-secondaryText text-3xl font-medium mb-3 pt-6 px-8 tracking-wide font-familjen-grotesk">
//                     Put together all your socials handles
//                   </p>
//                   {links.map((link, index) => (
//                     <div
//                       key={link.id}
//                       className="flex items-center mt-2 mb-2 px-8"
//                     >
//                       <div className="flex-grow relative">
//                         <input
//                           type="text"
//                           value={link.value}
//                           maxLength={30}
//                           placeholder="@username"
//                           onChange={(e) =>
//                             handleInputChange(link.id, e.target.value)
//                           }
//                           className="w-full pl-12 pr-2 pt-2.5 pb-2.5 -ml-2 placeholder:text-sm placeholder:font-light placeholder:text-textfieldBorder 
//                                 rounded-2xl border font-normal border-profileBorder bg-chipBackground text-profileText focus:border-primary focus:ring-0 focus:outline-none"
//                         />
//                         <img
//                           src={imageMap[link.title]}
//                           alt={link.title}
//                           className="rounded-full w-8 h-8 absolute left-0 bottom-1.5"
//                         />
//                       </div>
//                       {index === links.length - 1 ? (
//                         <div className="h-20"></div>
//                       ) : null}
//                     </div>
//                   ))}
//                   <div className="absolute bottom-0 bg-chipBackground border-t-2 px-10 border-dividerLine h-24 sm:h-20 w-full sm:w-1/2">
//                     <button
//                       className={`w-full py-2.5  mt-4 sm:mt-6 rounded-full text-buttonText bg-primary font-normal`}
//                       onClick={handleLinks}
//                     >
//                       Continue
//                     </button>
//                     <p
//                       className="sm:hidden text-center mt-2.5  text-viewAll text-xs font-inter font-light cursor-pointer"
//                       onClick={handleSkip}
//                     >
//                       Skip for now ->
//                     </p>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex flex-col bg-chipBackground sm:h-full h-88px  sm:w-1/2 w-full  overflow-y-auto custom-scrollbar">
//                   <p className="text-theme-secondaryText text-3xl font-medium  pt-5 px-8 tracking-wide font-familjen-grotesk">
//                     Last one!
//                   </p>
//                   <p className="text-theme-secondaryText text-sm font-extralight ml-0.5 px-8 mt-1 font-inter">
//                     Add details to your profile.
//                   </p>
//                   <div className="px-8">
//                     <div className="flex flex-col ">
//                       <div className="flex justify-start items-center">
//                         <div className="mt-2 w-16 h-16 relative">
//                           <img
//                             src={formData.logo ? formData.logo : Profile}
//                             alt="Profile"
//                             className="rounded-full w-full h-full border border-white object-cover"
//                             style={{ borderWidth: "2px" }}
//                           />
//                           <div className="absolute  cursor-pointer bottom-0 left-0 w-full h-1/2 bg-gray-800 bg-opacity-50 flex justify-center items-center rounded-b-full">
//                             <span className="text-theme-secondaryText text-sm">
//                               Add
//                             </span>
//                             <input
//                               type="file"
//                               accept="image/*"
//                               className="absolute inset-0 opacity-0 cursor-pointer"
//                               onChange={handleImageUpload}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                       <form onSubmit={handleSubmit} className="space-y-5 mt-6">
//                         {/* <OnboardTextField
//                     label="Full Name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     name="name"
//                     /> */}
//                         <OnboardTextField
//                           label="Contact"
//                           value={formData.contact}
//                           onChange={handleChange}
//                           name="contact"
//                         />
//                         <OnboardTextField
//                           label="Location"
//                           value={formData.location}
//                           onChange={handleChange}
//                           name="location"
//                         />

//                         <div className="relative">
//                           <label className="absolute left-4 -top-2 text-xs font-light font-inter bg-chipBackground text-textFieldColor">
//                             Description
//                           </label>
//                           <textarea
//                             value={formData.description}
//                             onChange={handleChange}
//                             name="description"
//                             maxLength={maxChars}
//                             className="w-full text-sm pt-4 font-inter pb-4 pl-4 pr-3 rounded-lg border font-light border-profileBorder bg-chipBackground text-profileText focus:border-primary focus:ring-0 focus:outline-none"
//                             rows="4"
//                             placeholder=""
//                           />
//                           <div className="text-right absolute right-2 bottom-3 text-xs text-textfieldBorder">
//                             {charCount}/{maxChars}
//                           </div>
//                         </div>
//                         <OnboardTextField
//                           label="Custom button display text"
//                           value={formData.customText}
//                           onChange={handleChange}
//                           name="customText"
//                         />
//                         <OnboardTextField
//                           label="Custom button link"
//                           value={formData.customUrl}
//                           onChange={handleChange}
//                           name="customUrl"
//                         />
//                       </form>
//                       <div className="h-24"></div>
//                     </div>
//                   </div>
//                   <div
//                     className={`absolute bottom-0 bg-chipBackground border-t-2 px-10 border-dividerLine h-24 sm:h-20 w-full sm:w-1/2`}
//                   >
//                     <div className="flex flex-col">
//                       <button
//                         className={`w-full py-2.5 mt-4 sm:mt-6 rounded-full text-buttonText bg-primary font-normal`}
//                         onClick={handleSaveOnboard}
//                       >
//                         Save
//                       </button>
//                       <p
//                         className="sm:hidden text-center mt-2.5  text-viewAll text-xs font-inter font-light cursor-pointer"
//                         onClick={handleSkip}
//                       >
//                         Skip for now ->
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               )}
//               <div className="hidden sm:flex flex-col sm:w-1/2 justify-between pr-3 pt-4">
//                 <p
//                   className="text-right  text-viewAll text-xs font-inter font-light cursor-pointer"
//                   onClick={handleSkip}
//                 >
//                   Skip for now ->
//                 </p>
//                 <img
//                   src={
//                     boardindex === 0
//                       ? DomainOnboard
//                       : boardindex === 1
//                       ? LinkOnboard
//                       : ProfileOnboard
//                   }
//                   alt="LinkOnboard"
//                   className="w-4/5 h-52 "
//                 />
//               </div>
//               {/* <div className="hidden sm:flex flex-col sm:w-1/2 pr-3 pt-4 justify-between ">
//                               <div className="flex items-start w-full justify-start">
//                               </div>
//                           </div> */}
//             </div>
//           </Dialog.Content>
//         </div>
//       </Dialog.Portal>
//     </Dialog.Root>
//   );
// };

// export default OnboardingModal;
