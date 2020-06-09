(function(root) {
    function Progress() {
        this.totalTime = 0; // 歌曲总时长
        this.startTime = 0; // 歌曲开始播放的时间
        this.frameId = 0; // 定时器
        this.lastPer = 0; // 记录上一次播放的时间
        this.init();
    }
    Progress.prototype = {
        init: function() {
            this.getDom();
        },
        getDom: function() {
            this.curTime = document.querySelector('.curTime');
            this.circle = document.querySelector('.circle');
            this.frontBg = document.querySelector('.frontBg');
            this.allTime = document.querySelector('.totalTime');
        },
        renderTotalTime: function(time) {
            // console.log(time);
            this.totalTime = time;
            time = this.formatTime(time);
            this.allTime.innerHTML = time;
        },
        formatTime: function(time) {
            time = Math.round(time);
            var m = Math.floor(time / 60);
            var s = time % 60;
            m = m < 10 ? '0' + m : m;
            s = s < 10 ? '0' + s : s;
            return m + ':' + s;
        },
        move: function(per, isDrag) {
            var _this = this;
            this.lastPer = per === undefined ? Math.ceil(this.lastPer) === 1 ? 0 : this.lastPer : per;

            this.startTime = new Date().getTime();

            cancelAnimationFrame(this.frameId);

            function frame() {
                var curTime = new Date().getTime();
                var per = _this.lastPer + (curTime - _this.startTime) / (_this.totalTime * 1000);

                if (per <= 1) {
                    _this.update(per, isDrag);
                } else {
                    cancelAnimationFrame(this.frameId);
                }
                
                _this.frameId = requestAnimationFrame(frame)
            } // 100 / 60
            frame();
        },
        update: function(per, isDrag) {
            var time = this.formatTime(per * this.totalTime);
            this.curTime.innerHTML = time;

            // 更新前背景的位置
            this.frontBg.style.width = per * 100 + '%';

            // 如果用户的操作是拖拽，小圆点的位置就不用更新了
            if (isDrag) {
                return; 
            }

            // 更新圆点的位置
            var disX = per * this.circle.parentNode.offsetWidth;
            this.circle.style.transform = 'translateX(' + disX + 'px)';
        },
        stop: function() {
            cancelAnimationFrame(this.frameId);
            var stopTime = new Date().getTime();
            this.lastPer += (stopTime - this.startTime) / (this.totalTime * 1000);
        }
    }

    function Drag() {
        this.dom = document.querySelector('.circle');
        this.startPointX = 0;
        this.per = 0;
        this.startLeft = 0; // 存储上一次拖拽的位置
        this.init();
    }
    Drag.prototype = {
        init: function() {
            var _this = this;
            this.dom.style.transform = 'translateX(0)';
            this.dom.addEventListener('touchstart', function(e) {
                _this.startPointX = e.changedTouches[0].pageX;
                _this.startLeft = parseFloat(this.style.transform.split('(')[1]); // ['translateX', '10px)']
                _this.start && _this.start();
            });
            this.dom.addEventListener('touchmove', function(e) {
                _this.disPointX = e.changedTouches[0].pageX - _this.startPointX;
                var disX = _this.disPointX + _this.startLeft;
                
                if (disX < 0) {
                    disX = 0
                } else if (disX > this.offsetParent.offsetWidth) {
                    disX = this.parentNode.offsetWidth
                }

                this.style.transform = 'translateX(' + disX + 'px)';
                _this.per = disX / this.parentNode.offsetWidth;

                _this.move && _this.move(_this.per);
            });
            this.dom.addEventListener('touchend', function(e) {
                _this.end && _this.end(_this.per);
            });
        }
    }

    root.progress = {
        pro: new Progress(),
        drag: new Drag()
    }
})(window.player || (window.player = {}))