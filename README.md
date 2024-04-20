# AdsPreview for sn.at and salzburg24.at

shows a preview of selected display ads on a mock site.

### Preview:

![URL / Browser preview](https://github.com/dalailahner/AdsPreview/blob/7dc8757ca9775a277b4cdd96118dce28e43bbb1e/preview.gif)

## how to use:

1. serve the root directory and open index.html in a browser
2. look at the available options for the ads in the console.
3. add the preferred options as a hyphen-separated search query string to the end of the URL in the browser.

## Available options:

|           | strings                                                                                      | default                                           |
| --------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| **Page:** | `SN` or `S24`                                                                                | `SN` (not showing in search query string)         |
| **Size:** | `DESKTOP` or `MOBILE`                                                                        | none (just displays it in the available viewport) |
| **Ads:**  | any single or combination of<br>the available ad-shortcodes<br>found in the browser console. | none                                              |
|           |                                                                                              |                                                   |

## Disclaimer:

- I had no access to any kind of server so I had to do everything client-side.
- not every ad is shown in every viewport size, I had to follow the sites existing layout.
