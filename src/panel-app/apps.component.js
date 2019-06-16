import React, { useState, useEffect, useMemo } from "react";
import { Scoped, always, maybe } from "kremling";
import AppStatusOverride from "./app-status-override.component";
import { evalDevtoolsCmd, evalCmd } from "../inspected-window.helper.js";
import useImportMapOverrides from "./useImportMapOverrides";

export default function Apps(props) {
  const sortedApps = useMemo(() => sortApps(props.apps), [props.apps]);
  const importMaps = useImportMapOverrides();

  const [hovered, setHovered] = useState();

  useEffect(() => {
    if (hovered) {
      overlayApp(hovered);
      return () => deOverlayApp(hovered);
    }
  }, [hovered]);

  useEffect(() => {
    document.body.classList.add(props.theme);
    return () => {
      document.body.classList.remove(props.theme);
    };
  }, [props.theme]);

  return (
    <Scoped css={css}>
      <table className={"table"}>
        <thead className="table-header">
          <tr>
            <th>App Name</th>
            <th>Status</th>
            <th>Status Overrides</th>
            {importMaps.enabled && <th>Import Override</th>}
          </tr>
        </thead>
        <tbody>
          {sortedApps.map(app => (
            <tr
              key={app.name}
              onMouseEnter={() => setHovered(app)}
              onMouseLeave={() => setHovered()}
            >
              <td>{app.name}</td>
              <td
                className={always("app-status")
                  .maybe("app-mounted", app.status === "MOUNTED")
                  .maybe("app-not-mounted", app.status !== "MOUNTED")}
              >
                {app.status.replace("_", " ").toLowerCase()}
              </td>
              <td>
                <AppStatusOverride app={app} />
              </td>
              {importMaps.enabled && (
                <td>
                  <input
                    value={importMaps.overrides[app.name] || ""}
                    onChange={e => {
                      importMaps.setOverride(app.name, e.target.value);
                    }}
                  />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {importMaps.enabled && (
        <button onClick={importMaps.commitOverrides}>
          Apply Overrides & Refresh
        </button>
      )}
    </Scoped>
  );
}

function sortApps(apps) {
  return [...apps]
    .sort((a, b) => {
      const nameA = a.name.toUpperCase(); // ignore upper and lowercase
      const nameB = b.name.toUpperCase(); // ignore upper and lowercase
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      // names must be equal
      return 0;
    })
    .sort((a, b) => {
      const statusA =
        a.status === "MOUNTED" || !!a.devtools.activeWhenForced ? 1 : 0;
      const statusB =
        b.status === "MOUNTED" || !!b.devtools.activeWhenForced ? 1 : 0;
      if (statusA > statusB) {
        return -1;
      } else if (statusA < statusB) {
        return 1;
      } else {
        return 0;
      }
    });
}

function overlayApp(app) {
  if (
    app.status !== "SKIP_BECAUSE_BROKEN" &&
    app.status !== "NOT_LOADED" &&
    app.devtools &&
    app.devtools.overlays
  ) {
    evalDevtoolsCmd(`overlay('${app.name}')`).catch(err => {
      console.error(`Error overlaying applicaton: ${app.name}`, err);
    });
  }
}

function deOverlayApp(app) {
  if (app.devtools && app.devtools.overlays) {
    evalDevtoolsCmd(`removeOverlay('${app.name}')`).catch(err => {
      console.error(`Error removing overlay on applicaton: ${app.name}`, err);
    });
  }
}

const css = `
:root {
  --color-blue-light: #6e92ff;
  --color-blue: #36f;
  --color-blue-dark: #2850c8;
  --color-blue-darkest: #172e74;

  --gray: #82889a;
  --blue-light: #96b0ff;
  --blue: #3366ff;
  --blue-dark: #2850c8;
  --pink: #e62e5c;
  --green: #28cb51;
  --table-spacing: .5rem;
}
body {
  font-family: sans-serif;
}

body.dark {
  background-color: #272822;
  color: #F8F8F2;
}

& .table {
  width: 100%;
}

& .table td, .table th {
  padding: 2px 8px;
}

& .table-header {
  color: #66D9EF;
  text-align: left;
}

& .app-status {
  border-radius: 1rem;
  color: #fff;
  font-size: .75rem;
  padding: .25rem .5rem .125rem;
  text-shadow: 0px 2px 4px rgba(0,0,0,.15);
  text-transform: capitalize;
}

& .app-mounted {
  background-color: var(--green);
}

& .app-not-mounted {
  background-color: var(--pink);
  color: #F92672;
}
`;
