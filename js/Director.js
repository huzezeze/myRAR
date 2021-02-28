//导演类，控制游戏的逻辑

import {DataStore} from "./base/DataStore.js";
import {PukeHeap} from "./player/PukeHeap.js";
import {Players} from "./player/Players.js";
import {PutPukeButton} from "./runtime/PutPukeButton.js";
import {CancelButton} from "./runtime/CancelButton.js";

export class Director {

    static getInstance() {
        if (!Director.instance) {
            Director.instance = new Director();
        }
        return Director.instance;
    }

    constructor() {
        this.dataStore = DataStore.getInstance();
        this.initPukeNum = 5;
        this.PUKE_W_REL = 105;
        this.PUKE_H_REL = 150;          //实际扑克尺寸   68/440, 20/105的间隔才能完整显示出数字
        this.PUKE_PROP = this.PUKE_W_REL / this.PUKE_H_REL;        //宽高比
        this.PUKE_STEP = 25;
        this.PUKE_STEP_PROP = this.PUKE_STEP / this.PUKE_W_REL; //递进步长，和步长与宽的比例
        this.WIN_W = wx.getSystemInfoSync().windowWidth;  //屏幕宽度 切换横屏后W和H自动交换，且x还是左右，y还是上下
        this.WIN_H = wx.getSystemInfoSync().windowHeight; //屏幕高度


        this._pukeNum = 17;
        this._pukeW = Math.floor((this.WIN_W - 100) / (this._pukeNum * this.PUKE_STEP_PROP - this.PUKE_STEP_PROP + 1) );
        this._pukeH = Math.floor(this._pukeW / this.PUKE_PROP);
        if(this._pukeH > this.WIN_H/4){
            this._pukeH = Math.floor(this.WIN_H/4);
            this._pukeW = Math.floor(this._pukeH * this.PUKE_PROP);
        }
        this._pukeStep = Math.floor(this._pukeW * this.PUKE_STEP_PROP);
        this._pukeStartHigh = this.WIN_H - (this.WIN_H/30 + this._pukeH);

        //全局变量
        this.dataStore.WIN_W = this.WIN_W;
        this.dataStore.WIN_H = this.WIN_H;
        this.dataStore.initPukeNum = this.initPukeNum;
        this.dataStore.PUKE_W_REL = this.PUKE_W_REL;
        this.dataStore.PUKE_H_REL = this.PUKE_H_REL;
        this.dataStore._pukeW = this._pukeW;
        this.dataStore._pukeH = this._pukeH;
        this.dataStore._pukeStartHigh = this._pukeStartHigh;
        this.dataStore._pukeStep = this._pukeStep;



        //保存点击的位置
        this.touchStartX = -1;
        this.touchStartY = -1;
        this.touchEndX = -1;
        this.touchEndY = -1;
    }

    init(){
        if(this.dataStore.debug){
            console.log('direc初始化');
        }

        this.pukeHeap = new PukeHeap();
        this.dataStore.pukeHeap = this.pukeHeap;
        this.play1 = new Players();
        this.dataStore.showBut = true;
        this.putPukeButton = PutPukeButton.getInstance();
        this.cancelButton = CancelButton.getInstance();

        this.onTouch();
        this.run();
    }

    //检查点击位置
    checkTouch(){
        if(this.dataStore.debug){
            console.log("checkTouch");
        }
        //1.如果点击的是牌
        if(this.play1.isSelPuke(this.touchStartX, this.touchStartY)){
            // console.log("in");
            this.play1.selPukesByTouchXY(
                this.touchStartX, this.touchStartY, this.touchEndX, this.touchEndY);

        }
        //2.如果点击的是按钮 TODO
        if(this.putPukeButton.imgY < this.touchStartY
            && this.touchStartY < this.putPukeButton.imgY + this.putPukeButton.height){
            if(this.putPukeButton.checkClick(
                this.touchStartX, this.touchStartY, this.touchEndX, this.touchEndY)
                && this.dataStore.showBut){
                    if(this.dataStore.debug)
                        console.log("点击put");
                    this.play1.checkPutPukes();
                }
            else if(this.cancelButton.checkClick(
                this.touchStartX, this.touchStartY, this.touchEndX, this.touchEndY)
                && this.dataStore.showBut){
                    if(this.dataStore.debug)
                        console.log("点击cancel");
                }
        }


        //响应完本次点击事件后重新监听点击，并清屏重绘
        if(this.touchStartX != -1){
            this.touchStartX = -1;
            this.touchStartY = -1;
            this.touchEndX = -1;
            this.touchEndY = -1;
            this.onTouch();
            this.dataStore.ctx.clearRect(0, 0,
                this.dataStore.canvas.width, this.dataStore.canvas.height);
            this.displayAll();
        }
    }

    onTouch(){
        if(this.dataStore.debug){
            console.log('onTouch');
        }
        wx.onTouchStart(function(e){

            // console.log("触摸开始");
            // console.log(e);
            // console.log(e.touches[0].clientX);

            Director.instance.touchStartX = e.touches[0].clientX;
            Director.instance.touchStartY = e.touches[0].clientY;
            Director.instance.touchEndX = Director.instance.touchStartX;
            Director.instance.touchEndY = Director.instance.touchStartY;
            /**
             * 这里的this是指上面的e，并不是最外层的director
             */
            // console.log(this.touchStartX, this.touchStartY);

        })
        wx.onTouchMove(function(e){
            // console.log("触摸移动");
            // console.log(e);
            // console.log(e.touches[0].clientX);
            Director.instance.touchEndX = e.touches[0].clientX;
            Director.instance.touchEndY = e.touches[0].clientY;

        })
        wx.onTouchEnd(function(e){
            // console.log("触摸结束");
            wx.offTouchStart();
            wx.offTouchMove();
            wx.offTouchEnd();
            Director.instance.checkTouch();
        })
        wx.onTouchCancel(function(e){
            console.log("触摸取消");
        })

    }



    displayAll(){
        this.play1.displayPukes();
        this.putPukeButton.display();
        this.cancelButton.display();
    }

    run() {
        if(this.dataStore.debug){
            console.log('direc运行');
        }
        // this.pukeHeap.getOnePuke().drawXY(100, this._pukeStartHigh);

        // this.play1.handPukes[this.play1.havePukeNum] = new Puke("putPuke");
        // console.log(this.play1.handPukes);


        this.displayAll();



        /**
         * 开始动画循环   此处似乎不需要进行动画循环
         */
        // let timer = requestAnimationFrame(() => this.displayAll());
        // this.dataStore.put('timer', timer);
        // wx.setPreferredFramesPerSecond(5);

        /**
         * 结束动画循环 + 清理缓存
         */
        // cancelAnimationFrame(this.dataStore.get('timer'));
        // this.dataStore.destroy();
        // //触发微信小游戏垃圾回收
        // wx.triggerGC();
    }
}