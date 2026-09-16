# TraceGraph2X

A colorful, interactive shape playground. Start from a point on a coordinate grid and create nested hearts, circles, stars, flowers, hexagons, or diamonds.

## Run

Open **index.html** in a modern browser. No installation, dependencies, or build step is required. Optional Google Fonts enhance the interface; system fonts work offline.

For a local server with Node.js 18 or newer:

```sh
node server.js
```

Visit http://127.0.0.1:4173. Run geometry tests with `node --test tests/*.test.js` (or `npm test`).

## Explore

- Select one of six shapes and one of four gradient palettes, or pick a custom solid color.
- Adjust layer count, starting radius, spacing, stroke thickness, and rotation.
- Enter X/Y coordinates or click the grid to position the origin. Positive Y points up.
- Animate growth, pause/resume, restart, change speed, or disable looping. Animation starts only when requested; reduced-motion preferences disable looping by default.
- Zoom in/out or use **Fit** to frame the whole pattern. Large patterns can extend beyond the initial view.
- Hide the grid or reset the playground at any time.
- Export the currently visible frame as a standalone SVG, including the chosen grid/background. The origin marker and interface are omitted.

Sizes and spacing use coordinate units. Each layer's radius is `starting size + layer index × spacing`. Stroke widths stay visually consistent as the view zooms. Shapes share the selected origin; the heart's origin is its bounding-box center.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Accessible controls and SVG canvas |
| `style.css` | Responsive dark interface |
| `geometry.js` | Pure shape paths and color interpolation |
| `app.js` | Rendering, animation, interaction, and export |
| `server.js` | Optional local preview server |
| `tests/geometry.test.js` | Geometry and palette checks |

## Hosting

This is a static site and can be served from any static host. For GitHub Pages, select **Settings → Pages → Deploy from a branch → main → / (root)**. No secrets or backend are required.
