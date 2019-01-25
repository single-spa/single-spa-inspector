import browser from "webextension-polyfill";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";

function PanelRoot(props) {
  const [apps, setApps] = useState();
  useEffect(() => {
    async function getApps() {
      try {
        const inspectedApps = await browser.devtools.inspectedWindow.eval(
          `document.querySelector('div')`
        );
        setApps(inspectedApps);
      } catch (err) {
        console.error(`Wrong in useEffect`);
        throw err;
      }
    }

    getApps();
  }, []);
  return (
    <div>
      {apps ? <span>{apps.toString()}</span> : <span>Loading apps...</span>}
      React is working!
    </div>
  );
}

//themeName may or may not work in chrome. yet to test it to see whether it does or not
ReactDOM.render(
  <PanelRoot theme={browser.devtools.panels.themeName} />,
  document.getElementById("app")
);
