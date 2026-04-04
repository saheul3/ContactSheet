// pimage
let images = [];

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

function renderImages(fs, images) {
    let x = HPADDING_PX;
    let y = VPADDING_PX;
    for (let i = 0; i < images.length; i++) {
        let img = images[i];
        fs.image(img, x, y, SHOT_WIDTH_PX, SHOT_HEIGHT_PX);
        x += SHOT_WIDTH_PX + HPADDING_PX;
    }
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

/**
 * Renders a cinema KeyCode mark: human-readable text + ITF barcode.
 * Repeats every `interval_frames` (default 16 = 1 foot of film).
 * Layout matches: EN 05 9635 6613+32 •   [barcode]
 */
function renderKeyCode(fs, element, start_frame) {
    const interval_frames = element.interval_frames || 16;
    const interval_px = interval_frames * CYCLE_W;
    const base_key  = element.base_key  || 6613;
    const roll      = element.roll      || 9635;
    const film_type = element.film_type || '19';
    const margin_y  = fs.height - element.margin_mm * SCALE;

    fs.push();
    fs.textFont(FONTS_CACHE[FONTS.vcd]);
    fs.textSize(element.height_mm * SCALE);
    fs.textAlign(LEFT, BOTTOM);
    fs.noStroke();

    let frame = start_frame;
    for (let x = 0; x < fs.width; x += interval_px, frame += interval_frames) {
        const key_feet    = base_key + Math.floor(frame / 16);
        const perf_offset = (frame % 16) * 4;
        const perf_str    = String(perf_offset).padStart(2, '0');

        // "KK" in red (manufacturer prefix), rest in element color
        fs.fill('#cc2200');
        fs.text('KK', x, margin_y);
        const kk_w = fs.textWidth('KK');

        const rest = ` ${film_type}  ${roll}  ${key_feet}+${perf_str} \u2022`;
        fs.fill(element.color);
        fs.text(rest, x + kk_w, margin_y);

        // ITF barcode after the text
        const text_w = kk_w + fs.textWidth(rest);
        const bc = drawKeyCodeBarcode(key_feet, perf_offset, roll, element.color);
        const bc_h = element.height_mm * SCALE;
        fs.image(bc, x + text_w + 3, margin_y - bc_h, bc.width * (bc_h / bc.height), bc_h);
        bc.remove();
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
        } else if (element.type === ElementType.KEYCODE) {
            renderKeyCode(fs, element, film_properties.start_frame);
        }
    }
}

const DEFAULT_FILMSTRIP_OPTIONS = {
    apply_glow: true,
    add_grain: true,
};

// ── 120 film rendering ────────────────────────────────────────────────────────

const SHOT_HEIGHT_120_MM = 56;
const HPADDING_120_MM = 5.0;
const VPADDING_120_MM = 2.0;
const SCALE_120 = FINAL_HEIGHT_120 / (SHOT_HEIGHT_120_MM + 2 * VPADDING_120_MM);
const SHOT_HEIGHT_120_PX = SHOT_HEIGHT_120_MM * SCALE_120;
const HPADDING_120_PX = HPADDING_120_MM * SCALE_120;
const VPADDING_120_PX = VPADDING_120_MM * SCALE_120;

function render120TopLabel(fs, element, cycle_w) {
    fs.fill(element.color);
    fs.noStroke();
    fs.textSize(element.height_mm * SCALE_120);
    fs.textAlign(LEFT, TOP);
    fs.textFont(FONTS_CACHE[element.font]);
    fs.textStyle(element.font_style === 'bold' ? BOLD : NORMAL);
    fs.push();
    fs.translate(element.offset * cycle_w, element.margin_mm * SCALE_120);
    let interval = (element.repeat === RepeatType.FRAME && element.every)
        ? element.every * cycle_w : cycle_w;
    if (element.repeat === RepeatType.NONE) {
        fs.text(element.text, 0, 0);
    } else {
        for (let x = 0; x < fs.width; x += interval) fs.text(element.text, x, 0);
    }
    fs.pop();
}

function render120FrameCount(fs, element, cycle_w, start_frame, bottom, alt) {
    fs.fill(element.color);
    fs.noStroke();
    fs.textSize(element.height_mm * SCALE_120);
    fs.textFont(FONTS_CACHE[element.font]);
    fs.textStyle(element.font_style === 'bold' ? BOLD : NORMAL);
    if (bottom) {
        fs.textAlign(CENTER, BOTTOM);
        fs.push();
        fs.translate(element.offset * cycle_w, fs.height - element.margin_mm * SCALE_120);
    } else {
        fs.textAlign(CENTER, TOP);
        fs.push();
        fs.translate(element.offset * cycle_w, element.margin_mm * SCALE_120);
    }
    for (let x = 0, count = start_frame; x < fs.width; x += cycle_w, count++) {
        fs.text(frameCountToString(count, alt), x, 0);
    }
    fs.pop();
}

function render120TopElements(fs, film_properties, cycle_w) {
    if (!film_properties.top_elements) return;
    for (let el of film_properties.top_elements) {
        if (el.type === ElementType.LABEL)            render120TopLabel(fs, el, cycle_w);
        else if (el.type === ElementType.FRAME_COUNT) render120FrameCount(fs, el, cycle_w, film_properties.start_frame || 1, false, false);
    }
}

function render120BottomElements(fs, film_properties, cycle_w) {
    if (!film_properties.bottom_elements) return;
    for (let el of film_properties.bottom_elements) {
        if (el.type === ElementType.LABEL)                render120TopLabel(fs, el, cycle_w);
        else if (el.type === ElementType.FRAME_COUNT)     render120FrameCount(fs, el, cycle_w, film_properties.start_frame || 1, true, false);
        else if (el.type === ElementType.FRAME_COUNT_ALT) render120FrameCount(fs, el, cycle_w, film_properties.start_frame || 1, true, true);
    }
}

// Renders text rotated 90° in the side padding area of each frame
function render120SideLabel(fs, element, cycle_w, shot_width_px) {
    fs.fill(element.color);
    fs.noStroke();
    fs.textSize(element.height_mm * SCALE_120);
    fs.textFont(FONTS_CACHE[element.font]);
    fs.textStyle(element.font_style === 'bold' ? BOLD : NORMAL);
    fs.textAlign(CENTER, CENTER);

    const is_right = element.side !== 'left';
    const x_in_cycle = is_right
        ? shot_width_px + HPADDING_120_PX / 2
        : -HPADDING_120_PX / 2;
    const y_center = VPADDING_120_PX + SHOT_HEIGHT_120_PX / 2 + (element.margin_mm || 0) * SCALE_120;
    const interval = (element.repeat === RepeatType.FRAME && element.every)
        ? element.every * cycle_w : cycle_w;

    for (let x = HPADDING_120_PX; x < fs.width; x += interval) {
        fs.push();
        fs.translate(x + x_in_cycle, y_center);
        fs.rotate(-HALF_PI);  // reads bottom-to-top like real film
        fs.text(element.text, 0, 0);
        fs.pop();
    }
}

// Renders small downward-pointing arrow markers (▼) in the left padding near the top of each frame
function render120SideArrow(fs, element, cycle_w, shot_width_px) {
    fs.fill(element.color);
    fs.noStroke();
    const h = element.size_mm * SCALE_120;
    const margin_px = (element.margin_mm || 0) * SCALE_120;
    const interval = (element.repeat === RepeatType.FRAME && element.every)
        ? element.every * cycle_w : cycle_w;

    for (let x = HPADDING_120_PX; x < fs.width; x += interval) {
        // centered in left padding, near the top of the frame (▼)
        const cx = x - HPADDING_120_PX / 2;
        const cy = VPADDING_120_PX + margin_px;
        fs.triangle(cx - h/2, cy, cx + h/2, cy, cx, cy + h);
    }
}

function render120SideElements(fs, film_properties, cycle_w, shot_width_px) {
    if (!film_properties.side_elements) return;
    for (let el of film_properties.side_elements) {
        if (el.type === ElementType.LABEL)      render120SideLabel(fs, el, cycle_w, shot_width_px);
        else if (el.type === ElementType.ARROW) render120SideArrow(fs, el, cycle_w, shot_width_px);
    }
}

function renderFilmstrip120(images, options=DEFAULT_FILMSTRIP_OPTIONS) {
    let filmstock_el = document.getElementById('filmSelect').getElementsByClassName('filmstock active')[0];
    if (!filmstock_el) { alert('No film stock selected'); return; }
    let fp = FILM[filmstock_el.id];

    const shot_width_mm = MEDIUM_FORMAT_WIDTHS_MM[fp.medium_format || '6x6'];
    const shot_width_px = shot_width_mm * SCALE_120;
    const cycle_w = shot_width_px + HPADDING_120_PX;

    const fs_width = images.length * cycle_w + HPADDING_120_PX;
    const fs_height = SHOT_HEIGHT_120_PX + 2 * VPADDING_120_PX;
    const fs_width_int = Math.round(fs_width);
    const fs_height_int = Math.round(fs_height);

    let fs = createGraphics(fs_width, fs_height);
    fs.background(0);

    render120TopElements(fs, fp, cycle_w);
    render120BottomElements(fs, fp, cycle_w);
    render120SideElements(fs, fp, cycle_w, shot_width_px);

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

    // images
    let x = HPADDING_120_PX;
    for (let img of images) {
        fs.image(img, x, VPADDING_120_PX, shot_width_px, SHOT_HEIGHT_120_PX);
        x += cycle_w;
    }

    return fs;
}

// Renders the 120 contact sheet as vertical strips (column-major order).
//
// The 820mm backing paper has 18 equally-spaced markers (~45.6mm apart).
// Photo frames are placed at format-dependent intervals (6x6=56mm, 6x7=69.5mm, etc.).
// These two spacings are independent — the markers do NOT align with frame edges.
//
// Each strip covers exactly 820/num_cols mm of the backing paper, so all 18 markers
// appear across the full contact sheet (6 per column for 3-col layout).
function renderContactSheet120(fp, num_cols, padding_mm, strip_spacing_mm = 2.0) {
    const shot_travel_mm = MEDIUM_FORMAT_WIDTHS_MM[fp.medium_format || '6x6'];
    const shot_width_px  = SHOT_HEIGHT_120_PX; // 56mm across film

    // Total exposed film length = actual frames × per-frame travel.
    // 18 markers are spread across this length (not the full 820mm backing paper),
    // so marker_interval = total_used_mm / 18.
    // col_length = total_used_mm / num_cols = exactly frames_per_col frames per column.
    const total_markers   = 18;
    const total_used_mm   = images.length * shot_travel_mm;
    const col_length_mm   = total_used_mm / num_cols;
    const col_height_px   = col_length_mm * SCALE_120;
    // 18 markers divide the full strip into 19 equal parts.
    // Marker m (1..18) sits at m * interval from the start of the film.
    const marker_interval_mm = total_used_mm / (total_markers + 1);

    // Small gap between frames (backing paper between exposures)
    const frame_gap_mm = VPADDING_120_MM;
    const shot_size_mm = shot_travel_mm - 2 * frame_gap_mm; // rendered image height

    const edge_pad_px      = HPADDING_120_PX;
    const strip_w          = shot_width_px + 2 * edge_pad_px;
    const strip_spacing_px = strip_spacing_mm * SCALE_120;
    const padding_px       = padding_mm * SCALE_120;
    const cs_width         = num_cols * strip_w + (num_cols - 1) * strip_spacing_px + 2 * padding_px;
    const cs_height        = col_height_px + 2 * padding_px;

    let cs = createGraphics(cs_width, cs_height);
    cs.background(0);

    for (let c = 0; c < num_cols; c++) {
        const strip_x       = padding_px + c * (strip_w + strip_spacing_px);
        const film_start_mm = c * col_length_mm;

        // Place each photo at its absolute film position.
        // Photos that physically fall in this column's film range are drawn
        // at their correct local offset — preserving spacing across cut boundaries.
        for (let idx = 0; idx < images.length; idx++) {
            const abs_mm = idx * shot_travel_mm;
            if (abs_mm < film_start_mm || abs_mm >= film_start_mm + col_length_mm) continue;
            const local_mm = abs_mm - film_start_mm;
            const img_x    = strip_x + edge_pad_px;
            const img_y    = padding_px + (local_mm + frame_gap_mm) * SCALE_120;
            cs.image(images[idx], img_x, img_y, shot_width_px, shot_size_mm * SCALE_120);
        }

        // Find markers (m=1..18) that fall within this column's film range.
        // Marker m is at absolute position m * marker_interval_mm.
        const first_m = Math.max(1,  Math.ceil(film_start_mm / marker_interval_mm));
        const last_m  = Math.min(18, Math.floor((film_start_mm + col_length_mm - 0.001) / marker_interval_mm));

        // Draw side elements
        if (fp.side_elements) {
            for (let el of fp.side_elements) {
                const is_left = el.side !== 'right';
                const cx = is_left
                    ? strip_x + edge_pad_px / 2
                    : strip_x + strip_w - edge_pad_px / 2;

                if (el.type === ElementType.LABEL) {
                    // 22 items (11 film names + 11 codes) evenly across total_used_mm.
                    // Items alternate: even index → film name, odd index → label_code.
                    const n_labels = 22;
                    const label_interval_mm = total_used_mm / n_labels;
                    cs.fill(el.color);
                    cs.noStroke();
                    cs.textSize(el.height_mm * SCALE_120);
                    cs.textFont(FONTS_CACHE[el.font]);
                    cs.textStyle(el.font_style === 'bold' ? BOLD : NORMAL);
                    cs.textAlign(CENTER, CENTER);
                    for (let i = 0; i < n_labels; i++) {
                        const abs_mm = (i + 0.5) * label_interval_mm;
                        if (abs_mm < film_start_mm || abs_mm >= film_start_mm + col_length_mm) continue;
                        const local_mm  = abs_mm - film_start_mm;
                        const user_code = (document.getElementById('film120Date').value || '').trim();
                        const code_str  = user_code || el.label_code || el.text;
                        const label_str = (i % 2 === 0) ? el.text : code_str;
                        cs.push();
                        cs.translate(cx, padding_px + local_mm * SCALE_120);
                        cs.rotate(HALF_PI);
                        cs.text(label_str, 0, 0);
                        cs.pop();
                    }
                } else if (el.type === ElementType.FRAME_COUNT) {
                    const margin_px = (el.margin_mm || 0) * SCALE_120;
                    cs.fill(el.color);
                    cs.noStroke();
                    cs.textSize(el.height_mm * SCALE_120);
                    cs.textFont(FONTS_CACHE[el.font]);
                    cs.textStyle(el.font_style === 'bold' ? BOLD : NORMAL);
                    cs.textAlign(CENTER, CENTER);
                    for (let m = first_m; m <= last_m; m++) {
                        const marker_mm  = m * marker_interval_mm;
                        const marker_y   = padding_px + (marker_mm - film_start_mm) * SCALE_120;
                        const marker_num = m; // m=1..18 directly
                        cs.push();
                        cs.translate(cx, marker_y + margin_px);
                        cs.rotate(HALF_PI);
                        cs.text(marker_num.toString(), 0, 0);
                        cs.pop();
                    }
                } else if (el.type === ElementType.ARROW) {
                    const ah        = (el.height_mm || 4) * SCALE_120;
                    const aw        = (el.width_mm || 2) * SCALE_120;
                    const margin_px = (el.margin_mm || 0) * SCALE_120;
                    cs.fill(el.color);
                    cs.noStroke();
                    for (let m = first_m; m <= last_m; m++) {
                        const marker_mm = m * marker_interval_mm;
                        const marker_y  = padding_px + (marker_mm - film_start_mm) * SCALE_120;
                        const base_y    = marker_y + margin_px;
                        // ▲ pointing up
                        cs.triangle(cx - aw/2, base_y + ah, cx + aw/2, base_y + ah, cx, base_y);
                    }
                }
            }
        }
    }

    // grain
    const grain_color = color(fp.sprocket_hole_color);
    const cw = Math.round(cs_width), ch = Math.round(cs_height);
    let grain_map = createImage(cw, ch);
    grain_map.loadPixels();
    const N = 4 * cw * ch;
    const gr = red(grain_color), gg = green(grain_color), gb = blue(grain_color);
    for (let i = 0; i < N; i += 4) {
        grain_map.pixels[i] = gr; grain_map.pixels[i+1] = gg;
        grain_map.pixels[i+2] = gb; grain_map.pixels[i+3] = randrange(0, 50);
    }
    grain_map.updatePixels();
    cs.blend(grain_map, 0, 0, cw, ch, 0, 0, cw, ch, ADD);

    return cs;
}

function renderFilmstrip(images, options=DEFAULT_FILMSTRIP_OPTIONS) {

    // Create a new canvas for the filmstrip
    const fs_width = images.length * CYCLE_W + HPADDING_PX;
    const fs_height = SHOT_HEIGHT_PX + 2 * VPADDING_PX;
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
    renderTopElements(fs, film_properties);
    renderBottomElements(fs, film_properties);

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

    // draw sprocket holes
    renderSprocketHoles(fs, film_properties);

    // draw images
    renderImages(fs, images);

    // Respect color vs monochrome
    // if (film_properties.bw) {
    //     fs.filter(GRAY);
    // }


    return fs;
}

function renderContactSheet(filmstrip, num_cols, padding_mm, strip_spacing_mm = 1.5) {
    let padding_px = padding_mm * SCALE;
    let strip_spacing_px = strip_spacing_mm * SCALE;
    let cs_width = num_cols * (SHOT_WIDTH_PX + HPADDING_PX) - HPADDING_PX + 2 * padding_px;
    let cs_height = Math.ceil(images.length / num_cols) * (filmstrip.height + strip_spacing_px) - strip_spacing_px + 2 * padding_px;
    let cs = createGraphics(cs_width, cs_height);

    cs.background(0);
    cs.fill(FILM_BORDER_COLOR);
    cs.noStroke();
    cs.push();
    cs.translate(0, padding_px);
    for (let i = 0, j = 0; i < images.length; i += num_cols, j++) {
        let start_x = padding_px + randrange(0.2, 0.8) * HPADDING_PX;
        let x = j * num_cols * (SHOT_WIDTH_PX + HPADDING_PX) + HPADDING_PX;
        let y = j * (filmstrip.height + strip_spacing_px);
        cs.image(filmstrip, start_x - x, y);
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
    let fs = is120 ? renderFilmstrip120(images) : renderFilmstrip(images);
    let fsimg = document.getElementById('filmstripimg');
    fs.canvas.toBlob(function(blob) {
        let url = URL.createObjectURL(blob);
        fsimg.src = url;
    });
    fsimg.style.display = 'block';

    // draw contact sheet
    let cs;
    if (is120) {
        const shot_width_px = MEDIUM_FORMAT_WIDTHS_MM[fp.medium_format || '6x6'] * SCALE_120;
        const cycle_w = shot_width_px + HPADDING_120_PX;
        const num_cols_120 = { '6x4.5': 4, '6x6': 3, '6x7': 2, '6x9': 2 }[fp.medium_format || '6x6'] || 3;
        cs = renderContactSheet120(fp, num_cols_120, 3);
    } else {
        cs = renderContactSheet(fs, 5, 3);
    }
    fs.remove();
    let csimg = document.getElementById('contactsheetimg');
    cs.canvas.toBlob(function(blob) {
        let url = URL.createObjectURL(blob);
        csimg.src = url;

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