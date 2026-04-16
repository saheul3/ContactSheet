// pimage
let images = [];
let BURNED_LEADER_IMG = null;

function randrange(min, max) {
    return Math.random() * (max - min) + min;
}

function refreshImages() {
    // load images from preview
    images = [];
    let preview = document.getElementById('imagePreview');
    let previewImages = preview.getElementsByTagName('img');
    for (let i = 0; i < previewImages.length; i++) {
        let img = previewImages[i];
        images.push(loadImage(img.src));
    }
}

function frameCountToString(fc, alt) {
    if (fc == -2) {
        if (alt) {
            return "XA";
        } else {
            return "X";
        }
    } else if (fc == -1) {
        if (alt) {
            return "00A";
        } else {
            return "00";
        }
    } else {
        // return fc.toString().padStart(2, "0");
        if (alt) {
            return fc.toString() + "A";
        } else {
            return fc.toString();
        }
    }
}

function renderSprocketHoles(fs, film_properties) {
    let dx = SPROCKET_HOLE_WIDTH_PX + SPROCKET_HOLE_SPACING_WIDTH_PX;
    // let start_x = Math.random() * 0.5 * dx; // Generate random value between 0 and 0.5 times dx
    let start_x = 0;
    // FIXME:
    fs.noFill();
    fs.stroke(film_properties.sprocket_hole_color);
    fs.strokeWeight(0.5);
    fs.blendMode(ADD);
    for (let x = start_x; x < fs.width; x += dx) {
        fs.rect(x, SPROCKET_HOLE_MARGIN_PX, SPROCKET_HOLE_WIDTH_PX, SPROCKET_HOLE_HEIGHT_PX, SPROCKET_HOLE_ROUNDING_PX);
        fs.rect(x, fs.height - SPROCKET_HOLE_MARGIN_PX - SPROCKET_HOLE_HEIGHT_PX, SPROCKET_HOLE_WIDTH_PX, SPROCKET_HOLE_HEIGHT_PX, SPROCKET_HOLE_ROUNDING_PX);
    }

    fs.blendMode(BLEND);
    fs.fill(0);
    fs.noStroke();
    for (let x = start_x; x < fs.width; x += dx) {
        fs.rect(x, SPROCKET_HOLE_MARGIN_PX, SPROCKET_HOLE_WIDTH_PX, SPROCKET_HOLE_HEIGHT_PX, SPROCKET_HOLE_ROUNDING_PX);
        fs.rect(x, fs.height - SPROCKET_HOLE_MARGIN_PX - SPROCKET_HOLE_HEIGHT_PX, SPROCKET_HOLE_WIDTH_PX, SPROCKET_HOLE_HEIGHT_PX, SPROCKET_HOLE_ROUNDING_PX);
    }
}

// ── Aspect-preserving image placement ───────────────────────────────────────
// Draws `img` into the (w × h) slot at (x, y) using "cover" fit: the image is
// scaled uniformly so it fully covers the slot, then cropped evenly from the
// overflow side.  Optional `rotation` (0/90/180/270 degrees CW) is applied
// before fitting so that the drawn result appears rotated inside the slot.
function drawImageCoverFit(fs, img, x, y, w, h, rotation) {
    if (!img || !img.width || !img.height || w <= 0 || h <= 0) return;
    rotation = rotation || 0;

    // When rotated 90°/270° the source image's axes are swapped relative to
    // the slot, so the cover-fit crop must be computed against the transposed
    // slot dimensions.
    let fit_w = w, fit_h = h;
    if (rotation === 90 || rotation === 270) { fit_w = h; fit_h = w; }

    const slot_aspect = fit_w / fit_h;
    const img_aspect  = img.width / img.height;
    let sx, sy, sw, sh;
    if (img_aspect > slot_aspect) {
        sh = img.height;
        sw = sh * slot_aspect;
        sx = (img.width - sw) / 2;
        sy = 0;
    } else {
        sw = img.width;
        sh = sw / slot_aspect;
        sx = 0;
        sy = (img.height - sh) / 2;
    }

    if (rotation === 0) {
        fs.image(img, x, y, w, h, sx, sy, sw, sh);
    } else {
        fs.push();
        fs.translate(x + w / 2, y + h / 2);
        fs.rotate(rotation * Math.PI / 180);
        fs.image(img, -fit_w / 2, -fit_h / 2, fit_w, fit_h, sx, sy, sw, sh);
        fs.pop();
    }
}

function renderImages(fs, images, offset_x = 0) {
    let x = HPADDING_PX + offset_x;
    let y = VPADDING_PX;
    for (let i = 0; i < images.length; i++) {
        let img = images[i];
        drawImageCoverFit(fs, img, x, y, SHOT_WIDTH_PX, SHOT_HEIGHT_PX);
        x += SHOT_WIDTH_PX + HPADDING_PX;
    }
}

function renderBurnedLeader(fs, leader_w) {
    if (!BURNED_LEADER_IMG) return;
    fs.image(BURNED_LEADER_IMG, 0, 0, leader_w, fs.height);
}

function renderTopFrameCount(fs, element, start_frame = 0) {
    // draw frame count
    fs.fill(element.color);
    fs.noStroke();
    fs.textSize(element.height_mm * SCALE);
    fs.textAlign(CENTER, TOP);
    fs.textFont(FONTS_CACHE[element.font]);
    fs.push();
    fs.translate(element.offset * CYCLE_W, element.margin_mm * SCALE);

    for (let x = 0, count = start_frame; x < fs.width; x += CYCLE_W, count++) {
        fs.text(frameCountToString(count), x, 0);
    }
    fs.pop();
}

function renderBottomFrameCount(fs, element, start_frame = 0, alt = false) {
    // draw frame count
    fs.fill(element.color);
    fs.noStroke();
    fs.textSize(element.height_mm * SCALE);
    fs.textAlign(CENTER, BOTTOM);
    fs.textFont(FONTS_CACHE[element.font]);
    fs.push();
    fs.translate(element.offset * CYCLE_W, fs.height - element.margin_mm * SCALE);

    for (let x = 0, count = start_frame; x < fs.width; x += CYCLE_W, count++) {
        fs.text(frameCountToString(count, alt), x, 0);
    }
    fs.pop();
}

function renderTopLabel(fs, element) {

    // setup draw
    fs.fill(element.color);
    fs.noStroke();
    fs.textSize(element.height_mm * SCALE);
    fs.textAlign(LEFT, TOP);
    fs.textFont(FONTS_CACHE[element.font]);
    fs.push();
    fs.translate(element.offset * CYCLE_W, element.margin_mm * SCALE);

    // find x interval
    let interval_px = CYCLE_W;
    if (element.repeat === RepeatType.DISTANCE) {
        if ('interval_mm' in element) {
            interval_px = element.interval_mm * SCALE;
        } else {
            console.error('Interval not specified for distance repeat type');
        }
    }

    if (element.repeat === RepeatType.FRAME && 'every' in element) {
        interval_px = element.every * CYCLE_W;
    }

    // draw text
    if (element.font_style) {
        switch (element.font_style) {
            case 'bold':
                fs.textStyle(BOLD);
                break;
            case 'italic':
                fs.textStyle(ITALIC);
                break;
            case 'bold-italic':
                fs.textStyle(BOLDITALIC);
                break;
            default:
                fs.textStyle(NORMAL);
                break;
        }
    }
    if (element.repeat === RepeatType.NONE) {
        fs.text(element.text, 0, 0);
    } else {
        for (let x = 0; x < fs.width; x += interval_px) {
            fs.text(element.text, x, 0);
        }
    }

    // end draw
    fs.pop();
}

function renderTopImage(fs, element) {
    let img = FILMSTOCK_ASSETS[element.src];

    fs.push();
    fs.translate(element.offset * CYCLE_W, element.margin_mm * SCALE);
    if ('tint' in element) {
        fs.tint(element.tint);
    }
    fs.image(img, 0, 0, element.width_mm * SCALE, element.height_mm * SCALE);
    fs.pop();
}

function renderBottomLabel(fs, element) {
    fs.fill(element.color);
    fs.noStroke();
    fs.textSize(element.height_mm * SCALE);
    fs.textAlign(LEFT, BOTTOM);
    fs.textFont(FONTS_CACHE[element.font]);
    fs.push();
    fs.translate(element.offset * CYCLE_W, fs.height - element.margin_mm * SCALE);

    let interval_px = CYCLE_W;
    if (element.repeat === RepeatType.DISTANCE && 'interval_mm' in element) {
        interval_px = element.interval_mm * SCALE;
    }
    if (element.repeat === RepeatType.FRAME && 'every' in element) {
        interval_px = element.every * CYCLE_W;
    }

    if (element.font_style) {
        fs.textStyle(element.font_style === 'bold' ? BOLD : element.font_style === 'italic' ? ITALIC : NORMAL);
    }

    if (element.repeat === RepeatType.NONE) {
        fs.text(element.text, 0, 0);
    } else {
        for (let x = 0; x < fs.width; x += interval_px) {
            fs.text(element.text, x, 0);
        }
    }
    fs.pop();
}

function renderTopElements(fs, film_properties) {
    for (let i = 0; i < film_properties.top_elements.length; i++) {
        let element = film_properties.top_elements[i];
        
        // Top elements can be label or frame count
        if (element.type === ElementType.FRAME_COUNT) {
            renderTopFrameCount(fs, element, film_properties.start_frame);
        } else if (element.type === ElementType.LABEL) {
            renderTopLabel(fs, element);
        } else if (element.type === ElementType.IMAGE) {
            renderTopImage(fs, element);
        }
    }
}

function renderDX(fs, element, dx_code, start_frame) {
    let dx_code_width_px = element.width_mm * SCALE;
    let dx_code_height_px = element.height_mm * SCALE;

    // let delta_x1 = (CYCLE_W - 2 * dx_code_width_px) / 4;
    let delta_x1 = 0;
    let delta_x2 = delta_x1 + CYCLE_W / 2;

    fs.push();
    fs.translate(element.offset * CYCLE_W, fs.height - dx_code_height_px);
    fs.noStroke();
    
    let framenum = start_frame * 2 - 1;

    for (let x = 0; x < fs.width; x += CYCLE_W) {

        // draw dx code (text)
        let dx1 = drawDX(dx_code, framenum, element.color);
        framenum++;
        let dx2 = drawDX(dx_code, framenum, element.color);
        framenum++;
        fs.image(dx1, x + delta_x1, 0, dx_code_width_px, dx_code_height_px);
        fs.image(dx2, x + delta_x2, 0, dx_code_width_px, dx_code_height_px);

        // free memory
        dx1.remove();
        dx2.remove();
    }

    fs.pop();
}

function renderBottomArrow(fs, element) {
    fs.push();
    fs.translate(element.offset * CYCLE_W, fs.height - element.margin_mm * SCALE);
    
    // draw triangle head
    const head_top = -element.head_height_mm * SCALE * 0.5;
    const head_bottom = -head_top;
    const head_width = element.head_width_mm * SCALE;
    fs.fill(element.color);
    fs.noStroke();
    for (let x = 0; x < fs.width; x += CYCLE_W) {
        fs.triangle(
            x, head_top,
            x + head_width, 0,
            x, head_bottom
        );
    }

    // draw triangle tail
    const tail_width = element.tail_width_mm * SCALE;
    if (element.has_tail) {
        fs.noFill();
        fs.stroke(element.color);
        fs.strokeWeight(element.tail_height_mm * SCALE);
        for (let x = 0; x < fs.width; x += CYCLE_W) {
            fs.line(x - tail_width, 0, x, 0);
        }
    }

    fs.pop();
}

// ── Cinema film edge marking renderer ─────────────────────────────────────────
// Based on Kodak Vision3 edge marking specification (ISO 4909 / KeyKode).
// 1 foot = 64 perforations. Each foot has two halves (32 perfs each).
// Each half: 5× frame-index dashes → barcode → key number text.
// Foot boundary = regular-size key number; mid-foot = smaller text with "+32".
// Bottom edge: blank. Markings on top edge only.
// Text is printed upside-down (rotated 180°) on the top edge.

const CHECK_SYMS = ['#', '>', '\u25BD', '\u25B3', '*', '$', '\u25A0'];

function renderCinemaEdge(fs, cinema) {
    const perf_px = (SPROCKET_HOLE_WIDTH_MM + SPROCKET_HOLE_SPACING_WIDTH_MM) * SCALE;
    const foot_px = 64 * perf_px;
    const half_px = 32 * perf_px;

    const col       = cinema.color || '#e8621a';
    const margin_mm = cinema.margin_mm || 0.3;
    const reg_size  = (cinema.height_mm || 1.1) * SCALE;
    const mid_size  = reg_size * 0.75;
    const bc_h      = reg_size;

    const mfg       = cinema.mfg_code  || 'E';
    const fid       = cinema.film_code  || 'N';
    const ftype     = cinema.film_type  || '19';
    const roll      = cinema.roll       || '0674';
    const base_key  = cinema.base_key   || 6613;

    // Deterministic pseudo-random
    function hashRand(seed) { let h = seed * 2654435761 >>> 0; return (h & 0xffff) / 0x10000; }

    // y position: same as other top labels (margin_mm from top of filmstrip).
    const strip_cy = margin_mm * SCALE + reg_size * 0.5;

    // All rendering is done rotated 180° — text reads upside-down on the top edge.
    fs.push();
    fs.translate(fs.width, strip_cy * 2);
    fs.rotate(PI);

    fs.fill(col);
    fs.noStroke();
    fs.textFont('Arial');
    fs.textAlign(CENTER, CENTER);

    const total_feet = Math.ceil(fs.width / foot_px) + 1;
    for (let fi = 0; fi < total_feet; fi++) {
        const foot_x  = fi * foot_px;
        const key_num = base_key + fi;

        for (let half = 0; half < 2; half++) {
            const hx = foot_x + half * half_px;
            // Mid-foot displays the NEXT foot's key number (observed: 8217● at
            // foot boundary, 8218+32● at mid-foot).  Barcode encodes the same.
            const display_key = half === 0 ? key_num : key_num + 1;

            // ─── Frame index marks: 5× dash at 4-perf intervals (perfs 0-16) ─
            fs.textSize(reg_size);
            fs.textAlign(CENTER, CENTER);
            for (let d = 0; d < 5; d++) {
                const dx = hx + d * 4 * perf_px;
                if (dx < -perf_px || dx > fs.width + perf_px) continue;
                fs.text('\u2013', dx, strip_cy); // en-dash
            }

            // ─── Matching check symbols (random, 1–2 per dash group) ─────────
            // Observed positions: ±1 perf from specific dashes (not always midpoint)
            const seed = key_num * 2 + half;
            if (hashRand(seed) > 0.25) {
                fs.textSize(reg_size * 0.7);
                fs.textAlign(CENTER, CENTER);
                const offsets = [1, 2, 3]; // +1 after dash, midpoint, -1 before next
                // First symbol
                const sym_idx1  = Math.floor(hashRand(seed + 7) * CHECK_SYMS.length);
                const dash_idx1 = Math.floor(hashRand(seed + 13) * 4);
                const off1      = offsets[Math.floor(hashRand(seed + 19) * 3)];
                const sym_x1    = hx + (dash_idx1 * 4 + off1) * perf_px;
                if (sym_x1 > 0 && sym_x1 < fs.width) {
                    fs.text(CHECK_SYMS[sym_idx1], sym_x1, strip_cy);
                }
                // Second symbol (≈50 % of the time, on a different dash gap)
                if (hashRand(seed + 3) > 0.5) {
                    const sym_idx2  = Math.floor(hashRand(seed + 17) * CHECK_SYMS.length);
                    let dash_idx2   = Math.floor(hashRand(seed + 23) * 4);
                    if (dash_idx2 === dash_idx1) dash_idx2 = (dash_idx2 + 1) % 4;
                    const off2 = offsets[Math.floor(hashRand(seed + 29) * 3)];
                    const sym_x2 = hx + (dash_idx2 * 4 + off2) * perf_px;
                    if (sym_x2 > 0 && sym_x2 < fs.width) {
                        fs.text(CHECK_SYMS[sym_idx2], sym_x2, strip_cy);
                    }
                }
            }

            // ─── Barcode (MR. CODE): ~2.5 perfs after dashes, ~5 perfs wide ─
            const bc_x = hx + 22.5 * perf_px;
            if (bc_x > -6 * perf_px && bc_x < fs.width + perf_px) {
                const perf_offset = half * 32;
                const bc = drawKeyCodeBarcode(display_key, perf_offset, parseInt(roll), col);
                const bc_w = 5 * perf_px;
                fs.image(bc, bc_x, strip_cy - bc_h * 0.5, bc_w, bc_h);
                bc.remove();
            }

            // ─── Key number text ─────────────────────────────────────────────
            const key_x = hx + 28.5 * perf_px;
            let key_text_str = '';
            if (key_x > -12 * perf_px && key_x < fs.width + perf_px) {
                fs.textAlign(LEFT, CENTER);
                if (half === 0) {
                    fs.textSize(reg_size);
                    key_text_str = `${mfg}${fid} ${ftype} ${roll} ${display_key}\u25CF`;
                } else {
                    fs.textSize(mid_size);
                    key_text_str = `${mfg}${fid} ${ftype} ${roll} ${display_key}+32\u25CF`;
                }
                fs.text(key_text_str, key_x, strip_cy);
            }

            // ─── Zero-frame reference mark (after text, per observation) ─────
            // Observed: ↑ appears 1–3.5 perfs after key number text, periodically.
            const arrowSeed = key_num * 3 + half;
            if (hashRand(arrowSeed) < 0.35) {
                fs.textSize(half === 0 ? reg_size : mid_size);
                const tw = key_text_str ? fs.textWidth(key_text_str) : 0;
                const arrow_x = key_x + tw + 1 * perf_px;
                if (arrow_x > 0 && arrow_x < fs.width) {
                    fs.textSize(reg_size);
                    fs.textAlign(CENTER, CENTER);
                    fs.text('\u2191', arrow_x, strip_cy);
                }
            }
        }
    }

    fs.pop();
}

function renderBottomElements(fs, film_properties) {
    for (let i = 0; i < film_properties.bottom_elements.length; i++) {
        let element = film_properties.bottom_elements[i];
        if (element.type === ElementType.FRAME_COUNT) {
            renderBottomFrameCount(fs, element, film_properties.start_frame);
        } else if (element.type === ElementType.FRAME_COUNT_ALT) {
            renderBottomFrameCount(fs, element, film_properties.start_frame, true);
        } else if (element.type === ElementType.LABEL) {
            renderBottomLabel(fs, element);
        } else if (element.type === ElementType.DX) {
            renderDX(fs, element, film_properties.dx_code, film_properties.start_frame);
        } else if (element.type === ElementType.ARROW) {
            renderBottomArrow(fs, element);
        }
    }
}

const DEFAULT_FILMSTRIP_OPTIONS = {
    apply_glow: true,
    add_grain: true,
};

// ── 120 film rendering ────────────────────────────────────────────────────────
// Architecture:
//   1. renderFilmstrip120() produces one fixed-length horizontal strip
//      (length depends on format, not on how many images were uploaded).
//   2. renderContactSheet120() slices that strip into equal pieces and
//      arranges them:  vertical → rotated CCW columns,  horizontal → stacked rows.

const SHOT_HEIGHT_120_MM = 56;
const VPADDING_120_MM = 2.0;
const FRAME_GAP_120_MM = 2.0;
const SCALE_120 = FINAL_HEIGHT_120 / (SHOT_HEIGHT_120_MM + 2 * VPADDING_120_MM);
const SHOT_HEIGHT_120_PX = SHOT_HEIGHT_120_MM * SCALE_120;
const VPADDING_120_PX = VPADDING_120_MM * SCALE_120;
const FRAME_GAP_120_PX = FRAME_GAP_120_MM * SCALE_120;

function get120Format() {
    const sel = document.getElementById('film120Format');
    return (sel && sel.value) || '6x6';
}
function get120Orientation() {
    const el = document.querySelector('input[name="film120Orientation"]:checked');
    return (el && el.value) || 'portrait';
}
function get120Camera() {
    const el = document.querySelector('input[name="film120Camera"]:checked');
    return (el && el.value) || 'slr';
}

// SLR: no rotation (0°).
// SLR(Half): rotate 90° CCW on the filmstrip (270° CW).
// TLR: rotate 90° CW on the filmstrip.
function getImageRotation(camera) {
    if (camera === 'tlr') return 90;
    if (camera === 'slr-half') return 270;
    return 0;
}

// ── Edge-element renderers (drawn on the horizontal filmstrip) ───────────────
// Config `side:'left'` → top edge of strip (becomes left of column after CCW).
// Config `side:'right'` → bottom edge of strip (becomes right of column).

function render120EdgeLabel(fs, el, fs_width) {
    const lbl_count = el.label_count || 16;
    const n_labels = 2 * lbl_count;
    const start_num = el.start_num || 41;
    const interval = fs_width / n_labels;

    fs.fill(el.color);
    fs.noStroke();
    fs.textSize(el.height_mm * SCALE_120);
    fs.textFont(FONTS_CACHE[el.font]);
    fs.textStyle(el.font_style === 'bold' ? BOLD : NORMAL);
    fs.textAlign(CENTER, CENTER);

    const is_top = el.side !== 'right';
    const y = is_top ? VPADDING_120_PX * 0.5 : FINAL_HEIGHT_120 - VPADDING_120_PX * 0.5;

    for (let i = 0; i < n_labels; i++) {
        const x = (i + 0.5) * interval;
        const user_code = (document.getElementById('film120Date').value || '').trim();
        const seq_num = String(start_num + Math.floor(i / 2));
        const code_str = el.fixed_code ? (user_code || el.label_code || el.text) : (user_code || seq_num);
        const label_str = (i % 2 === 0) ? code_str : el.text;
        fs.text(label_str, x, y);
    }
}

function render120EdgeFrameCount(fs, el, fs_width) {
    const total_markers = 18;
    const interval = fs_width / (total_markers + 1);
    const margin_px = (el.margin_mm || 0) * SCALE_120;
    const below = el.below || false;

    fs.fill(el.color);
    fs.noStroke();
    fs.textSize(el.height_mm * SCALE_120);
    fs.textFont(FONTS_CACHE[el.font]);
    fs.textStyle(el.font_style === 'bold' ? BOLD : NORMAL);
    fs.textAlign(CENTER, CENTER);

    const is_top = el.side !== 'right';
    // cy is centred in the edge band (top or bottom VPADDING strip of the filmstrip).
    const cy = is_top ? VPADDING_120_PX * 0.5 : FINAL_HEIGHT_120 - VPADDING_120_PX * 0.5;
    // 'margin' shifts ALONG the film direction (= filmstrip x).
    //   OLD column:  marker_y + (below ? +margin_px : -margin_px)
    //   NEW strip:   m*interval + (below ? -margin_px : +margin_px)   (column +y ↔ filmstrip -x)
    const shift = below ? -margin_px : margin_px;

    for (let m = 1; m <= total_markers; m++) {
        const x = m * interval + shift;
        fs.text(m.toString(), x, cy);
    }
}

function render120EdgeArrow(fs, el, fs_width) {
    const total_markers = 18;
    const interval = fs_width / (total_markers + 1);
    // height_mm is the arrow's extent ALONG the film (= length of the triangle).
    // width_mm  is the arrow's thickness PERPENDICULAR to the film.
    // This matches the OLD column definition where ▲ had "height" = ah along
    // the column's long axis (= along the film) and "width" = aw perpendicular.
    const arrow_len   = (el.height_mm || 4) * SCALE_120;
    const arrow_thick = (el.width_mm  || 2) * SCALE_120;
    const margin_px   = (el.margin_mm || 0) * SCALE_120;

    fs.fill(el.color);
    fs.noStroke();

    const is_top = el.side !== 'right';
    // Centre of the arrow in the edge band (top or bottom VPADDING strip).
    const cy = is_top ? VPADDING_120_PX * 0.5 : FINAL_HEIGHT_120 - VPADDING_120_PX * 0.5;
    const arrow_down = el.arrow_down || false;

    for (let m = 1; m <= total_markers; m++) {
        // OLD column: base_y = marker_y - margin_px  (shift toward top of column)
        // Column -y ↔ filmstrip +x, so the equivalent filmstrip shift is +margin_px.
        const ax = m * interval + margin_px;
        if (arrow_down) {
            // ◀ in filmstrip → ▼ in column (arrow_down = true)
            fs.triangle(
                ax, cy - arrow_thick / 2,
                ax, cy + arrow_thick / 2,
                ax - arrow_len, cy
            );
        } else {
            // ▶ in filmstrip → ▲ in column (default)
            fs.triangle(
                ax, cy - arrow_thick / 2,
                ax, cy + arrow_thick / 2,
                ax + arrow_len, cy
            );
        }
    }
}

function render120EdgeArrowNumbered(fs, el, fs_width) {
    const max_frame = el.max_frame || 12;
    const n_items   = 2 * max_frame + 2;
    // arrow_height_mm = length ALONG film, arrow_width_mm = thickness PERPENDICULAR
    const arrow_len   = (el.arrow_height_mm || 2.5) * SCALE_120;
    const arrow_thick = (el.arrow_width_mm  || 1.2) * SCALE_120;
    const nh        = (el.num_height_mm || 1.4) * SCALE_120;
    const interval  = fs_width / n_items;

    fs.fill(el.color);
    fs.noStroke();
    fs.textFont(FONTS_CACHE[el.font]);
    fs.textStyle(el.font_style === 'bold' ? BOLD : NORMAL);
    fs.textSize(nh);
    fs.textAlign(CENTER, CENTER);

    const is_top = el.side !== 'right';
    const cy = is_top ? VPADDING_120_PX * 0.5 : FINAL_HEIGHT_120 - VPADDING_120_PX * 0.5;
    const arrow_down = el.arrow_down || false;

    for (let i = 0; i < n_items; i++) {
        const ax = (i + 0.5) * interval;
        if (i === n_items - 1) {
            fs.text('X', ax, cy);
            continue;
        }
        // Arrow parallel to film.  Default ▶ (→ ▲ in column after CCW).
        if (arrow_down) {
            fs.triangle(
                ax, cy - arrow_thick / 2,
                ax, cy + arrow_thick / 2,
                ax - arrow_len, cy
            );
        } else {
            fs.triangle(
                ax, cy - arrow_thick / 2,
                ax, cy + arrow_thick / 2,
                ax + arrow_len, cy
            );
        }
        if (i % 2 === 1) {
            const frame_num = Math.floor(i / 2) + 1;
            // Number placed past the apex along the arrow direction.
            // After CCW rotation, "past the apex in +x" becomes "above apex (-y)" in the column,
            // matching the OLD layout (frame number appears above the ▲ arrow tip).
            const num_x = arrow_down
                ? ax - arrow_len - nh * 0.5
                : ax + arrow_len + nh * 0.5;
            fs.text(frame_num.toString(), num_x, cy);
        }
    }
}

function render120EdgeElements(fs, fp, fs_width) {
    if (!fp.side_elements) return;
    for (let el of fp.side_elements) {
        if (el.type === ElementType.LABEL)            render120EdgeLabel(fs, el, fs_width);
        else if (el.type === ElementType.FRAME_COUNT) render120EdgeFrameCount(fs, el, fs_width);
        else if (el.type === ElementType.ARROW)       render120EdgeArrow(fs, el, fs_width);
        else if (el.type === ElementType.ARROW_NUMBERED) render120EdgeArrowNumbered(fs, el, fs_width);
    }
}

// ── Filmstrip (one long horizontal image) ────────────────────────────────────

function renderFilmstrip120(images, options = DEFAULT_FILMSTRIP_OPTIONS) {
    let filmstock_el = document.getElementById('filmSelect').getElementsByClassName('filmstock active')[0];
    if (!filmstock_el) { alert('No film stock selected'); return; }
    let fp = FILM[filmstock_el.id];

    const format  = get120Format();
    const camera  = get120Camera();
    const isTLR   = camera === 'tlr';
    const isFree  = format === 'free';
    const rotation = getImageRotation(camera);

    // ── Per-image layout: compute position, width ───────────────────────
    let slots = [];        // { x, width }
    let frame_ends = [];   // cumulative x after each frame (slice boundaries)
    let fs_width;

    if (isFree) {
        // Variable pitch: each image keeps its natural (post-rotation) aspect.
        // No cropping, no forced ratio.
        let x = 0;
        for (let i = 0; i < images.length; i++) {
            const eff_w = (rotation === 90 || rotation === 270) ? images[i].height : images[i].width;
            const eff_h = (rotation === 90 || rotation === 270) ? images[i].width  : images[i].height;
            const img_w = SHOT_HEIGHT_120_PX * (eff_w / eff_h);
            slots.push({ x: x + FRAME_GAP_120_PX, width: img_w });
            x += img_w + 2 * FRAME_GAP_120_PX;
            frame_ends.push(x);
        }
        fs_width = Math.max(x, SHOT_HEIGHT_120_PX);
    } else {
        // Fixed-pitch format (6x6, 6x4.5, etc.)
        const pitch_mm = MEDIUM_FORMAT_WIDTHS_MM[format] || MEDIUM_FORMAT_WIDTHS_MM['6x6'];
        const num_exp  = STANDARD_EXPOSURES_120[format]  || 12;
        const cycle_px = pitch_mm * SCALE_120;
        const img_w_px = (pitch_mm - 2 * FRAME_GAP_120_MM) * SCALE_120;
        fs_width = num_exp * cycle_px;

        for (let i = 0; i < num_exp; i++) {
            frame_ends.push((i + 1) * cycle_px);
            if (i < images.length) {
                slots.push({ x: i * cycle_px + FRAME_GAP_120_PX, width: img_w_px });
            }
        }
    }

    // ── Create filmstrip canvas ─────────────────────────────────────────
    const fs_height     = FINAL_HEIGHT_120;
    const fs_width_int  = Math.round(fs_width);
    const fs_height_int = Math.round(fs_height);

    let fs = createGraphics(fs_width, fs_height);
    fs.background(0);

    // edge elements (labels, arrows, frame numbers along top/bottom edges)
    render120EdgeElements(fs, fp, fs_width);

    // grain
    const grain_color = color(fp.sprocket_hole_color);
    if (options.add_grain) {
        let grain_map = createImage(fs_width_int, fs_height_int);
        grain_map.loadPixels();
        const N = 4 * grain_map.width * grain_map.height;
        const gr = red(grain_color), gg = green(grain_color), gb = blue(grain_color);
        for (let i = 0; i < N; i += 4) {
            grain_map.pixels[i] = gr; grain_map.pixels[i+1] = gg;
            grain_map.pixels[i+2] = gb; grain_map.pixels[i+3] = randrange(0, 50);
        }
        grain_map.updatePixels();
        fs.blend(grain_map, 0, 0, fs_width_int, fs_height_int, 0, 0, fs_width_int, fs_height_int, ADD);
    }

    // glow
    if (options.apply_glow) {
        let fs_blur = createImage(fs_width_int, fs_height_int);
        fs_blur.copy(fs, 0, 0, fs_width_int, fs_height_int, 0, 0, fs_width_int, fs_height_int);
        fs_blur.filter(BLUR, 3);
        fs.blend(fs_blur, 0, 0, fs_width_int, fs_height_int, 0, 0, fs_width_int, fs_height_int, SOFT_LIGHT);
    }

    // draw images (with optional TLR rotation; Free uses exact aspect, fixed uses cover-fit)
    for (let i = 0; i < slots.length; i++) {
        const s = slots[i];
        drawImageCoverFit(fs, images[i], s.x, VPADDING_120_PX, s.width, SHOT_HEIGHT_120_PX, rotation);
    }

    return { graphics: fs, frame_ends: frame_ends };
}

// ── Contact sheet (slices of the filmstrip) ──────────────────────────────────

function renderContactSheet120(fs, fp, num_strips, padding_mm, strip_spacing_mm, frame_ends) {
    strip_spacing_mm = strip_spacing_mm || 2.0;
    const orientation   = get120Orientation();
    const padding_px    = padding_mm * SCALE_120;
    const spacing_px    = strip_spacing_mm * SCALE_120;
    const fs_h          = fs.height;   // = FINAL_HEIGHT_120

    // ── Compute per-strip slices at frame boundaries ────────────────────
    // Distribute frames evenly; each slice boundary sits between two frames
    // so that no image is split across strips.
    const total_frames    = frame_ends.length;
    const frames_per_strip = Math.max(1, Math.ceil(total_frames / num_strips));
    let slices = [];   // { src_x, width }
    for (let s = 0; s < num_strips; s++) {
        const start_f = s * frames_per_strip;
        if (start_f >= total_frames) break;
        const end_f   = Math.min((s + 1) * frames_per_strip, total_frames);
        const src_x   = start_f === 0 ? 0 : frame_ends[start_f - 1];
        const src_end = frame_ends[end_f - 1];
        slices.push({ src_x: src_x, width: src_end - src_x });
    }
    const actual_strips = slices.length;
    const max_slice_w   = Math.max(...slices.map(s => s.width));

    const handPlaced = document.getElementById('handPlacedCheck')?.checked || false;
    let cs, cw, ch;

    if (orientation === 'landscape') {
        // Stack horizontal slices as rows (widest slice sets canvas width)
        const jitter_extra = handPlaced ? padding_px * 0.4 : 0;
        cw = max_slice_w + 2 * padding_px + jitter_extra;
        ch = actual_strips * fs_h + (actual_strips - 1) * spacing_px + 2 * padding_px + jitter_extra;
        cs = createGraphics(cw, ch);
        cs.background(0);
        for (let r = 0; r < actual_strips; r++) {
            const sl = slices[r];
            const dst_x = padding_px;
            const dst_y = padding_px + r * (fs_h + spacing_px);
            if (handPlaced) {
                const jx = randrange(-1.5, 1.5) * SCALE_120;
                const jy = randrange(-1.5, 1.5) * SCALE_120;
                const ja = randrange(-0.4, 0.4) * Math.PI / 180;
                cs.push();
                cs.translate(dst_x + jx, dst_y + jy);
                cs.rotate(ja);
                cs.image(fs, 0, 0, sl.width, fs_h, sl.src_x, 0, sl.width, fs_h);
                cs.pop();
            } else {
                cs.image(fs, dst_x, dst_y, sl.width, fs_h, sl.src_x, 0, sl.width, fs_h);
            }
        }
    } else {
        // Portrait: rotate each slice → columns.
        // SLR(Half): rotate CW 90° (frame 1 at top).
        // Others:    rotate CCW 90° (frame 1 at bottom).
        const camera  = get120Camera();
        const rotateCW = camera === 'slr-half';
        const col_w   = fs_h;
        const max_col_h = max_slice_w;
        const jitter_extra = handPlaced ? padding_px * 0.4 : 0;
        cw = actual_strips * col_w + (actual_strips - 1) * spacing_px + 2 * padding_px + jitter_extra;
        ch = max_col_h + 2 * padding_px + jitter_extra;
        cs = createGraphics(cw, ch);
        cs.background(0);
        for (let c = 0; c < actual_strips; c++) {
            const sl = slices[c];
            const col_x = padding_px + c * (col_w + spacing_px);
            const jx = handPlaced ? randrange(-1.5, 1.5) * SCALE_120 : 0;
            const jy = handPlaced ? randrange(-1.5, 1.5) * SCALE_120 : 0;
            const ja = handPlaced ? randrange(-0.4, 0.4) * Math.PI / 180 : 0;
            cs.push();
            if (rotateCW) {
                cs.translate(col_x + col_w + jx, padding_px + jy);
                cs.rotate(HALF_PI + ja);
            } else {
                cs.translate(col_x + jx, padding_px + max_col_h + jy);
                cs.rotate(-HALF_PI + ja);
            }
            cs.image(fs, 0, 0, sl.width, fs_h, sl.src_x, 0, sl.width, fs_h);
            cs.pop();
        }
    }

    // grain (on the contact sheet canvas)
    const grain_color = color(fp.sprocket_hole_color);
    const gcw = Math.round(cw), gch = Math.round(ch);
    let grain_map = createImage(gcw, gch);
    grain_map.loadPixels();
    const N = 4 * gcw * gch;
    const gr = red(grain_color), gg = green(grain_color), gb = blue(grain_color);
    for (let i = 0; i < N; i += 4) {
        grain_map.pixels[i] = gr; grain_map.pixels[i+1] = gg;
        grain_map.pixels[i+2] = gb; grain_map.pixels[i+3] = randrange(0, 50);
    }
    grain_map.updatePixels();
    cs.blend(grain_map, 0, 0, gcw, gch, 0, 0, gcw, gch, ADD);

    return cs;
}

function renderFilmstrip(images, options=DEFAULT_FILMSTRIP_OPTIONS) {

    // Burned leader: extra space at the start of the filmstrip
    const burned_leader = document.getElementById('burnedLeaderCheck')?.checked || false;
    const fs_height = SHOT_HEIGHT_PX + 2 * VPADDING_PX;
    const leader_w = (burned_leader && BURNED_LEADER_IMG)
        ? Math.round(fs_height * (BURNED_LEADER_IMG.width / BURNED_LEADER_IMG.height))
        : 0;

    // Create a new canvas for the filmstrip
    const fs_width = images.length * CYCLE_W + HPADDING_PX + leader_w;
    const fs_width_int = Math.round(fs_width);
    const fs_height_int = Math.round(fs_height);
    let fs = createGraphics(fs_width, fs_height);
    fs.background(0);

    // Get film stock properties (from selected film stock)
    // TODO: move this to a separate function

    // look for all 'filmstock' classes within parent id 'filmSelect'
    // filmstock is the one that has the 'active' class
    let filmstock = document.getElementById('filmSelect').getElementsByClassName('filmstock active')[0];
    if (filmstock == null) {
        alert('No film stock selected');
        return;
    }

    // get the film stock properties
    let film_properties = FILM[filmstock.id];

    // draw film border
    if (film_properties.cinema_edge) {
        renderCinemaEdge(fs, film_properties.cinema_edge);
        // cinema film: bottom edge is blank
    } else {
        renderTopElements(fs, film_properties);
        renderBottomElements(fs, film_properties);
    }

    // Add grain
    const grain_color = color(film_properties.sprocket_hole_color);
    if (options.add_grain) {
        let grain_map = createImage(fs_width_int, fs_height_int);
        grain_map.loadPixels();
        const N = 4 * grain_map.width * grain_map.height;
        const grain_color_R = red(grain_color);
        const grain_color_G = green(grain_color);
        const grain_color_B = blue(grain_color);
        for (let i = 0; i < N; i += 4) {
            grain_map.pixels[i] = grain_color_R;
            grain_map.pixels[i + 1] = grain_color_G;
            grain_map.pixels[i + 2] = grain_color_B;
            grain_map.pixels[i + 3] = randrange(0, 50);
        }
        grain_map.updatePixels();
        fs.blend(grain_map, 0, 0, fs_width_int, fs_height_int, 0, 0, fs_width_int, fs_height_int, ADD);
    }

    // Apply glow effect
    if (options.apply_glow) {
        let fs_blur = createImage(fs.width, fs.height);
        fs_blur.copy(fs, 0, 0, fs_width_int, fs_height_int, 0, 0, fs_width_int, fs_height_int);
        fs_blur.filter(BLUR, 3);
        fs.blend(fs_blur, 0, 0, fs_width_int, fs_height_int, 0, 0, fs_width_int, fs_height_int, SOFT_LIGHT);
        // fs_blur.remove();
    }

    // Burned leader overlay (before sprocket holes so holes punch through)
    if (leader_w > 0) {
        renderBurnedLeader(fs, leader_w);
    }

    // draw sprocket holes
    renderSprocketHoles(fs, film_properties);

    // draw images (shifted right by leader width)
    renderImages(fs, images, leader_w);

    return fs;
}

function renderContactSheet(filmstrip, num_cols, padding_mm, strip_spacing_mm = 1.5, leader_w = 0) {
    let padding_px = padding_mm * SCALE;
    let strip_spacing_px = strip_spacing_mm * SCALE;
    const handPlaced = document.getElementById('handPlacedCheck')?.checked || false;
    const jitter_extra = handPlaced ? padding_px * 0.4 : 0;
    let cs_width = num_cols * (SHOT_WIDTH_PX + HPADDING_PX) - HPADDING_PX + 2 * padding_px + leader_w + jitter_extra;
    let cs_height = Math.ceil(images.length / num_cols) * (filmstrip.height + strip_spacing_px) - strip_spacing_px + 2 * padding_px + jitter_extra;
    let cs = createGraphics(cs_width, cs_height);

    cs.background(0);
    cs.fill(FILM_BORDER_COLOR);
    cs.noStroke();
    cs.push();
    cs.translate(0, padding_px);
    for (let i = 0, j = 0; i < images.length; i += num_cols, j++) {
        let start_x = padding_px + randrange(0.2, 0.8) * HPADDING_PX;
        let x = j * num_cols * (SHOT_WIDTH_PX + HPADDING_PX) + HPADDING_PX + (j > 0 ? leader_w : 0);
        let y = j * (filmstrip.height + strip_spacing_px);
        if (handPlaced) {
            let jitter_y = randrange(-1.5, 1.5) * SCALE;
            let jitter_angle = randrange(-0.4, 0.4) * Math.PI / 180;
            cs.push();
            cs.translate(start_x - x, y + jitter_y);
            cs.rotate(jitter_angle);
            cs.image(filmstrip, 0, 0);
            cs.pop();
        } else {
            cs.image(filmstrip, start_x - x, y);
        }
    }
    cs.pop();

    cs.fill(0);
    cs.noStroke();
    cs.rect(0, 0, padding_px, cs.height);
    cs.rect(cs.width - padding_px, 0, cs.width, cs.height);

    return cs;
}

function previewDraw() {
    // redraw();

    let filmstock_el = document.getElementById('filmSelect').getElementsByClassName('filmstock active')[0];
    if (!filmstock_el) { alert('No film stock selected'); return; }
    let fp = FILM[filmstock_el.id];
    let is120 = fp.format === '120';

    // draw filmstrip
    let fs, frame_ends;
    if (is120) {
        const result = renderFilmstrip120(images);
        fs = result.graphics;
        frame_ends = result.frame_ends;
    } else {
        fs = renderFilmstrip(images);
    }
    // Build filename slug from film stock key (e.g., "kodak-portra-400")
    const stock_slug = filmstock_el.id;
    const fs_filename = `${stock_slug}_preview.png`;
    const cs_filename = `${stock_slug}_contactsheet.png`;

    let fsimg = document.getElementById('filmstripimg');
    fs.canvas.toBlob(function(blob) {
        let url = URL.createObjectURL(blob);
        fsimg.src = url;
        fsimg.alt = fs_filename;
    });
    fsimg.style.display = 'block';

    // draw contact sheet
    let cs;
    if (is120) {
        const format_120 = get120Format();
        const orientation_120 = get120Orientation();
        const num_strips_map = orientation_120 === 'landscape'
            ? NUM_STRIPS_120_HORIZONTAL
            : NUM_STRIPS_120_VERTICAL;
        let num_strips_120;
        if (format_120 === 'free') {
            num_strips_120 = Math.max(1, Math.ceil(images.length / 4));
        } else {
            num_strips_120 = num_strips_map[format_120] || 3;
        }
        cs = renderContactSheet120(fs, fp, num_strips_120, 3, 2.0, frame_ends);
    } else {
        const burned_leader = document.getElementById('burnedLeaderCheck')?.checked || false;
        const lw = (burned_leader && BURNED_LEADER_IMG)
            ? Math.round((SHOT_HEIGHT_PX + 2 * VPADDING_PX) * (BURNED_LEADER_IMG.width / BURNED_LEADER_IMG.height))
            : 0;
        cs = renderContactSheet(fs, 5, 3, 1.5, lw);
    }
    fs.remove();
    let csimg = document.getElementById('contactsheetimg');
    cs.canvas.toBlob(function(blob) {
        let url = URL.createObjectURL(blob);
        csimg.src = url;
        csimg.alt = cs_filename;

        // to make contact sheet downloadable
        // csimg.onload = function() {
        //     URL.revokeObjectURL(url);
        // };
    });
    cs.remove();
    csimg.style.display = 'block';
}

FILMSTOCK_ASSETS = {};

function preload() {
    // load fonts
    for (let key in FONTS) {
        let font = FONTS[key];
        if (font.endsWith('.ttf') || font.endsWith('.otf')) {
            FONTS_CACHE[font] = loadFont('assets/' + font);
        } else {
            FONTS_CACHE[font] = font;
        }
    }

    // load burned leader overlay
    BURNED_LEADER_IMG = loadImage('assets/burnt_film_effect_expend.png');

    // load image assets from filmstock
    for (let key in FILM) {
        let filmstock = FILM[key];
        if (filmstock.top_elements) {
            for (top_element of filmstock.top_elements) {
                if (top_element.type === ElementType.IMAGE) {
                    FILMSTOCK_ASSETS[top_element.src] = loadImage(top_element.src);
                }
            }
        }
    }
}

function setup() {
    // createCanvas(800, 800, document.getElementById('p5canvas'));
    // background(0);
    noLoop();
}

function draw() {
    // background(0);

    // // draw all images in a grid
    // let x = 0;
    // let y = 0;
    // let w = width / 4;
    // let h = height / 4;
    // for (let i = 0; i < images.length; i++) {
    //     let img = images[i];
    //     image(img, x, y, w, h);
    //     x += w;
    //     if (x >= width) {
    //         x = 0;
    //         y += h;
    //     }
    // }
}