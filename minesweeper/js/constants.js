
const EASY_SETTINGS = {
    width: 328,
    height: 412,
    x: 9,
    y: 9,
    mines: 10,
};

const INTER_SETTINGS = {
    width: 552,
    height: 636,
    x: 16,
    y: 16,
    mines: 40,
};

const EXPERT_SETTINGS = {
    width: 1000,
    height: 636,
    x: 30,
    y: 16,
    mines: 99,
};

const LIGHT_THEME = {
    name: "Light",
    background: "#E7E7E7",
    selector: "#692FEE",
    settings: "#222222",
    textColour: "black",
};
const DARK_THEME = {
    name: "Night",
    background: "#222222",
    selector: "#EE2F2F",
    settings: "#E7E7E7",
    textColour: "white",
};

const cellImages = [
    "url(images/cell_open.png)",
    "url(images/cell_1.png)",
    "url(images/cell_2.png)",
    "url(images/cell_3.png)",
    "url(images/cell_4.png)",
    "url(images/cell_5.png)",
    "url(images/cell_6.png)",
    "url(images/cell_7.png)",
    "url(images/cell_8.png)",
    "url(images/cell_closed.png)",
    "url(images/cell_mine.png)",
    "url(images/cell_minehit.png)",
    "url(images/cell_wrongflag.png)",
    "url(images/cell_flag.png)",
];

const smileImages = {
    smile: "url(images/smiley_play.png)",
    win: "url(images/smiley_win.png)",
    dead: "url(images/smiley_dead.png)",
    oface: "url(images/smiley_oface.png)",
};

//Magic remote key codes
const keyCodes = {
    left: 0x25,
    up: 0x26,
    right: 0x27,
    down: 0x28,
    ok: 0x0D,
    back: 0x1CD,
    red: 0x193,
    green: 0x194,
    yellow: 0x195,
    blue: 0x196,
};

const numberImages = [
    "url(images/number_0.png)",
    "url(images/number_1.png)",
    "url(images/number_2.png)",
    "url(images/number_3.png)",
    "url(images/number_4.png)",
    "url(images/number_5.png)",
    "url(images/number_6.png)",
    "url(images/number_7.png)",
    "url(images/number_8.png)",
    "url(images/number_9.png)",
    "url(images/number_blank.png)",
];