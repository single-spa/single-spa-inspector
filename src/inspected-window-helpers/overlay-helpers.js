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
      const existingOverlayDiv = node.querySelector(`.${overlayDivClassName}`);
      existingOverlayDiv &&
        existingOverlayDiv.remove &&
        existingOverlayDiv.remove();
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
    const div = node.appendChild(document.createElement("div"));
    // setup main overlay div
    div.className = className;
    div.style.width = options.width || "100%";
    div.style.height = options.height || "100%";
    div.style.zIndex = options.zIndex || 40;
    div.style.position = options.position || "absolute";
    div.style.top = options.top || 0;
    div.style.left = options.left || 0;
    div.style.pointerEvents = "none";
    let backgroundColor;
    const hexRegex = /^#[A-Fa-f0-9]{6}$/g;
    if (options.color && hexRegex.test(options.color)) {
      backgroundColor = getRGBAFromHex(options.color.replace("#", ""));
    } else if (options.background) {
      backgroundColor = options.background;
    } else {
      backgroundColor = getColorFromString(appName);
    }
    div.style.background = backgroundColor;

    const childDiv = div.appendChild(document.createElement("div"));
    childDiv.style.display = "flex";
    childDiv.style.flexDirection = node.clientHeight > 80 ? "column" : "row";
    childDiv.style.alignItems = "center";
    childDiv.style.justifyContent = "center";
    childDiv.style.color =
      options.color || options.textColor || getColorFromString(appName, 1);
    childDiv.style.fontWeight = "bold";
    childDiv.style.height = "100%";
    childDiv.style.fontSize = "32px";

    const appNameDiv = document.createElement("div");
    appNameDiv.appendChild(document.createTextNode(appName));
    childDiv.appendChild(appNameDiv);

    if (options.textBlocks && options.textBlocks.length >= 1) {
      options.textBlocks.forEach(textBlock => {
        const textBlockDiv = document.createElement("div");
        textBlockDiv.appendChild(document.createTextNode(textBlock));
        childDiv.appendChild(textBlockDiv);
      });
    }

    return div;
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

  function getRGBAFromHex(hex, opacity = 0.4) {
      `0x${hex.slice(0, 2)}`,
      `0x${hex.slice(2, 4)}`,
      `0x${hex.slice(4, 6)}`
    ];
    return `rgba(${parseInt(rgba[0])}, ${parseInt(rgba[1])}, ${parseInt(
      rgba[2]
    )}, ${opacity})`;
  }

  function getAppByName(appName) {
    const { getRawAppData } = window.__SINGLE_SPA_DEVTOOLS__.exposedMethods;
    return getRawAppData().find(rawApp => rawApp.name === appName);
  }
}
