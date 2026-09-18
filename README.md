# Google Sheets True Dark

Google Sheets does not have a true dark theme on PC. This small browser add-on gives you one. Menus, toolbars, and the grid all go dark.

Most importantly, images in your sheets stay normal—they don’t turn into negative-looking images like they do with some other userscripts and dark theme extensions.

![Dark Google Sheet with a shopping list. Product photos stay true to life.](Example1.png)

![Dark Insert menu and Function submenu in Google Sheets.](Example2.png)

## How to install

You need a **userscript manager**. That is a free browser extension that can run this file on Google Sheets.

1. Install [Violentmonkey](https://violentmonkey.github.io/) for Chrome, Edge, or Firefox.
2. Open the script file: [google-sheets-true-dark.user.js](google-sheets-true-dark.user.js).
3. Click **Raw** (GitHub shows the file as plain text).
4. Violentmonkey should offer to **install** it. Confirm that.
5. Open any Google Sheet and refresh the page (`Ctrl` + `Shift` + `R` on Windows, `Cmd` + `Shift` + `R` on Mac).

If the browser asks whether Violentmonkey may run on `ogs.google.com`, choose **Allow**. That is Google’s account menu in the top-right corner.

After that, every Google Sheet you open in that browser should load in dark mode