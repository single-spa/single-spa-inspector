import React, { useReducer, useEffect } from "react";
import { evalDevtoolsCmd } from "../inspected-window.helper";
import Button from "./button";

export default function AppStatusOverride(props) {
  const [state, dispatch] = useReducer(reducer, inititalState);

  useEffect(() => {
    if (state.running) {
      evalDevtoolsCmd(
        `${typeToCommand[state.runType]}("${props.app.name}")`
      ).catch((err) => {
        console.error(`Error in app-status-override useEffect`);
        throw err;
      });
    }
  }, [state]);

  const activeWhenForced = props.app.devtools.activeWhenForced;
  return (
    <>
      {(activeWhenForced === "off" || props.app.status !== "MOUNTED") && (
        <Button onClick={() => dispatch({ type: "on" })}>Mount</Button>
      )}
      {(activeWhenForced === "on" || props.app.status === "MOUNTED") && (
        <Button onClick={() => dispatch({ type: "off" })}>Unmount</Button>
      )}
      <Button
        onClick={() => dispatch({ type: "reset" })}
        disabled={!activeWhenForced}
      >
        Reset
      </Button>
    </>
  );
}

const typeToCommand = {
  on: "forceMount",
  off: "forceUnmount",
  reset: "revertForceMountUnmount",
};

const inititalState = { running: false, runType: null };
function reducer(state, action) {
  switch (action.type) {
    case "on":
      return {
        running: true,
        runType: "on",
      };
    case "off":
      return {
        running: true,
        runType: "off",
      };

    default:
      return {
        running: true,
        runType: "reset",
      };
  }
}
