import { installDevtools } from "./install-devtools";
import browser from "webextension-polyfill";

var script = document.createElement("script");
script.textContent = `(${installDevtools.toString()})()`;
(document.head || document.documentElement).appendChild(script);
script.remove();

window.addEventListener("single-spa:app-change", () => {
  browser.runtime.sendMessage({
    from: "single-spa",
    type: "app-change"
  });
});
