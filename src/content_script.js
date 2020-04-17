import { installDevtools } from "./install-devtools";
import { setupMountAndUnmount } from "./inspected-window-helpers/force-mount-unmount.js";
import { setupOverlayHelpers } from "./inspected-window-helpers/overlay-helpers.js";
import browser from "webextension-polyfill";

addStringifyableScript(installDevtools);
addStringifyableScript(setupMountAndUnmount);
addStringifyableScript(setupOverlayHelpers);

window.addEventListener("single-spa:routing-event", () => {
  browser.runtime.sendMessage({
    from: "single-spa",
    type: "routing-event",
  });
});

function addStringifyableScript(scriptReference) {
  var script = document.createElement("script");
  script.textContent = `(${scriptReference.toString()})()`;
  (document.head || document.documentElement).appendChild(script);
  script.remove();
}
