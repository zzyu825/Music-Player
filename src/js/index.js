(function ($, player) {
    function MusicPlayer(dom) {
        this.wrap = dom; // 播放器的容器
        this.dataList = []; // 存储请求到的数据
        this.curIndex = 0; // 当前歌曲的索引
        this.rotateImgTimer = null; // 旋转图片的计时器
    }

    MusicPlayer.prototype = {
        init: function() { // 初始化
            this.getDom(); // 获取元素
            this.getData('../mock/data.json'); // 请求数据
        },
        getDom: function() { // 获取元素
            // 获取底部导航里的所有按钮
            this.controlBtns = document.querySelectorAll('.control li');
            // 获取旋转图片
            this.record = document.querySelector('.songImg img');
        },
        getData: function(url) {
            var _this = this;
            $.ajax({
                url: url,
                method: 'get',
                success: function(data) {
                    _this.dataList = data;
                    _this.loadMusic(_this.curIndex); // 加载音乐
                    _this.musicControl(); // 添加音乐操作的功能
                },
                error: function(err) {
                    console.log('数据请求失败：' + err)
                }
            })
        },
        loadMusic: function(index) { // 加载音乐
            // console.log(this.dataList, index)
            player.render(this.dataList[index]); // 渲染歌曲图片和信息
            player.music.load(this.dataList[index].audioSrc);
            // 播放音乐(只有状态为play才能播放)
            if (player.music.status === 'play') {
                player.music.play();
                this.controlBtns[2].className = 'playing'; // 切换暂停图片
                this.imgRotate(0);
            }
            
        },
        musicControl: function() { // 控制音乐（播放、暂停、上/下一首）
            var _this = this;
            // 播放、暂停
            this.controlBtns[2].addEventListener('touchend', function() {
                if (player.music.status === 'play') {
                    player.music.pause(); // 暂停
                    this.className = ''; // 切换播放图片
                    _this.imgStop(); // 停止旋转
                } else {
                    player.music.play(); // 播放
                    this.className = 'playing'; // 切换暂停图片
                    var deg = _this.record.dataset.rotate || 0;
                    _this.imgRotate(deg); // 旋转图片
                }
            });
            // 上一首
            this.controlBtns[1].addEventListener('touchend', function() {
                player.music.status = 'play';
                _this.loadMusic(--_this.curIndex);
            })
            // 下一首
            this.controlBtns[3].addEventListener('touchend', function() {
                player.music.status = 'play';
                _this.loadMusic(++_this.curIndex);
            })
        },
        imgRotate: function(deg) { // 旋转图片
            var _this = this;
            clearInterval(this.rotateImgTimer);
            this.rotateImgTimer = setInterval(function() {
                deg = +deg + 0.2;
                _this.record.style.transform = 'rotate(' + deg + 'deg)';
                _this.record.dataset.rotate = deg; // 为了暂停后继续播放能够获取到
            }, 1000 / 60);
        },
        imgStop: function() { // 停止图片旋转
            clearInterval(this.rotateImgTimer);
        }
    }

    var musicPlayer = new MusicPlayer(document.getElementById('wrap'));
    musicPlayer.init();

})(window.Zepto, window.player)