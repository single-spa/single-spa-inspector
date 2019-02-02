import React from "react";
import { Scoped, always, maybe } from "kremling";
import AppStatusOverride from "./app-status-override.component";

export default function Apps(props) {
  const sortedApps = sortApps(props.apps);

  return (
    <Scoped css={css}>
      <table className={`theme-${props.theme ? props.theme : "dark"} table`}>
        <thead className="table-header">
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>Status Overrides</th>
          </tr>
        </thead>
        <tbody>
          {sortedApps.map(app => (
            <tr key={app.name}>
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
            </tr>
          ))}
        </tbody>
      </table>
    </Scoped>
  );
}

function sortApps(apps) {
  return [...apps].sort((a, b) => {
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
  });
}

const css = `
& .table {
  width: 100%;
  height: 100%;
}

& .table td, .table th {
  padding: 2px 8px;
}

& .table-header {
  color: #66D9EF;
  text-align: left;
}

& .theme-dark {
  background-color: #272822;
  color: #F8F8F2;
}

& .app-status {
  text-transform: capitalize;
}

& .app-mounted {
  color: #A6E22E;
}

& .app-not-mounted {
  color: #F92672;
}
`;
