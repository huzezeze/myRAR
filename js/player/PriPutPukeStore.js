import {DataStore} from "../base/DataStore.js";
import {PukeRule} from "./PukeRule.js";

/**
 * @Description: 保存上家出的牌
 * @author Hu
 * @date 2021/3/3 11:03
 */

export class PriPutPukeStore {
    constructor() {
        this.dataStore = DataStore.getInstance();
        this.pukes = [];
        this.pukeNum = 0;
        //这里的str只用保存牌面大小即可，不用花色
        this.pukeStr = [];
        this.putType = -1;
        this.pukeNameMap = this.getPukeNameMap();
        this.newPutStr = [];
        this.newPutType = -2;
    }

    /**
     * 传入putPukes，更新priPut内的数据,不包括下次nextCanPuts
     */
    update(putPukes){
            this.pukes = putPukes.pukes;
            this.pukeNum = this.pukes.length;
            this.pukeStr = this.newPutStr;
            this.putType = this.newPutType;
            return true;
    }

    clear(){
        this.pukes = [];
        this.pukeNum = 0;
        this.pukeStr = [];
        this.putType = -1;
    }

    checkPutIsTrue(putPukes){
        this.newPutStr = [];
        this.newPutType = -2;
        for (let i = 0; i < putPukes.pukes.length; i++){
            this.newPutStr[i] = putPukes.pukes[i].num;
        }
        this.newPutType = this.getPutType(this.newPutStr);

        //第一个出牌，只需出牌类型正确即可
        if(this.pukeStr.length === 0 && this.putType === -1){
            if(this.newPutType >= 0 && this.newPutType <= 5){
                this.update(putPukes);
                return true;
            }
            return false;
        }
        //1.检查两者出牌类型是否相同
        if(this.putType === this.newPutType && this.pukeStr.length === this.newPutStr.length){
            //刚好接住上家的牌
            if(this.pukeNameMap.get(this.pukeStr[0])+1
                === this.pukeNameMap.get(this.newPutStr[0])){
                this.update(putPukes);
                return true;
            }

            console.log("下面判断是否是被2压制",this.dataStore.priPut);
            //出单或者出对时，被2压制
            if((this.putType === 0 || this.putType === 1) &&
                    this.pukeStr[0] !== "g" && this.newPutStr[0] === "g"){
                this.update(putPukes);
                return true;
            }
            return false;
        }
        //2.类型不同的话只能是炸弹压制
        else if(this.newPutType === 4
            && (this.putType!==4 || this.pukeStr[0] < this.newPutStr[0])){
            this.update(putPukes);
            return true;
        }


        return false;
    }

    /**
     *
     * @param pukeStr 根据传入的str判断出牌的类型 这里的str只保存每张牌的大小，不含花色
     * 3~10：3,4,5,6,7,8,9,a, JQK：b,c,d, A2：e,g,  大小王：x,y
     * @return -1：str为空， 0：出单， 1：出对， 2：连对， 3：顺子， 4：炸弹  5：三个
     */
    getPutType(pukeStr){
        //TODO 先不考虑癞子
        let n = pukeStr.length;
        switch (n) {
            case 0: //没有牌，类型默认为-1
                return -1;
            case 1: //只有一张牌，只能是出单
                return 0;
            case 2: //只有两张牌且两张牌数字相同，为出对，（这里没有王炸），先不考虑癞子
                if (pukeStr[0] === pukeStr[1])
                    return 1;
                else
                    return -1;
            default:
                if (this._checkLianDui(pukeStr))
                    return 2;
                if (this._checkShunZi(pukeStr))
                    return 3;
                if (this._checkBoom(pukeStr))
                    return 4;
                if(this._checkSanLian(pukeStr))
                    return 5;
                return -1;
        }
    }

    _checkLianDui(pukeStr){
        let n = pukeStr.length;
        //这里连对最少是两对
        if(n < 4 || n % 2 !== 0 )
            return false;
        for(let i = 1; i < n; i++){
            let t = i % 2;
            if( this.pukeNameMap.get(pukeStr[i]) - (1^t)    //这里^的优先级问题，需要加括号
                !== this.pukeNameMap.get(pukeStr[i-1]) )
                return false;

        }
        return true;
    }

    _checkShunZi(pukeStr){
        let n = pukeStr.length;
        if(n < 3)
            return false;
        for (let i = 1; i < n; i++){
            if(this.pukeNameMap.get(pukeStr[i])-1 !== this.pukeNameMap.get(pukeStr[i-1]))
                return false;
        }
        return true;
    }

    _checkBoom(pukeStr){
        let n = pukeStr.length;
        if(n !== 4)
            return false;
        for (let i = 1; i < n; i++){
            if(pukeStr[i] !== pukeStr[i-1])
                return false;
        }
        return true;
    }

    _checkSanLian(pukeStr){
        let n = pukeStr.length;
        if(n !== 3)
            return false;
        for (let i = 1; i < n; i++){
            if(pukeStr[i] !== pukeStr[i-1])
                return false;
        }
        return true;
    }

    getPukeNameMap(){
        let map = new Map();
        //3~10
        map.set("3", 3);
        map.set("4", 4);
        map.set("5", 5);
        map.set("6", 6);
        map.set("7", 7);
        map.set("8", 8);
        map.set("9", 9);
        map.set("a", 10);
        //JQK
        map.set("b", 11);
        map.set("c", 12);
        map.set("d", 13);
        //AZ
        map.set("e", 14);
        map.set("g", 15);
        return map;
    }
}