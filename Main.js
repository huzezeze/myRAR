import {DataStore} from "./js/base/DataStore.js";
import {ResourceLoader} from "./js/base/ResourceLoader.js";
import {Director} from "./js/Director.js";


export class Main{
    constructor() {
        console.log('main构造函数');
        this.canvas = wx.createCanvas();
        this.ctx = this.canvas.getContext('2d');
        this.dataStore = DataStore.getInstance();
        this.director = Director.getInstance();
        const loader = ResourceLoader.create();
        loader.onLoaded(map => this.onResourceFirstLoaded(map));


    }

    onResourceFirstLoaded(map) {
        console.log('main加载资源');
        this.dataStore.canvas = this.canvas;
        this.dataStore.ctx = this.ctx;
        this.dataStore.res = map;

        this.dataStore.debug = false;


        this.init();
        // this.createBackgroundMusic();
        // const examples = new ApiExamples();
        // examples.getUserInfo();
        // examples.login();
        // examples.getSettings();
        // examples.httpExample();
        // examples.socketExample();
        // examples.download();
        // this.init();
        // this.director.isGameOver = true;
        // this.dataStore
        //     .put('background', BackGround)
        //     .put('beginButton',BeginButton);
        // this.dataStore.get('background').draw();
        // this.dataStore.get('beginButton').draw();
        // this.registerEvent();
    }

    init() {
        if(this.dataStore.debug){
            console.log('main初始化');
        }
        // wx.showModal({
        //     title: '提示',
        //     content: '这是一个模态弹窗',
        //     success: function(res) {
        //         if (res.confirm) {
        //             console.log('用户点击确定')
        //         } else if (res.cancel) {
        //             console.log('用户点击取消')
        //         }
        //     }
        // })

        this.director.init();
    }
}