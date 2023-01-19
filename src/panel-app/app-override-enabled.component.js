import React from "react";
import Button from "./button";
import useActiveOverrides from "./useActiveOverrides";

export default function AppOverrideEnabled({ appName }) {
  const { activeOverrides, disableOverride, enableOverride } =
    useActiveOverrides();
  const isDisabled = activeOverrides[appName];

  return (
    <>
      {isDisabled && (
        <Button onClick={() => enableOverride(appName)}>Enable</Button>
      )}
      {!isDisabled && (
        <Button onClick={() => disableOverride(appName)}>Disable</Button>
      )}
    </>
  );
}
