import { useState, useEffect } from "react";
import { evalCmd } from "../inspected-window.helper.js";

export default function useActiveOverrides() {
  const [activeOverrides, setActiveOverrides] = useState({});
  const [appError, setAppError] = useState();

  if (appError) {
    throw appError;
  }

  async function getDisabledOverrides() {
    try {
      const disabledOverrides = await evalCmd(`(function() {
        return window.importMapOverrides.getDisabledOverrides()
      })()`);
      const disabled = disabledOverrides.reduce(
        (accum, current) => ({ ...accum, [current]: true }),
        {}
      );

      setActiveOverrides(disabled);
    } catch (err) {
      err.message = `Error during getDisabledOverrides. ${err.message}`;
      setAppError(err);
    }
  }

  async function disableOverride(currentMap) {
    try {
      await evalCmd(`(function() {
        return window.importMapOverrides.disableOverride("${currentMap}")
      })()`);
      setActiveOverrides((disabled) => ({ ...disabled, [currentMap]: true }));

      await evalCmd(`window.location.reload()`);
    } catch (err) {
      err.message = `Error during disableOverride. ${err.message}`;
      setAppError(err);
    }
  }

  async function enableOverride(currentMap) {
    try {
      await evalCmd(`(function() {
        return window.importMapOverrides.enableOverride("${currentMap}")
      })()`);
      setActiveOverrides((disabled) => ({
        ...disabled,
        [currentMap]: false,
      }));

      await evalCmd(`window.location.reload()`);
    } catch (err) {
      err.message = `Error during enableOverride. ${err.message}`;
      setAppError(err);
    }
  }

  // Get initial list of maps if they exist
  useEffect(() => {
    async function initActiveOverrides() {
      await getDisabledOverrides();
    }

    try {
      initActiveOverrides();
    } catch (err) {
      err.message = `Error during initActiveOverrides. ${err.message}`;
      setAppError(err);
    }
  }, []);

  return {
    activeOverrides,
    enableOverride,
    disableOverride,
  };
}
