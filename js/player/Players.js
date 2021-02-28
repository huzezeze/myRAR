import {DataStore} from "../base/DataStore.js";
import {PlayerPukes} from "./PlayerPukes.js";

/**
 * @Description:  玩家类
 * @author Hu
 * @date 2021/2/26 20:02
 */
export class Players {
    constructor() {
        console.log('players初始化');
        this.dataStore = DataStore.getInstance();

        //手牌
        this.handPukes = new PlayerPukes();
        this.handPukes.startY = this.dataStore._pukeStartHigh;

        //出牌区的牌
        this.putPukes = new PlayerPukes();
        // this.putPukeNum = 0;
        // this.putPukeStartX = 0;
        this.putPukes.startY = this.dataStore._pukeStartHigh -
            this.dataStore._pukeH - this.dataStore._pukeStep;
        // this.putPukeLen = 0;

        this.isMyPhone = true;

        this.score = 0;
        this.winNum = 0;
        this.loseNum = 0;

        this.getPukes(this.dataStore.initPukeNum);
    }

    /**
     * 传入摸牌数量n
     */
    getPukes(n){
        for(let i = 0; i < n; i++){
            let curPuke = this.dataStore.pukeHeap.getOnePuke();
            this.handPukes.add(curPuke);

        }

    }

    /**
     * 显示该玩家的手牌
     */
    displayPukes(){
        if(this.dataStore.debug){
            console.log('players显示牌');
        }

        //如果是自己的手机则显示在主位置
        if(this.isMyPhone){
            this.handPukes.displayAllPukes();
            this.putPukes.displayAllPukes();

        }
        if(this.dataStore.debug){
            console.log(this.handPukes);
        }

    }

    /**
     * 传入点击的xy，返回是否选中了牌
     */
    isSelPuke(x, y){
        return this.handPukes.startX < x && x < this.handPukes.startX + this.handPukes.len
            && this.handPukes.startY < y && y < this.handPukes.startY + this.dataStore._pukeH;
    }

    /**
     * 传入点击的xy坐标，修改选中手牌的状态
     */
    selPukesByTouchXY(startX, startY, endX, endY){
        //TODO
        let _pukeStep = this.dataStore._pukeStep;
        //只选了一张牌
        if (endX - startX <= _pukeStep) {
            let selPukeId = Math.floor((startX - this.handPukes.startX) / _pukeStep);
            if (selPukeId >= this.handPukes.pukeNum)
                selPukeId = this.handPukes.pukeNum - 1;

            this.handPukes.pukes[selPukeId].up = !this.handPukes.pukes[selPukeId].up;

        }
        else {
            let selPukeIdStart = Math.floor((startX - this.handPukes.startX) / _pukeStep);
            let selPukeIdEnd = Math.floor((endX - this.handPukes.startX) / _pukeStep);
            if (selPukeIdEnd < selPukeIdStart) {
                let t = selPukeIdEnd;
                selPukeIdEnd = selPukeIdStart;
                selPukeIdStart = t;
            }
            if (selPukeIdEnd >= this.handPukes.pukeNum)
                selPukeIdEnd = this.handPukes.pukeNum - 1;
            if (selPukeIdStart > selPukeIdEnd)
                selPukeIdStart = selPukeIdEnd;
            for (let i = selPukeIdStart; i <= selPukeIdEnd; i++) {
                this.handPukes.pukes[i].up = !this.handPukes.pukes[i].up;
            }
        }
        this.handPukes.updateSite();
    }

    /**
     * 点击出牌按钮时，检查是否有牌被选中
     */
    checkPutPukes(){
        let havePut = false;
        let curId = 0;
        let loopNum = this.handPukes.pukeNum;
        for(let i = 0; i < loopNum; i++){
            let curPuke = this.handPukes.pukes[curId];
            if(curPuke.up){
                havePut = true;
                curPuke.putMe();
                this.putPukes.add(curPuke);
                this.handPukes.remove(curId);
            }
            else
                curId ++;
        }
        if(havePut){
            this.dataStore.showBut = false;
        }

        this.handPukes.updateSite();
        this.putPukes.updateSite();

        return havePut;
    }

    /**
     * 检查出牌的序列是否合理
     */
    checkPutIsTrue(){
        //TODO
    }
}