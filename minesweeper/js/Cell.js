"use strict";


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
]

class Cell{
    constructor(div, x, y){
        this.div        = div;
        this.x          = x;
        this.y          = y;
        this.number     = 0;
        this.isMine     = false;
        this.isFlagged  = false;
        this.isOpen     = false;

        this.subscriber = undefined;

        this._mouseDown     = this._mouseDown.bind(this);
        this._mouseUp       = this._mouseUp.bind(this);
        this._mouseEnter    = this._mouseEnter.bind(this);
        this._mouseLeave    = this._mouseLeave.bind(this);
        this._click         = this._click.bind(this);
        this._onContextMenu = this._onContextMenu.bind(this);


        div.addEventListener("mousedown", this._mouseDown);
        div.addEventListener("mouseup", this._mouseUp);
        div.addEventListener("mouseenter", this._mouseEnter);
        div.addEventListener("mouseleave", this._mouseLeave);
        div.addEventListener("click", this._click);
        div.addEventListener("contextmenu", this._onContextMenu);
    }

    subscribe(s){
        this.subscriber = s;
    }

    open(x,y){
        this.isOpen = true;
        if(this.isMine){
            if(this.x == x && this.y == y){
                this.div.style.backgroundImage = cellImages[11];
            }else{
                this.div.style.backgroundImage = cellImages[10];
            }
        }else if(this.isFlagged){
            this.div.style.backgroundImage = cellImages[12];
        }else{
            this.div.style.backgroundImage = cellImages[this.number];
        }
    }

    flag(bool){
        if(bool){
            this.div.style.backgroundImage = cellImages[13];
        }else{
            this.div.style.backgroundImage = cellImages[9];
        }
        this.isFlagged = bool;
    }

    _mouseDown(event){
    }

    _mouseUp(event){
        event.preventDefault();
        this.subscriber(event, this);
    }

    _mouseEnter(event){
    }

    _mouseLeave(event){
    }

    _onContextMenu(event){
        event.preventDefault();
        return false;
    }

    _click(event){
        
    }
}