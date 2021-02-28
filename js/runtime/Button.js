/**
 * @Description:
 * @author Hu
 * @date 2021/2/27 22:24
 */
import {Sprite} from "../base/Sprite.js";

export class Button extends Sprite{
    constructor(name, x, y) {
        const img = Sprite.getImage(name);
        super(img);
        this.show = true;
        this.width = 70;
        this.height = 30;
        this.imgX = x;
        this.imgY = y;
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
        if(this.show){
            this.drawXY(this.imgX, this.imgY);
        }
    }

    checkClick(startX, startY, endX, endY){

    }
}