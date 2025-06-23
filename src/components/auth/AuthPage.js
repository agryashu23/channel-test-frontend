import TextField from "@mui/material/TextField";
import axios from "axios";
import OtpInput from "react-otp-input";
import { setLoginMode } from "../../redux/slices/modalSlice";
import { setAuthCookies } from "./../../services/cookies";
import { setCredentials } from "../../redux/slices/authSlice";
import { fetchMyData } from "../../redux/slices/myDataSlice";
import { setOnboarding } from "../../redux/slices/authSlice";
import { useGoogleLogin, useGoogleOneTapLogin } from "@react-oauth/google";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import googleLogo from "../../assets/channel_images/google_logo.svg";
import { domainUrl } from "./../../utils/globals";
import { getCsrfToken } from "../../services/csrfToken";
import GoogleOneTapLogin from "./GoogleAuth";
import { ChannelImages } from "../constants/images";
import {
  React,
  useState,
  useEffect,
  useRef,
  useNavigate,
  useDispatch,
  useLocation,
  hostUrl,
} from "../../globals/imports";
import Loading from "../../widgets/Loading";
import { validateEmail } from "../../utils/methods";

const AuthPage = ({ isSubdomain }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isOtp, setIsOtp] = useState(false);
  const location = useLocation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [otpBackend, setOtpBackend] = useState("");
  const [otp, setOtp] = useState("");
  const [newError, setNewError] = useState("");
  const [forgotError, setForgotError] = useState("");
  const dispatch = useDispatch();
  const [forgot, setForgot] = useState(false);
  const [buttonEnabled, setButtonEnabled] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState("");
  const [redirectDomain, setRedirectDomain] = useState("");
  const csrfToken = getCsrfToken();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    forgotEmail: "",
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const redirectParam = searchParams.get("redirect");
    const redirectParamDomain = searchParams.get("redirectDomain");
    if (redirectParam) {
      setRedirectUrl(redirectParam);
    }
    if (redirectParamDomain) {
      setRedirectDomain(redirectParamDomain);
    }
  }, [location.search]);

  const handleOnboardOpen = () => {
    dispatch(setOnboarding(true));
    if (redirectDomain !== "" && redirectUrl !== "") {
      navigate(`/channels/onboarding?redirectDomain=${redirectDomain}& `, {
        replace: true,
      });
    } else if (redirectDomain !== "") {
      navigate(`/channels/onboarding?redirectDomain=${redirectDomain}`, {
        replace: true,
      });
    } else if (redirectUrl !== "") {
      navigate(`/channels/onboarding?redirect=${redirectUrl}`, {
        replace: true,
      });
    } else {
      navigate(`/channels/onboarding`, {
        replace: true,
      });
    }
  };

  const clearData = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setIsLogin(false);
    setIsOtp(false);
    setOtp("");
    setOtpBackend("");
    setNewError("");
  };

  const handleToggleLogin = () => {
    setNewError("");
    setIsLogin(!isLogin);
    setPassword("");
    setLoading(false);
    setErrors({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agree: "",
    });
  };
  const handleToggleOtp = () => {
    setNewError("");
    setIsOtp(false);
    setLoading(false);
    setErrors({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      agree: "",
    });
  };
  const handleToggleForgot = () => {
    setNewError("");
    setIsLogin(false);
    setForgot(false);
    setLoading(false);
    setErrors({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      forgotPassword: "",
      agree: "",
    });
  };
  const handleResendCode = async () => {
    setNewError("");
    try {
      const userData = {
        name: fullName.trim(),
        email: email.trim(),
      };
      await axios
        .post(`${hostUrl}/api/register`, userData, {
          headers: {
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        })
        .then((response) => {
          if (response.data.success === true) {
            setOtpBackend(response.data.otp);
            setIsOtp(true);
          } else {
            setNewError(response.data.message);
          }
        });
    } catch (error) {
      console.error("Error registering", error);
    }
  };

  const handleforgotPassword = async () => {
    setForgotError("");
    if (!forgotEmail) {
      setForgotError("Please Enter email!");
    } else {
      try {
        const response = await axios.post(
          `${hostUrl}/api/forgot/password`,
          {
            email: forgotEmail.trim(),
          },
          {
            headers: {
              "X-CSRF-Token": csrfToken,
            },
            withCredentials: true,
          }
        );
        setForgotError(response.data.message);
      } catch (error) {
        setForgotError("Error in validation. Please try again.");
      }
    }
  };
  const fetchUserDetails = async (accessToken) => {
    try {
      const response = await axios.get(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      setNewError("Auth failed. Please try again");
    }
  };
  const registerOrLoginUserGoogle = async (userData) => {
    try {
      return await axios.post(
        `${hostUrl}/api/google/auth`,
        {
          name: userData.name,
          email: userData.email,
        },
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Failed to register/login user", error);
      throw new Error("Failed to register/login");
    }
  };

  const handleGoogleSuccess = async (tokenResponse) => {
    try {
      setGoogleLoading(true);
      const userData = await fetchUserDetails(tokenResponse.access_token);
      const response = await registerOrLoginUserGoogle(userData);
      if (response.data.success) {
        dispatch(
          setCredentials({
            user: response.data.user,
            token: response.data.token,
          })
        );
        setAuthCookies(response.data.token, response.data.user);
        clearData();
        fetchMyData();
        setGoogleLoading(false);
        if (response.data.islogin === false) {
          handleOnboardOpen();
        } else {
          if (redirectDomain !== "" && redirectUrl !== "") {
            window.location.replace(
              `https://${redirectDomain}.${domainUrl}${redirectUrl}`
            );
          } else if (redirectDomain !== "") {
            window.location.replace(`https://${redirectDomain}.${domainUrl}`);
          } else if (redirectUrl !== "") {
            navigate(`${redirectUrl}`, {
              replace: true,
            });
          } else {
            navigate(`/account/${response.data.user.username}/profile`, {
              replace: true,
            });
          }
        }
      }
      setGoogleLoading(false);
    } catch (error) {
      setGoogleLoading(false);
      console.error("Error during login process:", error);
      setNewError("Error Registering. Please try again");
    }
  };
  const handleTapGoogleSuccess = async (tokenResponse) => {
    try {
      setGoogleLoading(true);
      const userData = JSON.parse(atob(tokenResponse.credential.split(".")[1]));
      const response = await registerOrLoginUserGoogle(userData);
      window.google?.accounts.id.cancel();
      if (response.data.success) {
        dispatch(
          setCredentials({
            user: response.data.user,
            token: response.data.token,
          })
        );
        setAuthCookies(response.data.token, response.data.user);
        clearData();
        fetchMyData();
        setGoogleLoading(false);
        if (response.data.islogin === false) {
          handleOnboardOpen();
        } else {
          if (redirectDomain !== "" && redirectUrl !== "") {
            window.location.replace(
              `https://${redirectDomain}.${domainUrl}${redirectUrl}`
            );
          } else if (redirectDomain !== "") {
            window.location.replace(`https://${redirectDomain}.${domainUrl}`);
          } else if (redirectUrl !== "") {
            navigate(`${redirectUrl}`, {
              replace: true,
            });
          } else {
            navigate(`/account/${response.data.user.username}/profile`, {
              replace: true,
            });
          }
        }
      }
      setGoogleLoading(false);
    } catch (error) {
      setGoogleLoading(false);
      console.error("Error during login process:", error);
      setNewError("Error Registering. Please try again");
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => {
      setNewError("Validation failed. Please try again.");
      console.log("Login failed");
    },
  });

  const oneTapGoogleLogin = useGoogleOneTapLogin({
    onSuccess: handleTapGoogleSuccess,
    onError: () => {
      console.log("One Tap Login Failed");
    },
    prompt_parent_id: "one-tap-container", // Ensures placement
  });

  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const validateForm = () => {
    setNewError("");
    let valid = true;
    const newErrors = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!fullName && !isLogin) {
      newErrors.fullName = "Full name is required";
      valid = false;
    }
    if (!email) {
      newErrors.email = "Email is required";
      valid = false;
    }
    if (!validateEmail(email)) {
      newErrors.email = "Invalid email address";
      valid = false;
    }
    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    }
    if (!isLogin && !agreed) {
      newErrors.agree = "You must agree to the terms and privacy policy";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };
  const validateForm2 = () => {
    let valid = true;
    if (!fullName && !isLogin) {
      valid = false;
    }
    if (!email) {
      valid = false;
    }
    if (!validateEmail(email)) {
      valid = false;
    }
    if (!password) {
      valid = false;
    }

    if (!isLogin && !agreed) {
      valid = false;
    }
    return valid;
  };

  useEffect(() => {
    setButtonEnabled(validateForm2());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullName, email, password, agreed, isLogin]);

  useEffect(() => {
    const handleAutofill = () => {
      const emailField = emailRef.current;
      const passwordField = passwordRef.current;

      if (emailField && passwordField) {
        setEmail(emailField.value);
        setPassword(passwordField.value);
        setButtonEnabled(validateForm2());
      }
    };

    handleAutofill();

    window.addEventListener("focus", handleAutofill);

    return () => {
      window.removeEventListener("focus", handleAutofill);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password]);

  const handleChangeOtp = async (value) => {
    setOtp(value);
    if (value.length === 6 && value === otpBackend) {
      setNewError("");
      const userData = {
        name: fullName.trim(),
        email: email.trim(),
        password: password,
      };
      try {
        await axios
          .post(`${hostUrl}/api/verify/auth`, userData, {
            headers: {
              "X-CSRF-Token": csrfToken,
            },
            withCredentials: true,
          })
          .then((response) => {
            if (response.data.success) {
              // console.log(response.data);
              setAuthCookies(response.data.token, response.data.user);
              dispatch(
                setCredentials({
                  user: response.data.user,
                  token: response.data.token,
                })
              );
              clearData();
              handleOnboardOpen();
            } else {
              setNewError(response.data.message);
            }
          });
      } catch (error) {
        setNewError("Error Registering. Please try again");
      }
    } else if (otp.length === 6) {
      setNewError("Enter Correct Otp");
      console.log("some error");
    }
  };

  const handleFormSubmit = async () => {
    setNewError("");
    setLoading(true);
    if (validateForm()) {
      if (isLogin) {
        const userData = {
          email: email.trim(),
          password: password,
        };
        try {
          await axios
            .post(`${hostUrl}/api/login`, userData, {
              withCredentials: true,
            })
            .then((response) => {
              if (response.data.success === true) {
                dispatch(
                  setCredentials({
                    user: response.data.user,
                    token: response.data.token,
                  })
                );
                setAuthCookies(response.data.token, response.data.user);
                clearData();
                fetchMyData();
                if (redirectDomain !== "" && redirectUrl !== "") {
                  window.location.replace(
                    `https://${redirectDomain}.${domainUrl}${redirectUrl}`
                  );
                } else if (redirectDomain !== "") {
                  window.location.replace(
                    `https://${redirectDomain}.${domainUrl}`
                  );
                } else if (redirectUrl !== "") {
                  navigate(`${redirectUrl}`, {
                    replace: true,
                  });
                } else {
                  navigate(`/account/${response.data.user.username}/profile`, {
                    replace: true,
                  });
                }
              } else {
                setNewError(response.data.message);
              }
              dispatch(setLoginMode(false));
              setLoading(false);
            });
        } catch (error) {
          console.log("Error registering", error);
          setNewError("Error in logging in. Please try again.");
          setLoading(false);
        }
      } else {
        const userData = {
          name: fullName.trim(),
          email: email.trim(),
        };
        try {
          await axios
            .post(`${hostUrl}/api/register`, userData, {
              headers: {
                "X-CSRF-Token": csrfToken,
              },
              withCredentials: true,
            })
            .then((response) => {
              if (response.data.success === true) {
                setOtpBackend(response.data.otp);
                setIsOtp(true);
              } else {
                setNewError(response.data.message);
              }
              setLoading(false);
            });
        } catch (error) {
          console.error("Error registering", error);
          setLoading(false);
        }
      }
    }
    setLoading(false);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    setErrors({ ...errors, password: "" });
  };
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    setErrors({ ...errors, email: "" });
  };

  if(googleLoading){
    return  <div
    className="bg-theme-secondaryBackground 
            w-full h-full flex flex-col justify-center items-center"
            >
    <div className="border border-theme-chatDivider bg-theme-tertiaryBackground rounded-md px-8 py-8 flex flex-col">
      <p className="text-theme-secondaryText font-normal text-md ">Redirection to Profile Page...</p>
      <div className="mt-10">
        <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-theme-primaryText"></div>
        </div>
      </div>
      <p className="text-theme-secondaryText font-normal text-sm mt-4 text-center">
        Please wait...
      </p>
    </div>
  </div>
  }

  return (
    <div className="flex flex-col sm:flex-row h-full">
      <GoogleOneTapLogin handleTapGoogleSuccess={handleTapGoogleSuccess} />
      <div className="bg-theme-secondaryBackground  pl-3 pt-4 sm:pb-0 pb-4">
        <img
          src={ChannelImages.CLogo.default}
          alt="logo"
          className="cursor-pointer"
          onClick={() => navigate("/")}
        />
      </div>
      <div className="w-full sm:w-1/2 h-full bg-theme-secondaryBackground xl:pl-[20%] sm:pt-20 pt-6 sm:items-start items-center flex flex-col justify-center ">
        <h3 className=" text-xl sm:text-3xl w-3/4 sm:text-start text-center font-medium tracking-wider text-theme-secondaryText font-inter">
          {forgot
            ? "Forgot Password"
            : isLogin
            ? "Get back to your channel"
            : isOtp
            ? "Verify it's you"
            : "Signup to get started"}
        </h3>
        <p className="text-theme-secondaryText text-sm mt-1">
          {forgot
            ? "(ಥ﹏ಥ)"
            : isLogin
            ? "ʕっ•ᴥ•ʔっ"
            : isOtp
            ? "•͡˘㇁•͡˘"
            : "ʕノ•ᴥ•ʔノ"}
        </p>
        {forgot ? (
          <div className="mt-4 w-3/5">
            <p className="text-theme-secondaryText font-normal text-xs font-inter">
              Enter the email address associated with your account and we'll
              send you a link to reset your password.
            </p>
            <div className="mt-6 w-full">
              <TextField
                label="email address"
                error={Boolean(errors.forgotEmail)}
                type="email"
                helperText={errors.forgotEmail}
                variant="outlined"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                fullWidth
                InputProps={{
                  style: {
                    color: "var(--theme-primarysecondaryText)",
                    padding: "0px 3px",
                    fontWeight: "400",
                  },
                  inputProps: {
                    style: {
                      color: "var(--theme-primaryText)",
                      fontSize: "14px",
                    },
                    placeholder: "email address",
                  },
                }}
                InputLabelProps={{
                  style: { color: "var(--theme-subtitle)" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "var(--theme-chatDivider)",
                    },
                    "&:hover fieldset": {
                      borderColor: "var(--theme-chatDivider)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--theme-chatDivider)",
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "var(--theme-placeholder)",
                    opacity: 1,
                  },
                  "& .MuiInputBase-root": {
                    maxHeight: "45px",
                    lineHeight: "45px",
                  },
                }}
              />
            </div>
            <div className="justify-center text-center align-center mb-8">
              <button
                onClick={handleforgotPassword}
                className={`w-full py-2.5 mt-6 rounded-xl ${
                  forgotEmail !== ""
                    ? "text-theme-primaryBackground bg-theme-secondaryText"
                    : "text-theme-buttonDisableText  bg-theme-buttonDisable "
                }  font-normal text-sm`}
              >
                Continue
              </button>
              <p className="text-theme-error font-normal mt-4 text-xs font-inter">
                {forgotError}
              </p>
            </div>
            <p className="text-center text-theme-secondaryText text-xs mt-8 mb-4">
              Don't have an account?
              <button
                onClick={handleToggleForgot}
                className="text-secondaryText underline ml-1 "
              >
                Register
              </button>
            </p>
          </div>
        ) : isOtp ? (
          <div className="mt-8 sm:w-4/5 w-4/5">
            <p className="text-theme-secondaryText font-normal text-sm font-inter sm:text-start text-center">
              Enter the verification code we just sent to your email id {email}
            </p>
            <div className="mt-5">
              <div className="flex sm:justify-start justify-center">
              <OtpInput
                value={otp}
                onChange={handleChangeOtp}
                numInputs={6}
                renderSeparator={<span className="md:w-3 w-2"></span>}
                renderInput={(props) => (
                  <input
                    {...props}
                    style={{
                      width: "34px",
                      height: "40px",
                      borderRadius: "6px",
                      backgroundColor: "#2B2930",
                      textAlign: "center",
                      color: "white",
                    }}
                    inputMode="numeric" // Ensures only numeric input
                    pattern="[0-9]*" // Restricts input to digits
                  />
                )}
              />
              </div>
              <p className=" text-theme-primaryText text-xs mt-3 font-inter sm:text-start text-center">
                Didn't received code?
                <button
                  onClick={handleResendCode}
                  className="text-theme-secondaryText underline ml-1 font-base font-inter font-normal"
                >
                  Resend
                </button>
              </p>
              <p className="text-theme-primaryText text-xs mb-12 mt-10 font-inter sm:text-start text-center">
                Entered wrong email?
                <button
                  onClick={handleToggleOtp}
                  className="text-theme-secondaryText underline ml-1 font-base font-inter font-normal"
                >
                  Change
                </button>
              </p>
            </div>
          </div>
        ) : (
          <>
            {!isLogin && (
              <div className="mt-4 w-3/5">
                <TextField
                  label="full name"
                  variant="outlined"
                  error={Boolean(errors.fullName)}
                  helperText={errors.fullName}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  fullWidth
                  InputProps={{
                    style: {
                      color: "var(--theme-primaryText)",
                      padding: "0px 3px",
                      fontWeight: "400",
                    },
                    inputProps: {
                      style: {
                        color: "var(--theme-primaryText)",
                        fontSize: "14px",
                      },
                      placeholder: "email address",
                    },
                  }}
                  InputLabelProps={{
                    style: { color: "var(--theme-subtitle)" },
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "var(--theme-chatDivider)",
                      },
                      "&:hover fieldset": {
                        borderColor: "var(--theme-chatDivider)",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "var(--theme-chatDivider)",
                      },
                      "&.Mui-focused .MuiInputLabel-root": {
                        color: "#D0BCFF !important",
                      },
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "var(--theme-placeholder)",
                      opacity: 1,
                    },
                    "& .MuiInputBase-root": {
                      maxHeight: "45px",
                      lineHeight: "45px",
                    },
                  }}
                />
              </div>
            )}
            <div className="mt-4 w-3/5">
              <TextField
                label="email address"
                error={Boolean(errors.email)}
                type="email"
                inputRef={emailRef}
                helperText={errors.email}
                onChange={handleChangeEmail}
                variant="outlined"
                value={email}
                fullWidth
                InputProps={{
                  style: {
                    color: "var(--theme-primaryText)",
                    padding: "0px 3px",
                    fontWeight: "400",
                  },
                  inputProps: {
                    style: {
                      color: "var(--theme-primaryText)",
                      fontSize: "14px",
                    },
                    placeholder: "email address",
                  },
                }}
                InputLabelProps={{
                  style: { color: "var(--theme-subtitle)" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "var(--theme-chatDivider)",
                    },
                    "&:hover fieldset": {
                      borderColor: "var(--theme-chatDivider)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--theme-chatDivider)",
                    },
                    "&.Mui-focused .MuiInputLabel-root": {
                      color: "#D0BCFF !important",
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "var(--theme-placeholder)",
                    opacity: 1,
                  },
                  "& .MuiInputBase-root": {
                    maxHeight: "45px",
                    lineHeight: "45px",
                  },
                }}
              />
            </div>
            <div className="mt-4 w-3/5">
              <TextField
                label={isLogin ? "password" : "create password"}
                variant="outlined"
                type={showPassword ? "text" : "password"}
                error={Boolean(errors.password)}
                helperText={errors.password}
                inputRef={passwordRef}
                value={password}
                onChange={handleChangePassword}
                fullWidth
                InputProps={{
                  style: {
                    color: "var(--theme-primaryText)",
                    padding: "0px 3px",
                    fontWeight: "400",
                  },
                  inputProps: {
                    style: {
                      color: "var(--theme-primaryText)",
                      fontSize: "14px",
                    },
                    placeholder: "password",
                  },

                  endAdornment: (
                    <InputAdornment position="end" className="mr-2">
                      <IconButton
                        className="mr-2 "
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOff sx={{ color: "#c4c4c4" }} />
                        ) : (
                          <Visibility sx={{ color: "#c4c4c4" }} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                InputLabelProps={{
                  style: { color: "var(--theme-subtitle)" },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "var(--theme-chatDivider)",
                    },
                    "&:hover fieldset": {
                      borderColor: "var(--theme-chatDivider)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--theme-chatDivider)",
                    },
                    "&.Mui-focused .MuiInputLabel-root": {
                      color: "#D0BCFF !important",
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "var(--theme-placeholder)",
                    opacity: 1,
                  },
                  "& .MuiInputBase-root": {
                    maxHeight: "45px",
                    lineHeight: "45px",
                  },
                }}
              />
            </div>

            {isLogin && (
              <button
                onClick={() => setForgot(true)}
                className="text-theme-primaryText w-3/5 mt-2  text-end text-xs mb-2"
              >
                forgot password?
              </button>
            )}
            {!isLogin && (
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 text-black bg rounded-sm checked:bg-theme-primary focus:ring-primary checked:ring-primary"
                />
                <label className="ml-2 text-xs text-theme-primaryText ">
                  I agree to the{" "}
                  <span className="text-theme-buttonEnable underline bg-transparent">
                    terms
                  </span>{" "}
                  &{" "}
                  <span
                    href="#"
                    className="text-theme-buttonEnable underline bg-transparent"
                  >
                    privacy policy
                  </span>
                </label>
              </div>
            )}
            <button
              onClick={handleFormSubmit}
              className={` w-3/5 py-2.5 mt-6 rounded-xl ${
                buttonEnabled
                  ? "text-theme-primaryBackground bg-theme-secondaryText"
                  : "text-theme-buttonDisableText  bg-theme-buttonDisable"
              }  font-normal text-sm`}
            >
              {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
            </button>
            <div className="justify-center items-center w-3/5 my-4">
              {newError !== "" ? (
                <p className="text-center text-theme-error  text-xs">
                  {newError}
                </p>
              ) : (
                !isSubdomain && (
                  <p className="text-center text-theme-secondaryText">or</p>
                )
              )}
            </div>
            {!isSubdomain && (
              <button
                onClick={() => googleLogin()}
                className="w-3/5 px-1.5 py-2 mb-4 text-xs  font-normal items-center
               text-theme-secondaryText bg-theme-tertiaryBackground rounded-xl border border-theme-chatDivider"
              >
                <img
                  src={googleLogo}
                  alt="Google logo"
                  className="inline w-6 h-6 mr-2"
                />
                {isLogin ? "Sign in with Google" : "Sign up with Google"}
              </button>
            )}
            <p className="text-center text-theme-secondaryText text-xs mb-10 ml-1 mt-2">
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={handleToggleLogin}
                className="text-theme-secondaryText underline ml-2 tracking-wide"
              >
                {isLogin ? "Register" : "Login"}
              </button>
            </p>
          </>
        )}
      </div>
      <div className="hidden sm:flex sm:w-1/2  items-center justify-start bg-theme-onboardBackground ">
        <img
          src="https://chips-social.s3.ap-south-1.amazonaws.com/channelsWebsite/LoginCover.svg"
          alt="Modal Illustration"
          className="w-3/4 lg:w-1/2 h-auto"
        />
      </div>
    </div>
  );
};

export default AuthPage;
