import browser from "webextension-polyfill";

createPanel().catch(err => {
  console.error("Something happened in createPanel()");
  throw err;
});

async function createPanel() {
  let portToBackground;

  const panel = await browser.devtools.panels.create(
    "single-spa Inspector",
    "/logo-white-bgblue.svg",
    "./panel.html"
  );

  panel.onShown.addListener(panelWindow => {
    portToBackground = browser.runtime.connect({ name: "panel-devtools" });
    portToBackground.onMessage.addListener(msg => {
      const custEvent = new CustomEvent("ext-content-script", {
        detail: msg
      });
      panelWindow.dispatchEvent(custEvent);
    });
  });

  panel.onHidden.addListener(() => {
    portToBackground.disconnect();
    portToBackground = null;
  });
}
