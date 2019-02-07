import browser from "webextension-polyfill";

export async function evalDevtoolsCmd(devToolsCommandString) {
  const commandString = `window.__SINGLE_SPA_DEVTOOLS__.${devToolsCommandString}`;
  return evalCmd(commandString);
}

export async function evalCmd(commandString) {
  // we don't try/catch here because we want the implementer to handle it... I think?
  const result = await browser.devtools.inspectedWindow.eval(commandString);
  if (result[1] && (result[1].isError || result[1].isException)) {
    throw new Error(
      `evalCmd '${commandString}' failed: ${JSON.stringify(result[1])}`
    );
  }
  return result[0];
}
