// this whole exported function is stringified, so be aware
export function setupOverlayHelpers() {
  const overlayDivClassName = `single-spa_overlay--div`;
  window.__SINGLE_SPA_DEVTOOLS__.overlay = setOverlaysOnApp;
  window.__SINGLE_SPA_DEVTOOLS__.removeOverlay = removeOverlaysFromApp;

  const overlaysConfigMap = {};

  const RO = new ResizeObserver(() => {
    // Redraw all overlays since we can't know which layout changes could affect other elements
    Object.entries(overlaysConfigMap).forEach(([appName, overlayConfig]) => {
      overlayConfig.nodes.forEach((node) => {
        createOverlayWithText(node, overlayConfig.options, appName);
      });
    });
  });

  // executed when you want to show the overlay
  function setOverlaysOnApp(appName) {
    const overlaysConfig = getOverlayNodesAndOptions(getAppByName(appName));
    overlaysConfigMap[appName] = overlaysConfig;
    overlaysConfig.nodes.forEach((node) => {
      RO.observe(node);
    });
  }

  // executed when you want to remove the overlay
  function removeOverlaysFromApp(appName) {
    overlaysConfigMap[appName].nodes.forEach((node) => {
      node
        .querySelectorAll(`.${overlayDivClassName}`)
        .forEach((overlayElem) => node.removeChild(overlayElem));
      RO.unobserve(node);
    });
    delete overlaysConfigMap[appName];
  }

  // everything after this are helper functions

  function getOverlayNodesAndOptions(app) {
    const { selectors = [], options = {} } = app.devtools.overlays;
    const singleSpaDefaultContainerId =
      "#" + CSS.escape(`single-spa-application:${app.name}`);
    return {
      nodes: selectors
        .concat(singleSpaDefaultContainerId)
        .map((selector) => document.querySelector(selector))
        .filter((node) => node),
      options,
    };
  }

  function createOverlayWithText(node, options, appName) {
    if (!node) {
      return null;
    }

    const { height, left, top, width } = node.getBoundingClientRect();
    const existingOverlay = node.querySelector(`.${overlayDivClassName}`);

    if (existingOverlay) {
      const existingOverlayRect = existingOverlay.getBoundingClientRect();
      if (
        existingOverlayRect.height === height &&
        existingOverlayRect.left === left &&
        existingOverlayRect.top === top &&
        existingOverlayRect.width === width
      ) {
        // short circuit if size and position hasn't changed
        return null;
      }
    }

    let backgroundColor;
    const hexRegex = /^#[A-Fa-f0-9]{6}$/g;
    if (options.color && hexRegex.test(options.color)) {
      backgroundColor = getRGBAFromHex(options.color.replace("#", ""));
    } else if (options.background) {
      backgroundColor = options.background;
    } else {
      backgroundColor = getColorFromString(appName);
    }

    const className = `${overlayDivClassName} ${(options.classes || []).join(
      " "
    )}`;

    // setup main overlay div
    const domStr = `
      <div
        class="${className}"
        style="
          background: ${backgroundColor};
          height: ${options.height || height + "px"};
          left: ${options.left || left + "px"};
          pointer-events: none;
          position: ${options.position || "absolute"};
          top: ${options.top || top + "px"};
          width: ${options.width || width + "px"};
          z-index: ${options.zIndex || 40};
        "
      >
        <div style="
          align-items: center;
          color: ${
            options.color || options.textColor || getColorFromString(appName, 1)
          };
          display: flex;
          flex-direction: ${node.clientHeight > 80 ? "column" : "row"};
          font-size: 2rem;
          font-weight: bold;
          height: 100%;
          justify-content: center;
        ">
          <div>${appName}</div>
          ${
            options.textBlocks && options.textBlocks.length >= 1
              ? options.textBlocks.map((textBlock) => `<div>${textBlock}</div>`)
              : ""
          }
        </div>
      </div>
    `;
    const overlayEl = new DOMParser().parseFromString(domStr, "text/html").body
      .firstChild;

    existingOverlay
      ? node.replaceChild(overlayEl, existingOverlay)
      : node.appendChild(overlayEl);
  }

  function getColorFromString(string, opacity = 0.4) {
    const cleanStr = string
      .split("")
      .map((l) => (/[^0-9a-z]/gi.test(l) ? l.charCodeAt(0) : l)) // replace non-ascii with charCode integer
      .join("");

    const raw = (
      parseInt(parseInt(cleanStr, 36).toExponential().slice(2, -5), 10) &
      0xffffff
    )
      .toString(16)
      .toUpperCase();
    const hex = raw.split("").concat([0, 0, 0, 0, 0, 0]).slice(0, 6).join("");
    return getRGBAFromHex(hex, opacity);
  }

  function getRGBAFromHex(hex, opacity = 0.1) {
    const [r, g, b] = [
      `0x${hex.slice(0, 2)}`,
      `0x${hex.slice(2, 4)}`,
      `0x${hex.slice(4, 6)}`,
    ].map((v) => parseInt(v));
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  function getAppByName(appName) {
    const { getRawAppData } = window.__SINGLE_SPA_DEVTOOLS__.exposedMethods;
    return getRawAppData().find((rawApp) => rawApp.name === appName);
  }
}
