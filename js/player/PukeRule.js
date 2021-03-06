/**
 * @Description:  根据传入的字符串数组和出牌规则，输出所有的出牌可能
 * @author Hu
 * @date 2021/3/3 11:13
 */
export class PukeRule{
    map = new Map();

    //输入一个字符串数组，根据出牌规则，输出已有手牌接下来所有的出牌可能
    static robotCalcAllCanPuts(priPutPukeStr, handPukesStr){
        //TODO
        if(priPutPukeStr.length === 0)
            return this._allCanPutsByBaseRule(handPukesStr);
    }

    //当前手牌有哪些合法的出法，包括出单、出对，连对(两个以上)，顺子(三个以上)，炸弹
    static _allCanPutsByBaseRule(handPukesStr){
        //TODO
        let single = this._getSingle(handPukesStr);
        let double = this._getDouble(handPukesStr);
        let lianDui = this._getLianDui(handPukesStr);
        let shunZi = this._getShunZi(handPukesStr);
        let boom = this._getBoom(handPukesStr);

        let res = [single, double, lianDui, shunZi, boom];

        return res;
    }

    static checkPutIsTrue(priPutPukeStr, handPukesStr){

    }

    static _getSingle(handPukesStr){

    }

    static _getDouble(handPukesStr){

    }

    static _getLianDui(handPukesStr){

    }

    static _getShunZi(handPukesStr){

    }

    static _getBoom(handPukesStr){

    }



}