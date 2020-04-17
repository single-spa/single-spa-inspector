import browser from "webextension-polyfill";

let portsToPanel = [];

browser.runtime.onMessage.addListener((msg, sender) => {
  //message received from the content-script running in the page context
  portsToPanel.forEach((port) => {
    if (sender.id === port.sender.id) {
      port.postMessage(msg);
    }
  });
});

browser.runtime.onConnect.addListener((port) => {
  if (port.name !== "panel-devtools") return;
  portsToPanel = [...portsToPanel, port];

  port.onDisconnect.addListener(() => {
    portsToPanel = portsToPanel.filter((p) => p !== port);
  });
});
