import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { evalDevtoolsCmd } from "./inspected-window.helper";
import browser from "webextension-polyfill";

function PanelRoot(props) {
  const [apps, setApps] = useState();

  useEffect(() => {
    window.addEventListener("ext-content-script", msg => {
      if (
        msg.detail.from === "single-spa" &&
        msg.detail.type === "app-change"
      ) {
        getApps(setApps).catch(err => {
          console.error("error in getting apps after update event");
          throw err;
        });
      }
    });
  }, []);

  useEffect(() => {
    getApps(setApps).catch(err => {
      console.error("error in getting apps on mount");
      throw err;
    });
  }, []);

  if (!apps) return <div>Loading...</div>;
  return (
    <div>
      {apps.map(app => (
        <div key={app.name}>
          {app.name} : {app.status}
        </div>
      ))}
    </div>
  );
}

async function getApps(setAppsFn) {
  const results = await evalDevtoolsCmd(`getAppData()`);
  setAppsFn(results);
}

//themeName may or may not work in chrome. yet to test it to see whether it does or not
ReactDOM.render(
  <PanelRoot theme={browser.devtools.panels.themeName} />,
  document.getElementById("app")
);
