export function setupMountAndUnmount() {
  const forceMount = forceMountUnmount.bind(null, true);
  const forceUnmount = forceMountUnmount.bind(null, false);

  function revertForceMountUnmount(appName) {
    const { reroute } = window.__SINGLE_SPA_DEVTOOLS__.exposedMethods;

    const app = getAppByName(appName);
    if (app.devtools.activeWhenBackup) {
      app.activeWhen = app.devtools.activeWhenBackup;
      delete app.devtools.activeWhenBackup;
      delete app.devtools.activeWhenForced;
    }
    reroute();
  }

  function forceMountUnmount(shouldMount, appName) {
    const {
      getRawAppData,
      toLoadPromise,
      toBootstrapPromise,
      NOT_LOADED,
      reroute,
    } = window.__SINGLE_SPA_DEVTOOLS__.exposedMethods;
    const app = getRawAppData().find((rawapp) => rawapp.name === appName);

    if (!app.devtools.activeWhenBackup) {
      // only set the backup when there isn't one already. otherwise you could potentilaly overwrite it with "always on" or "always off"
      app.devtools.activeWhenBackup = app.activeWhen;
    }

    app.devtools.activeWhenForced = shouldMount ? "on" : "off";
    app.activeWhen = () => shouldMount;

    if (shouldMount && app.status === NOT_LOADED) {
      // we can't mount a NOT_LOADED app, so let's load and bootstrap it first
      toLoadPromise(app)
        .then(() => toBootstrapPromise(app))
        .then(() => reroute())
        .catch((err) => {
          console.error(
            `Something failed in the process of loading and bootstrapping your force mounted app (${app.name}):`,
            err
          );
          throw err;
        });
    } else {
      reroute();
    }
  }

  function getAppByName(appName) {
    const { getRawAppData } = window.__SINGLE_SPA_DEVTOOLS__.exposedMethods;
    return getRawAppData().find((rawApp) => rawApp.name === appName);
  }

  window.__SINGLE_SPA_DEVTOOLS__.forceUnmount = forceUnmount;
  window.__SINGLE_SPA_DEVTOOLS__.forceMount = forceMount;
  window.__SINGLE_SPA_DEVTOOLS__.revertForceMountUnmount = revertForceMountUnmount;
}
