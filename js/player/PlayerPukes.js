import {DataStore} from "../base/DataStore.js";
import {Sprite} from "../base/Sprite";
import {Puke} from "./Puke";

/**
 * @Description: 玩家牌组类
 * @author Hu
 * @date 2021/2/28 15:10
 */
export class PlayerPukes {
    constructor(pukes = [],
                pukeNum = 0,
                startX = 0,
                startY = 0,
                len = 0) {
        // console.log('playerPukes初始化');
        this.dataStore = DataStore.getInstance();

        this.pukes = pukes;
        this.pukeStr = [];
        this.pukeNum = pukeNum;
        this.startX = startX;
        this.startY = startY;
        this.len = len;

        this.dir = 'mid';
    }

    //返回第n张牌
    get(n){
        if(n >= this.pukeNum)
            throw Error("n is out of scope!");

        return this.pukes[n];
    }

    //将curPuke放入第n个位置
    add(curPuke, n = this.pukeNum){
        if(n > this.pukeNum)
            throw Error("n is out of scope!");

        for(let i = this.pukeNum; i > n; i--)
            this.pukes[i] = this.pukes[i-1];
        this.pukes[n] = curPuke;
        this.pukeStr[n] = curPuke.pukeName;

        this.pukeNum++;
        this.sortPuke();
        this.updateSite();
    }

    //移除并返回第n个位置的牌  n从0开始
    remove(n){
        if(n >= this.pukeNum)
            throw Error("n is out of scope!");
        let removePuke = this.pukes[n];
        for (let i = n; i < this.pukeNum-1; i++){
            this.pukes[i] = this.pukes[i+1];
            this.pukeStr[i] = this.pukeStr[i+1];
        }

        this.pukeNum--;
        this.sortPuke();
        this.updateSite();
        return removePuke;
    }


    swap(a, b){
        let t = this.pukes[a];
        this.pukes[a] = this.pukes[b];
        this.pukes[b] = t;

        let s = this.pukeStr[a];
        this.pukeStr[a] = this.pukeStr[b];
        this.pukeStr[b] = s;
    }

    //对自己进行排序
    sortPuke(){
        //插入排序即可
        for(let i = 1; i < this.pukeNum; i++){
            let curPuke = this.pukes[i];
            for (let j = 0; j < i; j++)
                if(this.pukes[j].num > curPuke.num)
                    this.swap(i, j);
        }
    }

    setStartX(startX){
        this.startX = startX;
    }

    //更新所有牌的位置
    updateSite(){
        this.len = (this.pukeNum-1) * this.dataStore._pukeStep + this.dataStore._pukeW;
        //TODO 这里重复修改startX导致2 3号的put牌组的位置出错
        switch (this.dir){
            case "mid":
                this.startX = (this.dataStore.WIN_W - this.len) / 2;
                break;
            case "left":
            case "right":
                break;
        }

        for(let i = 0; i < this.pukeNum; i++){
            let curPuke = this.pukes[i];
            //已经使用的不显示
            if(!curPuke.used) {
                if(curPuke.put){
                    curPuke.imgX = this.startX + i * this.dataStore._pukeStep;
                    curPuke.imgY = this.startY;
                }
                else {
                    curPuke.imgX = this.startX + i * this.dataStore._pukeStep;
                    curPuke.imgY = this.startY - curPuke.up * this.dataStore._pukeStep;
                }
            }
        }
    }

    displayAllPukes(){
        for(let i = 0; i < this.pukeNum; i++){
            let curPuke = this.pukes[i];
            curPuke.drawXY(curPuke.imgX, curPuke.imgY);
        }
    }

    clear(){
        this.pukes = [];
        this.pukeStr = [];
        this.pukeNum = 0;
        this.startX = 0;
        this.len = 0;
    }

    copy(){
        let res = new PlayerPukes(Array.from(this.pukes), this.pukeNum,
            this.startX, this.startY, this.len);
        res.pukeStr = Array.from(this.pukeStr);
        res.dir = this.dir;
        return res;
    }
}