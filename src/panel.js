import browser from "webextension-polyfill";

async function createPanel() {
  try {
    const panel = await browser.devtools.panels.create(
      "single-spa Inspector",
      "/src/logo-white-bgblue.svg",
      "/src/panel.html"
    );

    panel.onShown.addListener(initPanel);
    panel.onHidden.addListener(uninitPanel);
  } catch (err) {
    console.error(`panels.create error`);
    throw err;
  }
}

function initPanel() {
  console.log("init");
}

function uninitPanel() {
  console.log("bye");
}

createPanel();
