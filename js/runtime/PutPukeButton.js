/**
 * @Description: 出牌按钮
 * @author Hu
 * @date 2021/2/26 22:15
 */
import {Sprite} from "../base/Sprite.js";

export class PutPukeButton extends Sprite{
    static getInstance() {
        if (!PutPukeButton.instance) {
            PutPukeButton.instance = new PutPukeButton();
        }
        return PutPukeButton.instance;
    }

    constructor() {
        const img = Sprite.getImage("putPuke");
        super(img);
        this.show = true;
        this.width = 70;
        this.height = 30;
        this.imgX = this.dataStore.WIN_W/2 + this.dataStore._pukeStep;
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