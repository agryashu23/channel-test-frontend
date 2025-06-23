import "./App.css";
import { React, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  useLocation,
  Navigate,
} from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import embedStore from "./redux/store/embedStore";
import PageHome from "./components/ChannelPages/PageHome";
import ThemeHandler from "./utils/ThemeHandler";
import Onboarding from "./components/Onboarding/Onboarding";
import { Helmet } from "react-helmet";
import { Provider } from "react-redux";
import Logo from "./assets/icons/logo.svg";
import Footer from "./components/Footer/Footer";
import AuthPage from "./components/auth/AuthPage";
import Landing from "./components/LandingPage/Landing";
import Welcome from "./components/LandingPage/Welcome";
import Profile from "./components/Profile/Profile";
import ChannelPage from "./components/Channel/ChannelPage";
import useInitializeApp from "./services/initializeApp";
import ProfileChipsView from "./components/View/ProfileChipsView";
import AcceptInvite from "./components/widgets/AcceptInvite";
import HomePage from "./components/Home/Home";
import { extractSubdomain } from "./utils/extractDomain";
import { updateGalleryField } from "./redux/slices/gallerySlice";
import { setIsDomain } from "./redux/slices/authSlice";
import Gallery from "./components/Profile/Gallery";
import QueryPage from "./components/query";
import Page404 from "./components/Page404/Page404";
import CurationView from "./components/View/CurationView";
import { ProtectedOnboardingRoute } from "./components/Onboarding/Protectedonboardroute";
import EmbedHomePage from "./components/EmbedChannels/views/EmbedHomePage";
import PrivacyPage from "./components/Footer/Modals/PrivacyPage";
import ResetPassword from "./utils/ResetPassword";
import EmbedAuthPage from "./components/EmbedChannels/views/EmbedAuthPage";
import EmbedOnboardPage from "./components/EmbedChannels/views/EmbedOnboardPage";
import GoogleAuthPopup from "./components/EmbedChannels/views/EmbedGoogleAuth";
import GoogleAuthCallback from "./components/EmbedChannels/utility/Callback";
import Integration from "./components/Integration/Integration";
import Modals from "./utils/modals";
import AdminHome from "./components/Admin/AdminHome";
import PageDM from "./components/ChannelPages/DMPages/PageDM";
import DMChat from "./components/ChannelPages/DMPages/DMChat";
import DocsPage from "./components/Documentation/DocMainPage";
import DMMessages from "./components/ChannelPages/DMPages/DMMessages";
import ChannelAdmin from "./components/ChannelAdmin/ChannelAdmin";
import TermsPage from "./components/Footer/Modals/TermsPage";
import Shipping from "./components/Footer/Modals/Shipping";
import ContactUs from "./components/Footer/Modals/ContactUs";
import CancellationPolicy from "./components/Footer/Modals/Cancellation";
import EventFullPage from "./components/ChannelPages/widgets/EventFullPage";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const dispatch = useDispatch();
  useInitializeApp();
  const [hasSubdomain, setHasSubdomain] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    const subdomain = extractSubdomain(url);
    if (subdomain) {
      dispatch(setIsDomain(true));
      setHasSubdomain(true);
      dispatch(updateGalleryField({ name: "username", value: subdomain }));
    }
  }, [dispatch]);

  const MainLayout = () => {
    const location = useLocation();
    const allowedPaths = ["/get-started", "/channels/onboarding"];
    const isFooterVisible = allowedPaths.some((path) => {
      const regex = new RegExp(`^${path.replace(/:[^\s/]+/g, "([^/]+)")}$`);
      return regex.test(location.pathname);
    });

    return (
      <div className="relative flex flex-col min-h-screen bg-theme-primaryBackground w-full overflow-y-auto custom-scrollbar">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Channels.Social</title>
          <link rel="icon" href={Logo} />
        </Helmet>
        <div className="flex flex-1 ">
          <div className=" w-full">
            <Outlet />
          </div>
        </div>
        <div className="w-full">{isFooterVisible && <Footer />}</div>
      </div>
    );
  };

  const SubdomainLayout = () => {
    const location = useLocation();
    const allowedPaths = ["/get-started", "/channels/onboarding"];
    const isFooterVisible = allowedPaths.some((path) => {
      const regex = new RegExp(`^${path.replace(/:[^\s/]+/g, "([^/]+)")}$`);
      return regex.test(location.pathname);
    });

    return (
      <div className="relative flex flex-col min-h-screen bg-theme-primaryBackground w-full overflow-y-auto custom-scrollbar">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Channels.Social</title>
          <link rel="icon" href={Logo} />
        </Helmet>
        <div className="flex flex-1 ">
          <div className=" w-full">
            <Outlet />
          </div>
        </div>
        <div className="w-full">{isFooterVisible && <Footer />}</div>
      </div>
    );
  };

  const isMainApp = window.location.hostname.endsWith("channels.social");
  return (
    <Router>
      <GoogleOAuthProvider clientId="391369792833-72medeq5g0o5sklosb58k7c98ps72foj.apps.googleusercontent.com">
        <ThemeHandler />
        <ToastContainer position="bottom-right"  newestOnTop />
        <Routes>
          {hasSubdomain ? (
            <>
              <Route element={<SubdomainLayout />}>
                <Route path="/" element={<Landing />}>
                  <Route index element={<Gallery />} />{" "}
                  <Route path="/account/:username/welcome" element={<Welcome />} />{" "}
                  <Route path="/account/:username/profile" element={<Profile />} />{" "}
                  <Route path="/account/:username/messages" element={<PageDM />} />
                  <Route
                    path="/account/:username/curation/:curId"
                    element={<ProfileChipsView />}
                  />{" "}
                  <Route path="/account/:username/messages/" element={<PageDM />}>
                    <Route path="list" element={<DMMessages />} />
                    <Route path="list/:user" element={<DMChat />} />
                  </Route>
                  <Route path="/curation/:curId" element={<CurationView />} />
                  <Route
                    path="/account/:username/channel/:channelId"
                    element={<ChannelPage />}
                  />{" "}
                  {/* <Route path="/channel/:channelId" element={<ChannelPage />} />{" "} */}
                  <Route
                    path="/account/:username/channel/:channelId/c-id/topic/:topicId"
                    element={<PageHome />}
                  />{" "}
                </Route>
                <Route
                  path="/get-started"
                  element={<AuthPage isSubdomain={hasSubdomain} />}
                />
                <Route
                  path="/channels/onboarding"
                  element={
                    <ProtectedOnboardingRoute>
                      <Onboarding />
                    </ProtectedOnboardingRoute>
                  }
                />
                <Route
                  path="/account/:username/curation/:curId"
                  element={<ProfileChipsView />}
                />
                <Route path="/accept-invite" element={<AcceptInvite />} />

                <Route path="*" element={<Page404 />} />
              </Route>
            </>
          ) : (
            <Route element={<MainLayout />}>
              <Route
                path="/embed/google-auth/login"
                element={<GoogleAuthPopup />}
              />
              <Route path="/channels/admin/panel" element={<ChannelAdmin />} />

              <Route
                path="/auth/google/callback"
                element={<GoogleAuthCallback />}
              />
              <Route path="/admin/:username/home" element={<AdminHome />} />

              <Route path="/" element={<HomePage />} />
              <Route path="/pricing" element={<HomePage />} />

              <Route
                path="/get-started"
                element={<AuthPage isSubdomain={hasSubdomain} />}
              />

              <Route
                path="/channels/onboarding"
                element={
                  <ProtectedOnboardingRoute>
                    <Onboarding />
                  </ProtectedOnboardingRoute>
                }
              />
              <Route path="/account/:username" element={<Landing />}>
                <Route index element={<Navigate to="welcome" replace />} />
                <Route path="welcome" element={<Welcome />} />
                <Route path="profile" element={<Profile />} />
                <Route path="messages" element={<PageDM />} />
                <Route path="messages/" element={<PageDM />}>
                  <Route path="list" element={<DMMessages />} />
                  <Route path="list/:user" element={<DMChat />} />
                </Route>

                <Route path="curation/:curId" element={<ProfileChipsView />} />
                <Route path="channel/:channelId" element={<ChannelPage />} />
                <Route
                  path="channel/:channelId/c-id/topic/:topicId"
                  element={<PageHome />}
                />
              </Route>

              <Route path="/api/integration" element={<Landing />}>
                <Route path="channels" element={<Integration />} />
              </Route>
              {/* <Route path="/auth-login" element={<EmbedAuthPage />} /> */}

              <Route
                path="/account/:username/curation/:curId"
                element={<ProfileChipsView />}
              />

              <Route path="/accept-invite" element={<AcceptInvite />} />
              <Route path="/privacy-policy" element={<PrivacyPage />} />
              <Route path="/terms-and-conditions" element={<TermsPage />} />
              <Route path="/shipping-policy" element={<Shipping />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route
                path="/cancellation-policy"
                element={<CancellationPolicy />}
              />
              <Route path="/query/feedback/channels" element={<QueryPage />} />
              <Route path="/event/:eventId" element={<EventFullPage />} />
              <Route path="*" element={<Page404 />} />
              <Route
                path="/reset-password/:token"
                element={<ResetPassword />}
              />
              <Route path="/documentation/channels" element={<DocsPage />} />

              <Route
                path="/embed/channels/*"
                element={
                  <Provider store={embedStore}>
                    <EmbedHomePage />
                  </Provider>
                }
              >
                <Route
                  path="account/:username/channel/:channelId"
                  element={<ChannelPage />}
                />
                <Route path="get-started" element={<EmbedAuthPage />} />
                <Route path="account/:username/messages/" element={<PageDM />}>
                  <Route path="list" element={<DMMessages />} />
                  <Route path="list/:user" element={<DMChat />} />
                </Route>

                <Route path="onboarding" element={<EmbedOnboardPage />} />
                <Route path="account/:username/profile" element={<Profile />} />
                <Route
                  path="account/:username/channel/:channelId/c-id/topic/:topicId"
                  element={<PageHome />}
                />
              </Route>
            </Route>
          )}
        </Routes>
        <Modals />
      </GoogleOAuthProvider>
    </Router>
  );
};

export default App;
