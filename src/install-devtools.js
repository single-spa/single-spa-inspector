// this function gets toString()-ed, so for anything you change here make sure it can work in a string-ed environment.
export function installDevtools() {
  if (window.__SINGLE_SPA_DEVTOOLS__) return;
  Object.defineProperty(window, "__SINGLE_SPA_DEVTOOLS__", {
    value: {},
  });
}
