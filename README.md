# single-spa Devtools Inspector

A Firefox/Chrome devtools extension to provide utilities for helping with [single-spa](https://single-spa.js.org) applications

## Installation links

- [Firefox]()
- [Chrome]()

Note: you can also build and run this locally. See [how to contribute](#how-to-contribute)

## Features

- List all registered applications (mounted at top)
- Show all application statuses (statii)
- Force mount and unmount an application

## Feature requests

If you would like to request a feature to be added, please open an issue with the title "Enhancement:"

---

## How to contribute

To fix a bug, add features, or just build the extension locally:

1. Install Firefox (Chrome support coming)
1. [Create a FF profile](#create-a-firefox-dev-profile) called `single-spa-inspector-dev`
1. Clone this repo
1. `nvm use` (ensures we're all using the same version of node)
1. `npm i`
1. `npm start`

### Create a Firefox dev profile

Currently, development happens by default in Firefox. If you would like Firefox to remember any settings that you change to Firefox itself, this project is configured to use a profile called "single-spa-inspector-dev". To create this profile, go to `about:profiles` in Firefox and create it. From then on, Firefox will use that profile and remember any changes you make (e.g. devtools location, devtools dark mode, etc.)

---

## Thanks

- Built with [web-ext](https://github.com/mozilla/web-ext) which makes for a better dev experience
- Uses [webextension-polyfill](https://github.com/mozilla/webextension-polyfill) to make cross-platform dev easier
- [React Devtools](https://github.com/facebook/react-devtools) for showing how to do some of these things
- And [CanopyTax](https://www.canopytax.com) for indirectly funding this :)
