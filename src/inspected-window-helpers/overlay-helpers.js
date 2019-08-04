// this whole exported function is stringified, so be aware
export function setupOverlayHelpers() {
  const overlayDivClassName = `single-spa_overlay--div`;
  window.__SINGLE_SPA_DEVTOOLS__.overlay = setOverlaysOnApp;
  window.__SINGLE_SPA_DEVTOOLS__.removeOverlay = removeOverlaysFromApp;

  // executed when you want to show the overlay
  function setOverlaysOnApp(appName) {
    const app = getAppByName(appName);
    const { options, selectors } = getSelectorsAndOptions(app);

    selectors.forEach(selector => {
      createOverlayWithText(selector, options, appName);
    });
  }

  // executed when you want to remove the overlay
  function removeOverlaysFromApp(appName) {
    const app = getAppByName(appName);
    const { selectors } = getSelectorsAndOptions(app);
    selectors.forEach(selector => {
      const element = document.querySelector(selector);
      if (!element) {
        return null;
      }
      const existingOverlayDiv = element.querySelector(
        `.${overlayDivClassName}`
      );
      existingOverlayDiv &&
        existingOverlayDiv.remove &&
        existingOverlayDiv.remove();
    });
  }

  // everything after this are helper functions

  function getSelectorsAndOptions(app) {
    const { selectors } = app.devtools.overlays;
    if (!selectors.length) {
      selectors.push(`#single-spa-application\\:${app.name}`);
    }
    return {
      selectors: selectors
        .map(selector => document.querySelector(selector))
        .filter(node => node),
      options: app.devtools.overlays.options || {}
    };
  }

  function createOverlayWithText(selector, options, appName) {
    const className = `${overlayDivClassName} ${(options.classes || []).join(
      " "
    )}`;
    const element = document.querySelector(selector);
    if (!element) {
      return null;
    }
    const existingOverlayDiv = element.querySelector(`.${overlayDivClassName}`);
    if (existingOverlayDiv) {
      return existingOverlayDiv;
    }
    const div = element.appendChild(document.createElement("div"));
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
    childDiv.style.flexDirection = element.clientHeight > 80 ? "column" : "row";
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

  function getColorFromString(string, opacity = 0.1) {
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
    const rgba = [
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
