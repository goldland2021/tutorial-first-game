// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
       
       jumpHeight: 0,
       // 主角跳跃高度
       jumpDuration: 0,
       // 主角跳跃持续时间
       maxMoveSpeed: 0,
       // 最大移动速度
       accel: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    runJumpAction () {
        
        var jumpUp = cc.tween().by(this.jumpDuration,{y: this.jumpHeight},{easing: 'sineOut'});
        // 跳跃上升
        
        var jumpDown = cc.tween().by(this.jumpDuration,{y:-this.jumpHeight},{easing: 'sineIn'});
        // 下落

        var tween = cc.tween().sequence(jumpUp, jumpDown);
        // 创建一个缓动，按jumpup、jumpDown 的顺序执行动作

        return cc.tween().repeatForever(tween);
        // 不断重复
    },

    onLoad: function() {

        // 初始化跳跃动作
        var jumpAction = this.runJumpAction();
        cc.tween(this.node).then(jumpAction).start()


        // 加速度方向开关
        this.accLeft = false;
        this.accRight = false;
        
        // 主角当前水平方向速度
        this.xSpeed = 0;

        // 初始化键盘输入监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onkeydown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP,this.onkeydown,this);
    },

    onDestroy () {
        cc.systemEvent.off('keydown',this.onKeyDown,this);
        cc.systemEvent.off('keyup',this.onKeyUp,this);
    },

    onkeydown(event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = true;
                break;
            case cc.macro.KEY.d:
                this.accRight = true;
                break;
        }
    },

    onkeyup(event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = false;
            case cc.macro.KEY.d:
                this.accRight = false;
                break;
        }
    },
    
    update: function (dt) {
        if(this.accLeft) {
            this.xSpeed -= this.accel * dt;
        }
        else if(this.accRight) {
            this.xSpeed += this.accel * dt;
        }

        if(Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }
        
        // 根据当前的速度更新主角的位置
        this.node.x += this.xSpeed * dt; 
    },

});

