import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { evalDevtoolsCmd } from "./inspected-window.helper";
import browser from "webextension-polyfill";
import Apps from "./panel-app/apps.component";

function PanelRoot(props) {
  const [apps, setApps] = useState();

  useEffect(() => {
    getApps(setApps).catch(err => {
      console.error("error in getting apps on mount");
      throw err;
    });
  }, []);

  useEffect(() => {
    const boundEvtListener = contentScriptListener.bind(null, setApps);
    window.addEventListener("ext-content-script", boundEvtListener);

    return () => {
      window.removeEventListener("ext-content-script", boundEvtListener);
    };
  }, []);

  if (!apps)
    return (
      <div>
        Loading... if you see this message for a long time, either single-spa is
        not on the page or you are not running a version of single-spa that
        supports developer tools
      </div>
    );

  return <Apps apps={apps} theme={props.theme} />;
}

async function getApps(setAppsFn) {
  const results = await evalDevtoolsCmd(`exposedMethods.getRawAppData()`);
  setAppsFn(results);
}

function contentScriptListener(setApps, msg) {
  if (msg.detail.from === "single-spa" && msg.detail.type === "routing-event") {
    getApps(setApps).catch(err => {
      console.error("error in getting apps after update event");
      throw err;
    });
  }
}

//themeName may or may not work in chrome. yet to test it to see whether it does or not
ReactDOM.render(
  <PanelRoot theme={browser.devtools.panels.themeName} />,
  document.getElementById("app")
);
