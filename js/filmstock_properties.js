// various physical film properties

// this is the preview height in pixels
const PREVIEW_HEIGHT = 600;
const FINAL_HEIGHT = 200;

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
    let filmstockContainer = document.getElementById('filmSelect');
    filmstockContainer.innerHTML = "";

    for (let key in FILM) {
        let filmstock = FILM[key];
        if (!filmstock.enabled) {
            continue;
        }

        let filmstock_el = document.createElement('div');
        let icon = filmstock.icon;
        let name = filmstock.name;
        filmstock_el.classList.add('filmstock');
        if (filmstock.active) {
            filmstock_el.classList.add('active');
        }

        filmstock_el.id = key;

        filmstock_el.innerHTML = `
        <img src="img/filmrolls/${icon}" alt="${name}">
        <p>${name}</p>
        `;

        if (filmstock.enabled) {
            filmstock_el.addEventListener('click', function() {
                selectFilmStock(key);
            });
        } else {
            filmstock_el.classList.add('disabled');
        
        }

        filmstockContainer.appendChild(filmstock_el);
    }
}