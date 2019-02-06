import browser from "webextension-polyfill";

export async function evalDevtoolsCmd(evalString) {
  // we don't try/catch here because we want the implementer to handle it... I think?
  const result = await browser.devtools.inspectedWindow.eval(
    `window.__SINGLE_SPA_DEVTOOLS__.${evalString}`
  );
  if (result[1] && (result[1].isError || result[1].isException)) {
    throw new Error(
      `evalDevtoolsCmd '${evalString}' failed: ${JSON.stringify(result[1])}`
    );
  }
  return result[0];
}
