"use strict";

const EASY_SETTINGS = {
    width: 328,
    height: 412,
    x: 9,
    y: 9,
    mines: 10,
}

const INTER_SETTINGS = {
    width: 552,
    height: 636,
    x: 16,
    y: 16,
    mines: 40,
}

const EXPERT_SETTINGS = {
    width: 1000,
    height: 636,
    x: 30,
    y: 16,
    mines: 99,
}

const LIGHT_THEME = {
    name: "Light",
    background: "#E7E7E7",
    selector: "#7BEA67",
    settings: "#222222",
    textColor: "black",
}
const DARK_THEME = {
    name: "Night",
    background: "#222222",
    selector: "#EA6767",
    settings: "#E7E7E7",
    textColour: "white",
}

let selectedTheme = DARK_THEME;
const DEFAULT_CELL_SIZE = 32;

let scale = 1;
let settingsMenu = undefined;
let game = undefined;


function setTheme(){
    document.body.style.backgroundColor = selectedTheme.background;
    document.getElementById("selector").style.border = `solid thin ${selectedTheme.selector}`;
    const settings = document.getElementById("sidemenu");
    settings.style.backgroundColor = selectedTheme.background;
    settings.style.borderTop = `solid thick ${selectedTheme.settings}`;
    settings.style.borderRight = `solid thick ${selectedTheme.settings}`;
    settings.style.borderBottom = `solid thick ${selectedTheme.settings}`;
    
    const elements = [...document.getElementsByTagName("h1"), ...document.getElementsByTagName("h2"), ...document.getElementsByTagName("h3")];
    //const elements = ;
    for (let i = 0; i < elements.length; i++){
        elements[i].style.color = `${selectedTheme.textColour}`;
    }
}


function newGame(settings) {
    buildBoard(settings.width, settings.height, settings.x, settings.y);
    applyScale();
    setTheme();
    if(game){
        game.stop();
    }
    game = new Game(settings.x, settings.y, settings.mines);
}

/**
 * Draw minesweeper board
 * @param {float} scale Scale of board
 */
function buildBoard(width, height, x, y) {
    const board = document.getElementById("minesweeperContainer");
    board.innerHTML = "";
    board.style.width = `${width}px`;
    board.style.height = `${height}px`;
    let remainingSpace = board.offsetWidth;

    const btl = document.createElement("div");
    btl.className = "bordertl";
    board.append(btl);

    for (let i = 0; i < x; i++){
        const bt = document.createElement("div");
        bt.className = "borderTop";
        board.append(bt);
    }

    const btr = document.createElement("div");
    btr.className = "bordertr";
    board.append(btr);
    const bll = document.createElement("div");
    bll.className = "borderLong";   
    board.append(bll);
    remainingSpace -= (bll.offsetWidth * 2);


    const top = document.createElement("div");
    top.className = "topArea";
    top.style.width = `${DEFAULT_CELL_SIZE * x}px`;
    board.append(top);
    {
        
        const spacerl = document.createElement("div");
        spacerl.className = "spacer";
        top.append(spacerl);
        remainingSpace -= (spacerl.offsetWidth * 2);

        for(let i = 0; i<3; i++){
            const fdisplay1 = document.createElement("div");
            fdisplay1.className = "dotDisplay";
            {
                const img1 = document.createElement("div");
                img1.className = "dotDisplayImage";
                img1.id = `flagDisplay_${i}`
                fdisplay1.append(img1);
            }
            top.append(fdisplay1);
            remainingSpace -= (fdisplay1.offsetWidth * 2);
        }

        const middle = document.createElement("div");
        middle.className = "smileSpace";
        middle.style.width = `${remainingSpace}px`;
        {
            const smile = document.createElement("div");
            smile.className = "smile";
            smile.id = "smile";
            middle.append(smile);
        }
        top.append(middle);
       
        for (let i = 0; i < 3; i++) {
            const fdisplay1 = document.createElement("div");
            fdisplay1.className = "dotDisplay";
            {
                const img1 = document.createElement("div");
                img1.className = "dotDisplayImage";
                img1.id = `timeDisplay_${i}`
                fdisplay1.append(img1);
            }
            top.append(fdisplay1);
        }

        const spacer2 = document.createElement("div");
        spacer2.className = "spacer";
        top.append(spacer2);

       
    }

    const blr = document.createElement("div");
    blr.className = "borderLong";
    board.append(blr);

    const jl = document.createElement("div");
    jl.className = "jointl";
    board.append(jl);

    for (let i = 0; i < x; i++) {
        const bt = document.createElement("div");
        bt.className = "borderTop";
        board.append(bt);
    }

    const jr = document.createElement("div");
    jr.className = "jointr";
    board.append(jr);


    for (let i = 0; i < y; i++){
        let s = document.createElement("div");
        s.className = "side";
        board.append(s);
        for (let j = 0; j < x; j++){
            const cell = document.createElement("div");
            cell.className = "cell";
            cell.id = `cell_${j}_${i}`;
            board.append(cell);
        }
        s = document.createElement("div");
        s.className = "side";
        board.append(s);
    }

    const bbl = document.createElement("div");
    bbl.className = "borderbl";
    board.append(bbl);

    for (let i = 0; i < x; i++) {
        const bt = document.createElement("div");
        bt.className = "borderTop";
        board.append(bt);
    }

    const bbr = document.createElement("div");
    bbr.className = "borderbr";
    board.append(bbr);
}

function applyScale(){
    const board = document.getElementById("minesweeperContainer");
    if(scale === 1){
        return;
    }
    const stack = [board];
    while (stack.length > 0) {
        const elm = stack.pop();
        stack.push(...elm.children);
        elm.style.width = `${elm.offsetWidth * scale}px`;
        elm.style.height = `${elm.offsetHeight * scale}px`;
    }
}

function settings() {
    let open = true;

    const easyButton = document.getElementById("newGameEasy");
    const interButton = document.getElementById("newGameInter")
    const expertButton = document.getElementById("newGameExpert")
    const sizeSmall = document.getElementById("sizeSmall");
    const sizeMedium = document.getElementById("sizeMedium");
    const sizeLarge = document.getElementById("sizeLarge");

    easyButton.addEventListener("click", () =>{
        newGame(EASY_SETTINGS);
    });
    interButton.addEventListener("click", () =>{
        newGame(INTER_SETTINGS);
    });
    expertButton.addEventListener("click", () =>{
        newGame(EXPERT_SETTINGS);
    });
    

    return{

    }
}



window.addEventListener("load", () =>{
    settingsMenu = settings();
    newGame(EXPERT_SETTINGS);
});