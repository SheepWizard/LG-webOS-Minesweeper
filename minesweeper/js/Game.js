"use strict";

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
}



class Game{
    constructor(x,y,m){
        this.x              = x;
        this.y              = y;
        this.mines          = m;
        this.cells          = [];
        this.selectedCell   = 0;
        this.gameOver       = false;
        this.firstClick     = true;
        this.timer          = undefined;

        this._onCellClick = this._onCellClick.bind(this);
        this._keyPress = this._keyPress.bind(this);
        this._cursorStateChange = this._cursorStateChange.bind(this);

        document.addEventListener("keydown", this._keyPress);
        document.addEventListener('cursorStateChange', this._cursorStateChange, false);
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

    addCell(cell){
        cell.subscribe(this._onCellClick)
        this.cells.push(cell);
    }


    _onCellClick(event, cell){
        if(this.gameOver){
            return;
        }

        if(this.firstClick){
            this.firstClick = false;
            this._timerStart();
        }

        //Left click
        if(event.which === 1){
            this._openCell(cell)

        //Right click
        }else if(event.which === 3){
            if(!cell.isOpen){
                cell.flag(!cell.isFlagged);
            }
        }  
    }

    _openCell(cell){
        if (cell.isFlags) {
            return;
        }
        if (cell.isMine) {
            console.log("hit mine")
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

    _checkWin(){
        for(let i = 0; i<this.cells.length; i++){
            if(!this.cells[i].isMine && !this.cells[i].isOpen){
                return;
            }
        }
        console.log("gameover");
        this._endgame(true);
    }

    //DONT DIE FIRST CLICK

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
    }

    _timerStart(){
        this.timer = setInterval(() => {
            console.log("this.time");
        }, 100);
    }

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
                })
            }
            c.open();  
        }
    }

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

    _cellOffset(x,y){
        return y * this.x + x;
    }

    _keyPress(event){
        
        if(cursorSate === 1 || this.gameOver){
            return;
        }

        switch (event.keyCode) {
            case keyCodes.ok:
                this._onCellClick({which: 1}, this.cells[this.selectedCell]);
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
                document.getElementById("print").innerHTML = `${(this.selectedCell - 1) & this.x}  ${(this.x - 1)} `;
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
            default:
                break;
        }
    }

    _updateSelector(bool){
        const selector = document.getElementById("selector");
        if(bool){
            selector.style.display = "block";
            const borderWidth = this.cells[this.selectedCell].div.offsetWidth/10;
            selector.style.width = this.cells[this.selectedCell].div.offsetWidth;
            selector.style.height = this.cells[this.selectedCell].div.offsetHeight;
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