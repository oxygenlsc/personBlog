let cavs = document.getElementById('cavs');//获取画板
let ctx = cavs.getContext('2d');
cavs.width = window.innerWidth;
cavs.height = window.innerHeight;
let w = cavs.width;
let h = cavs.height;
let count = 30;
let rainarr = [];
function Rain() {

}

Rain.prototype = {
    init: function () {
        this.x = this.random(1, w);
        this.y = 0;
        this.r = 1;
        this.yspeed = this.random(4, 7)
        this.rspeed = 1;
        this.t = 1;
        this.ts = 0.96;
        this.l = this.random(h * 0.8, h * 0.9);
        this.maxR = 50;
    },
    random: function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    },
    draw: function () {
        if (this.y > this.l) {
            // 画一个圆形
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI, false)
            // ctx.arc(x,y,r,0,2*Math.PI,false)
            // XY 坐标 R半径 0起点度数 到终点度数  false 顺时针 true逆时针
            ctx.strokeStyle = this.getRandomColor(this.t)
            ctx.closePath()
            ctx.stroke();//开始绘制 默认颜色黑色
        } else {
            ctx.fillStyle = this.getRandomColor()
            ctx.fillRect(this.x, this.y, 2, 10)
        }
        this.updata();
    },
    updata: function () {
        if (this.y > this.l) {
            if (this.t > 0.03) {
                this.r += this.rspeed;
                if (this.r > this.maxR) {
                    this.t *= this.ts;
                }
            }
            else {
                this.init();
            }
        } else {
            this.y += this.yspeed;
        }
    },
    getRandomColor:function(t=1){
        return `rgba(${this.random(1,255)},${this.random(1,255)},${this.random(1,255)},${t})`
    }
}
function move() {
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < rainarr.length; i++) {
        // console.log( rainarr[i])
        rainarr[i].draw();
    }
    window.requestAnimationFrame(move)
}


function creatRain() {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            let rain = new Rain();
            rain.init();
            rainarr.push(rain);
        }, 200 * i);
    }
}
creatRain();
move();