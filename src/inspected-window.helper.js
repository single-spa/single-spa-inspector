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

  if (typeof InstallTrigger !== "undefined") {
    // use this hack until this commit https://github.com/mozilla/webextension-polyfill/commit/6f178c56daed2f548d29e879e3caf082183eed3a is released
    // see https://github.com/mozilla/webextension-polyfill/issues/168 and https://github.com/mozilla/webextension-polyfill/pull/175 and https://stackoverflow.com/a/41820692/2098017
    return result[0];
  } else {
    return result;
  }
}
