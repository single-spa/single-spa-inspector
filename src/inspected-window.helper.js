import browser from "webextension-polyfill";

export async function evalDevtoolsCmd(evalString) {
  const commandString = `window.__SINGLE_SPA_DEVTOOLS__.${evalString}`;
  return evalCmd(commandString);
}

export async function evalCmd(evalString) {
  // we don't try/catch here because we want the implementer to handle it... I think?
  const result = await browser.devtools.inspectedWindow.eval(evalString);
  if (result[1] && (result[1].isError || result[1].isException)) {
    throw new Error(
      `evalCmd '${evalString}' failed: ${JSON.stringify(result[1])}`
    );
  }
  return result[0];
}
