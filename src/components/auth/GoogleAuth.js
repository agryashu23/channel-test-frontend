import { useEffect, useSelector } from "../../globals/imports";

const GoogleOneTapLogin = ({ handleTapGoogleSuccess }) => {
  const isLoggedIn = useSelector((state) => !!state.auth.user);

  useEffect(() => {
    if (!isLoggedIn) {
      if (
        !document.querySelector(
          'script[src="https://accounts.google.com/gsi/client"]'
        )
      ) {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;

        script.onload = () => {
          if (window.google) {
            console.log("✅ Google Identity Services Loaded!");

            window.google.accounts.id.initialize({
              client_id:
                "391369792833-72medeq5g0o5sklosb58k7c98ps72foj.apps.googleusercontent.com",
              callback: handleTapGoogleSuccess,
              auto_select: false,
              cancel_on_tap_outside: true,
            });

            setTimeout(() => {
              if (!isLoggedIn) {
                window.google.accounts.id.prompt();
              }
            }, 1000);
          }
        };

        document.body.appendChild(script);
      } else {
        if (window.google && !isLoggedIn) {
          window.google.accounts.id.initialize({
            client_id:
              "391369792833-72medeq5g0o5sklosb58k7c98ps72foj.apps.googleusercontent.com",
            callback: handleTapGoogleSuccess,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          setTimeout(() => {
            if (!isLoggedIn) {
              window.google.accounts.id.prompt();
            }
          }, 1000);
        }
      }
    } else {
      setTimeout(() => {
        window.google?.accounts.id.cancel();
      }, 500);
    }
  }, [isLoggedIn]);

  return null;
};

export default GoogleOneTapLogin;
