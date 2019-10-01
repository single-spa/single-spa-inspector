// this whole exported function is stringified, so be aware
export function setupOverlayHelpers() {
  const overlayDivClassName = `single-spa_overlay--div`;
  window.__SINGLE_SPA_DEVTOOLS__.overlay = setOverlaysOnApp;
  window.__SINGLE_SPA_DEVTOOLS__.removeOverlay = removeOverlaysFromApp;

  // executed when you want to show the overlay
  function setOverlaysOnApp(appName) {
    const app = getAppByName(appName);
    const { options, nodes } = getOverlayNodesAndOptions(app);

    nodes.forEach(node => {
      createOverlayWithText(node, options, appName);
    });
  }

  // executed when you want to remove the overlay
  function removeOverlaysFromApp(appName) {
    const app = getAppByName(appName);
    const { nodes } = getOverlayNodesAndOptions(app);
    nodes.forEach(node => {
      if (!node) {
        return null;
      }
      node
        .querySelectorAll(`.${overlayDivClassName}`)
        .forEach(overlayElem =>
          overlayElem.parentNode.removeChild(overlayElem)
        );
    });
  }

  // everything after this are helper functions

  function getOverlayNodesAndOptions(app) {
    const { selectors = [], options = {} } = app.devtools.overlays;
    const singleSpaDefaultContainerId =
      "#" + CSS.escape(`single-spa-application:${app.name}`);
    return {
      nodes: selectors
        .concat(singleSpaDefaultContainerId)
        .map(selector => document.querySelector(selector))
        .filter(node => node),
      options
    };
  }

  function createOverlayWithText(node, options, appName) {
    if (!node) {
      return null;
    }
    const className = `${overlayDivClassName} ${(options.classes || []).join(
      " "
    )}`;
    const existingOverlayDiv = node.querySelector(`.${overlayDivClassName}`);
    if (existingOverlayDiv) {
      return existingOverlayDiv;
    }
    // setup main overlay div
    let backgroundColor;
    const hexRegex = /^#[A-Fa-f0-9]{6}$/g;
    if (options.color && hexRegex.test(options.color)) {
      backgroundColor = getRGBAFromHex(options.color.replace("#", ""));
    } else if (options.background) {
      backgroundColor = options.background;
    } else {
      backgroundColor = getColorFromString(appName);
    }

    const { height, left, top, width } = node.getBoundingClientRect();
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
          color: ${options.color ||
            options.textColor ||
            getColorFromString(appName, 1)};
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
              ? options.textBlocks.map(textBlock => `<div>${textBlock}</div>`)
              : ""
          }
        </div>
      </div>
    `;
    const overlayEl = new DOMParser().parseFromString(domStr, "text/html").body
      .firstChild;
    return node.appendChild(overlayEl);
  }

  function getColorFromString(string, opacity = 0.4) {
    const raw = (
      parseInt(
        parseInt(string, 36)
          .toExponential()
          .slice(2, -5),
        10
      ) & 0xffffff
    )
      .toString(16)
      .toUpperCase();
    const hex = raw
      .split("")
      .concat([0, 0, 0, 0, 0, 0])
      .slice(0, 6)
      .join("");
    return getRGBAFromHex(hex, opacity);
  }

  function getRGBAFromHex(hex, opacity = 0.1) {
    const [r, g, b] = [
      `0x${hex.slice(0, 2)}`,
      `0x${hex.slice(2, 4)}`,
      `0x${hex.slice(4, 6)}`
    ].map(v => parseInt(v));
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  function getAppByName(appName) {
    const { getRawAppData } = window.__SINGLE_SPA_DEVTOOLS__.exposedMethods;
    return getRawAppData().find(rawApp => rawApp.name === appName);
  }
}
