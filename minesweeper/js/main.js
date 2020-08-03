"use strict";


let selectedTheme = DARK_THEME;
const DEFAULT_CELL_SIZE = 32;

let scale = 1;
let settingsMenu = undefined;
let game = undefined;
let currentSettings = undefined;

/**
 * Set colours for selected theme
 */
function setTheme(){
    document.body.style.backgroundColor = selectedTheme.background;
    document.getElementById("selector").style.borderColor  = `${selectedTheme.selector}`;
    const settings = document.getElementById("sidemenu");
    settings.style.backgroundColor = selectedTheme.background;
    settings.style.borderColor = `${selectedTheme.settings}`;
    const footer = document.getElementById("bottomBar");
    footer.style.backgroundColor = selectedTheme.background;
    footer.style.borderColor = `${selectedTheme.settings}`;

    const btns = document.getElementsByClassName("settingsButton");
    for(let i = 0; i<btns.length; i++){
        btns[i].style.backgroundColor = selectedTheme.background;
        btns[i].style.color = selectedTheme.textColour;
        btns[i].style.borderColor = selectedTheme.selector;
    }
    
    const elements = [...document.getElementsByTagName("h1"), ...document.getElementsByTagName("h2"), ...document.getElementsByTagName("h3")];
    for (let i = 0; i < elements.length; i++){
        elements[i].style.color = `${selectedTheme.textColour}`;
    }
}


function newGame(settings) {
    const loadingText = document.getElementById("loading");
    loadingText.innerHTML = "Loading...";

        
    setTimeout(() => {
        currentSettings = settings;
        buildBoard(settings.width, settings.height, settings.x, settings.y);
        applyScale();
        setTheme();
        if (game) {
            game.stop();
        }
        game = new Game(settings.x, settings.y, settings.mines);
        if (settingsMenu.isOpen()) {
            game._disableKeys(true);
        }
        loadingText.innerHTML = "";
    }, 10);

    
    
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
    const stack = [board];
    while (stack.length > 0) {
        const elm = stack.pop();
        stack.push(...elm.children);
        elm.style.width = `${elm.offsetWidth * scale}px`;
        elm.style.height = `${elm.offsetHeight * scale}px`;
    }
}

function loadLocalSettings() {
    const localStorage = window.localStorage;
    let ls = localStorage.getItem(STORAGE_NAME);
    if(!ls){
        
        localStorage.setItem(STORAGE_NAME, JSON.stringify({ scale: 1, theme: DARK_THEME}));
    }else{
        ls = JSON.parse(ls);
        scale = ls.scale;
        selectedTheme = ls.theme;
    }
}

function saveSettings(){
    localStorage.setItem(STORAGE_NAME, JSON.stringify({ scale: scale, theme: selectedTheme }));
}


/**
 * Settings menu controls
 */
function settings() {
    let open = false;

    const sideMenu = document.getElementById("sidemenu");
    const easyButton = document.getElementById("newGameEasy");
    const interButton = document.getElementById("newGameInter")
    const expertButton = document.getElementById("newGameExpert")
    const sizeSmall = document.getElementById("sizeSmall");
    const sizeMedium = document.getElementById("sizeMedium");
    const sizeLarge = document.getElementById("sizeLarge");
    const lightButton = document.getElementById("lightButton");
    const darkButton = document.getElementById("darkButton");
    const backButton = document.getElementById("backButton");
    const modeButton = document.getElementById("modeButton");
    const settingButton = document.getElementById("settingButton");

    const buttonPositions = [
        [easyButton, interButton, expertButton],
        [sizeSmall, sizeMedium, sizeLarge],
        [lightButton, darkButton],
        [backButton]
    ];
    let menuSelector = [0,0];

    function openMenu(){
        if (open) {
            open = false;
            sideMenu.style.left = "-375px";
            setTimeout(() => {
                game._disableKeys(false); 
            }, 100);  
        } else {
            open = true;
            sideMenu.style.left = "0px";
            game._disableKeys(true);
            displaySelector();
        }
    }

    function displaySelector() {
        for(let i = 0; i<buttonPositions.length; i++){
            for(let j = 0; j<buttonPositions[i].length; j++){
                buttonPositions[i][j].style.backgroundColor = selectedTheme.background;
            }
        }
        buttonPositions[menuSelector[0]][menuSelector[1]].style.backgroundColor = "#ec5d94"; 
    }
    displaySelector();

    easyButton.addEventListener("mousedown", () =>{
        newGame(EASY_SETTINGS);
        displaySelector();
    });
    interButton.addEventListener("mousedown", () =>{
        newGame(INTER_SETTINGS);
        displaySelector();
    });
    expertButton.addEventListener("mousedown", () =>{
        newGame(EXPERT_SETTINGS);
        displaySelector();
    });
    sizeSmall.addEventListener("mousedown", () =>{
        if(scale === 0.7) return;
        scale = 0.7;
        saveSettings();
        newGame(currentSettings);
        displaySelector();
    });
    sizeMedium.addEventListener("mousedown", () =>{
        if(scale === 1) return;
        scale = 1;
        saveSettings();
        newGame(currentSettings);
        displaySelector();
    });
    sizeLarge.addEventListener("mousedown", () =>{
        if(scale === 1.3) return
        scale = 1.3;
        saveSettings();
        newGame(currentSettings);
        displaySelector();
    });
    lightButton.addEventListener("mousedown", () =>{
        selectedTheme = LIGHT_THEME;
        setTheme();
        saveSettings();
        displaySelector();
    });
    darkButton.addEventListener("mousedown", () =>{
        selectedTheme = DARK_THEME;
        setTheme();
        saveSettings();
        displaySelector();
    });
    backButton.addEventListener("mousedown", () =>{
        openMenu();
    });
    modeButton.addEventListener("mousedown", () =>{
        game.changeMode();
    });
    settingButton.addEventListener("mousedown", () =>{
        settingsMenu.open();
    });


    function onMouseEnter(event) {
        event.target.style.backgroundColor = "#EA6767";
    }
    function onMouseLeave(event) {
        event.target.style.backgroundColor = selectedTheme.background;      
    }

    modeButton.addEventListener("mouseenter", onMouseEnter);
    settingButton.addEventListener("mouseenter", onMouseEnter);
    modeButton.addEventListener("mouseleave", onMouseLeave);
    settingButton.addEventListener("mouseleave", onMouseLeave);

    /**
     * Menu hover action. Probably not the best solutions :P
     */
    for (let i = 0; i < buttonPositions.length; i++) {
        for (let j = 0; j < buttonPositions[i].length; j++) {
            buttonPositions[i][j].addEventListener("mouseenter", () =>{
                menuSelector[0] = i;
                menuSelector[1] = j;
                displaySelector();
            });
            buttonPositions[i][j].addEventListener("mouseleave", () => {
                for (let i = 0; i < buttonPositions.length; i++) {
                    for (let j = 0; j < buttonPositions[i].length; j++) {
                        buttonPositions[i][j].style.backgroundColor = selectedTheme.background;
                    }
                }
                displaySelector();
            });
        }
    }
    

    return{
        moveDown: function() {
            if(!open) return;
            if(menuSelector[0] < buttonPositions.length-1){
                menuSelector[0]++;
            }else{
                menuSelector[0] = 0;
            }
            if (menuSelector[1] > buttonPositions[menuSelector[0]].length - 1) {
                menuSelector[1] = buttonPositions[menuSelector[0]].length - 1
            }
            displaySelector();
        },
        moveUp: function() {
            if (!open) return;
            if(menuSelector[0] > 0){
                menuSelector[0]--;
            }else{
                menuSelector[0] = buttonPositions.length-1;
            }
            if (menuSelector[1] > buttonPositions[menuSelector[0]].length - 1) {
                menuSelector[1] = buttonPositions[menuSelector[0]].length - 1
            }
            displaySelector();
        },
        moveRight: function() {
            if (!open) return;
            if(menuSelector[1] < buttonPositions[menuSelector[0]].length -1){
                menuSelector[1]++;
            }else{
                menuSelector[1] = 0;
            }
            displaySelector();
        },
        moveLeft: function() {
            if (!open) return;
            if(menuSelector[1] > 0){
                menuSelector[1]--;
            }else{
                menuSelector[1] = buttonPositions[menuSelector[0]].length-1;
            }
            displaySelector();
        },
        click: function() {
            if (!open) return;
            const clickEvent = document.createEvent('MouseEvents');
            clickEvent.initEvent("mousedown", true, true);
            buttonPositions[menuSelector[0]][menuSelector[1]].dispatchEvent(clickEvent);
        },
        open: function() {
            openMenu();
        },
        isOpen: function() {
            return open;
        },
        disableSelector: function() {
            for (let i = 0; i < buttonPositions.length; i++) {
                for (let j = 0; j < buttonPositions[i].length; j++) {
                    buttonPositions[i][j].style.backgroundColor = selectedTheme.background;
                }
            }
        },
        enableSelector: function() {
            if(open){
                displaySelector();
            }
            
        }
    }
}

document.addEventListener("keydown", (event) =>{
    switch (event.keyCode) {
        case keyCodes.ok:
            settingsMenu.click();
            break;
        case keyCodes.right:
            settingsMenu.moveRight();
            break;
        case keyCodes.left:
            settingsMenu.moveLeft();
            break;
        case keyCodes.down:
            settingsMenu.moveDown();
            break;
        case keyCodes.up:
            settingsMenu.moveUp();
            break;
        case keyCodes.blue:
            settingsMenu.open();
            break;
        case keyCodes.red:
            game.changeMode();
            break;
        default:
            break;
    }
});

// document.addEventListener('cursorStateChange', (event) =>{
//     if (event.detail.visibility) {
//         settingsMenu.disableSelector();
//     }else{
//         settingsMenu.enableSelector();
//     }

// }, false);

window.addEventListener("load", () =>{
    loadLocalSettings()
    settingsMenu = settings();
    newGame(EASY_SETTINGS);
});





