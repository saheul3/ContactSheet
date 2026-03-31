# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development

This is a Jekyll-based static site with client-side-only JavaScript (no build step for JS/CSS).

**Local development:**
```bash
bundle exec jekyll serve
```

**Build:**
```bash
bundle exec jekyll build
```

There are no tests or linting configured.

## Architecture

The app generates realistic 35mm film contact sheets in the browser using p5.js. All processing is client-side — no server uploads.

### Script loading order (matters — no module bundler)

```
fonts.js → filmstock_properties.js → dxcode.js → contact_sheet.js → image_loader.js → ui.js
```

### Core modules

**`js/filmstock_properties.js`** — Film stock data and physical dimensions.
- `FILM` dictionary: 20+ film stocks (Fujifilm, Ilford, Kodak, Kentmere), each with `top_elements[]`, `bottom_elements[]`, `dx_code`, sprocket colors, and rendering properties.
- `ElementType` enum: frame count, label, arrow, DX, image.
- `RepeatType` enum: none, per-frame, per-distance.
- Defines pixel-to-mm conversion constants and sprocket hole dimensions.
- `populateFilmStocks()` builds the film selection UI dynamically from this data.

**`js/contact_sheet.js`** — Main p5.js rendering engine.
- `renderFilmstrip(images)` → single row filmstrip with sprocket holes, labels, DX codes, frame numbers.
- `renderContactSheet(filmstrip, cols)` → arranges multiple filmstrip rows into a grid.
- `previewDraw()` → drives filmstrip preview UI.
- Reads from the currently selected film stock in `FILM`.

**`js/dxcode.js`** — DX barcode encoder per ISO 4909:1995.
- `drawDX(p5, dx_code, ...)` → renders a barcode as p5.Graphics.
- Encodes clock track + data track (DX1, DX2, frame number, parity).

**`js/image_loader.js`** — Folder upload and image pre-processing.
- `uploadImages(event)` → handles folder selection, validates 1–40 images.
- `scaleImage(img, maxHeight)` → scales and auto-rotates portrait images.

**`js/ui.js`** — Window/dialog management using interact.js (draggable).
- Controls step-by-step flow: welcome → upload → processing → preview → filmstrip → contact sheet.
- All dialog windows use 98.css (retro Windows 98 styling).

### User flow

Welcome → Upload folder → Images loaded/scaled (progress bar) → Image preview → Select film stock → Filmstrip preview → Contact sheet output (saveable image)

### External dependencies (CDN, no npm)

- **p5.js v1.9.0** — canvas rendering for all filmstrip graphics
- **interact.js** — draggable dialog windows
- **98.css** — Windows 98 UI theme
- **jQuery 3.5.1** (slim)

### Adding a new film stock

Add an entry to the `FILM` dictionary in `js/filmstock_properties.js`. Each stock needs: `top_elements`, `bottom_elements`, `dx_code`, `sprocket_hole_color`, and a film roll icon in `img/filmrolls/`. `populateFilmStocks()` picks it up automatically.
