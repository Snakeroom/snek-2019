# :snake: Snek Extension
## Installation
_The Chrome Extension is coming 🐍ssssoon🐍..._

In the **snek-extenson** directory run the following:
```bash
npm i && npm run build
```
This will install the necessary packages needed and build the extension (compiled & unpacked extension files are in the "dist" folder).

In Chrome go to _chrome://extensions/_, Tick the "Developer Mode" option, and click "Load Unpacked". Give it the
path to *snek-extension/dist*.

## Updating
Any time a source file is saved, the extension will automatically reload.

To run the most recent update, run
```bash
git pull # This updates the local code

npm i && npm run build
```
