"use strict";




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
        this._onContextMenu = this._onContextMenu.bind(this);


        div.addEventListener("mousedown", this._mouseDown);
        div.addEventListener("mouseup", this._mouseUp);
        div.addEventListener("mouseenter", this._mouseEnter);
        div.addEventListener("mouseleave", this._mouseLeave);
        div.addEventListener("contextmenu", this._onContextMenu);
    }

    subscribe(s){
        this.subscriber = s;
    }

    /**
     * Change cells image based on its properties
     * @param {int} x X position of cell that was clicked
     * @param {int} y Y position of cell that was clicked
     */
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

    /**
     * Update cells flag image
     * @param {boolean} bool If flagged or not
     */
    flag(bool){
        if(bool){
            this.div.style.backgroundImage = cellImages[13];
        }else{
            this.div.style.backgroundImage = cellImages[9];
        }
        this.isFlagged = bool;
    }
    /**
     * Reset cell to original state
     */
    reset(){
        this.number = 0;
        this.isMine = false;
        this.isFlagged = false;
        this.isOpen = false;
        this.div.style.backgroundImage = cellImages[9];
    }

    _mouseDown(event){
        //this.div.style.backgroundImage = cellImages[0];
    }

    _mouseUp(event){
        event.preventDefault();
        this.subscriber(this);
    }

    _mouseEnter(event){
    }

    _mouseLeave(event){
    }

    _onContextMenu(event){
        event.preventDefault();
        return false;
    }
}