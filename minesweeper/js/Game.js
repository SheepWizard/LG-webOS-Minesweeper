"use strict";

//Magic remote key codes
const keyCodes = {
    left:   0x25,
    up:     0x26,
    right:  0x27,
    down:   0x28,
    ok:     0x0D,
    back:   0x1CD,
    red:    0x193,
    green:  0x194,
    yellow: 0x195,
    blue:   0x196,
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



class Game{
    constructor(x,y,m){
        this.x              = x;
        this.y              = y;
        this.mines          = m;
        this.cells          = [];
        this.selectedCell   = 0;
        this.flagsPlaced    = 0;
        this.gameOver       = false;
        this.firstClick     = true;
        this.timer          = undefined;
        this.resetButton    = document.getElementById("smile");
        this.mode           = 0;
        this.time           = 0;
        this.flagDisplay    = [];
        this.timeDisplay    = [];

        this._onCellClick       = this._onCellClick.bind(this);
        this._keyPress          = this._keyPress.bind(this);
        this._cursorStateChange = this._cursorStateChange.bind(this);
        this._reset             = this._reset.bind(this);

        document.addEventListener("keydown", this._keyPress);
        document.addEventListener('cursorStateChange', this._cursorStateChange, false);
        this.resetButton.addEventListener("mouseup", this._reset);

        this.getDisplays();
        this.getCells();
        this.placeMines();
        this.placeNumbers();
        this._setDotDisplay(this.flagDisplay, this.mines);
    }

    stop(){
        clearInterval(this.timer);
    }

    getDisplays(){
        for(let i = 0; i<3; i++){
            this.flagDisplay.push(document.getElementById(`flagDisplay_${i}`));
            this.timeDisplay.push(document.getElementById(`timeDisplay_${i}`));
        }
    }

    getCells(){
        const cells = document.getElementsByClassName("cell");
        for(let i = 0; i<cells.length; i++){
            const tkns = cells[i].id.split("_");
            const c = new Cell(cells[i], parseInt(tkns[1]), parseInt(tkns[2]));
            c.subscribe(this._onCellClick);
            this.cells.push(c);
        }
    }

    placeMines(){
        let minesPlaces = 0;
        while(minesPlaces < this.mines){
            const rnd = Math.floor(Math.random()* (this.x*this.y));
            if(this.cells[rnd].isMine){
                continue;
            }
            this.cells[rnd].isMine = true;
            minesPlaces++;
        }
    }

    placeNumbers(){
        for(let y = 0; y<this.y; y++){
            for(let x = 0; x<this.x; x++){
                const neighbours = this._getCellNeighbours(x,y);
                let mineCount = 0;
                neighbours.forEach((c) => {
                    if(c.isMine){
                        mineCount++;
                    }
                });
                this.cells[this._cellOffset(x,y)].number = mineCount; 
            }
        }
    }

    /**
     * Called when a cell is clicked.
     * @param {MouseEvent} event 
     * @param {Cell} cell 
     */
    _onCellClick(cell){
        if(this.gameOver){
            return;
        }

        if(this.firstClick){
            //Dont die on first click
            if(cell.isMine){
                while(cell.isMine){
                    this.cells.forEach(c => c.reset());
                    this.placeMines();
                }
                this.placeNumbers();
            }

            this.firstClick = false;
            this._timerStart();
        }

        //Update selector positon when using magic mouse to when moving back to button you are in last clicked place
        if(cursorSate === 0){
            this.selectedCell = this._cellOffset(cell.x, cell.y);
        }
        
        //Mine mode
        if(this.mode === 0){
            this._openCell(cell);
        }
        //Flag mode
        else{
            if (!cell.isOpen) {
                this.flagsPlaced = cell.isFlagged ? --this.flagsPlaced : ++this.flagsPlaced;
                this._setDotDisplay(this.flagDisplay, this.mines - this.flagsPlaced);
                cell.flag(!cell.isFlagged);
            }
        }
    }

    /**
     * Check what to do with cell if left clicked
     * @param {Cell} cell 
     */
    _openCell(cell){
        if (cell.isFlagged) {
            return;
        }
        if (cell.isMine) {
            cell.open(cell.x, cell.y);
            this._endgame(false);
            return;
        } else if (cell.number === 0) {
            this._openEmpty(cell);
        } else {
            cell.open(cell.x, cell.y);
        }
        this._checkWin();
    }

    /**
     * Check if player has won the game
     */
    _checkWin(){
        for(let i = 0; i<this.cells.length; i++){
            if(!this.cells[i].isMine && !this.cells[i].isOpen){
                return;
            }
        }
        this._endgame(true);
    }

    /**
     * Do all end game stuff
     * @param {bool} won True is player won, false if hit mine
     */
    _endgame(won){
        this.gameOver = true;
        clearInterval(this.timer);

        //Open up cells revealing mines, wrongly flagged areas
        if(won){
            this.cells.forEach((cell) =>{
                if(cell.isMine){
                    cell.flag(true);
                }
            });
            
            this._setDotDisplay(this.flagDisplay, 0);
        }else{
            for(let i = 0; i<this.cells.length; i++){
                if (this.cells[i].isFlagged && !this.cells[i].isMine){
                    this.cells[i].open(-1,-1);
                }
                if(this.cells[i].isMine && !this.cells[i].isOpen){
                    this.cells[i].open(-1,-1);
                }
            }
        }

        //move selector over smile
        const selector = document.getElementById("selector");
        const borderWidth = this.cells[this.selectedCell].div.offsetWidth / 10;
        selector.style.width =  `${this.resetButton.offsetWidth}px`;
        selector.style.height = `${this.resetButton.offsetHeight}px`;
        selector.style.borderWidth = `${borderWidth}px`
        selector.style.top = `${this.resetButton.getBoundingClientRect().top - borderWidth}px`;
        selector.style.left = `${this.resetButton.getBoundingClientRect().left - borderWidth}px`;

    }

    _timerStart(){
        const interval = 100;
        this.ti
        this.timer = setInterval(() => {
            this.time += interval;
            if(this.time % 1000 === 0){
                this._setDotDisplay(this.timeDisplay, this.time/1000);
            }
        }, interval);
    }

    /**
     * Update dot displays
     * @param {Array<Element>} disp Array of displays images
     * @param {int} num Number to be displayed
     */
    _setDotDisplay(disp, num){
        num = num > 999 ? 999 : num < -99 ? -99 : num;

        let isNeg = false
        if(num < 0){
            isNeg = true;
        }

        const string = Math.abs(num).toString();
        const offset = (3 - string.length);
        for(let i = 0; i<disp.length; i++){
            if(isNeg){
                if(i === offset-1){
                    disp[i].style.backgroundImage = numberImages[10];
                }else{
                    disp[i].style.backgroundImage = numberImages[parseInt(string[i - offset])];
                }
            }else{
                if (i >= offset) {
                    disp[i].style.backgroundImage = numberImages[parseInt(string[i - offset])];
                } else {
                    disp[i].style.backgroundImage = numberImages[0];
                }
            } 
        }
    }

    /**
     * Reset board
     */
    _reset(){
        this.gameOver = false;
        this.firstClick = true;
        this.flagsPlaced = 0;
        this.time = 0;
        clearInterval(this.timer);
        
        this.cells.forEach((elm) =>{
            elm.reset();
        });

        this.placeMines();
        this.placeNumbers();
        this._setDotDisplay(this.flagDisplay, this.mines);
        this._setDotDisplay(this.timeDisplay, 0);
        if(cursorSate){
            this._updateSelector(true);
        }    
    }

    /**
     * If a empty cell is clicked open up all cells around it.
     * @param {Cell} cell cell that was clicked
     */
    _openEmpty(cell){
        const stack = [cell];
        while(stack.length > 0){
            const c = stack.pop();
            if(c.number === 0){
                const neighbours = this._getCellNeighbours(c.x, c.y);
                neighbours.forEach((elm) =>{
                    if(!elm.isOpen && !elm.isFlagged){
                        stack.push(elm);
                    }
                });
            }
            c.open();  
        }
    }

    /**
     * Get a cells neighbouring cells
     * @param {int} x Cell x pos
     * @param {int} y Cell y pos
     */
    _getCellNeighbours(x,y){

        getBounds = getBounds.bind(this);
        function getBounds(x2,y2) {
            return x2 >= 0 && y2 >= 0 && x2 < this.x && y2<this.y;
        }

        const neighbours = [];
        x--; y--;
        if(getBounds(x,y)){
            neighbours.push(this.cells[this._cellOffset(x,y)]);
        }
        x++;
        if (getBounds(x, y)) {
            neighbours.push(this.cells[this._cellOffset(x, y)]);
        }
        x++;
        if (getBounds(x, y)) {
            neighbours.push(this.cells[this._cellOffset(x, y)]);
        }
        y++;
        if (getBounds(x, y)) {
            neighbours.push(this.cells[this._cellOffset(x, y)]);
        }
        y++;
        if (getBounds(x, y)) {
            neighbours.push(this.cells[this._cellOffset(x, y)]);
        }
        x--;
        if (getBounds(x, y)) {
            neighbours.push(this.cells[this._cellOffset(x, y)]);
        }
        x--;
        if (getBounds(x, y)) {
            neighbours.push(this.cells[this._cellOffset(x, y)]);
        }
        y--;
        if (getBounds(x, y)) {
            neighbours.push(this.cells[this._cellOffset(x, y)]);
        }
        return neighbours;
    }

    /**
     * Get a cells position in array from its x and y value
     * @param {int} x 
     * @param {int} y 
     */
    _cellOffset(x,y){
        return y * this.x + x;
    }

    /**
     * Detect when remote buttons are pressed
     * @param {KeyEvent} event 
     */
    _keyPress(event){
        
        if(cursorSate === 1){
            return;
        }

        if (this.gameOver){
            if (event.keyCode === keyCodes.ok){
                this._reset();
            }
                
            return;
        }

        switch (event.keyCode) {
            case keyCodes.ok:
                this._onCellClick(this.cells[this.selectedCell]);
                break;
            case keyCodes.right:
                if((this.selectedCell + 1) % this.x === 0){
                    this.selectedCell -= this.x-1;
                }else{
                    ++this.selectedCell;
                }
                this._updateSelector(true);
                break;
            case keyCodes.left:
                
                if((this.selectedCell -1) % this.x === this.x-1 || this.selectedCell-1 === -1){
                    this.selectedCell += this.x-1;
                }else{
                    --this.selectedCell;
                }
                this._updateSelector(true);
                break;
            case keyCodes.down:
                if(this.selectedCell + this.x > (this.x*this.y)-1 ){
                   
                    this.selectedCell = this.x - ((this.x * this.y) - this.selectedCell);
                }else{
                    this.selectedCell += this.x;
                }
                this._updateSelector(true);
                break;
            case keyCodes.up:
                if(this.selectedCell - this.x < 0){
                    this.selectedCell = ((this.x*this.y)) - (this.x - this.selectedCell);
                }else{
                    this.selectedCell -= this.x;
                }
                this._updateSelector(true);
                break;
            case keyCodes.red:
                this.mode = this.mode === 0 ? 1 : 0;
                break;
            default:
                break;
        }
    }

    /**
     * Update selectors visuals
     * @param {boolean} bool If selector should be shown or not
     */
    _updateSelector(bool){
        const selector = document.getElementById("selector");
        if(bool){
            selector.style.display = "block";

            //Keep selector on reset button if game over
            if(this.gameOver){
                return;
            }

            const borderWidth = this.cells[this.selectedCell].div.offsetWidth/10;
            selector.style.width = `${this.cells[this.selectedCell].div.offsetWidth}px`;
            selector.style.height = `${this.cells[this.selectedCell].div.offsetHeight}px`;
            selector.style.borderWidth = `${borderWidth}px`
            selector.style.top = `${this.cells[this.selectedCell].div.getBoundingClientRect().top - borderWidth}px`;
            selector.style.left = `${this.cells[this.selectedCell].div.getBoundingClientRect().left - borderWidth}px`;
        }else{
            selector.style.display = "none";
        }
    }

    _cursorStateChange(event){
        if (event.detail.visibility){
            this._updateSelector(false);
        }else{
            this._updateSelector(true);
        }
    }
}

//Debug function
function printT(msg) {
    document.getElementById("print").innerHTML = `${msg}`;
}