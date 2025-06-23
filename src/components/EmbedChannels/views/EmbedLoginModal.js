// import React, { useState, useEffect, useRef } from "react";
// import * as Dialog from "@radix-ui/react-dialog";
// import loginImage from "../../assets/images/login_model_card.png";
// import chipLogo from "../../assets/icons/chips.png";
// import googleLogo from "../../assets/images/google_logo.png";
// import { useNavigate } from "react-router-dom";
// import TextField from "@mui/material/TextField";
// import axios from "axios";
// import { hostUrl } from "../../utils/globals";
// import OtpInput from "react-otp-input";
// import { closeModal, setLoginMode } from "../../redux/slices/modalSlice";
// import { useDispatch, useSelector } from "react-redux";
// import { setAuthCookies } from "./../../services/cookies";
// import { setCredentials } from "../../redux/slices/authSlice";
// import { fetchMyData } from "../../redux/slices/myDataSlice";
// import { useGoogleLogin } from "@react-oauth/google";
// import InputAdornment from "@mui/material/InputAdornment";
// import IconButton from "@mui/material/IconButton";
// import Visibility from "@mui/icons-material/Visibility";
// import VisibilityOff from "@mui/icons-material/VisibilityOff";
// import useModal from "./../hooks/ModalHook";

// const LoginModal = () => {
//   const navigate = useNavigate();
//   const [isLogin, setIsLogin] = useState(false);
//   const [isOtp, setIsOtp] = useState(false);
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [forgotEmail, setForgotEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [agreed, setAgreed] = useState(false);
//   const [otpBackend, setOtpBackend] = useState("");
//   const [otp, setOtp] = useState("");
//   const [newError, setNewError] = useState("");
//   const [forgotError, setForgotError] = useState("");
//   const dispatch = useDispatch();
//   const [forgot, setForgot] = useState(false);
//   const [buttonEnabled, setButtonEnabled] = useState(false);

//   const emailRef = useRef(null);
//   const passwordRef = useRef(null);

//   const isOpen = useSelector((state) => state.modals.modalLoginOpen);
//   const isLoginMode = useSelector((state) => state.modals.isLoginMode);

//   const [errors, setErrors] = useState({
//     fullName: "",
//     email: "",
//     password: "",
//     confirmPassword: "",
//     forgotEmail: "",
//   });
//   const { handleOpenModal } = useModal();

//   const handleOnboardOpen = () => {
//     handleOpenModal("modalOnboardOpen");
//   };

//   const clearData = () => {
//     setFullName("");
//     setEmail("");
//     setPassword("");
//     setConfirmPassword("");
//     setIsLogin(false);
//     setIsOtp(false);
//     setOtp("");
//     setOtpBackend("");
//     setNewError("");
//   };

//   const handleToggleLogin = () => {
//     setNewError("");
//     setIsLogin(!isLogin);
//     setErrors({
//       fullName: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       agree: "",
//     });
//   };
//   const handleToggleOtp = () => {
//     setNewError("");
//     setIsOtp(false);
//     setErrors({
//       fullName: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       agree: "",
//     });
//   };
//   const handleToggleForgot = () => {
//     setNewError("");
//     setIsLogin(false);
//     setForgot(false);
//     setErrors({
//       fullName: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//       forgotPassword: "",
//       agree: "",
//     });
//   };
//   const handleResendCode = async () => {
//     setNewError("");
//     try {
//       const userData = {
//         name: fullName.trim(),
//         email: email.trim(),
//       };
//       await axios.post(`${hostUrl}/api/register`, userData).then((response) => {
//         if (response.data.success === true) {
//           setOtpBackend(response.data.otp);
//           setIsOtp(true);
//         } else {
//           setNewError(response.data.message);
//         }
//       });
//     } catch (error) {
//       console.error("Error registering", error);
//     }
//   };
//   const fetchUserDetails = async (accessToken) => {
//     try {
//       const response = await axios.get(
//         "https://www.googleapis.com/oauth2/v2/userinfo",
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       setNewError("Auth failed. Please try again");
//     }
//   };
//   const handleforgotPassword = async () => {
//     setForgotError("");
//     if (!forgotEmail) {
//       setForgotError("Please Enter email!");
//     } else {
//       try {
//         const response = await axios.post(`${hostUrl}/api/forgot/password`, {
//           email: forgotEmail.trim(),
//         });
//         setForgotError(response.data.message);
//       } catch (error) {
//         setForgotError("Error in validation. Please try again.");
//       }
//     }
//   };

//   const registerOrLoginUserGoogle = async (userData) => {
//     try {
//       return await axios.post(`${hostUrl}/api/google/auth`, {
//         name: userData.name,
//         email: userData.email,
//       });
//     } catch (error) {
//       console.error("Failed to register/login user", error);
//       throw new Error("Failed to register/login");
//     }
//   };

//   const onClose = () => {
//     dispatch(closeModal("modalLoginOpen"));
//   };
//   const handleGoogleSuccess = async (tokenResponse) => {
//     try {
//       const userData = await fetchUserDetails(tokenResponse.access_token);
//       const response = await registerOrLoginUserGoogle(userData);
//       if (response.data.success) {
//         // dispatch(clearMyData());
//         // dispatch(clearProfileData());
//         // dispatch(clearGalleryData());
//         dispatch(
//           setCredentials({
//             user: response.data.user,
//             token: response.data.token,
//           })
//         );
//         setAuthCookies(response.data.token, response.data.user);
//         clearData();
//         fetchMyData();
//         onClose();
//         if (response.data.islogin === false) {
//           handleOnboardOpen();
//         } else if (isLoginMode) {
//           navigate(`/profile/${response.data.user.username}`);
//         }
//         dispatch(setLoginMode(false));
//       }
//     } catch (error) {
//       console.error("Error during login process:", error);
//       setNewError("Error Registering. Please try again");
//     }
//   };

//   const googleLogin = useGoogleLogin({
//     onSuccess: handleGoogleSuccess,
//     onError: () => {
//       setNewError("Validation failed. Please try again.");
//       console.log("Login failed");
//     },
//   });

//   const handleMouseDownPassword = (e) => {
//     e.preventDefault();
//   };

//   const handleClickShowPassword = () => {
//     setShowPassword(!showPassword);
//   };
//   const validateForm = () => {
//     setNewError("");
//     let valid = true;
//     const newErrors = {
//       fullName: "",
//       email: "",
//       password: "",
//       confirmPassword: "",
//     };

//     if (!fullName && !isLogin) {
//       newErrors.fullName = "Full name is required";
//       valid = false;
//     }
//     if (!email) {
//       newErrors.email = "Email is required";
//       valid = false;
//     }
//     if (!password) {
//       newErrors.password = "Password is required";
//       valid = false;
//     }
//     if (!isLogin && password !== confirmPassword) {
//       newErrors.confirmPassword = "Passwords do not match";
//       valid = false;
//     }
//     if (!isLogin && !agreed) {
//       newErrors.agree = "You must agree to the terms and privacy policy";
//       valid = false;
//     }

//     setErrors(newErrors);
//     return valid;
//   };
//   const validateForm2 = () => {
//     let valid = true;
//     if (!fullName && !isLogin) {
//       valid = false;
//     }
//     if (!email) {
//       valid = false;
//     }
//     if (!password) {
//       valid = false;
//     }
//     // if (!isLogin && password !== confirmPassword) {
//     //   valid = false;
//     // }
//     if (!isLogin && !agreed) {
//       valid = false;
//     }
//     return valid;
//   };

//   useEffect(() => {
//     setButtonEnabled(validateForm2());
//   }, [fullName, email, password, confirmPassword, agreed, isLogin]);

//   useEffect(() => {
//     const handleAutofill = () => {
//       const emailField = emailRef.current;
//       const passwordField = passwordRef.current;

//       if (emailField && passwordField) {
//         setEmail(emailField.value);
//         setPassword(passwordField.value);
//         setButtonEnabled(validateForm2());
//       }
//     };

//     handleAutofill();

//     window.addEventListener("focus", handleAutofill);

//     return () => {
//       window.removeEventListener("focus", handleAutofill);
//     };
//   }, [email, password]);

//   const handleChangeOtp = async (value) => {
//     setOtp(value);
//     if (value.length === 6 && value === otpBackend) {
//       setNewError("");
//       const userData = {
//         name: fullName.trim(),
//         email: email.trim(),
//         password: password,
//       };
//       try {
//         await axios
//           .post(`${hostUrl}/api/verify/auth`, userData)
//           .then((response) => {
//             if (response.data.success) {
//               // console.log(response.data);
//               setAuthCookies(response.data.token, response.data.user);
//               dispatch(
//                 setCredentials({
//                   user: response.data.user,
//                   token: response.data.token,
//                 })
//               );
//               clearData();
//               // fetchMyData();
//               onClose();
//               handleOnboardOpen();
//             } else {
//               setNewError(response.data.message);
//             }
//           });
//       } catch (error) {
//         setNewError("Error Registering. Please try again");
//       }
//     } else if (otp.length === 6) {
//       setNewError("Enter Correct Otp");
//       console.log("some error");
//     }
//   };

//   const handleFormSubmit = async () => {
//     setNewError("");
//     if (validateForm()) {
//       if (isLogin) {
//         const userData = {
//           email: email.trim(),
//           password: password,
//         };
//         try {
//           await axios
//             .post(`${hostUrl}/api/login`, userData)
//             .then((response) => {
//               if (response.data.success === true) {
//                 // console.log(profileData);
//                 dispatch(
//                   setCredentials({
//                     user: response.data.user,
//                     token: response.data.token,
//                   })
//                 );
//                 setAuthCookies(response.data.token, response.data.user);
//                 clearData();
//                 fetchMyData();
//                 onClose();
//                 if (isLoginMode) {
//                   navigate(`/profile/${response.data.user.username}`);
//                 }
//                 // navigate(`/profile/${response.data.user.username}`);
//               } else {
//                 setNewError(response.data.message);
//               }
//               dispatch(setLoginMode(false));
//             });
//         } catch (error) {
//           console.error("Error registering", error);
//           setNewError("Error in logging in. Please try again.");
//         }
//       } else {
//         const userData = {
//           name: fullName.trim(),
//           email: email.trim(),
//         };
//         try {
//           await axios
//             .post(`${hostUrl}/api/register`, userData)
//             .then((response) => {
//               if (response.data.success === true) {
//                 setOtpBackend(response.data.otp);
//                 setIsOtp(true);
//               } else {
//                 setNewError(response.data.message);
//               }
//             });
//         } catch (error) {
//           console.error("Error registering", error);
//         }
//       }
//     }
//   };

//   const handleOverlayClick = () => {
//     onClose();
//     dispatch(setLoginMode(false));
//   };

//   return (
//     <Dialog.Root open={isOpen}>
//       <Dialog.Portal>
//         <Dialog.Overlay
//           className="fixed inset-0 bg-black bg-opacity-70 z-50"
//           onClick={handleOverlayClick}
//         />
//         <div className="fixed inset-0 z-50 flex items-center justify-center">
//           <Dialog.Content className="bg-chipBackground rounded-xl overflow-hidden shadow-xl transform transition-all w-4/5 lg:w-3/5 xxl:w-1/2">
//             <Dialog.Title />

//             <div className="flex flex-col sm:flex-row">
//               <div className="hidden sm:flex sm:w-1/2 bg-primary items-center justify-center rounded-l-2xl">
//                 <img
//                   src={loginImage}
//                   alt="Modal Illustration"
//                   className="w-full rounded-l-xl"
//                 />
//               </div>
//               <div className="w-full sm:w-1/2 bg-chipBackground pl-8 pr-8 pt-4 flex flex-col justify-center rounded-r-xl">
//                 <div className="flex flex-row justify-between items-center">
//                   <h3 className="text-lg font-medium tracking-wider text-white">
//                     {forgot
//                       ? "Forgot Password"
//                       : isLogin
//                       ? "Jump back in"
//                       : isOtp
//                       ? "Verify it's you"
//                       : "Join the club"}
//                   </h3>
//                   <img
//                     src={chipLogo}
//                     alt="Modal Illustration"
//                     className="w-8 "
//                   />
//                 </div>
//                 <p className="text-primaryGrey text-xs mt-1">
//                   {forgot
//                     ? "(ಥ﹏ಥ)"
//                     : isLogin
//                     ? "ʕっ•ᴥ•ʔっ"
//                     : isOtp
//                     ? "•͡˘㇁•͡˘"
//                     : "ʕノ•ᴥ•ʔノ"}
//                 </p>
//                 <div className="border-t border-dividerLine my-2"></div>
//                 {forgot ? (
//                   <div className="mt-6">
//                     <p className="text-white font-normal text-xs font-inter">
//                       Enter the email address associated with your account and
//                       we'll send you a link to reset your password.
//                     </p>
//                     <div className="mt-6">
//                       <TextField
//                         label="email address"
//                         error={Boolean(errors.forgotEmail)}
//                         type="email"
//                         helperText={errors.forgotEmail}
//                         variant="outlined"
//                         value={forgotEmail}
//                         onChange={(e) => setForgotEmail(e.target.value)}
//                         fullWidth
//                         InputProps={{
//                           style: {
//                             color: "white",
//                             padding: "0px 3px",
//                             fontWeight: "300",
//                           }, // Adjust padding for less vertical spacing and ensure text color is white
//                           inputProps: {
//                             style: {
//                               color: "white", // This sets the text color
//                               fontSize: "14px",
//                             },
//                             placeholder: "email address", // This is the actual placeholder text
//                           },
//                         }}
//                         InputLabelProps={{
//                           style: { color: "#A3A3A3" },
//                         }}
//                         sx={{
//                           "& .MuiOutlinedInput-root": {
//                             "& fieldset": {
//                               borderColor: "#938F99",
//                             },
//                             "&:hover fieldset": {
//                               borderColor: "#938F99",
//                             },
//                             "&.Mui-focused fieldset": {
//                               borderColor: "#938F99",
//                             },
//                             "&.Mui-focused .MuiInputLabel-root": {
//                               color: "#D0BCFF !important",
//                             },
//                           },
//                           "& .MuiInputBase-input::placeholder": {
//                             color: "#211F26",
//                             opacity: 1,
//                           },
//                           "& .MuiInputBase-root": {
//                             maxHeight: "45px",
//                             lineHeight: "45px",
//                           },
//                         }}
//                       />
//                     </div>
//                     <div className="justify-center text-center align-center mb-8">
//                       <button
//                         onClick={handleforgotPassword}
//                         className="w-1/2 bg-primary text-buttonText text-sm font-normal py-2.5 rounded-3xl transition mt-6"
//                       >
//                         Continue
//                       </button>
//                       <p className="text-errorLight font-normal mt-4 text-xs font-inter">
//                         {forgotError}
//                       </p>
//                     </div>
//                     <p className="text-center text-white text-xs mb-10 mt-20">
//                       Don't have an account?
//                       <button
//                         onClick={handleToggleForgot}
//                         className="text-secondaryText underline ml-1 "
//                       >
//                         Register
//                       </button>
//                     </p>
//                   </div>
//                 ) : isOtp ? (
//                   <div className="mt-8">
//                     <p className="text-white font-normal text-sm font-inter">
//                       Enter the verification code we just sent to your email id{" "}
//                       {email}
//                     </p>
//                     <div className="mt-5">
//                       <OtpInput
//                         value={otp}
//                         onChange={handleChangeOtp}
//                         numInputs={6}
//                         renderSeparator={<span className="w-2"></span>}
//                         renderInput={(props) => (
//                           <input
//                             {...props}
//                             style={{
//                               width: "34px",
//                               height: "40px",
//                               borderRadius: "6px",
//                               backgroundColor: "#2B2930",
//                               textAlign: "center",
//                               color: "white",
//                             }}
//                             inputMode="numeric" // Ensures only numeric input
//                             pattern="[0-9]*" // Restricts input to digits
//                           />
//                         )}
//                       />
//                       <p className="text-center text-primaryGrey text-xs mt-3 font-inter">
//                         Didn't received code?
//                         <button
//                           onClick={handleResendCode}
//                           className="text-secondaryText underline ml-1 font-base font-inter font-normal"
//                         >
//                           Resend
//                         </button>
//                       </p>
//                       <p className="text-center text-white text-xs mb-12 mt-20 font-inter">
//                         Entered wrong email?
//                         <button
//                           onClick={handleToggleOtp}
//                           className="text-secondaryText underline ml-1 font-base font-inter font-normal"
//                         >
//                           Change
//                         </button>
//                       </p>
//                     </div>
//                   </div>
//                 ) : (
//                   <>
//                     {!isLogin && (
//                       <div className="mt-5">
//                         <TextField
//                           label="full name"
//                           variant="outlined"
//                           error={Boolean(errors.fullName)}
//                           helperText={errors.fullName}
//                           value={fullName}
//                           onChange={(e) => setFullName(e.target.value)}
//                           fullWidth
//                           InputProps={{
//                             style: {
//                               color: "white",
//                               padding: "0px 3px",
//                               fontWeight: "300",
//                             }, // Adjust padding for less vertical spacing and ensure text color is white
//                             inputProps: {
//                               style: {
//                                 color: "white", // This sets the text color
//                                 fontSize: "14px",
//                               },
//                               placeholder: "full name", // This is the actual placeholder text
//                             },
//                           }}
//                           InputLabelProps={{
//                             style: { color: "#A3A3A3" },
//                           }}
//                           sx={{
//                             "& .MuiOutlinedInput-root": {
//                               "& fieldset": {
//                                 borderColor: "#938F99",
//                               },
//                               "&:hover fieldset": {
//                                 borderColor: "#938F99",
//                               },
//                               "&.Mui-focused fieldset": {
//                                 borderColor: "#938F99",
//                               },
//                               "&.Mui-focused .MuiInputLabel-root": {
//                                 color: "#D0BCFF !important",
//                               },
//                             },
//                             "& .MuiInputBase-input::placeholder": {
//                               color: "#211F26",
//                               opacity: 1,
//                             },
//                             "& .MuiInputBase-root": {
//                               maxHeight: "45px",
//                               lineHeight: "45px",
//                             },
//                           }}
//                         />
//                       </div>
//                     )}
//                     <div className="mt-3">
//                       <TextField
//                         label="email address"
//                         error={Boolean(errors.email)}
//                         type="email"
//                         inputRef={emailRef}
//                         helperText={errors.email}
//                         variant="outlined"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         fullWidth
//                         InputProps={{
//                           style: {
//                             color: "white",
//                             padding: "0px 3px",
//                             fontWeight: "300",
//                           }, // Adjust padding for less vertical spacing and ensure text color is white
//                           inputProps: {
//                             style: {
//                               color: "white", // This sets the text color
//                               fontSize: "14px",
//                             },
//                             placeholder: "email address", // This is the actual placeholder text
//                           },
//                         }}
//                         InputLabelProps={{
//                           style: { color: "#A3A3A3" },
//                         }}
//                         sx={{
//                           "& .MuiOutlinedInput-root": {
//                             "& fieldset": {
//                               borderColor: "#938F99",
//                             },
//                             "&:hover fieldset": {
//                               borderColor: "#938F99",
//                             },
//                             "&.Mui-focused fieldset": {
//                               borderColor: "#938F99",
//                             },
//                             "&.Mui-focused .MuiInputLabel-root": {
//                               color: "#D0BCFF !important",
//                             },
//                           },
//                           "& .MuiInputBase-input::placeholder": {
//                             color: "#211F26",
//                             opacity: 1,
//                           },
//                           "& .MuiInputBase-root": {
//                             maxHeight: "45px",
//                             lineHeight: "45px",
//                           },
//                         }}
//                       />
//                     </div>
//                     <div className="mt-3">
//                       <TextField
//                         label={isLogin ? "password" : "create password"}
//                         variant="outlined"
//                         type={showPassword ? "text" : "password"}
//                         error={Boolean(errors.password)}
//                         helperText={errors.password}
//                         inputRef={passwordRef}
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         fullWidth
//                         InputProps={{
//                           style: {
//                             color: "white",
//                             padding: "0px 3px",
//                             fontWeight: "300",
//                           },
//                           inputProps: {
//                             style: {
//                               color: "white",
//                               fontSize: "14px",
//                             },
//                             placeholder: isLogin
//                               ? "password"
//                               : "create password",
//                           },
//                           endAdornment: (
//                             <InputAdornment position="end" className="mr-2">
//                               <IconButton
//                                 className="mr-2 bg-primaryGrey"
//                                 aria-label="toggle password visibility"
//                                 onClick={handleClickShowPassword}
//                                 onMouseDown={handleMouseDownPassword}
//                                 edge="end"
//                               >
//                                 {showPassword ? (
//                                   <VisibilityOff />
//                                 ) : (
//                                   <Visibility />
//                                 )}
//                               </IconButton>
//                             </InputAdornment>
//                           ),
//                         }}
//                         InputLabelProps={{
//                           style: { color: "#A3A3A3" },
//                         }}
//                         sx={{
//                           "& .MuiOutlinedInput-root": {
//                             "& fieldset": {
//                               borderColor: "#938F99",
//                             },
//                             "&:hover fieldset": {
//                               borderColor: "#938F99",
//                             },
//                             "&.Mui-focused fieldset": {
//                               borderColor: "#938F99",
//                             },
//                             "&.Mui-focused .MuiInputLabel-root": {
//                               color: "#D0BCFF !important",
//                             },
//                           },
//                           "& .MuiInputBase-input::placeholder": {
//                             color: "#211F26",
//                             opacity: 1,
//                           },
//                           "& .MuiInputBase-root": {
//                             maxHeight: "45px",
//                             lineHeight: "45px",
//                           },
//                         }}
//                       />
//                     </div>
//                     {!isLogin && (
//                       <div className="mt-3 mb-0">
//                         <TextField
//                           label="confirm password"
//                           variant="outlined"
//                           type="password"
//                           error={Boolean(errors.confirmPassword)}
//                           helperText={errors.confirmPassword}
//                           value={confirmPassword}
//                           onChange={(e) => setConfirmPassword(e.target.value)}
//                           fullWidth
//                           InputProps={{
//                             style: {
//                               color: "white",
//                               padding: "0px 3px",
//                               fontWeight: "300",
//                             },
//                             inputProps: {
//                               style: {
//                                 color: "white",
//                                 fontSize: "14px",
//                               },
//                               placeholder: "confirm password",
//                             },
//                           }}
//                           InputLabelProps={{
//                             style: { color: "#A3A3A3" },
//                           }}
//                           sx={{
//                             "& .MuiOutlinedInput-root": {
//                               "& fieldset": {
//                                 borderColor: "#938F99",
//                               },
//                               "&:hover fieldset": {
//                                 borderColor: "#938F99",
//                               },
//                               "&.Mui-focused fieldset": {
//                                 borderColor: "#938F99",
//                               },
//                               "&.Mui-focused .MuiInputLabel-root": {
//                                 color: "#D0BCFF !important",
//                               },
//                               "&.Mui-error fieldset": {
//                                 borderColor: "#F2B8B5",
//                               },
//                             },
//                             "& .MuiInputBase-input::placeholder": {
//                               color: "#211F26",
//                               opacity: 1,
//                             },
//                             "& .MuiInputBase-root": {
//                               maxHeight: "45px",
//                               lineHeight: "45px",
//                             },
//                             "& .MuiFormHelperText-root": {
//                               color: "#F2B8B5",
//                             },
//                           }}
//                         />
//                       </div>
//                     )}
//                     {isLogin && (
//                       <button
//                         onClick={() => setForgot(true)}
//                         className="text-primary ml-auto mt-2 text-xs mb-2"
//                       >
//                         forgot password?
//                       </button>
//                     )}
//                     {!isLogin && (
//                       <div className="flex items-center mt-4">
//                         <input
//                           type="checkbox"
//                           checked={agreed}
//                           onChange={(e) => setAgreed(e.target.checked)}
//                           className="w-4 h-4 text-black bg rounded-sm checked:bg-primary focus:ring-primary checked:ring-primary"
//                         />
//                         <label className="ml-2 text-xs text-primaryGrey">
//                           I agree to the{" "}
//                           <span className="text-secondaryText underline">
//                             terms
//                           </span>{" "}
//                           &{" "}
//                           <span
//                             href="#"
//                             className="text-secondaryText underline"
//                           >
//                             privacy policy
//                           </span>
//                         </label>
//                       </div>
//                     )}
//                     <button
//                       onClick={handleFormSubmit}
//                       className="w-1/2  text-sm ml-auto mr-auto font-normal py-2.5 rounded-3xl transition mt-5"
//                       style={{
//                         backgroundColor: buttonEnabled ? "#D0BCFF" : "#2B2930",
//                         color: buttonEnabled ? "#381E72" : "grey",
//                       }}
//                     >
//                       {isLogin ? "Login" : "Register"}
//                     </button>
//                     {newError !== "" ? (
//                       <p className="text-center text-errorLight my-3 text-xs">
//                         {newError}
//                       </p>
//                     ) : (
//                       <p className="text-center text-white my-3">or</p>
//                     )}
//                     <button
//                       type="button"
//                       onClick={() => googleLogin()}
//                       className="w-4/5 px-1.5 py-2 mb-4 text-xs ml-auto mr-auto font-normal text-white bg rounded-3xl"
//                     >
//                       <img
//                         src={googleLogo}
//                         alt="Google logo"
//                         className="inline w-6 h-6 mr-2"
//                       />
//                       {isLogin ? "Sign in with Google" : "Sign up with Google"}
//                     </button>
//                     <p className="text-center text-white text-xs mb-5 mt-2">
//                       {isLogin
//                         ? "Don't have an account? "
//                         : "Already have an account? "}
//                       <button
//                         onClick={handleToggleLogin}
//                         className="text-secondaryText underline "
//                       >
//                         {isLogin ? "Register" : "Login"}
//                       </button>
//                     </p>
//                   </>
//                 )}
//               </div>
//             </div>
//           </Dialog.Content>
//         </div>
//       </Dialog.Portal>
//     </Dialog.Root>
//   );
// };

// export default LoginModal;
