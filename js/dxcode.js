// clock track consiting of 1s and 0s
const CLK_TRACK = [
    1, 1, 1, 1, 1,
    ...(new Array(23).fill(0).map((_, i) => (i) % 2)),
    1, 1, 1
];

/**
 * Calculates the number of exposures based on the given dx code.
 * @param {number} dx - The dx code.
 * @returns {number} - The number of exposures.
 */
function get_num_exp(dx) {
    let exp_code = parseInt(dx % 10);
    if (exp_code === 1) {
        return 12;
    } else if (exp_code === 2) {
        return 20;
    } else if (exp_code === 3) {
        return 24;
    } else if (exp_code === 4) {
        return 36;
    } else if (exp_code === 5) {
        return 48;
    } else if (exp_code === 6) {
        return 60;
    } else if (exp_code === 0) {
        return 72;
    } else {
        return 0;
    }
}

/**
 * Calculates the DX2 value based on the given DX value.
 * @param {number} dx - The DX value.
 * @returns {number} - The calculated DX2 value.
 */
function getDX2(dx) {
    let dx2 = Math.floor(dx / 10);
    return dx2 % 16;
}

/**
 * Calculates the DX1 value based on the given DX value.
 * 
 * @param {number} dx - The DX value.
 * @returns {number} - The calculated DX1 value.
 */
function getDX1(dx) {
    let dx1 = Math.floor(dx / 10);
    return (dx1 - getDX2(dx)) / 16;
}

/**
 * Calculates the parity of three numbers.
 * @param {number} dx1 - The first number.
 * @param {number} dx2 - The second number.
 * @param {number} frameNum - The third number.
 * @returns {number} The parity of the three numbers.
 */
function getParity(dx1, dx2, frameNum) {
    return (dx1 % 2 + dx2 % 2 + frameNum % 2) % 2;
}

/**
 * Creates a data track based on the given dx value and frame number.
 * @param {number} dx - The dx value.
 * @param {number} frameNum - The frame number.
 * @returns {number[]} - The data track array.
 */
function makeDataTrack(dx, frameNum) {
    let dataTrack = new Array(31).fill(0);
    let dx1 = getDX1(dx);
    let dx2 = getDX2(dx);

    // bits [0-5] are alternating
    for (let i = 0; i < 6; i++) {
        dataTrack[i] = (i + 1) % 2;
    }

    // 7 bits of dx1 [6-12]
    for (let i = 0; i < 7; i++) {
        dataTrack[12 - i] = (dx1 >> i) % 2;
    }

    // empty bit [13]
    dataTrack[13] = 0;

    // 4 bits of dx2 [14-17] MSB first
    for (let i = 0; i < 4; i++) {
        dataTrack[17 - i] = (dx2 >> i) % 2;
    }

    // 7 bits of frame number [18-24] MSB first
    // if negative, use 2's complement
    if (frameNum < 0) {
        frameNum = 128 + frameNum;
    }
    for (let i = 0; i < 7; i++) {
        dataTrack[24 - i] = (frameNum >> i) % 2;
    }

    // empty
    dataTrack[25] = 0;

    // 1 bit of parity
    dataTrack[26] = getParity(dx1, dx2, frameNum);

    // 4 bits of stop bits
    for (let i = 0; i < 4; i++) {
        dataTrack[i + 27] = i % 2;
    }

    return dataTrack;
}

/**
 * Draws a DX code image based on the given DX code and frame number.
 * @param {string} dx - The DX code.
 * @param {number} frameNum - The frame number.
 * @returns {p5.Graphics} - The DX code image.
 */
function drawDX(dx, frameNum, color, debug=false) {

    // process dx code (last 5 digits)
    dx = parseInt(dx) % 100000;

    let bit_width = 2;
    let bit_height = 5;

    let dxImage = createGraphics(bit_width * 31, bit_height * 2);
    dxImage.noStroke();
    dxImage.background(0);
    dxImage.fill(color);

    dxImage.noStroke();

    // draw clock track
    for (let i = 0; i < 31; i++) {
        if (CLK_TRACK[i] === 1) {
            dxImage.rect(i * bit_width, 0, bit_width, bit_height);
        }

    }

    // draw data track
    let dataTrack = makeDataTrack(dx, frameNum);
    for (let i = 0; i < 31; i++) {
        if (dataTrack[i] === 1) {
            dxImage.rect(i * bit_width, bit_height, bit_width, bit_height);
        }
    }

    // debug
    // dxImage.fill(255);
    // dxImage.textSize(5);
    // dxImage.textAlign(LEFT, TOP);
    // dxImage.text("DX:" + dx + " F#:" + frameNum, 0, 0);

    return dxImage
}

// ── KeyCode (MR. CODE) barcode — Interleaved 2-of-5 (ITF) ────────────────────
// Spec: ISO 4909 / SMPTE KeyCode. Encodes 10 digits using ITF.
// Bars at even indices, spaces at odd indices (both drawn from element widths).
const _ITF_ENC = [
    [1,1,3,3,1], // 0: NNWWN
    [3,1,1,1,3], // 1: WNNNW
    [1,3,1,1,3], // 2: NWNNW
    [3,3,1,1,1], // 3: WWNNN
    [1,1,3,1,3], // 4: NNWNW
    [3,1,3,1,1], // 5: WNWNN
    [1,3,3,1,1], // 6: NWWNN
    [1,1,1,3,3], // 7: NNNWW
    [3,1,1,3,1], // 8: WNNWN
    [1,3,1,3,1], // 9: NWNWN
];

/**
 * Draws a KeyCode barcode (Interleaved 2-of-5) for cinema film.
 * Encodes: roll(4) + key_feet(4) + perf_offset(2) = 10 digits.
 * @param {number} key_feet - Key number in feet.
 * @param {number} perf_offset - Perforation offset (0–60, increments of 4).
 * @param {number} roll - Roll number (4 digits).
 * @param {string} color - Bar color.
 * @returns {p5.Graphics}
 */
function drawKeyCodeBarcode(key_feet, perf_offset, roll, color) {
    const N = 6, W = 15;  // narrow and wide bar widths in px
    const h = 9;

    const digits = (
        String(roll % 10000).padStart(4, '0') +
        String(key_feet % 10000).padStart(4, '0') +
        String(perf_offset % 100).padStart(2, '0')
    ).split('').map(Number);

    // Build element array: [bar, space, bar, space, ...]
    const elems = [N, N, N, N]; // start guard: bar, space, bar, space
    for (let i = 0; i < digits.length; i += 2) {
        const b = _ITF_ENC[digits[i]];
        const s = _ITF_ENC[digits[i + 1]];
        for (let j = 0; j < 5; j++) {
            elems.push(b[j] === 1 ? N : W); // bar
            elems.push(s[j] === 1 ? N : W); // space
        }
    }
    elems.push(W, N, N); // stop guard: wide bar, narrow space, narrow bar

    const totalWidth = elems.reduce((a, b) => a + b, 0);
    const bc = createGraphics(totalWidth, h);
    bc.background(0, 0);
    bc.noStroke();
    bc.fill(color);

    let x = 0;
    for (let i = 0; i < elems.length; i++) {
        const w = elems[i];
        if (i % 2 === 0) bc.rect(x, 0, w, h); // bars only
        x += w;
    }
    return bc;
}
