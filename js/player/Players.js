import {DataStore} from "../base/DataStore.js";
import {PlayerPukes} from "./PlayerPukes.js";
import {Sprite} from "../base/Sprite.js";

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

        //根据当前手牌和上家出的牌计算出的所有可出牌情况
        this.allCanPut = [];

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
     * 玩家点击出牌按钮时判断是否有牌被选中，并检查出牌的合理性
     */
    humanPutPukes(){
        if(this.checkPutPukes() && this.checkPutIsTrue()){
            //当前玩家出完牌之后 出牌权转到下家
            console.log("修改this.dataStore.curPutPlayerId");
            this.dataStore.curPutPlayerId = this.nextPlayerId(this.dataStore.curPutPlayerId);
            this.handPukes.updateSite();
            this.putPukes.updateSite();
            return true;
        }
        else {
            this.returnPutPukes();
            return false;
        }
    }

    /**
     * 检查是否有牌被选中 返回true，false
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

        return havePut;
    }

    /**
     * 如果出牌失败要将putPukes回退
     */
    returnPutPukes(){
        console.log("出牌失败，回退");
        for(let i = this.putPukes.pukeNum-1; i >=0 ; i--){
            let curPuke = this.putPukes.pukes[i];
                curPuke.initState();
                this.handPukes.add(curPuke);

        }
        this.putPukes.clear();
        this.handPukes.sortPuke();
        this.handPukes.updateSite();
    }

    cancelPut(){
        console.log(this.id + "号放弃出牌");
        this.dataStore.curPutPlayerId = this.nextPlayerId(this.dataStore.curPutPlayerId);
    }

    /**
     * 检查出牌的序列是否合理
     */
    checkPutIsTrue(){
        return this.dataStore.priPut.checkPutIsTrue(this.putPukes);

        // return true;
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
     * 让人机尝试接牌
     */
    robotPutPuke(){
        let isPut = false;

        console.log("当前是", this.dataStore.curPutPlayerId,"号人机出牌");
        console.log(this.id + "号人机尝试出牌");
        let testHandPukes = this.handPukes;
        let testPutPukes = this.putPukes;
        let allCan = [];//这里保存全排列情况, 三维数组，第一维是取几个数字，第二维是第几种情况，第三维是当前数字是几

        let temp = this.getAllCan();
        let priPutPukeNum = this.dataStore.priPut.pukeNum;
        //如果到人机先出，则默认出单
        if(priPutPukeNum === 0)
            allCan[0] = temp[0];
        //如果上家出的四张以上，最少也要出四张牌压，或者放弃出牌
        else if(priPutPukeNum >= 4){
            if(this.handPukes.pukeNum < 4){
                this.cancelPut();
                return isPut;
            }
            allCan[0] = temp[4-1];
            if(this.handPukes.pukeNum >= priPutPukeNum)
                allCan[1] = temp[priPutPukeNum-1];
        }
        else{//上家出了少于4张牌
            if(this.handPukes.pukeNum < priPutPukeNum){
                this.cancelPut();
                return isPut;
            }
            allCan[0] = temp[priPutPukeNum-1];
            if(this.handPukes.pukeNum >= 4)
                allCan[1] = temp[4-1];
        }

        //遍历所有出牌情况
        for (let i = 0; i < allCan.length; i++){
            let cur = allCan[i];
            for(let j = 0; j < cur.length; j++){
                let curCan = cur[j];
                //根据当前出牌情况创建hand和put
                testHandPukes = this.handPukes.copy();
                testPutPukes = this.putPukes.copy();
                for (let k = curCan.length-1; k >= 0; k--){
                    testPutPukes.add(testHandPukes.remove(curCan[k]));
                }
                //测试新建的put是否能接牌，如果能接上就出
                // console.log("尝试",testPutPukes.pukeStr);
                // console.log("上家",this.dataStore.priPut);
                if(this.dataStore.priPut.checkPutIsTrue(testPutPukes)){
                    isPut = true;
                    this.dataStore.curPutPlayerId = this.nextPlayerId(this.dataStore.curPutPlayerId);
                    this.dataStore.canPut = false;

                    this.handPukes = testHandPukes;
                    this.putPukes = testPutPukes;
                    this.handPukes.updateSite();
                    this.putPukes.updateSite();
                    return isPut;
                }
            }

        }
        //所有出牌可能都不行，则出牌失败
        if(!isPut)
            this.cancelPut();

        return isPut;
    }

    /**
     * 计算并返回下一个出牌玩家的id
     * @returns {number}
     */
    nextPlayerId(priId){
        let tempId = (priId+1) % 3;
        if(tempId === 0)
            return 3;
        else
            return tempId;
    }

    getAllCan(){
        let res = [];
        for(let i = 1; i <= this.handPukes.pukeNum; i++){
        //     for(let i = 1; i <= 2; i++){
            let tempRes = [];
            this._getAllCan(0, i, [], tempRes);
            res[i-1] = tempRes;
        }
        return res;
    }

    /**
     * 从cur开始考虑，取need个数字的所有情况，放入res中
     * @param cur       当前考虑第几个位置
     * @param need      还需要几个数字
     * @param curRes    当前的结果
     * @param res       总结果
     * @private
     */
    _getAllCan(cur, need, curRes, res){
        if(need === 0){
            res[res.length] = curRes.concat();
            return;
        }
        if(cur >= this.handPukes.pukeNum)
            return;

        //如果还有数字可考虑，且还需要数字，则当前位置的数字有加入和不加入两种情况
        //考虑当前，再去下一个
        let newCurRes = curRes.concat();
        newCurRes[curRes.length] = cur;
        this._getAllCan(cur+1, need-1, newCurRes, res);

        //不考虑当前位置，直接去下一个
        this._getAllCan(cur+1, need, curRes, res);
    }
}