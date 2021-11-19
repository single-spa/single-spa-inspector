import { useCss } from "kremling";
import { capitalize, startCase } from "lodash-es";
import React, { useEffect, useState } from "react";
import { evalDevtoolsCmd } from "../inspected-window.helper.js";
import Button from "../panel-app/button.js";
import Fuse from "fuse.js";

export default function Profiler() {
  const [hasProfiler, setHasProfiler] = useState(true);
  const [profileEvents, setProfileEvents] = useState([]);
  const [getEvents, setGetEvents] = useState(true);
  const [sort, setSort] = useState({ column: "start", descending: true });
  const [filters, setFilters] = useState({
    disabledTypes: [],
    search: "",
  });

  useEffect(() => {
    evalDevtoolsCmd("exposedMethods.getProfilerData()")
      .then((evts) => {
        if (filters.search.trim().length > 0) {
          const fuse = new Fuse(evts, {
            keys: ["name"],
            includeMatches: false,
            includeScore: false,
          });

          evts = fuse.search(filters.search).map((i) => i.item);
        }

        evts = evts.filter((evt) => {
          const hideEvent = filters.disabledTypes.some((disabledType) => {
            const [type, name = null, kind = null] = disabledType.split(":");
            if (type !== evt.type) {
              return false;
            } else if (name && name !== evt.name) {
              return false;
            } else if (kind && kind !== evt.kind) {
              return false;
            } else {
              return true;
            }
          });
          return !hideEvent;
        });

        evts.forEach((evt) => {
          evt.duration = evt.end - evt.start;
        });

        evts.sort((first, second) => {
          const larger = sort.descending ? second : first;
          const smaller = sort.descending ? first : second;

          const isString =
            typeof larger[sort.column] === "string" ||
            typeof smaller[sort.column] === "string";

          return isString
            ? larger[sort.column].localeCompare(smaller[sort.column])
            : larger[sort.column] - smaller[sort.column];
        });

        setProfileEvents(evts);
      })
      .catch((err) => {
        console.error(err);
        setHasProfiler(false);
      });
  }, [getEvents, sort, filters]);

  const scope = useCss(css);

  if (!hasProfiler) {
    return (
      <div>
        This version of single-spa does not support profiler data. Please
        upgrade to single-spa@6 and verify you're using the single-spa.dev.js
        build rather than single-spa.min.js
      </div>
    );
  }

  return (
    <div {...scope}>
      <header className="profiler-header">
        <div className="filters">
          <label>
            Search name:
            <input
              type="text"
              className="mainSearch"
              value={filters.search}
              onChange={(evt) =>
                setFilters({ ...filters, search: evt.target.value })
              }
            />
          </label>
          <div>
            <div className="filter-header">Application</div>
            {filterCheckbox("application", null, "load")}
            {filterCheckbox("application", null, "bootstrap")}
            {filterCheckbox("application", null, "mount")}
            {filterCheckbox("application", null, "unmount")}
          </div>
          <div>
            <div className="filter-header">Parcel</div>
            {filterCheckbox("parcel", null, "update")}
            {filterCheckbox("parcel", null, "bootstrap")}
            {filterCheckbox("parcel", null, "mount")}
            {filterCheckbox("parcel", null, "unmount")}
          </div>
          <div>
            <div className="filter-header">Routing</div>
            {filterCheckbox("routing", "loadApps")}
            {filterCheckbox("routing", "unmountAndUnload")}
            {filterCheckbox("routing", "loadAndMount")}
            {filterCheckbox("routing", "navigationCanceled")}
          </div>
        </div>
        <div className="actions">
          <a href={csvUrl()} download="single-spa-profiling.csv">
            Download Report
          </a>
          <Button onClick={() => setGetEvents(!getEvents)}>Refresh</Button>
        </div>
      </header>
      <table className="profile-table">
        <thead>
          <tr>
            {tableHeaderRow("type")}
            {tableHeaderRow("name")}
            {tableHeaderRow("kind")}
            {tableHeaderRow("operationSucceeded", "Succeeded")}
            {tableHeaderRow("start")}
            {tableHeaderRow("duration")}
          </tr>
        </thead>
        <tbody>
          {profileEvents.map((evt) => (
            <tr key={evt.index}>
              <td>{evt.type}</td>
              <td>{evt.name}</td>
              <td>{evt.kind}</td>
              <td>{evt.operationSucceeded ? "Yes" : "No"}</td>
              <td>{evt.start.toLocaleString()}</td>
              <td>{(evt.end - evt.start).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="explanation">
        The single-spa profiler shows how long microfrontends take to load,
        mount, unmount, etc. The timestamps come from{" "}
        <a
          target="_blank"
          href="https://developer.mozilla.org/en-US/docs/Web/API/Performance/now"
        >
          performance.now()
        </a>
        , which measures the number of milliseconds since the page loaded.
      </p>
    </div>
  );

  function csvUrl() {
    const rows = [
      ["Event Type", "Name", "Kind", "Succeeded", "Start", "Duration"],
      ...profileEvents.map((evt) => [
        evt.type,
        evt.name,
        evt.kind,
        evt.operationSucceeded,
        evt.start,
        evt.end - evt.start,
      ]),
    ];
    const csvReport = `data:text/csv;charset=utf-8,${rows
      .map((r) => r.join(","))
      .join("\n")}`;
    return encodeURI(csvReport);
  }

  function toggleSort(column, label) {
    const descending = sort.column === column ? !sort.descending : true;

    setSort({
      column,
      descending,
    });
  }

  function tableHeaderRow(column, label) {
    let caret;
    if (sort.column === column) {
      caret = sort.descending ? "\u2304" : "\u2303";
    }

    if (!label) {
      label = capitalize(column);
    }

    return (
      <th role="button" tabIndex={0} onClick={() => toggleSort(column)}>
        {label} {caret}
      </th>
    );
  }

  function filterCheckbox(type, name, kind) {
    const filterStr = `${type}:${name ?? ""}:${kind ?? ""}`;
    const checked = !filters.disabledTypes.includes(filterStr);

    return (
      <div>
        <label>
          <input type="checkbox" checked={checked} onClick={handleClick} />
          {startCase(name || kind)}
        </label>
      </div>
    );

    function handleClick() {
      if (checked) {
        setFilters({
          ...filters,
          disabledTypes: [...filters.disabledTypes, filterStr],
        });
      } else {
        setFilters({
          ...filters,
          disabledTypes: filters.disabledTypes.filter((t) => t !== filterStr),
        });
      }
    }
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
  margin: 12px 32px;
  font-size: 12px;
}

.profiler-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.filters {
  display: flex;
  font-size: 14px;
}

.filter-header {
  color: var(--gray);
}

.filters > *:not(first-child) {
  margin-left: 24px;
}

.mainSearch {
  width: 100%;
}
`;
