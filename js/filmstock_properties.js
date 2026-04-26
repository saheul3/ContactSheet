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
    KEYCODE: 'keycode',
    ARROW_NUMBERED: 'arrow numbered',
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
    '6x4.5': 46,    // 42 + 4
    '6x6':   60,    // 56 + 4
    '6x7':   73.5,  // 69.5 + 4
    '6x8':   80,    // 76 + 4
    '6x9':   88,    // 84 + 4
    '6x12':  116,   // 112 + 4
    '6x17':  172,   // 168 + 4
};

// Standard number of exposures per format on a 120 roll
const STANDARD_EXPOSURES_120 = {
    '6x4.5': 16, '6x6': 12, '6x7': 10, '6x8': 9,
    '6x9':    8, '6x12': 6, '6x17': 4,
};

// Number of strips for the 120 contact sheet per format + orientation.
// Must divide STANDARD_EXPOSURES_120 cleanly for even slicing.
const NUM_STRIPS_120_VERTICAL = {
    '6x4.5': 4, '6x6': 3, '6x7': 2, '6x8': 3,
    '6x9':   2, '6x12': 2, '6x17': 1,
};
const NUM_STRIPS_120_HORIZONTAL = {
    '6x4.5': 4, '6x6': 4, '6x7': 2, '6x8': 3,
    '6x9':   2, '6x12': 2, '6x17': 1,
};

// create a dictionary of film stock properties
const FILM = {
    'fuji-100': {
        'name': 'Fujifilm 100',
        'icon': 'fuji100_icon.png',
        'enabled': true,
        'dx_code': '015250',
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
                'text': '100',
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
    'fuji-200': {
        'name': 'Fujifilm 200',
        'icon': 'fuji200_icon.png',
        'enabled': true,
        'dx_code': '015260',
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
                'text': '200',
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
        'icon': 'kodakportra400_icon.png',
        'enabled': true,
        'dx_code': '512574',
        'start_frame': 0,
        'top_elements': [
            {
                'type': ElementType.LABEL,
                'text': 'KODAK',
                'font': FONTS.black,
                'color': '#dcaf7b',
                'height_mm': 1.62,
                'margin_mm': 0.0,
                'repeat': RepeatType.FRAME,
                'offset': 0.60,
            },
            {
                'type': ElementType.LABEL,
                'text': 'PORTRA 400',
                'font': FONTS.sans,
                'font_style': 'bold',
                'color': '#dcaf7b',
                'height_mm': 1.6,
                'margin_mm': 0.2,
                'repeat': RepeatType.FRAME,
                'offset': 0.81,
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
    'kodak-ektar-100': {
        'name': 'Kodak Ektar 100',
        'icon': 'kodakektar100_icon.png',
        'enabled': true,
        'dx_code': '512564',
        'start_frame': 0,
        'top_elements': [
            {
                'type': ElementType.LABEL,
                'text': 'KODAK',
                'font': FONTS.black,
                'color': '#dcaf7b',
                'height_mm': 1.62,
                'margin_mm': 0.0,
                'repeat': RepeatType.FRAME,
                'offset': 0.60,
            },
            {
                'type': ElementType.LABEL,
                'text': 'EKTAR 100',
                'font': FONTS.sans,
                'font_style': 'bold',
                'color': '#dcaf7b',
                'height_mm': 1.6,
                'margin_mm': 0.2,
                'repeat': RepeatType.FRAME,
                'offset': 0.81,
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
    'kodak-e100': {
        'name': 'Kodak E100',
        'icon': 'kodake100_icon.png',
        'enabled': true,
        'dx_code': '512584',
        'start_frame': 0,
        'top_elements': [
            {
                'type': ElementType.LABEL,
                'text': 'KODAK',
                'font': FONTS.black,
                'color': '#dcaf7b',
                'height_mm': 1.62,
                'margin_mm': 0.0,
                'repeat': RepeatType.FRAME,
                'offset': 0.60,
            },
            {
                'type': ElementType.LABEL,
                'text': 'E100',
                'font': FONTS.sans,
                'font_style': 'bold',
                'color': '#dcaf7b',
                'height_mm': 1.6,
                'margin_mm': 0.2,
                'repeat': RepeatType.FRAME,
                'offset': 0.81,
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
        ],
        'sprocket_hole_color': '#b49342',
    },
    'kodak-portra-160': {
        'name': 'Kodak Portra 160',
        'icon': 'unknown_roll_icon.png',
        'enabled': false,
        'dx_code': -1,
    },
    'kodak-tmax-400': {
        'name': 'Kodak T-Max 400',
        'icon': 'kodaktmax400_icon.png',
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
    'kodak-gold-200': {
        'name': 'Kodak GB 200',
        'icon': 'kodakgold200_icon.png',
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
    'kodak-vision3-50d': {
        'name': 'Kodak Vision3 50D',
        'icon': 'kodakvision350d_icon.png',
        'enabled': true,
        'dx_code': -1,
        'start_frame': 1,
        'cinema_edge': {
            'color': '#dcaf7b',
            'mfg_code': 'E',
            'film_code': 'R',
            'film_type': '03',      // 5203
            'roll': '0412',
            'base_key': 5130,
            'height_mm': 1.1,
            'margin_mm': 0.3,
        },
        'top_elements': [],
        'bottom_elements': [],
        'sprocket_hole_color': '#b49342',
    },
    'kodak-vision3-250d': {
        'name': 'Kodak Vision3 250D',
        'icon': 'kodakvision3250d_icon.png',
        'enabled': true,
        'dx_code': -1,
        'start_frame': 1,
        'cinema_edge': {
            'color': '#dcaf7b',
            'mfg_code': 'E',
            'film_code': 'N',
            'film_type': '31',      // 5231
            'roll': '0674',
            'base_key': 8217,
            'height_mm': 1.1,
            'margin_mm': 0.3,
        },
        'top_elements': [],
        'bottom_elements': [],
        'sprocket_hole_color': '#b49342',
    },
    'kodak-vision3-500t': {
        'name': 'Kodak Vision3 500T',
        'icon': 'kodakvision3500t_icon.png',
        'enabled': true,
        'dx_code': -1,
        'start_frame': 1,
        'cinema_edge': {
            'color': '#dcaf7b',
            'mfg_code': 'E',
            'film_code': 'J',
            'film_type': '19',      // 5219
            'roll': '0891',
            'base_key': 3042,
            'height_mm': 1.1,
            'margin_mm': 0.3,
        },
        'top_elements': [],
        'bottom_elements': [],
        'sprocket_hole_color': '#b49342',
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
                'start_num': 41,
                'end_num': 56,
                'side': 'left',
                'font': FONTS.sans,
                'font_style': 'bold',
                'color': '#dcaf7b',
                'height_mm': 1.5,
                'repeat': RepeatType.FRAME,
            },
            {
                // Alternating: ▲, ▲1, ▲, ▲2, ..., ▲, ▲12, ▲, X (26 items, equally spaced)
                'type': ElementType.ARROW_NUMBERED,
                'side': 'right',
                'font': FONTS.sans,
                'font_style': 'bold',
                'color': '#dcaf7b',
                'arrow_height_mm': 2.5,
                'arrow_width_mm': 1.2,
                'num_height_mm': 1.4,
                'max_frame': 12,
            },
        ],
        'sprocket_hole_color': '#b49342',
    },
    'kodak-gold-200-120': {
        'name': 'Kodak Gold 200',
        'icon': 'kodakgold200_120_icon.png',
        'enabled': true,
        'format': '120',
        'medium_format': '6x6',
        'dx_code': -1,
        'start_frame': 1,
        'side_elements': [
            {
                'type': ElementType.LABEL,
                'text': 'KODAK 200',
                'start_num': 41,
                'end_num': 56,
                'side': 'left',
                'font': FONTS.sans,
                'font_style': 'bold',
                'color': '#dcaf7b',
                'height_mm': 1.5,
                'repeat': RepeatType.FRAME,
            },
            {
                'type': ElementType.ARROW_NUMBERED,
                'side': 'right',
                'font': FONTS.sans,
                'font_style': 'bold',
                'color': '#dcaf7b',
                'arrow_height_mm': 2.5,
                'arrow_width_mm': 1.2,
                'num_height_mm': 1.4,
                'max_frame': 12,
            },
        ],
        'sprocket_hole_color': '#b49342',
    },
    'kodak-e100-120': {
        'name': 'Kodak E100',
        'icon': 'kodake100_120_icon.png',
        'enabled': true,
        'format': '120',
        'medium_format': '6x6',
        'dx_code': -1,
        'start_frame': 1,
        'side_elements': [
            {
                'type': ElementType.LABEL,
                'text': 'KODAK E100',
                'start_num': 41,
                'end_num': 56,
                'side': 'left',
                'font': FONTS.sans,
                'font_style': 'bold',
                'color': '#dcaf7b',
                'height_mm': 1.5,
                'repeat': RepeatType.FRAME,
            },
            {
                'type': ElementType.ARROW_NUMBERED,
                'side': 'right',
                'font': FONTS.sans,
                'font_style': 'bold',
                'color': '#dcaf7b',
                'arrow_height_mm': 2.5,
                'arrow_width_mm': 1.2,
                'num_height_mm': 1.4,
                'max_frame': 12,
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
                'label_code': '4274',
                'fixed_code': true,
                'label_count': 11,
                'side': 'right',
                'font': FONTS.vcd,
                'color': '#eee',
                'height_mm': 1.5,
                'repeat': RepeatType.FRAME,
            },
            {
                'type': ElementType.FRAME_COUNT,
                'side': 'left',
                'font': FONTS.vcd,
                'color': '#eee',
                'height_mm': 1.4,
                'margin_mm': 5.0,
                'below': true,
                'repeat': RepeatType.FRAME,
            },
            {
                'type': ElementType.ARROW,
                'side': 'left',
                'color': '#eee',
                'height_mm': 3.5,
                'width_mm': 1.5,
                'margin_mm': 2.0,
                'arrow_down': true,
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
    'fomapan-200': {
        'name': 'Fomapan 200',
        'icon': 'fomapan200_icon.png',
        'enabled': true,
        'dx_code': '014202',
        'bw': true,
        'start_frame': -1,
        'top_elements': [
            {
                'type': ElementType.LABEL,
                'text': 'F O M A P A N',
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 1.9,
                'margin_mm': 0.2,
                'repeat': RepeatType.FRAME,
                'every': 4,
                'offset': 0.55,
            },
            {
                'type': ElementType.LABEL,
                'text': '2     0     0',
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 1.9,
                'margin_mm': 0.2,
                'repeat': RepeatType.FRAME,
                'every': 4,
                'offset': 1.95,
            },
            {
                'type': ElementType.LABEL,
                'text': '3   6   2   4',
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 1.9,
                'margin_mm': 0.2,
                'repeat': RepeatType.FRAME,
                'every': 4,
                'offset': 3.25,
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
        ],
        'sprocket_hole_color': '#888',
    },
    'fomapan-100': {
        'name': 'Fomapan 100',
        'icon': 'fomapan100_icon.png',
        'enabled': true,
        'dx_code': '014102',
        'bw': true,
        'start_frame': -1,
        'top_elements': [
            {
                'type': ElementType.LABEL,
                'text': 'F O M A P A N',
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 1.9,
                'margin_mm': 0.2,
                'repeat': RepeatType.FRAME,
                'every': 4,
                'offset': 0.55,
            },
            {
                'type': ElementType.LABEL,
                'text': '1     0     0',
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 1.9,
                'margin_mm': 0.2,
                'repeat': RepeatType.FRAME,
                'every': 4,
                'offset': 1.95,
            },
            {
                'type': ElementType.LABEL,
                'text': '3   6   1   4',
                'font': FONTS.vcd,
                'font_style': 'bold',
                'color': '#eee',
                'height_mm': 1.9,
                'margin_mm': 0.2,
                'repeat': RepeatType.FRAME,
                'every': 4,
                'offset': 3.25,
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
        ],
        'sprocket_hole_color': '#888',
    },
}

const FILM_BRAND_MAP = {
    'fuji':      'Fujifilm',
    'fomapan':   'Foma',
    'ilf':       'Ilford',
    'kentmere':  'Kentmere',
    'kodak':     'Kodak',
    'cinestill': 'CineStill',
    'other':     'Other',
};
const FILM_BRAND_ORDER = ['kodak', 'fuji', 'ilf', 'kentmere', 'fomapan', 'cinestill', 'other'];

let _filmTabState = null;
let _selectedFilmKey = null;

function _filmGroups() {
    const formats = { '35mm': {}, '120': {} };
    for (let key in FILM) {
        const fs = FILM[key];
        if (!fs.enabled) continue;
        const fmtKey = fs.format === '120' ? '120' : '35mm';
        const prefix = key.split('-')[0];
        const brand = FILM_BRAND_MAP[prefix] ? prefix : 'other';
        if (!formats[fmtKey][brand]) formats[fmtKey][brand] = [];
        formats[fmtKey][brand].push(key);
    }
    return formats;
}

function _orderedBrands(formatBrands) {
    const ordered = FILM_BRAND_ORDER.filter(b => formatBrands[b]);
    for (const b of Object.keys(formatBrands)) {
        if (!ordered.includes(b)) ordered.push(b);
    }
    return ordered;
}

function populateFilmStocks() {
    const container = document.getElementById('filmSelect');
    container.innerHTML = "";

    const formats = _filmGroups();
    const availFormats = ['35mm', '120'].filter(f => Object.keys(formats[f]).length > 0);
    if (availFormats.length === 0) return;

    // Initialize / reconcile tab state
    if (!_filmTabState || !availFormats.includes(_filmTabState.format)) {
        _filmTabState = { format: availFormats[0], brand: null };
    }
    const brands = _orderedBrands(formats[_filmTabState.format]);
    if (!_filmTabState.brand || !brands.includes(_filmTabState.brand)) {
        _filmTabState.brand = brands[0];
    }

    // Format tabs
    const formatTabs = document.createElement('menu');
    formatTabs.setAttribute('role', 'tablist');
    formatTabs.classList.add('filmFormatTabs');
    for (const fmt of availFormats) {
        const li = document.createElement('li');
        li.setAttribute('role', 'tab');
        li.setAttribute('aria-selected', _filmTabState.format === fmt ? 'true' : 'false');
        const a = document.createElement('a');
        a.href = '#filmSelect';
        a.textContent = fmt;
        a.addEventListener('click', (e) => {
            e.preventDefault();
            _filmTabState.format = fmt;
            _filmTabState.brand = null;
            populateFilmStocks();
        });
        li.appendChild(a);
        formatTabs.appendChild(li);
    }
    container.appendChild(formatTabs);

    // Brand tabs
    const brandRow = document.createElement('div');
    brandRow.classList.add('filmBrandTabs');
    for (const b of brands) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = FILM_BRAND_MAP[b] || b;
        if (_filmTabState.brand === b) btn.classList.add('active');
        btn.addEventListener('click', () => {
            _filmTabState.brand = b;
            populateFilmStocks();
        });
        brandRow.appendChild(btn);
    }
    container.appendChild(brandRow);

    // Films of active format + brand
    const keys = formats[_filmTabState.format][_filmTabState.brand] || [];
    const row = document.createElement('div');
    row.classList.add('filmStockRow');
    for (const key of keys) {
        const filmstock = FILM[key];
        const el = document.createElement('div');
        el.classList.add('filmstock');
        if (_selectedFilmKey === key) el.classList.add('active');
        el.id = key;
        el.innerHTML = `
            <img src="img/filmrolls/${filmstock.icon}" alt="${filmstock.name}">
            <p>${filmstock.name}</p>
        `;
        el.addEventListener('click', function() {
            _selectedFilmKey = key;
            selectFilmStock(key);
        });
        row.appendChild(el);
    }
    container.appendChild(row);
}

// ----- Custom film support -----

const CUSTOM_FILMS_STORAGE_KEY = 'contactsheet_custom_films';
let _customFilmCounter = 0;
let _editingCustomKey = null;

function _isCustomKey(key) {
    return typeof key === 'string' && key.startsWith('other-custom-');
}

function _labelEditableElements(elements) {
    if (!elements) return [];
    const out = [];
    elements.forEach((el, idx) => {
        if (el && el.type === ElementType.LABEL && typeof el.text === 'string') {
            out.push({ idx: idx, text: el.text });
        }
    });
    return out;
}

function loadCustomFilmsFromStorage() {
    try {
        const raw = localStorage.getItem(CUSTOM_FILMS_STORAGE_KEY);
        if (!raw) return;
        const customs = JSON.parse(raw);
        for (const key in customs) {
            FILM[key] = customs[key];
            const m = key.match(/^other-custom-(\d+)$/);
            if (m) {
                const n = parseInt(m[1], 10);
                if (n > _customFilmCounter) _customFilmCounter = n;
            }
        }
    } catch (e) {
        console.error('Failed to load custom films:', e);
    }
}

function saveCustomFilmsToStorage() {
    const customs = {};
    for (const key in FILM) {
        if (_isCustomKey(key)) customs[key] = FILM[key];
    }
    try {
        localStorage.setItem(CUSTOM_FILMS_STORAGE_KEY, JSON.stringify(customs));
    } catch (e) {
        console.error('Failed to save custom films:', e);
    }
}

function openCustomizeDialog() {
    _editingCustomKey = null;
    const select = document.getElementById('customBaseFilm');
    select.innerHTML = '';

    // Group by format with optgroups
    const byFmt = { '35mm': [], '120': [] };
    for (const key in FILM) {
        if (!FILM[key].enabled) continue;
        const fmt = FILM[key].format === '120' ? '120' : '35mm';
        byFmt[fmt].push(key);
    }
    for (const fmt of ['35mm', '120']) {
        if (byFmt[fmt].length === 0) continue;
        const grp = document.createElement('optgroup');
        grp.label = fmt;
        byFmt[fmt].sort((a, b) => FILM[a].name.localeCompare(FILM[b].name));
        for (const key of byFmt[fmt]) {
            const opt = document.createElement('option');
            opt.value = key;
            opt.textContent = FILM[key].name + (_isCustomKey(key) ? ' (custom)' : '');
            grp.appendChild(opt);
        }
        select.appendChild(grp);
    }

    // Default base: currently selected film if any, else first
    if (_selectedFilmKey && FILM[_selectedFilmKey]) {
        select.value = _selectedFilmKey;
    }
    select.onchange = () => loadCustomizeFromBase(select.value);
    loadCustomizeFromBase(select.value);

    document.getElementById('customizeFilmWindow').classList.remove('hidden');
}

function loadCustomizeFromBase(baseKey) {
    const base = FILM[baseKey];
    if (!base) return;

    if (_isCustomKey(baseKey)) {
        _editingCustomKey = baseKey;
        document.getElementById('customDeleteBtn').style.display = '';
        document.getElementById('customName').value = base.name;
    } else {
        _editingCustomKey = null;
        document.getElementById('customDeleteBtn').style.display = 'none';
        document.getElementById('customName').value = base.name + ' (Custom)';
    }
    document.getElementById('customDxCode').value = base.dx_code || '';

    const container = document.getElementById('customLabelsContainer');
    container.innerHTML = '';

    const topLabels = _labelEditableElements(base.top_elements);
    const botLabels = _labelEditableElements(base.bottom_elements);

    function addSection(title, list, position) {
        if (list.length === 0) return;
        const h = document.createElement('div');
        h.textContent = title;
        h.style.cssText = 'font-weight:bold; font-size:10px; color:#666; margin:2px 0;';
        container.appendChild(h);
        list.forEach((lbl) => {
            const wrap = document.createElement('div');
            wrap.style.cssText = 'margin-bottom:3px;';
            const input = document.createElement('input');
            input.type = 'text';
            input.value = lbl.text;
            input.dataset.position = position;
            input.dataset.idx = String(lbl.idx);
            input.style.cssText = 'width:100%; font-size:11px;';
            wrap.appendChild(input);
            container.appendChild(wrap);
        });
    }

    addSection('Top edge labels', topLabels, 'top');
    addSection('Bottom edge labels', botLabels, 'bottom');

    if (topLabels.length === 0 && botLabels.length === 0) {
        const p = document.createElement('p');
        p.textContent = 'This film has no editable text labels.';
        p.style.cssText = 'font-size:10px; color:#666; margin:4px;';
        container.appendChild(p);
    }
}

function closeCustomizeDialog() {
    document.getElementById('customizeFilmWindow').classList.add('hidden');
}

function saveCustomFilm() {
    const baseKey = document.getElementById('customBaseFilm').value;
    const base = FILM[baseKey];
    if (!base) return;

    // Deep clone base — JSON safe because FILM uses string enums and string fonts
    const custom = JSON.parse(JSON.stringify(base));
    custom.name = document.getElementById('customName').value.trim() || 'Custom Film';
    const dxRaw = document.getElementById('customDxCode').value.trim();
    custom.dx_code = dxRaw;
    custom.enabled = true;

    // Apply label text overrides
    const inputs = document.querySelectorAll('#customLabelsContainer input');
    inputs.forEach((input) => {
        const pos = input.dataset.position;
        const idx = parseInt(input.dataset.idx, 10);
        const list = pos === 'top' ? custom.top_elements : custom.bottom_elements;
        if (list && list[idx]) list[idx].text = input.value;
    });

    let newKey;
    if (_editingCustomKey && FILM[_editingCustomKey]) {
        newKey = _editingCustomKey;
    } else {
        _customFilmCounter += 1;
        newKey = `other-custom-${_customFilmCounter}`;
    }
    FILM[newKey] = custom;

    saveCustomFilmsToStorage();
    closeCustomizeDialog();

    // Switch view to Other tab and the saved film
    _filmTabState = { format: custom.format === '120' ? '120' : '35mm', brand: 'other' };
    _selectedFilmKey = newKey;
    populateFilmStocks();
    selectFilmStock(newKey);
}

function deleteCustomFilm() {
    if (!_editingCustomKey || !FILM[_editingCustomKey]) return;
    if (!confirm(`Delete "${FILM[_editingCustomKey].name}"?`)) return;
    delete FILM[_editingCustomKey];
    saveCustomFilmsToStorage();
    if (_selectedFilmKey === _editingCustomKey) _selectedFilmKey = null;
    _editingCustomKey = null;
    closeCustomizeDialog();
    _filmTabState = null;
    populateFilmStocks();
}