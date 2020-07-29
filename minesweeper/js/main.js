"use strict";

const DEFAULT_CELL_SIZE = 32;
let game = new Game(9,9,10);
let cells = [];
let scale = 1;


function newGame(x,y,m) {
    game.x = x;
    game.y = y;
    game.mines = m;
    buildBoard();
    game.placeMines();
    game.placeNumbers();
}

/**
 * Draw minesweeper board
 * @param {float} scale Scale of board
 */
function buildBoard() {
    const board = document.getElementById("minesweeperContainer");
    board.innerHTML = "";

    const btl = document.createElement("div");
    btl.className = "bordertl";
    board.append(btl);

    for(let i = 0; i<game.x; i++){
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

    const top = document.createElement("div");
    top.className = "topArea";
    top.style.width = `${DEFAULT_CELL_SIZE * game.x}px`;
    board.append(top);

    const blr = document.createElement("div");
    blr.className = "borderLong";
    board.append(blr);

    const jl = document.createElement("div");
    jl.className = "jointl";
    board.append(jl);

    for (let i = 0; i < game.x; i++) {
        const bt = document.createElement("div");
        bt.className = "borderTop";
        board.append(bt);
    }

    const jr = document.createElement("div");
    jr.className = "jointr";
    board.append(jr);


    for(let y = 0; y<game.y; y++){
        let s = document.createElement("div");
        s.className = "side";
        board.append(s);
        for(let x = 0; x<game.x; x++){
            const cell = document.createElement("div");
            cell.className = "cell";
            game.addCell(new Cell(cell, x, y));
            board.append(cell);
        }
        s = document.createElement("div");
        s.className = "side";
        board.append(s);
    }

    const bbl = document.createElement("div");
    bbl.className = "borderbl";
    board.append(bbl);

    for (let i = 0; i < game.x; i++) {
        const bt = document.createElement("div");
        bt.className = "borderTop";
        board.append(bt);
    }

    const bbr = document.createElement("div");
    bbr.className = "borderbr";
    board.append(bbr);

    for (let i = 0; i < board.children.length; i++){
        board.children[i].style.width = `${board.children[i].offsetWidth * scale}px`;
        board.children[i].style.height = `${board.children[i].offsetHeight * scale}px`; 
    }
}





window.addEventListener("load", () =>{
    newGame(9,9,10);
});