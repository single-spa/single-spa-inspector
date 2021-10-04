import { useCss } from "kremling";
import React, { useEffect, useState } from "react";
import { evalDevtoolsCmd } from "../inspected-window.helper.js";

export default function Profiler() {
  const [hasProfiler, setHasProfiler] = useState(true)
  const [profileEvents, setProfileEvents] = useState([]);

  useEffect(() => {
    evalDevtoolsCmd("exposedMethods.getProfilerData()").then(evts => {
      evts.sort((first, second) => first.end - second.end)
      setProfileEvents(evts)
    }).catch(err => {
      console.error(err)
      setHasProfiler(false)
    })
  }, [])

  const scope = useCss(css)

  if (!hasProfiler) {
    return (
      <div>
        This version of single-spa does not support profiler data. Please upgrade to single-spa@6 and verify you're using the single-spa.dev.js build rather than single-spa.min.js
      </div>
    )
  }

  return (
    <table {...scope} className="profile-table">
      <thead>
        <tr>
          <th>Event Type</th>
          <th>App / Parcel</th>
          <th>Kind</th>
          <th>Succeeded</th>
          <th>Start</th>
          <th>Duration</th>
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
  );
}

const css = `
.profile-table {
  width: 100%;
}

.profile-table th, .profile-table td {
  text-align: center;
}
`