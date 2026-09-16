# TraceGraph2X

TraceGraph2X turns parametric mathematics into a continuously drawn line on a black Cartesian plane.

## Run locally

Open `index.html` directly, or run the dependency-free local server:

```sh
npm start
```

Then open http://127.0.0.1:4173. Run the mathematical checks with `npm test`.

## Mathematical curves

The interface includes six parameterized presets:

- Heart curve
- Lissajous curve
- Polar rose
- Archimedean spiral
- Butterfly curve
- Hypotrochoid

For every preset, the interface shows `x(t)`, `y(t)`, and the active domain of `t`. The moving pen reports the current parameter and Cartesian position as the curve is traced.

## Controls

- Change amplitude, the curve-specific parameter, sample resolution, and line width.
- Set the origin numerically or click the graph.
- Start, pause, resume, restart, speed up, or loop the trace.
- Toggle the coordinate grid and the faint full-path guide.
- Export the graph as a standalone SVG.

The app is plain HTML, CSS, SVG, and JavaScript. It has no runtime dependencies or build step.
