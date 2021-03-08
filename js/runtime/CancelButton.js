/**
 * @Description:
 * @author Hu
 * @date 2021/2/27 21:01
 */
import {Sprite} from "../base/Sprite.js";

export class CancelButton extends Sprite{
    static getInstance() {
        if (!CancelButton.instance) {
            CancelButton.instance = new CancelButton();
        }
        return CancelButton.instance;
    }

    constructor() {
        const img = Sprite.getImage("cancel");
        super(img);
        this.show = true;
        this.width = 70;
        this.height = 30;
        this.imgX = this.dataStore.WIN_W/2 - this.dataStore._pukeStep - this.width;
        this.imgY = this.dataStore._pukeStartHigh - Math.max(this.dataStore._pukeH/2, 50);
    }

    drawXY(siteX, siteY){
        this.ctx.drawImage(
            this.img,
            0, 0,
            this.width, this.height,
            siteX, siteY,
            this.width, this.height
        );
    }

    display(){
        if(this.dataStore.priPut.pukeNum === 0 ||
            this.dataStore.curPutPlayerId === this.dataStore.priPutPlayerId)
            return;
        if(this.dataStore.showBut){
            this.drawXY(this.imgX, this.imgY);
        }
    }

    checkClick(startX, startY, endX, endY){
        return this.imgX < startX && startX < this.imgX + this.width
            && this.imgY < startY && startY < this.imgY + this.height
            && this.imgX < endX && endX < this.imgX + this.width
            && this.imgY < endY && endY < this.imgY + this.height
    }


}