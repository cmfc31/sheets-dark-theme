# Google Sheets True Dark

Google Sheets does not have a real dark theme. This small browser add-on gives you one.

Menus, toolbars, and the grid go dark. **Photos in your sheet stay normal** — they do not turn into negatives.

It works on any Google Sheet you open in the browser (`docs.google.com/spreadsheets`), including files you own and files shared with you.

## What it looks like

A shopping list with product photos. The sheet is dark, but the pictures still look like the real products:

![Dark Google Sheet with a shopping list. Product photos in the Image column stay true to life.](Example1.png)

Menus and submenus are dark too, so they are easy to read at night:

![Dark Insert menu and Function submenu in Google Sheets.](Example2.png)

## How to install

You need a **userscript manager**. That is a free browser extension that can run this file on Google Sheets.

1. Install [Violentmonkey](https://violentmonkey.github.io/) for Chrome, Edge, or Firefox.
2. Open the script file: [google-sheets-true-dark.user.js](google-sheets-true-dark.user.js).
3. Click **Raw** (GitHub shows the file as plain text).
4. Violentmonkey should offer to **install** it. Confirm that.
5. Open any Google Sheet and refresh the page (`Ctrl` + `Shift` + `R` on Windows, `Cmd` + `Shift` + `R` on Mac).

If the browser asks whether Violentmonkey may run on `ogs.google.com`, choose **Allow**. That is Google’s account menu in the top-right corner.

After that, every Google Sheet you open in that browser should load in dark mode.

## Notes

- This only changes how Sheets **looks on your computer**. It does not change the file for other people.
- It does not apply to Google Docs, Slides, or Drive.
- There is no on/off switch. While the script is enabled in Violentmonkey, Sheets stays dark.
- If something looks off after an update, replace the script in Violentmonkey with the latest file and hard-refresh the sheet.
