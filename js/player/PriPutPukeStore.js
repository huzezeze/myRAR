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
        this.pukeNum = this.pukes.length;
        //这里的str只用保存牌面大小即可，不用花色
        this.pukeStr = [];
        this.putType = this.getPutType(this.pukeStr);
        this.map = new Map();
        this.newPutStr = [];
        this.newPutType = -1;
    }

    /**
     * 传入putPukes，更新priPut内的数据,不包括下次nextCanPuts
     */
    update(putPukes){
        for (let i = 0; i < putPukes.pukes.length; i++){
            this.newPutStr[i] = putPukes.pukes[i].num;
        }
        if(this.checkPutIsTrue()){
            this.pukes = putPukes.pukes;
            this.pukeNum = this.pukes.length;
            this.pukeStr = this.newPutStr;
            this.putType = this.newPutType;
            return true;
        }
        else
            return false;
    }

    checkPutIsTrue(){
        //1.检查两者出牌类型是否相同
        this.newPutType = this.getPutType(this.newPutStr);
        if(this.putType === this.newPutType){
            //刚好接住上家的牌
            if(this.pukeStr[0]+1 === this.newPutStr[0])
                return true;
            //出单或者出对时，被2压制
            else if((this.putType === 1 || this.putType === 2) &&
                    this.pukeStr[0] !== 'g' && this.newPutStr[0] === 'g')
                return true;
            return false;
        }
        //2.类型不同的话只能是炸弹压制
        else if(this.newPutType === 4){
            return this.putType!==4 || this.pukeStr[0] < this.newPutStr[0];
        }

        return false;
    }

    /**
     *
     * @param pukeStr 根据传入的str判断出牌的类型 这里的str只保存每张牌的大小，不含花色
     * 3~10：3,4,5,6,7,8,9,a, JQK：b,c,d, A2：e,g,  大小王：x,y
     * @return -1：str为空， 0：出单， 1：出对， 2：连对， 3：顺子， 4：炸弹
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
                break;
            default:
                if (this._checkLianDui(pukeStr))
                    return 2;
                if (this._checkShunZi(pukeStr))
                    return 3;
                if (this._checkBoom(pukeStr))
                    return 4;
                return -1;
        }
    }

    _checkLianDui(pukeStr){
        let n = pukeStr.length;
        //这里连对最少是两对
        if(n < 4 || n % 2 !== 0 )
            return false;
        for(let i = 0; i < n / 2; i++){
            let type = this.getPutType(pukeStr.slice(i*2, i*2+2));//slice函数取值区间是左闭右开
            if(type !== 1)
                return false;
        }
        return true;
    }

    _checkShunZi(pukeStr){
        let n = pukeStr.length;
        if(n < 3)
            return false;
        for (let i = 1; i < n; i++){
            if(pukeStr[i]-1 !== pukeStr[i-1])
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
}