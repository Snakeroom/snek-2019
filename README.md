# :snake: Snek Extension

## Installation

In the **snek-extenson** directory run the following:

```bash
npm i && npm start
```

This will install the necessary packages needed and build the extension (compiled & unpacked extension files are in the "dist" folder).

In Chrome go to _chrome://extensions/_, Tick the "Developer Mode" option, and click "Load Unpacked". Give it the
path to _snek-extension/dist_.

## Updating

Any time a source file is saved, the extension will automatically reload.

To run the most recent update, run

```bash
git pull # This updates the local code

npm i && npm start
```
