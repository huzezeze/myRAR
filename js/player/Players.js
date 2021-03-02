import {DataStore} from "../base/DataStore.js";
import {PlayerPukes} from "./PlayerPukes.js";
import {Sprite} from "../base/Sprite";

/**
 * @Description:  玩家类
 * @author Hu
 * @date 2021/2/26 20:02
 */
export class Players {
    constructor(playerId, isRobot = false) {
        console.log('players初始化');
        this.dataStore = DataStore.getInstance();

        this.id = playerId;
        this.isRobot = isRobot;

        //手牌
        this.handPukes = new PlayerPukes();
        this.handPukes.startY = this.dataStore._pukeStartHigh;
        this.pukeBack = new Sprite(Sprite.getImage("pukeBack"));

        //出牌区的牌
        this.putPukes = new PlayerPukes();
        // this.putPukeNum = 0;
        // this.putPukeStartX = 0;
        this.putPukes.startY = this.dataStore._pukeStartHigh -
            this.dataStore._pukeH - this.dataStore._pukeStep;
        // this.putPukeLen = 0;

        this.isMyPhone = true;
        this.dir = 'mid';

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
        //当前玩家出完牌之后 出牌权转到下家
        if(havePut && this.checkPutIsTrue()){
            console.log("修改this.dataStore.curPutPlayerId");
            this.dataStore.curPutPlayerId = this.nextPlayerId();
        }

        this.handPukes.updateSite();
        this.putPukes.updateSite();

        return havePut;
    }

    cancelPut(){
        console.log(this.id + "号放弃出牌");
        this.dataStore.curPutPlayerId = this.nextPlayerId();
    }

    /**
     * 检查出牌的序列是否合理
     */
    checkPutIsTrue(){
        //TODO
        return true;
    }

    setDir(dir){
        this.dir = dir;
        this.handPukes.dir = dir;
        this.putPukes.dir = dir;
    }

    /**
     * 显示牌的背面和剩余牌数，顺便把出的牌也显示了
     * @param dir 默认主家mid，显示左右left和right
     */
    displayBack(){
        let backStartX, backStartY;
        let textStartX, textStartY;

        switch (this.dir){
            case "right":
                backStartX = this.dataStore.canvas.width - this.dataStore._pukeStep - this.dataStore._pukeW;
                backStartY = (this.dataStore.canvas.height - this.dataStore._pukeH) / 2;
                textStartX = backStartX + this.dataStore._pukeW / 2 - 6;
                textStartY = (this.dataStore.canvas.height) / 2 + 10;
                this.putPukes.setStartX(backStartX - this.putPukes.len - this.dataStore._pukeStep * 2);
                // this.putPukes.startX = backStartX - this.putPukes.len - this.dataStore._pukeStep * 2;

                break;
            case "left":
                backStartX = this.dataStore._pukeStep;
                backStartY = (this.dataStore.canvas.height - this.dataStore._pukeH) / 2;
                textStartX = backStartX + this.dataStore._pukeW / 2 - 6;
                textStartY = (this.dataStore.canvas.height) / 2 + 10;
                this.putPukes.setStartX(backStartX + this.dataStore._pukeW + this.dataStore._pukeStep * 2);
                // this.putPukes.startX = backStartX;// + this.dataStore._pukeW + this.putPukes.len + this.dataStore._pukeStep * 2;
                break;
            case "mid":
                return;
        }
        this.putPukes.startY = backStartY;
        this.putPukes.updateSite();
        // console.log(this.id, this.putPukes);
        this.putPukes.displayAllPukes();

        this.pukeBack.drawXY(backStartX, backStartY);
        this.dataStore.ctx.font = '25px Arial';
        this.dataStore.ctx.fillStyle = '#22958a';
        this.dataStore.ctx.fillText(
            //这里的xy是文本框的左下角 一个数字长20 宽5~13
            this.handPukes.pukeNum,
            textStartX,
            textStartY
        );
        this.dataStore.ctx.fillText(
            //这里的xy是文本框的左下角 一个数字长20 宽5~13
            this.id + "号",
            textStartX,
            backStartY - 20
        );
    }

    robotCheckPut(){
        return this.dataStore.curPutPlayerId === this.id;
    }

    /**
     * 让人机输出第一张牌
     */
    robotPutPuke(){
        this.dataStore.canPut = false;

        console.log(this.dataStore.curPutPlayerId);
        console.log(this.id + "号人机出了一张牌");
        this.dataStore.curPutPlayerId = this.nextPlayerId();

        this.putPukes.add(this.handPukes.get(0));
        this.handPukes.remove(0);
        this.handPukes.updateSite();
        this.putPukes.updateSite();
    }

    /**
     * 计算并返回下一个出牌玩家的id
     * @returns {number}
     */
    nextPlayerId(){
        let tempId = (this.dataStore.curPutPlayerId+1) % 3;
        if(tempId === 0)
            return 3;
        else
            return tempId;
    }
}