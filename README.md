# AdsPreview für sn.at und salzburg24.at

Browseransicht der ausgewählten Display-Werbemittel auf einer Mock-Seite.

### Preview:

![URL / Browser preview](https://github.com/dalailahner/AdsPreview/blob/b564ef518e490330567854c1fba2ac3638297fdf/preview.gif)

## Tutorial:

1. Stammverzeichnis im Netzwerk bereitstellen und index.html im Browser öffnen.
2. entnehmen Sie der Browserkonsole die verfügbaren Optionen für die Werbeanzeigen.
3. fügen Sie die ausgewählten Optionen als Bindestrich-getrennten search query der URL im Browser hinzu.

## Verfügbare Optionen:

|            | strings                                                                              | default                                                  |
| ---------- | ------------------------------------------------------------------------------------ | -------------------------------------------------------- |
| **Seite:** | `SN` oder `S24`                                                                      | `SN` (wird nicht im search query angezeigt)              |
| **Größe:** | `DESKTOP` oder `MOBIL`                                                               | keine (wird einfach im verfügbaren Viewport dargestellt) |
| **Ads:**   | einen oder eine Kombination aus den in der Browserkonsole verfügbaren Ad-Shortcodes. | keine                                                    |

## Disclaimer:

- Ich hatte keinen Zugang zu einem Server und musste daher alles client-side lösen.
- nicht jede Anzeige wird in jedem Viewport dargestellt. Musste mich an das bestehende Layout der Website halten.
