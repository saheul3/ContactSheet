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

    // draw filmstrip
    let fs = renderFilmstrip(images);
    let fsimg = document.getElementById('filmstripimg');
    fs.canvas.toBlob(function(blob) {
        let url = URL.createObjectURL(blob);
        fsimg.src = url;

        // to make preview downloadable
        // fsimg.onload = function() {
        //     URL.revokeObjectURL(url);
        // };
    });
    fs.remove();
    fsimg.style.display = 'block';

    // draw contact sheet
    let cs = renderContactSheet(fs, 5, 3);
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