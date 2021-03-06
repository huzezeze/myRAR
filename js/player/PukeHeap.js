/**
 * @Description: 全局牌堆
 * @author Hu
 * @date 2021/2/26 9:42
 */
import {Sprite} from "../base/Sprite.js";
import {Puke} from "./Puke.js";

export class PukeHeap extends Sprite{
    constructor() {
        super();
        this.pukeData = ["bossBig", "bossSmall",
                "fe","fg","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd",
                "he","hg","h3","h4","h5","h6","h7","h8","h9","ha","hb","hc","hd",
                "me","mg","m3","m4","m5","m6","m7","m8","m9","ma","mb","mc","md",
                "re","rg","r3","r4","r5","r6","r7","r8","r9","ra","rb","rc","rd"];
        this.havePukeNum = this.pukeData.length;

    }

    getOnePuke(){
        let pukeId  = Math.floor(Math.random() * (this.havePukeNum - 2) + 2);  //产生[2, havePukeNum)
        let pukeName = this.pukeData[pukeId];
        this.swap(pukeId, this.havePukeNum-1);
        let curPuke = new Puke(pukeName);
        return curPuke;
    }

    //抽牌后将已抽的牌放后面，防止重复抽到
    swap(a, b){
        let t = this.pukeData[a];
        this.pukeData[a] = this.pukeData[b];
        this.pukeData[b] = t;
        if(this.havePukeNum > 0)
            this.havePukeNum--;
        else{
            //TODO 如果未结束就没牌 将使用过的牌进行洗牌重组

        }
    }


}