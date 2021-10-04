import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { evalDevtoolsCmd } from "./inspected-window.helper";
import browser from "webextension-polyfill";
import Apps from "./panel-app/apps.component";
import ErrorBoundary from "./panel-app/ErrorBoundary.component";
import Profiler from "./profiler/profiler.js";
import { Tabs, TabList, Tab, TabPanels, TabPanel } from "@reach/tabs";
import "@reach/tabs/styles.css";

function PanelRoot(props) {
  const [apps, setApps] = useState();
  const [appError, setAppError] = useState();

  if (appError) {
    throw appError;
  }

  useEffect(() => {
    try {
      getApps(setApps);
    } catch (err) {
      err.message = `Error during getApps: ${err.message}`;
      setAppError(err);
    }
  }, []);

  useEffect(() => {
    document.body.classList.add(props.theme);
    return () => {
      document.body.classList.remove(props.theme);
    };
  }, [props.theme]);

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

  return (
    <>
      <Tabs>
        <TabList>
          <Tab>Applications</Tab>
          <Tab>Profiler</Tab>
        </TabList>

        <TabPanels style={{ marginTop: "16px" }}>
          <TabPanel>
            <Apps apps={apps} theme={props.theme} />
          </TabPanel>
          <TabPanel>
            <Profiler />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
}

async function getApps(setAppsFn) {
  const results = await evalDevtoolsCmd(`exposedMethods.getRawAppData()`);
  setAppsFn(results);
}

function contentScriptListener(setApps, msg) {
  if (msg.detail.from === "single-spa" && msg.detail.type === "routing-event") {
    getApps(setApps).catch((err) => {
      console.error("error in getting apps after update event");
      throw err;
    });
  }
}

//themeName may or may not work in chrome. yet to test it to see whether it does or not
ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <PanelRoot theme={browser.devtools.panels.themeName} />
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById("app")
);
