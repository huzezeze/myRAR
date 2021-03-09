// const pukes = ["bossBig", "bossSmall",
//     "fe","fg","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd",
//     "he","hg","h3","h4","h5","h6","h7","h8","h9","ha","hb","hc","hd",
//     "me","mg","m3","m4","m5","m6","m7","m8","m9","ma","mb","mc","md",
//     "re","rg","r3","r4","r5","r6","r7","r8","r9","ra","rb","rc","rd"]
// const MIN_PUKE_NUM = 0, MAX_PUKE_NUM = 53;
// const PUKE_W_REL = 105, PUKE_H_REL = 150;          //实际扑克尺寸   68/440的间隔才能完整显示出数字
// const PUKE_PROP = PUKE_W_REL / PUKE_H_REL;        //宽高比
// const PUKE_STEP = 20, PUKE_STEP_PROP = PUKE_STEP / PUKE_W_REL; //递进步长，和步长与宽的比例
// const WIN_W = wx.getSystemInfoSync().windowWidth;  //屏幕宽度
// const WIN_H = wx.getSystemInfoSync().windowHeight; //屏幕高度


// // console.log("WIN_W = " + WIN_W + ", WIN_H = " + WIN_H);
// // console.log("pukeW = " + pukeW + ", pukeH = " + pukeH + ", pukeStep = " + pukeStep);

// //创建画布
// const canvas = wx.createCanvas();
// const ctx = canvas.getContext('2d');

// const buttonCanvas = wx.createCanvas();
// const buttonCtx = buttonCanvas.getContext('2d');


// const _pukeStartHigh = canvas.height * 3 / 4;
// const _pukeNum = 17;
// const _pukeW =Math.floor( (WIN_W - 100) / (_pukeNum * PUKE_STEP_PROP - PUKE_STEP_PROP + 1) );
// const _pukeH = Math.floor(_pukeW / PUKE_PROP);
// const _pukeStep = Math.floor(_pukeW * PUKE_STEP_PROP);


// //玩家结构体
// function _play(pukeNum, pukeLen, pukeStartSite, pukeEndSite, playPukes){
//     //有几张牌
//     this.pukeNum = pukeNum;

//     //用了几张牌
//     this.useNum = 0;

//     //牌面占多长的宽度
//     this.pukeLen = pukeLen;

//     //开始位置
//     this.pukeStartSite = pukeStartSite;

//     //结束位置
//     this.pukeEndSite = pukeEndSite;

//     //每张牌是哪个，url，是否使用，图像左上角的x，y坐标
//     this.playPukes = playPukes;
// }

// //单张扑克结构体

// function _pukeStru(img, url, col, num, imgX, imgY) {
//     this.img = img;
//     this.url = url;
//     this.col = col;
//     this.num = num;
//     this.imgX = imgX;
//     this.imgY = imgY;

//     this.use = false;
//     this.isSel = false;
// }

// //整体牌堆结构体
// function _pukeHeap(exiNum){
//     this.exiNum = exiNum;
//     this.data = pukes;
// }

// //抽牌
// function getPuke(pukeHeap, play, getNum){
//     let pukeId;
//     let selPuke;
//     let pukeUrl;
//     let img;
//     let col;
//     let num;
//     let imgY;

//     //先抽牌
//     for(let i = 0; i < getNum; i++){
//         // console.log(pukeHeap)
//         pukeId  = Math.floor(Math.random() * (pukeHeap.exiNum - 0 + 1) + 0);
//         selPuke = pukeHeap.data[pukeId];
//         pukeUrl = "images/pukes/" + selPuke + ".jpg" ;
//         img     = wx.createImage();
//         imgY    = _pukeStartHigh;
//         img.src = pukeUrl;

//         console.log("i=" + i + ", selPuke=" + selPuke + ", pukeId=" + pukeId);

//         if(selPuke == "bossBig"){
//             col = null;
//             num = "y";
//         }
//         else if(selPuke == "bossSmall"){
//             col = null;
//             num = "x";
//         }
//         else{
//             col = selPuke[0];
//             num = selPuke.slice(1);
//         }

//         let curPuke = new _pukeStru(img, pukeUrl, col, num,play1.pukeStartSite + i * _pukeStep, imgY);



//         //对手牌排序
//         //找到位置
//         let site = 0;
//         if(curPuke.num == "y")
//             site = play.pukeNum;
//         else if(curPuke.num == "x"){
//             if(play.pukeNum != 0 && play.playPukes[play.pukeNum-1].num == "y")
//                 site = play.pukeNum-1;
//             else
//                 site = play.pukeNum;
//         }
//         else{ //如果不是大王也不是小王 插入排序比较应该放在哪个位置
//             let haveSwap = false;
//             for (let j = 0; j < play.pukeNum; j++) {
//                 if(play.playPukes[j].num < curPuke.num)
//                     continue;
//                 else{
//                     haveSwap = true;
//                     site = j;
//                     break;
//                 }
//             }
//             if(!haveSwap)
//                 site = play.pukeNum;
//         }

//         //找到位置之后所有后移，腾出空间
//         for (let j = play.pukeNum; j > site; j--)
//             play.playPukes[j] = play.playPukes[j - 1];

//         play.playPukes[site] = curPuke;

//         // play.playPukes[pukeNum] = curPuke;
//         play.pukeNum++;



//         //牌堆中将已经抽到的牌放最后，表示不参与后面的随机取牌过程
//         pukeHeap.exiNum--;
//         swap(pukeHeap, pukeHeap.exiNum, pukeId);
//     }

//     //再根据牌的数量定位置
//     for (let i = 0; i < play.pukeNum; i++) {
//         if(!play.playPukes[i].use)
//             play.playPukes[i].imgX = play.pukeStartSite + i * _pukeStep;
//     }
// }

// function swap(pukeHeap, a, b){
//     let t = pukeHeap.data[a];
//     pukeHeap.data[a] = pukeHeap.data[b];
//     pukeHeap.data[b] = t;
// }

// //TODO
// //绘制按钮
// function drawButton(){
//     // buttonCtx.fillStyle = ;

// }

// //绘制玩家手牌
// function drawPlayPukes(){
//     for(let i = 0; i < play1.pukeNum; i++){
//         if(!play1.playPukes[i].use)
//             ctx.drawImage(play1.playPukes[i].img, play1.playPukes[i].imgX, play1.playPukes[i].imgY, _pukeW, _pukeH);
//     }
// }


// //检查点击的位置
// function checkTouchSite(){

//     //点击位置是牌
//     if(play1.pukeStartSite < touchStartX && touchStartX < play1.pukeEndSite
//         && _pukeStartHigh < touchStartY && touchStartY < _pukeStartHigh + _pukeH) {
//         //只选了一张牌
//         if (touchEndX - touchStartX <= _pukeStep) {
//             let selPukeId = Math.floor((touchStartX - play1.pukeStartSite) / _pukeStep);
//             if (selPukeId >= play1.pukeNum)
//                 selPukeId = play1.pukeNum - 1;

//             if (play1.playPukes[selPukeId].isSel) {
//                 play1.playPukes[selPukeId].isSel = false;
//                 play1.playPukes[selPukeId].imgY += _pukeStep * 2;
//             } else {
//                 play1.playPukes[selPukeId].isSel = true;
//                 play1.playPukes[selPukeId].imgY -= _pukeStep * 2;
//             }
//         } else {
//             let selPukeIdStart = Math.floor((touchStartX - play1.pukeStartSite) / _pukeStep);
//             let selPukeIdEnd = Math.floor((touchEndX - play1.pukeStartSite) / _pukeStep);
//             if (selPukeIdEnd < selPukeIdStart) {
//                 let t = selPukeIdEnd;
//                 selPukeIdEnd = selPukeIdStart;
//                 selPukeIdStart = t;
//             }
//             if (selPukeIdEnd >= play1.pukeNum)
//                 selPukeIdEnd = play1.pukeNum - 1;
//             if (selPukeIdStart > selPukeIdEnd)
//                 selPukeIdStart = selPukeIdEnd;
//             for (let i = selPukeIdStart; i <= selPukeIdEnd; i++) {
//                 if (play1.playPukes[i].isSel) {
//                     play1.playPukes[i].isSel = false;
//                     play1.playPukes[i].imgY += _pukeStep * 2;
//                 } else {
//                     play1.playPukes[i].isSel = true;
//                     play1.playPukes[i].imgY -= _pukeStep * 2;
//                 }
//             }
//         }
//     }

//     //TODO
//     // 点击位置是出牌按钮
//     // if(){
//     //
//     // }

//     //响应点击后清屏重绘
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
// }


// //定义玩家
// let play1 = new _play();
// play1.pukeNum = 0;
// play1.pukeLen = (_pukeNum-1) * _pukeStep + _pukeW;
// play1.pukeStartSite = WIN_W/2 - play1.pukeLen/2;
// play1.pukeEndSite = WIN_W/2 + play1.pukeLen/2;
// play1.playPukes = new Array(_pukeNum);

// console.log(play1);

// // （pukeNum - 1）* step + pukeW  + 100 = WIN_W   +++++  step = pukeW * prop   ====>  (pukeNum * prop - prop + 1) * pukeW  + 100 = WIN_W




// //init初始化
// let pukeHeap = new _pukeHeap(54);
// getPuke(pukeHeap, play1, _pukeNum);

// let touchStartX;
// let touchStartY;
// let touchEndX;
// let touchEndY;

// wx.onTouchStart(function(e){
//     console.log("触摸开始");
//     // console.log(e);
//     // console.log(e.touches[0].clientX);

//     touchStartX = e.touches[0].clientX;
//     touchStartY = e.touches[0].clientY;
//     touchEndX = touchStartX;
//     touchEndY = touchStartY;
    
// })
// wx.onTouchMove(function(e){
//     console.log("触摸移动");
//     // console.log(e);
//     // console.log(e.touches[0].clientX);
//     touchEndX = e.touches[0].clientX;
//     touchEndY = e.touches[0].clientY;
// })
// wx.onTouchEnd(function(e){
//     console.log("触摸结束");
//     //判断点击位置
//     checkTouchSite();
// })
// wx.onTouchCancel(function(e){
//     console.log("触摸取消");
// })


// setInterval(function(){  //这里必须放入循环中才能显示图片

//     //绘制按钮
//     drawButton();

//     //绘制玩家手牌
//     drawPlayPukes();

// }, 16)


// 竖屏 横屏
// "deviceOrientation": "portrait",
//     "deviceOrientation": "landscape"

import {Main} from "./Main.js";
new Main();

