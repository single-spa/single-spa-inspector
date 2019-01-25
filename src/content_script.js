import { installDevtools } from "./install-devtools";

var script = document.createElement("script");
script.textContent = `(${installDevtools.toString()})()`;
(document.head || document.documentElement).appendChild(script);
script.remove();
