import browser from "webextension-polyfill";

addStringifyableScript("./build/installDevtools.js");
addStringifyableScript("./build/forceMountUnmount.js");
addStringifyableScript("./build/overlayHelpers.js");

window.addEventListener("single-spa:routing-event", () => {
  browser.runtime.sendMessage({
    from: "single-spa",
    type: "routing-event",
  });
});

function addStringifyableScript(scriptReference) {
  var script = document.createElement("script");
  script.src = chrome.runtime.getURL(scriptReference);
  (document.head || document.documentElement).appendChild(script);
  script.onload = function() {
    script.remove();
  };
}
