import { useState, useEffect } from "react";
import { evalCmd } from "../inspected-window.helper.js";

export default function useImportMapOverrides() {
  const [importMapsEnabled, setImportMapEnabled] = useState(false);
  const [overrides, setOverrides] = useState({});
  const [disabledOverrides, setDisabledOverrides] = useState({});
  const [appError, setAppError] = useState();

  if (appError) {
    throw appError;
  }

  async function checkImportMapOverrides() {
    try {
      const hasImportMapsEnabled = await evalCmd(`(function() {
        return !!window.importMapOverrides
      })()`);
      return hasImportMapsEnabled;
    } catch (err) {
      err.message = `Error during hasImporMapsEnabled. ${err.message}`;
      setAppError(err);
    }
  }

  async function getImportMapOverrides() {
    try {
      const { imports } = await evalCmd(`(function() {
        return window.importMapOverrides.getOverrideMap()
      })()`);
      setOverrides(imports);
    } catch (err) {
      err.message = `Error during getImportMapOverrides. ${err.message}`;
      setAppError(err);
    }
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

      setDisabledOverrides(disabled);
    } catch (err) {
      err.message = `Error during getDisabledOverrides. ${err.message}`;
      setAppError(err);
    }
  }

  async function addOverride(currentMap, currentUrl) {
    try {
      await evalCmd(`(function() {
        return window.importMapOverrides.addOverride("${currentMap}", "${currentUrl}")
      })()`);
    } catch (err) {
      err.message = `Error during addOverride. ${err.message}`;
      setAppError(err);
    }
  }

  async function removeOverride(currentMap) {
    try {
      await evalCmd(`(function() {
        return window.importMapOverrides.removeOverride("${currentMap}")
      })()`);
    } catch (err) {
      err.message = `Error during removeOverride. ${err.message}`;
      setAppError(err);
    }
  }

  async function batchSetOverrides() {
    try {
      const overrideCalls = Object.entries(overrides).map(([map, url]) =>
        !url ? removeOverride(map) : addOverride(map, url)
      );
      await Promise.all(overrideCalls);
      await evalCmd(`window.location.reload()`);
    } catch (err) {
      err.message = `Error during batchSetOverrides. ${err.message}`;
      setAppError(err);
    }
  }

  async function disableOverride(currentMap) {
    try {
      await evalCmd(`(function() {
        return window.importMapOverrides.disableOverride("${currentMap}")
      })()`);
      setDisabledOverrides((disabled) => ({ ...disabled, [currentMap]: true }));

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
      setDisabledOverrides((disabled) => ({
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
    async function initImportMapsOverrides() {
      const hasImportMapsEnabled = await checkImportMapOverrides();
      if (hasImportMapsEnabled) {
        setImportMapEnabled(hasImportMapsEnabled);
        await getImportMapOverrides();
        await getDisabledOverrides();
      }
    }

    try {
      initImportMapsOverrides();
    } catch (err) {
      err.message = `Error during initImportMapsOverrides. ${err.message}`;
      setAppError(err);
    }
  }, []);

  const setOverride = (mapping, url) => {
    const newOverrides = {
      ...overrides,
      [mapping]: url,
    };
    setOverrides(newOverrides);
  };

  return {
    enabled: importMapsEnabled,
    overrides,
    disabledOverrides,
    enableOverride,
    disableOverride,
    setOverride,
    commitOverrides: batchSetOverrides,
  };
}
