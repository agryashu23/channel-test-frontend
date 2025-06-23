(function () {
  if (window.ChannelsWidgetLoaded) return;
  window.ChannelsWidgetLoaded = true;

  const production = true;

  const breakpoints = {
    sm: 500,
    md: 800,
    lg: 1100,
    xl: 1300,
  };

  let currentWidgetParams = null;
  const apiKey = getApiKeyFromScript();
  const domain = production ? window.location.hostname : "channelsbychips.site";

  if (!apiKey) {
    console.error("❌ Missing API key in script URL.");
    return;
  }

  function getApiKeyFromScript() {
    const scripts = document.getElementsByTagName("script");
    for (let script of scripts) {
      const src = script.src;
      if (src && src.includes("widget.js")) {
        const urlParams = new URL(src).searchParams;
        return urlParams.get("apiKey");
      }
    }
    return null;
  }

  function resolveResponsiveValue(valueObj) {
    if (!valueObj) return "100%";
    if (typeof valueObj === "string") return valueObj;

    const width = window.innerWidth;
    let matchedValue = valueObj.default || null;

    for (let key in valueObj) {
      const bp = breakpoints[key] || parseInt(key.replace(/[<>]/g, ""), 10);
      if (!bp || key === "default") continue;

      if (
        (key.startsWith("<") && width < bp) ||
        (key.startsWith(">") && width > bp) ||
        (breakpoints[key] && width < bp)
      ) {
        matchedValue = valueObj[key];
      }
    }

    return matchedValue || "100%";
  }

  function createModal({ width, height, position = "right" }) {
    removeExistingModal();

    const overlay = document.createElement("div");
    overlay.id = "channels-modal-overlay";
    overlay.style.cssText = `
      position: fixed;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: rgba(0,0,0,0.4);
      z-index: 1000;
    `;

    const sidepanel = document.createElement("div");
    sidepanel.id = "channels-modal-sidepanel";

    let panelStyles = `
    position: fixed;
    z-index: 1001;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 24px rgba(0,0,0,0.14);
    background: #252525;
    border-radius: 14px;
    width: ${width};
    height: ${height};
  `;

    if (position === "right") {
      panelStyles += "right: 0; bottom: 0;";
    } else if (position === "left") {
      panelStyles += "left: 0; bottom: 0;";
    } else if (position === "top-left") {
      panelStyles += "left: 0; top: 0;";
    } else if (position === "top-right") {
      panelStyles += "right: 0; top: 0;";
    } else if (position === "center") {
      panelStyles += `
      top: 50%; left: 50%;
      transform: translate(-50%, -50%);
    `;
    } else if (position === "bottom") {
      panelStyles += `
      left: 50%; bottom: 0; transform: translateX(-50%);
      width: ${width}; max-width: 100vw;
    `;
    } else {
      panelStyles += "right: 0; bottom: 0;";
    }

    sidepanel.style.cssText = panelStyles;

    const iframe = document.createElement("iframe");
    iframe.src = `${
      production ? "https://channels.social" : "http://localhost:3001"
    }/embed/channels`;
    iframe.className = "channels-frame";
    iframe.style.cssText = `
      width: 100%;
      height: 100%;
      border: none;
      border-radius: ${position === "center" ? "14px" : "14px 14px 0 0"};
      background-color: #252525;
      flex-grow: 1;
    `;

    sidepanel.appendChild(iframe);
    overlay.appendChild(sidepanel);
    document.body.appendChild(overlay);
    document.body.style.overflow = "hidden";

    overlay.addEventListener("click", () => {
      removeExistingModal();
    });

    sidepanel.addEventListener("click", (e) => e.stopPropagation());

    window.addEventListener("resize", resizeModal);
  }

  function resizeModal() {
    const modal = document.getElementById("channels-modal-sidepanel");
    if (!modal || !currentWidgetParams) return;

    const newWidth = resolveResponsiveValue(currentWidgetParams.width);
    const newHeight = resolveResponsiveValue(currentWidgetParams.height);

    modal.style.width = newWidth;
    modal.style.height = newHeight;
  }

  function removeExistingModal() {
    const existing = document.getElementById("channels-modal-overlay");
    if (existing) existing.remove();
    document.body.style.overflow = "auto";
  }

  function sendEmbedMessage(embedData) {
    const iframe = document.querySelector("#channels-modal-sidepanel iframe");
    if (!iframe) return;

    iframe.addEventListener("load", () => {
      iframe.contentWindow.postMessage(
        {
          type: "embedData",
          source: "channels-widget",
          payload: embedData,
        },
        production ? "https://channels.social" : "http://localhost:3001"
      );
    });
  }

  window.ChannelsWidget = function (params = {}) {
    fetch(
      `${
        production ? "https://api.channels.social" : "http://localhost:3000"
      }/api/verify/api/key`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, domain }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data.valid) {
          alert("❌ Invalid API key or unauthorized domain.");
          console.error("❌ Invalid API key or unauthorized domain.");
          return;
        }

        window.openChannelsWidget = function (params = {}) {
          currentWidgetParams = params;

          let sanitizedEmail = null;
          if (params.email) {
            sanitizedEmail = params.email.trim().toLowerCase();
            sanitizedEmail = sanitizedEmail.replace(/\s+/g, "");
            const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
            if (!emailRegex.test(sanitizedEmail)) {
              alert("❌ Invalid email address.");
              console.error(
                "❌ Invalid email address provided:",
                sanitizedEmail
              );
              return;
            }
          }

          const embedData = {
            apiKey,
            domain,
            selectedChannel: params.selectedChannel || null,
            email: sanitizedEmail,
            selectedTopic: params.selectedTopic || null,
            theme: params.theme || "dark",
            autoLogin: params.autoLogin || false,
            channels: params.channels || [],
          };

          const width = resolveResponsiveValue(
            params.width || { default: "450px", "<500": "100%" }
          );
          const height = resolveResponsiveValue(
            params.height || { default: "90%", "<500": "80%" }
          );
          const position = params.position || "right";

          createModal({ width, height, position });

          setTimeout(() => sendEmbedMessage(embedData), 100);
        };
      })
      .catch((error) => console.log("❌ Error verifying API key:", error));
  };
})();
