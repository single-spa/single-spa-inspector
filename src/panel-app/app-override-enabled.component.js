import React from "react";
import Button from "./button";

export default function AppOverrideEnabled({
  appName,
  disabled,
  enable,
  disable,
}) {
  return (
    <>
      {disabled && <Button onClick={() => enable(appName)}>Enable</Button>}
      {!disabled && <Button onClick={() => disable(appName)}>Disable</Button>}
    </>
  );
}
