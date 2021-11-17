import { useCss } from "kremling";
import React, { useEffect, useState } from "react";
import { evalDevtoolsCmd } from "../inspected-window.helper.js";
import Button from "../panel-app/button.js";

export default function Profiler() {
  const [hasProfiler, setHasProfiler] = useState(true)
  const [profileEvents, setProfileEvents] = useState([]);
  const [getEvents, setGetEvents] = useState(true)

  useEffect(() => {
    evalDevtoolsCmd("exposedMethods.getProfilerData()").then(evts => {
      evts.sort((first, second) => second.end - first.end)
      setProfileEvents(evts.sort((first, second) => second.start - first.start))
    }).catch(err => {
      console.error(err)
      setHasProfiler(false)
    })
  }, [getEvents])

  const scope = useCss(css)

  if (!hasProfiler) {
    return (
      <div>
        This version of single-spa does not support profiler data. Please upgrade to single-spa@6 and verify you're using the single-spa.dev.js build rather than single-spa.min.js
      </div>
    )
  }

  return (
    <div {...scope}>
      <header className="profiler-header">
        <p className="explanation">
          The single-spa profiler shows how long microfrontends take to load, mount, unmount, etc. The timestamps come
          from <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/Performance/now">performance.now()</a>, which measures
          the number of milliseconds since the page loaded. The profiler events are ordered from most recent to least recent.
        </p>
        <div className="actions">
          <a href={csvUrl()} download="single-spa-profiling.csv">Download</a>
          <Button onClick={() => setGetEvents(!getEvents)}>Refresh</Button>
        </div>
      </header>
      <table className="profile-table">
        <thead>
          <tr>
            <th>Event Type</th>
            <th>Name</th>
            <th>Kind</th>
            <th>Succeeded</th>
            <th>Start (ms)</th>
            <th>Duration (ms)</th>
          </tr>
        </thead>
        <tbody>
          {profileEvents.map(evt => (
            <tr key={evt.index}>
              <td>{evt.type}</td>
              <td>{evt.name}</td>
              <td>{evt.kind}</td>
              <td>{evt.operationSucceeded ? 'Yes' : 'No'}</td>
              <td>{evt.start.toLocaleString()}</td>
              <td>{(evt.end - evt.start).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  function csvUrl() {
    const rows = [["Event Type", "Name", "Kind", "Succeeded", "Start", "Duration"], ...profileEvents.map(evt => ([evt.type, evt.name, evt.kind, evt.operationSucceeded, evt.start, evt.end - evt.start]))]
    const csvReport = `data:text/csv;charset=utf-8,${rows.map(r => r.join(",")).join("\n")}`
    return encodeURI(csvReport)
  }
}

const css = `
.profile-table {
  width: 100%;
  border-spacing: 0;
}

.profile-table th {
  background-color: black;
  color: white;
  padding: 5px 0;
}

.profile-table td {
  border: 1px solid black;
  padding: 2px 0;
}

.profile-table th, .profile-table td {
  text-align: center;
}

.actions {
  margin: 0 32px 16px 32px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.actions *:not(last-child) {
  margin-right: 12px;
}

.explanation {
  margin: 0 32px 12px 32px;
  font-size: 12px;
}

.profiler-header {
  display: flex;
}
`