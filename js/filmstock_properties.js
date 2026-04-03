// various physical film properties

// this is the preview height in pixels
const PREVIEW_HEIGHT = 600;
const FINAL_HEIGHT = 200;

// 120 film output resolution: 12 px/mm ≈ 305 DPI.
// Defined as the rendered pixel height of the full 60mm film width
// (56mm image + 2mm edge top + 2mm edge bottom).
const FINAL_HEIGHT_120 = 720;

// physical film dimensions in mm
const SHOT_WIDTH_MM = 36;
const SHOT_HEIGHT_MM = 24;
const HPADDING_MM = 1.8;
const VPADDING_MM = 5.5;

const SPROCKET_HOLE_WIDTH_MM = 1.981;
const SPROCKET_HOLE_SPACING_WIDTH_MM = 2.7688;
const SPROCKET_HOLE_HEIGHT_MM = 2.794;
const SPROCKET_HOLE_MARGIN_MM = 2.0185;
const SPROCKET_HOLE_ROUNDING_MM = 0.5;

let SPROKET_HOLE_COLOR = "#000";
let SPROKET_HOLE_STROKE_COLOR = "#444";

let FILM_BORDER_COLOR = "#ccc";

// based on preview height, calculate the scale factor mm -> px
const SCALE = FINAL_HEIGHT / SHOT_HEIGHT_MM;

// calculate the remaining dimensions in px
const SHOT_WIDTH_PX = SHOT_WIDTH_MM * SCALE;
const SHOT_HEIGHT_PX = SHOT_HEIGHT_MM * SCALE;
const HPADDING_PX = HPADDING_MM * SCALE;
const VPADDING_PX = VPADDING_MM * SCALE;
const SPROCKET_HOLE_WIDTH_PX = SPROCKET_HOLE_WIDTH_MM * SCALE;
const SPROCKET_HOLE_SPACING_WIDTH_PX = SPROCKET_HOLE_SPACING_WIDTH_MM * SCALE;
const SPROCKET_HOLE_HEIGHT_PX = SPROCKET_HOLE_HEIGHT_MM * SCALE;
const SPROCKET_HOLE_MARGIN_PX = SPROCKET_HOLE_MARGIN_MM * SCALE;
const SPROCKET_HOLE_ROUNDING_PX = SPROCKET_HOLE_ROUNDING_MM * SCALE;

// For convenience
const CYCLE_W = SHOT_WIDTH_PX + HPADDING_PX;


class FilmStock {
    constructor(name, top_line, top_line_interval_mm, top_line_follow_frame, top_line_text_size_mm, top_line_margin_mm) {
        this.name = name;
        this.top_line = top_line;
        this.top_line_interval_mm = top_line_interval_mm;
        this.top_line_follow_frame = top_line_follow_frame;
        this.top_line_text_size_mm = top_line_text_size_mm;
        this.top_line_margin_mm = top_line_margin_mm;
    }
}


// Enum for types of elements
const ElementType = {
    FRAME_COUNT: 'frame count',
    FRAME_COUNT_ALT: 'frame count alt',
    LABEL: 'label',
    ARROW: 'arrow',
    DX: 'dx',
    IMAGE: 'image',
};

const RepeatType = {
    NONE: 'none',
    FRAME: 'frame',
    DISTANCE: 'distance'
};

// 120 medium format frame widths in mm (along the film direction)
// Per-frame pitch along the film (image height + 2mm edge top + 2mm edge bottom).
// e.g. 6x6: 56mm image + 4mm edges = 60mm pitch.
const MEDIUM_FORMAT_WIDTHS_MM = {
    '6x4.5': 46,   // 42 + 4
    '6x6':   60,   // 56 + 4
    '6x7':   73.5, // 69.5 + 4
    '6x9':   88,   // 84 + 4
};

// create a dictionary of film stock properties
const FILM = {
    'fuji-400': {
        'name': 'Fujifilm 400',
        'icon': 'fuji400_icon.png',
        'enabled': true,
        'active': true,
        // 'dx_code': '906284', // stupid code
        'dx_code': '015270',
        'start_frame': -1,
        'top_elements': [
            {
                'type': ElementType.LABEL,
                'text': 'FUJI',
                'font': FONTS.sans,
                'font_style': 'bold',
                'color': '#dcaf7b',
                'height_mm': 1.4,
                'margin_mm': 0.35,
                'repeat': RepeatType.FRAME,
                'offset': 0.6,
            },
            {
                'type': ElementType.LABEL,
                'text': '400',
                'font': FONTS.sans,
                'color': '#dcaf7b',
                'height_mm': 1.4,
                'margin_mm': 0.35,
                'repeat': RepeatType.FRAME,
                'offset': 0.71,
            },
            {
                'type': ElementType.FRAME_COUNT,
                'font': FONTS.sans,
                'color': '#dcaf7b',
                'height_mm': 1.4,
                'margin_mm': 0.35,
                'repeat': RepeatType.FRAME,
                'offset': 0.4,
            },
            {
                'type': ElementType.IMAGE,
                'src': 'assets/fuji_batch_label.jpg',
                'tint': '#c02527',
                // 'height_mm': 1.5,
                // 'width_mm': 14.45,
                // 'margin_mm': 0.56,
                'height_mm': 2.1,
                'width_mm': 20.2,
                'margin_mm': 0.1,
                'repeat': RepeatType.NONE,
                'offset': 3,
            }
        ],
        'bottom_elements': [
            {
                'type': ElementType.FRAME_COUNT,
                'font': FONTS.sans,
                'color': '#dcaf7b',
                'height_mm': 1.65,
                'margin_mm': 0.15,
                'repeat': RepeatType.FRAME,
                'offset': 0.4,
            },
            {
                'type': ElementType.FRAME_COUNT_ALT,
                'font': FONTS.sans,
                'color': '#dcaf7b',
                'height_mm': 1.1,
                'margin_mm': 0.73,
                'repeat': RepeatType.FRAME,
                'offset': 0.9,
            },
            {
                'type': ElementType.ARROW,
                'color': '#dcaf7b',

                //      |\   arrow pointing to the right
                //  |===+ >  + is the origin
                //      |/

                'margin_mm': 0.32,
                'offset': 0.882,

                'head_width_mm': 1.43,
                'head_height_mm': 0.55,
                
                'has_tail': true,
                'tail_width_mm': 2.34,
                'tail_height_mm': 0.2,
            },
            {
                'type': ElementType.DX,
                'color': '#dcaf7b',
                'height_mm': 2.2,
                'width_mm': 12.65,
                'repeat': RepeatType.FRAME,
                'offset': -0.06,
            }
        ],
        'sprocket_hole_color': '#b49342',
    },
    'ilf-hp5-400': {
        'name': 'Ilford HP5 400',
        'icon': 'ilfordhp5plus400_icon.png',
        'enabled': true,
        'dx_code': '017534',
        'bw': true,
        'start_frame': -1,
        'top_elements': [
            {
                'type': ElementType.LABEL,
                'text': 'ILFORD HP5 PLUS',
                'font': FONTS.vcd,
                'color': '#eee',
                'height_mm': 2.2,
                'margin_mm': 0.0,
                'repeat': RepeatType.FRAME,
                'offset': 0.2,
            },
            {
                'type': ElementType.LABEL,
                'text': '5621',
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 1.6,
                'margin_mm': 0.2,
                'repeat': RepeatType.FRAME,
                'every': 3,
                'offset': 0.8,
            },
            {
                'type': ElementType.LABEL,
                'text': '-11',
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 1.2,
                'margin_mm': 0.57,
                'repeat': RepeatType.FRAME,
                'every': 3,
                'offset': 0.903,
            },
        ],
        'bottom_elements': [
            {
                'type': ElementType.FRAME_COUNT,
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 2.5,
                'margin_mm': -0.15,
                'repeat': RepeatType.FRAME,
                'offset': 0.365,
            },
            {
                'type': ElementType.FRAME_COUNT_ALT,
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 1.6,
                'margin_mm': 0.2,
                'repeat': RepeatType.FRAME,
                'offset': 0.89,
            },
            {
                'type': ElementType.ARROW,
                'color': '#eee',

                'margin_mm': 0.72,
                'offset': 0.81,

                'head_width_mm': 1.45,
                'head_height_mm': 0.99,
            },
            {
                'type': ElementType.DX,
                'color': '#eee',
                'height_mm': 2.2,
                'width_mm': 13,
                'repeat': RepeatType.FRAME,
                'offset': -0.06,
            }
        ],
        'sprocket_hole_color': '#888',
    },
    'kentmere-400': {
        'name': 'Kentmere 400',
        'icon': 'kentmerepan400_icon.png',
        'enabled': true,
        'dx_code': '017704',
        'bw': true,
        'start_frame': -1,
        'top_elements': [
            {
                'type': ElementType.LABEL,
                'text': 'K 400',
                'font': FONTS.vcd,
                'color': '#eee',
                'height_mm': 2.2,
                'margin_mm': 0.0,
                'repeat': RepeatType.FRAME,
                'offset': 0.1,
            },
            {
                'type': ElementType.LABEL,
                'text': '5565',
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 1.6,
                'margin_mm': 0.2,
                'repeat': RepeatType.FRAME,
                'every': 3,
                'offset': 0.8,
            },
            {
                'type': ElementType.LABEL,
                'text': '-11',
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 1.2,
                'margin_mm': 0.57,
                'repeat': RepeatType.FRAME,
                'every': 3,
                'offset': 0.903,
            },
        ],
        'bottom_elements': [
            {
                'type': ElementType.FRAME_COUNT,
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 2.5,
                'margin_mm': -0.15,
                'repeat': RepeatType.FRAME,
                'offset': 0.365,
            },
            {
                'type': ElementType.FRAME_COUNT_ALT,
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 1.6,
                'margin_mm': 0.2,
                'repeat': RepeatType.FRAME,
                'offset': 0.89,
            },
            {
                'type': ElementType.ARROW,
                'color': '#eee',

                'margin_mm': 0.72,
                'offset': 0.81,

                'head_width_mm': 1.45,
                'head_height_mm': 0.99,
            }
        ],
        'sprocket_hole_color': '#888',
    },
    'kentmere-100': {
        'name': 'Kentmere 100',
        'icon': 'kentmerepan100_icon.png',
        'enabled': true,
        'dx_code': '017702',
        'bw': true,
        'start_frame': -1,
        'top_elements': [
            {
                'type': ElementType.LABEL,
                'text': 'K 100',
                'font': FONTS.vcd,
                'color': '#eee',
                'height_mm': 2.2,
                'margin_mm': 0.0,
                'repeat': RepeatType.FRAME,
                'offset': 0.1,
            },
            {
                'type': ElementType.LABEL,
                'text': '5565',
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 1.6,
                'margin_mm': 0.2,
                'repeat': RepeatType.FRAME,
                'every': 3,
                'offset': 0.8,
            },
            {
                'type': ElementType.LABEL,
                'text': '-11',
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 1.2,
                'margin_mm': 0.57,
                'repeat': RepeatType.FRAME,
                'every': 3,
                'offset': 0.903,
            },
        ],
        'bottom_elements': [
            {
                'type': ElementType.FRAME_COUNT,
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 2.5,
                'margin_mm': -0.15,
                'repeat': RepeatType.FRAME,
                'offset': 0.365,
            },
            {
                'type': ElementType.FRAME_COUNT_ALT,
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 1.6,
                'margin_mm': 0.2,
                'repeat': RepeatType.FRAME,
                'offset': 0.89,
            },
            {
                'type': ElementType.ARROW,
                'color': '#eee',

                'margin_mm': 0.72,
                'offset': 0.81,

                'head_width_mm': 1.45,
                'head_height_mm': 0.99,
            }
        ],
        'sprocket_hole_color': '#888',
    },
    'ilf-sfx-200': {
        'name': 'Ilford SFX 200',
        'icon': 'ilfordsfx200_icon.png',
        'enabled': true,
        'dx_code': '017354',
        'bw': true,
        'start_frame': -1,
        'top_elements': [
            {
                'type': ElementType.LABEL,
                'text': 'ILFORD SFX 200',
                'font': FONTS.vcd,
                'color': '#eee',
                'height_mm': 2.2,
                'margin_mm': 0.0,
                'repeat': RepeatType.FRAME,
                'offset': 0.2,
            },
            {
                'type': ElementType.LABEL,
                'text': '5120',
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 1.6,
                'margin_mm': 0.2,
                'repeat': RepeatType.FRAME,
                'every': 3,
                'offset': 0.8,
            },
            {
                'type': ElementType.LABEL,
                'text': '-12',
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 1.2,
                'margin_mm': 0.57,
                'repeat': RepeatType.FRAME,
                'every': 3,
                'offset': 0.903,
            },
        ],
        'bottom_elements': [
            {
                'type': ElementType.FRAME_COUNT,
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 2.5,
                'margin_mm': -0.15,
                'repeat': RepeatType.FRAME,
                'offset': 0.365,
            },
            {
                'type': ElementType.FRAME_COUNT_ALT,
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 1.6,
                'margin_mm': 0.2,
                'repeat': RepeatType.FRAME,
                'offset': 0.89,
            },
            {
                'type': ElementType.ARROW,
                'color': '#eee',

                'margin_mm': 0.72,
                'offset': 0.81,

                'head_width_mm': 1.45,
                'head_height_mm': 0.99,
            },
            {
                'type': ElementType.DX,
                'color': '#eee',
                'height_mm': 2.2,
                'width_mm': 13,
                'repeat': RepeatType.FRAME,
                'offset': -0.06,
            }
        ],
        'sprocket_hole_color': '#888',
    },
    'ilf-delta-400': {
        'name': 'Ilford Delta 400',
        'icon': 'ilforddelta400_icon.png',
        'enabled': true,
        'dx_code': '017523',
        'bw': true,
        'start_frame': -1,
        'top_elements': [
            {
                'type': ElementType.LABEL,
                'text': 'DELTA 400    PROFESSIONAL',
                'font': FONTS.vcd,
                'color': '#eee',
                'height_mm': 2.2,
                'margin_mm': 0.0,
                'repeat': RepeatType.FRAME,
                'every': 3,
                'offset': 1.4,
            },
            {
                'type': ElementType.LABEL,
                'text': 'ILFORD',
                'font': FONTS.vcd,
                'color': '#eee',
                'height_mm': 2.2,
                'margin_mm': 0.0,
                'repeat': RepeatType.FRAME,
                'every': 3,
                'offset': 0.2,
            },
            {
                'type': ElementType.LABEL,
                'text': '5375',
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 1.6,
                'margin_mm': 0.2,
                'repeat': RepeatType.FRAME,
                'every': 3,
                'offset': 0.8,
            },
            {
                'type': ElementType.LABEL,
                'text': '-12',
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 1.2,
                'margin_mm': 0.57,
                'repeat': RepeatType.FRAME,
                'every': 3,
                'offset': 0.903,
            },
        ],
        'bottom_elements': [
            {
                'type': ElementType.FRAME_COUNT,
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 2.5,
                'margin_mm': -0.15,
                'repeat': RepeatType.FRAME,
                'offset': 0.365,
            },
            {
                'type': ElementType.FRAME_COUNT_ALT,
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 1.6,
                'margin_mm': 0.2,
                'repeat': RepeatType.FRAME,
                'offset': 0.89,
            },
            {
                'type': ElementType.ARROW,
                'color': '#eee',

                'margin_mm': 0.72,
                'offset': 0.81,

                'head_width_mm': 1.45,
                'head_height_mm': 0.99,
            },
            {
                'type': ElementType.DX,
                'color': '#eee',
                'height_mm': 2.2,
                'width_mm': 13,
                'repeat': RepeatType.FRAME,
                'offset': -0.06,
            }
        ],
        'sprocket_hole_color': '#888',
    },
    'ilf-delta-3200': {
        'name': 'Ilford Delta 3200',
        'icon': 'unknown_roll_icon.png',
        'enabled': false,
        'dx_code': -1,
    },
    'ilf-delta-100': {
        'name': 'Ilford Delta 100',
        'icon': 'unknown_roll_icon.png',
        'enabled': false,
        'dx_code': -1,
        'bw': true,
    },
    'ilf-fp4-125': {
        'name': 'Ilford FP4 125',
        'icon': 'unknown_roll_icon.png',
        'enabled': false,
        'dx_code': -1,
        'bw': true,
    },
    'ilf-panf-50': {
        'name': 'Ilford Pan F 50',
        'icon': 'unknown_roll_icon.png',
        'enabled': false,
        'dx_code': -1,
        'bw': true,
    },
    'kodak-ultra-400': {
        'name': 'Kodak GC 400',
        'icon': 'kodakultra400_icon.png',
        'enabled': true,
        'dx_code': '915373',
        'start_frame': -1,
        'top_elements': [
            {
                'type': ElementType.LABEL,
                'text': 'KODAK',
                'font': FONTS.black,
                'color': '#dcaf7b',
                'height_mm': 1.62,
                'margin_mm': 0.0,
                'repeat': RepeatType.FRAME,
                'every': 2,
                'offset': -0.386,
            },
            {
                'type': ElementType.LABEL,
                'text': 'GC 400',
                'font': FONTS.sans,
                'font_style': 'bold',
                'color': '#dcaf7b',
                'height_mm': 1.6,
                'margin_mm': 0.2,
                'repeat': RepeatType.FRAME,
                'every': 2,
                'offset': -0.18,
            },
            {
                'type': ElementType.LABEL,
                'text': 'KODAK',
                'font': FONTS.black,
                'font_style': 'bold',
                'color': '#dcaf7b',
                'height_mm': 1.62,
                'margin_mm': 0.0,
                'repeat': RepeatType.FRAME,
                'every': 2,
                'offset': 0.81,
            },
            {
                'type': ElementType.LABEL,
                'text': 'GC 400',
                'font': FONTS.sans,
                'font_style': 'bold',
                'color': '#dcaf7b',
                'height_mm': 1.6,
                'margin_mm': 0.2,
                'repeat': RepeatType.FRAME,
                'every': 2,
                'offset': 0.63,
            },
            {
                'type': ElementType.FRAME_COUNT,
                'font': FONTS.black,
                'color': '#dcaf7b',
                'height_mm': 1.62,
                'margin_mm': 0.0,
                'repeat': RepeatType.FRAME,
                'offset': 0.4,
            },
        ],
        'bottom_elements': [
            {
                'type': ElementType.FRAME_COUNT,
                'font': FONTS.black,
                'color': '#dcaf7b',
                'height_mm': 2.0,
                'margin_mm': -0.35,
                'repeat': RepeatType.FRAME,
                'offset': 0.4,
            },
            {
                'type': ElementType.FRAME_COUNT_ALT,
                'font': FONTS.black,
                'color': '#dcaf7b',
                'height_mm': 1.2,
                'margin_mm': 0.55,
                'repeat': RepeatType.FRAME,
                'offset': 0.9,
            },
            {
                'type': ElementType.ARROW,
                'color': '#dcaf7b',

                'margin_mm': 0.32,
                'offset': 0.882,

                'head_width_mm': 1.43,
                'head_height_mm': 0.55,
                
                'has_tail': true,
                'tail_width_mm': 2.34,
                'tail_height_mm': 0.2,
            },
            {
                'type': ElementType.DX,
                'color': '#dcaf7b',
                'height_mm': 2.2,
                'width_mm': 12.65,
                'repeat': RepeatType.FRAME,
                'offset': -0.06,
            }
        ],
        'sprocket_hole_color': '#b49342',
    },
    'kodak-portra-400': {
        'name': 'Kodak Portra 400',
        'icon': 'unknown_roll_icon.png',
        'enabled': false,
        'dx_code': -1,
    },
    'kodak-portra-160': {
        'name': 'Kodak Portra 160',
        'icon': 'unknown_roll_icon.png',
        'enabled': false,
        'dx_code': -1,
    },
    'kodak-tmax-400': {
        'name': 'Kodak T-Max 400',
        'icon': 'unknown_roll_icon.png',
        'enabled': true,
        'dx_code': "310803",
        'top_elements': [
            {
                'type': ElementType.LABEL,
                'text': 'KODAK',
                'font': FONTS.black,
                'color': '#eee',
                'height_mm': 1.62,
                'margin_mm': 0.0,
                'repeat': RepeatType.FRAME,
                'offset': -0.386,
            },
            {
                'type': ElementType.LABEL,
                'text': '400-2TMY',
                'font': FONTS.sans,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 1.6,
                'margin_mm': 0.2,
                'repeat': RepeatType.FRAME,
                'offset': -0.18,
            },
            // {
            //     'type': ElementType.LABEL,
            //     'text': 'KODAK',
            //     'font': FONTS.black,
            //     'font_style': 'bold',
            //     'color': '#eee',
            //     'height_mm': 1.62,
            //     'margin_mm': 0.0,
            //     'repeat': RepeatType.FRAME,
            //     'every': 2,
            //     'offset': 0.81,
            // },
            // {
            //     'type': ElementType.LABEL,
            //     'text': 'GC 400',
            //     'font': FONTS.sans,
            //     'font_style': 'bold',
            //     'color': '#dcaf7b',
            //     'height_mm': 1.6,
            //     'margin_mm': 0.2,
            //     'repeat': RepeatType.FRAME,
            //     'every': 2,
            //     'offset': 0.63,
            // },
            {
                'type': ElementType.FRAME_COUNT,
                'font': FONTS.black,
                'color': '#eee',
                'height_mm': 1.62,
                'margin_mm': 0.0,
                'repeat': RepeatType.FRAME,
                'offset': 0.4,
            },
        ],
        'bottom_elements': [
            {
                'type': ElementType.FRAME_COUNT,
                'font': FONTS.black,
                'color': '#eee',
                'height_mm': 2.0,
                'margin_mm': -0.35,
                'repeat': RepeatType.FRAME,
                'offset': 0.4,
            },
            {
                'type': ElementType.FRAME_COUNT_ALT,
                'font': FONTS.black,
                'color': '#eee',
                'height_mm': 1.2,
                'margin_mm': 0.55,
                'repeat': RepeatType.FRAME,
                'offset': 0.875,
            },
            {
                'type': ElementType.ARROW,
                'color': '#eee',

                'margin_mm': 0.32,
                'offset': 0.882,

                'head_width_mm': 1.43,
                'head_height_mm': 0.55,
                
                'has_tail': true,
                'tail_width_mm': 2.34,
                'tail_height_mm': 0.2,
            }
        ],
        'sprocket_hole_color': '#888',
    },
    'kodak-tmax-3200': {
        'name': 'Kodak T-Max 3200',
        'icon': 'unknown_roll_icon.png',
        'enabled': false,
        'dx_code': -1,
    },
    'kodak-tmax-100': {
        'name': 'Kodak T-Max 100',
        'icon': 'unknown_roll_icon.png',
        'enabled': false,
        'dx_code': -1,
    },
    'kodak-trix-400': {
        'name': 'Kodak Tri-X 400',
        'icon': 'unknown_roll_icon.png',
        'enabled': false,
        'dx_code': -1,
    },
    'kodak-ektar-100': {
        'name': 'Kodak Ektar 100',
        'icon': 'unknown_roll_icon.png',
        'enabled': false,
        'dx_code': -1,
    },
    'kodak-gold-200': {
        'name': 'Kodak GB 200',
        'icon': 'unknown_roll_icon.png',
        'enabled': true,
        'dx_code': '512504',
        'start_frame': -1,
        'top_elements': [
            {
                'type': ElementType.LABEL,
                'text': 'KODAK',
                'font': FONTS.black,
                'color': '#dcaf7b',
                'height_mm': 1.62,
                'margin_mm': 0.0,
                'repeat': RepeatType.FRAME,
                'every': 2,
                'offset': -0.386,
            },
            {
                'type': ElementType.LABEL,
                'text': 'GB 200-7',
                'font': FONTS.sans,
                'font_style': 'bold',
                'color': '#dcaf7b',
                'height_mm': 1.6,
                'margin_mm': 0.2,
                'repeat': RepeatType.FRAME,
                'every': 2,
                'offset': -0.18,
            },
            {
                'type': ElementType.LABEL,
                'text': 'KODAK',
                'font': FONTS.black,
                'font_style': 'bold',
                'color': '#dcaf7b',
                'height_mm': 1.62,
                'margin_mm': 0.0,
                'repeat': RepeatType.FRAME,
                'every': 2,
                'offset': 0.81,
            },
            {
                'type': ElementType.LABEL,
                'text': 'GB 200-7',
                'font': FONTS.sans,
                'font_style': 'bold',
                'color': '#dcaf7b',
                'height_mm': 1.6,
                'margin_mm': 0.2,
                'repeat': RepeatType.FRAME,
                'every': 2,
                'offset': 0.6,
            },
            {
                'type': ElementType.FRAME_COUNT,
                'font': FONTS.black,
                'color': '#dcaf7b',
                'height_mm': 1.62,
                'margin_mm': 0.0,
                'repeat': RepeatType.FRAME,
                'offset': 0.4,
            },
            // {
            //     'type': ElementType.IMAGE,
            //     'src': 'assets/fuji_batch_label.jpg',
            //     'tint': '#c02527',
            //     // 'height_mm': 1.5,
            //     // 'width_mm': 14.45,
            //     // 'margin_mm': 0.56,
            //     'height_mm': 2.1,
            //     'width_mm': 20.2,
            //     'margin_mm': 0.1,
            //     'repeat': RepeatType.NONE,
            //     'offset': 3,
            // }
        ],
        'bottom_elements': [
            {
                'type': ElementType.FRAME_COUNT,
                'font': FONTS.black,
                'color': '#dcaf7b',
                'height_mm': 2.0,
                'margin_mm': -0.35,
                'repeat': RepeatType.FRAME,
                'offset': 0.4,
            },
            {
                'type': ElementType.FRAME_COUNT_ALT,
                'font': FONTS.black,
                'color': '#dcaf7b',
                'height_mm': 1.2,
                'margin_mm': 0.55,
                'repeat': RepeatType.FRAME,
                'offset': 0.9,
            },
            {
                'type': ElementType.ARROW,
                'color': '#dcaf7b',

                //      |\   arrow pointing to the right
                //  |===+ >  + is the origin
                //      |/

                'margin_mm': 0.32,
                'offset': 0.882,

                'head_width_mm': 1.43,
                'head_height_mm': 0.55,
                
                'has_tail': true,
                'tail_width_mm': 2.34,
                'tail_height_mm': 0.2,
            },
            {
                'type': ElementType.DX,
                'color': '#dcaf7b',
                'height_mm': 2.2,
                'width_mm': 12.65,
                'repeat': RepeatType.FRAME,
                'offset': -0.06,
            }
        ],
        'sprocket_hole_color': '#b49342',
    },
    'kodak-colorplus-200': {
        'name': 'Kodak ColorPlus 200',
        'icon': 'unknown_roll_icon.png',
        'enabled': false,
        'dx_code': -1,
    },
    'kodak-proimage-100': {
        'name': 'Kodak ProImage 100',
        'icon': 'unknown_roll_icon.png',
        'enabled': false,
        'dx_code': '512574',
    },
    'rollei-retro-400s': {
        'name': 'Rollei Retro 400s',
        'icon': 'unknown_roll_icon.png',
        'enabled': false,
        'dx_code': '854011',
    },
    'kodak-vision3-500t': {
        'name': 'Kodak Vision3 500T',
        'icon': 'kodakvision3500t_icon.png',
        'enabled': true,
        'dx_code': -1,
        'start_frame': 1,
        // Top edge: manufacturing info sequence (VCD_OSD_MONO, one field per frame, repeating every 8)
        // Based on: — EASTMAN   5219   021   2301   23   174   2022   —   -
        'top_elements': [
            { 'type': ElementType.LABEL, 'text': '\u2014EASTMAN', 'font': FONTS.vcd, 'color': '#e8621a', 'height_mm': 1.1, 'margin_mm': 0.25, 'repeat': RepeatType.FRAME, 'every': 8, 'offset': 0.0 },
            { 'type': ElementType.LABEL, 'text': '5219',         'font': FONTS.vcd, 'color': '#e8621a', 'height_mm': 1.1, 'margin_mm': 0.25, 'repeat': RepeatType.FRAME, 'every': 8, 'offset': 1.0 },
            { 'type': ElementType.LABEL, 'text': '021',          'font': FONTS.vcd, 'color': '#e8621a', 'height_mm': 1.1, 'margin_mm': 0.25, 'repeat': RepeatType.FRAME, 'every': 8, 'offset': 2.0 },
            { 'type': ElementType.LABEL, 'text': '2301',         'font': FONTS.vcd, 'color': '#e8621a', 'height_mm': 1.1, 'margin_mm': 0.25, 'repeat': RepeatType.FRAME, 'every': 8, 'offset': 3.0 },
            { 'type': ElementType.LABEL, 'text': '23',           'font': FONTS.vcd, 'color': '#e8621a', 'height_mm': 1.1, 'margin_mm': 0.25, 'repeat': RepeatType.FRAME, 'every': 8, 'offset': 4.0 },
            { 'type': ElementType.LABEL, 'text': '174',          'font': FONTS.vcd, 'color': '#e8621a', 'height_mm': 1.1, 'margin_mm': 0.25, 'repeat': RepeatType.FRAME, 'every': 8, 'offset': 5.0 },
            { 'type': ElementType.LABEL, 'text': '2022',         'font': FONTS.vcd, 'color': '#e8621a', 'height_mm': 1.1, 'margin_mm': 0.25, 'repeat': RepeatType.FRAME, 'every': 8, 'offset': 6.0 },
            { 'type': ElementType.LABEL, 'text': '\u2014',       'font': FONTS.vcd, 'color': '#e8621a', 'height_mm': 1.1, 'margin_mm': 0.25, 'repeat': RepeatType.FRAME, 'every': 8, 'offset': 7.2 },
        ],
        // Bottom edge: KeyCode format (EN 19 [batch] [keynum]+[offset] •) + film name
        // Based on: EN 05 9635 6613+32 •   [barcode]   VISION3 500T  5219
        'bottom_elements': [
            // KeyCode prefix: KK 19 [batch]   (every 8 frames)
            { 'type': ElementType.LABEL, 'text': 'KK 19  9635', 'font': FONTS.vcd, 'color': '#e8621a', 'height_mm': 1.0, 'margin_mm': 0.5, 'repeat': RepeatType.FRAME, 'every': 8, 'offset': 0.0 },
            // Frame key number (increments per frame)
            { 'type': ElementType.FRAME_COUNT, 'font': FONTS.vcd, 'color': '#e8621a', 'height_mm': 1.0, 'margin_mm': 0.5, 'repeat': RepeatType.FRAME, 'offset': 2.2 },
            // Zero-frame reference mark •
            { 'type': ElementType.LABEL, 'text': '+32 \u2022', 'font': FONTS.vcd, 'color': '#e8621a', 'height_mm': 1.0, 'margin_mm': 0.5, 'repeat': RepeatType.FRAME, 'every': 8, 'offset': 3.0 },
            // Film name + density patch (every 8 frames, offset 4)
            { 'type': ElementType.LABEL, 'text': 'VISION3 500T  5219', 'font': FONTS.vcd, 'color': '#e8621a', 'height_mm': 1.0, 'margin_mm': 0.5, 'repeat': RepeatType.FRAME, 'every': 8, 'offset': 4.0 },
            // Arrow (film direction)
            {
                'type': ElementType.ARROW,
                'color': '#e8621a',
                'margin_mm': 0.32,
                'offset': 0.882,
                'head_width_mm': 1.43,
                'head_height_mm': 0.55,
                'has_tail': true,
                'tail_width_mm': 2.34,
                'tail_height_mm': 0.2,
            },
        ],
        'sprocket_hole_color': '#c24a10',
    },
    'kodak-portra-400-120': {
        'name': 'Kodak Portra 400',
        'icon': 'kodakportra400_120_icon.png',
        'enabled': true,
        'format': '120',
        'medium_format': '6x6',
        'dx_code': -1,
        'start_frame': 1,
        'side_elements': [
            {
                'type': ElementType.LABEL,
                'text': 'KODAK PORTRA 400',
                'label_code': 'EI 400',
                'side': 'left',
                'font': FONTS.sans,
                'font_style': 'bold',
                'color': '#dcaf7b',
                'height_mm': 1.5,
                'repeat': RepeatType.FRAME,
            },
            {
                'type': ElementType.FRAME_COUNT,
                'side': 'right',
                'font': FONTS.sans,
                'color': '#dcaf7b',
                'height_mm': 1.4,
                'margin_mm': 0.5,
                'repeat': RepeatType.FRAME,
            },
            {
                'type': ElementType.ARROW,
                'side': 'right',
                'color': '#dcaf7b',
                'height_mm': 3.5,
                'width_mm': 1.5,
                'margin_mm': 2.0,
                'repeat': RepeatType.FRAME,
            },
        ],
        'sprocket_hole_color': '#b49342',
    },
    'ilf-hp5-400-120': {
        'name': 'Ilford HP5 400',
        'icon': 'ilfordhp5plus400_120_icon.png',
        'enabled': true,
        'format': '120',
        'medium_format': '6x6',
        'dx_code': -1,
        'bw': true,
        'start_frame': 1,
        'side_elements': [
            {
                'type': ElementType.LABEL,
                'text': 'ILFORD HP5 PLUS',
                'label_code': '400',
                'side': 'left',
                'font': FONTS.vcd,
                'color': '#eee',
                'height_mm': 1.5,
                'repeat': RepeatType.FRAME,
            },
            {
                'type': ElementType.FRAME_COUNT,
                'side': 'right',
                'font': FONTS.vcd,
                'color': '#eee',
                'height_mm': 1.4,
                'margin_mm': 0.5,
                'repeat': RepeatType.FRAME,
            },
            {
                'type': ElementType.ARROW,
                'side': 'right',
                'color': '#eee',
                'height_mm': 3.5,
                'width_mm': 1.5,
                'margin_mm': 2.0,
                'repeat': RepeatType.FRAME,
            },
        ],
        'sprocket_hole_color': '#888',
    },
    'unknown': {
        'name': 'Unknown',
        'icon': 'unknown_roll_icon.png',
        'enabled': true,
        'dx_code': -1,
        'start_frame': -1,
        'top_elements': [
            {
                'type': ElementType.LABEL,
                'text': 'UNKNOWN',
                'font': FONTS.sans,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 1.62,
                'margin_mm': 0.0,
                'repeat': RepeatType.FRAME,
                'every': 2,
                'offset': -0.3,
            },
            {
                'type': ElementType.FRAME_COUNT,
                'font': FONTS.sans,
                'color': '#eee',
                'height_mm': 1.62,
                'margin_mm': 0.0,
                'repeat': RepeatType.FRAME,
                'offset': 0.4,
            },
        ],
        'bottom_elements': [
            {
                'type': ElementType.FRAME_COUNT,
                'font': FONTS.sans,
                'color': '#eee',
                'height_mm': 2.0,
                'margin_mm': -0.35,
                'repeat': RepeatType.FRAME,
                'offset': 0.4,
            },
            {
                'type': ElementType.FRAME_COUNT_ALT,
                'font': FONTS.sans,
                'color': '#eee',
                'height_mm': 1.2,
                'margin_mm': 0.55,
                'repeat': RepeatType.FRAME,
                'offset': 0.9,
            },
            {
                'type': ElementType.ARROW,
                'color': '#eee',
                'margin_mm': 0.72,
                'offset': 0.81,
                'head_width_mm': 1.45,
                'head_height_mm': 0.99,
            },
        ],
        'sprocket_hole_color': '#888',
    },
}

function populateFilmStocks() {
    const filmstockContainer = document.getElementById('filmSelect');
    filmstockContainer.innerHTML = "";

    // Use an array to preserve 35mm-first order (plain object keys like '120'
    // get sorted as integer indices by JS engines, putting them before '35mm').
    const groups = [
        { label: '35mm', keys: [] },
        { label: '120',  keys: [] },
    ];
    const groupOf = key => FILM[key].format === '120' ? groups[1] : groups[0];
    for (let key in FILM) {
        const fs = FILM[key];
        if (!fs.enabled) continue;
        groupOf(key).keys.push(key);
    }

    for (const { label: groupName, keys } of groups) {
        if (keys.length === 0) continue;

        const header = document.createElement('p');
        header.textContent = groupName;
        header.style.cssText = 'width:100%; margin:4px 0 2px; font-size:11px; color:#888; border-bottom:1px solid #888; padding-bottom:2px;';
        filmstockContainer.appendChild(header);

        const row = document.createElement('div');
        row.classList.add('filmStockRow');

        for (const key of keys) {
            const filmstock = FILM[key];
            const filmstock_el = document.createElement('div');
            filmstock_el.classList.add('filmstock');
            if (filmstock.active) filmstock_el.classList.add('active');
            filmstock_el.id = key;
            filmstock_el.innerHTML = `
                <img src="img/filmrolls/${filmstock.icon}" alt="${filmstock.name}">
                <p>${filmstock.name}</p>
            `;
            filmstock_el.addEventListener('click', function() {
                selectFilmStock(key);
            });
            row.appendChild(filmstock_el);
        }

        filmstockContainer.appendChild(row);
    }
}