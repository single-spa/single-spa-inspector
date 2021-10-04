# single-spa Devtools Inspector

A Firefox/Chrome devtools extension to provide utilities for helping with [single-spa](https://single-spa.js.org) applications.

[Full Documentation](https://single-spa.js.org/docs/devtools)

## Feature requests

If you would like to request a feature to be added, please open an issue with the title "Enhancement:"

---

## How to contribute

To fix a bug, add features, or just build the extension locally:

### Firefox

1. Install Firefox
1. [Create a FF profile](#create-a-firefox-dev-profile) called `single-spa-inspector-dev`. Alternatively, temporarily install the extension as documented in https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#installing.
1. Clone this repo
1. `nvm use` (ensures we're all using the same version of node)
1. `npm i`
1. `npm start`
1. Open devtools and navigate to the **single-spa Inspector** tab

#### Create a Firefox dev profile

Currently, development happens by default in Firefox. If you would like Firefox to remember any settings that you change to Firefox itself, this project is configured to use a profile called "single-spa-inspector-dev". To create this profile, go to [about:profiles](about:profiles). Firefox will use that profile and remember any changes you make (e.g. devtools location, devtools dark mode, etc.)

#### Debugging

Once single-spa Inspector is running, open a new tab and navigate to [about:debugging](about:debugging). single-spa Inspector should be listed as a Temporary Extension, and a "Debug" control should be displayed. Click on this to enable devtools for the extension. In the upper-right corner, click on the divided square icon next to the 3-dot menu, and select `/build/panel.html` as the target. You can now inspect the inspector UI as you would a normal webpage.

### Chrome

1. Install Chrome
1. Create a Chrome profile

   - This process is somewhat convoluted but needed in order to save preferences and any additional extensions
   - Before starting any processes, open the Chrome Profiles directory
     - Mac: `~/Library/Application Support/Google/Chrome`
     - Windows: `%LOCALAPPDATA%\Google\Chrome\User Data`
     - See the [Chromium User Data Directory docs](https://chromium.googlesource.com/chromium/src/+/master/docs/user_data_dir.md) for other platforms/chrome builds
   - In that folder, take note of the Profile folders (eg. named "Profile 1", "Profile 2", etc. on Mac)
   - Open Chrome and [add a new profile](https://support.google.com/chrome/answer/2364824)
   - Return to the Chrome user data folder and locate the newly created Profile folder
   - Rename the folder to "single-spa-inspector-dev" (for convenience)
   - Copy the file path for this profile folder

1. Start Chrome with `$CHROME_PROFILE_PATH` env set to the profile folder path

   ```sh
   # for Mac
   CHROME_PROFILE_PATH="~/Library/Application Support/Google/Chrome/single-spa-inspector-dev" npm run start:chrome
   ```

#### Debugging

- Open single-spa inspector in devtools
- Right-click on any element inside of the inspector, and click "Inspect"
- A new instance of devtools will appear to inspect the devtools DOM

---

### Publishing a New Version

1. Update the version in `manifest.json` and `package.json` (they should match)
1. Ensure that the necessary Firefox env values are in your local .env

   ```
   WEXT_SHIPIT_FIREFOX_JWT_ISSUER=xxxxx
   WEXT_SHIPIT_FIREFOX_JWT_SECRET=xxxxx
   ```

1. Ensure that the necessary Chrome env values are in your local .env

   ```sh
   WEXT_SHIPIT_CHROME_EXTENSION_ID=xxxxx
   WEXT_SHIPIT_CHROME_CLIENT_ID=xxxxx
   WEXT_SHIPIT_CHROME_CLIENT_SECRET=xxxxx
   WEXT_SHIPIT_CHROME_REFRESH_TOKEN=xxxxx
   ```

1. Run `npm run deploy`

- Alternatively, to deploy individual browsers you can run `npm run deploy:firefox` or `npm run deploy:chrome`

You may also want to verify the status at the respective extensions page

- [Firefox Add-on Developer Hub](https://addons.mozilla.org/en-US/developers/)
- [Chrome Store Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard)

---

## Thanks

- Built with [web-ext](https://github.com/mozilla/web-ext) which makes for a better dev experience
- Uses [webextension-polyfill](https://github.com/mozilla/webextension-polyfill) to make cross-platform dev easier
- [React Devtools](https://github.com/facebook/react-devtools) for showing how to do some of these things
- And [CanopyTax](https://www.canopytax.com) for indirectly funding this :)
