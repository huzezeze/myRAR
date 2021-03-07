/**
 * @Description: 单张牌
 * @author Hu
 * @date 2021/2/26 10:10
 */
import {Sprite} from "../base/Sprite.js";

export class Puke extends Sprite{
    constructor(pukeName) {
        const img = Sprite.getImage(pukeName);
        super(img);

        this.pukeName = pukeName;

        this.imgX = -1;
        this.imgY = -1;

        //选中后视为上浮
        this.up = false;

        //选中点击出牌后视为打出，标记是否显示在出牌区
        this.put = false;

        //打出后视为使用  使用后则不再显示
        this.used = false;

        //花色和数字
        if(pukeName == "bossBig"){
            this.col = null;
            this.num = "y";
        }
        else if(pukeName == "bossSmall"){
            this.col = null;
            this.num = "x";
        }
        else{
            this.col = pukeName[0];
            this.num = pukeName.slice(1);
        }


    }


    putMe(){
        this.up = false;
        this.put = true;
        this.used = false;
    }

    useMe(){
        this.up = false;
        this.put = false;
        this.used = true;
    }

    initState(){
        this.up = false;
        this.put = false;
        this.used = false;
    }

}