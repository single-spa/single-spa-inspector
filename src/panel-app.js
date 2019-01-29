import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { evalDevtoolsCmd } from "./inspected-window.helper";

function PanelRoot(props) {
  const [apps, setApps] = useState();
  useEffect(() => {
    async function getApps() {
      const results = await evalDevtoolsCmd(`getAppData()`);
      setApps(results);
    }

    getApps().catch(err => {
      console.error("error in panel-app.js -> getApps()");
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

//themeName may or may not work in chrome. yet to test it to see whether it does or not
ReactDOM.render(
  <PanelRoot theme={browser.devtools.panels.themeName} />,
  document.getElementById("app")
);
