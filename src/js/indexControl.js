(function(root) {
    function Index(len) {
        this.len = len; // 数据的长度，用于做判断
        this.index = 0; // 当前的索引
    }
    Index.prototype = {
        prev: function() { // 上一首
            return this.getIndex(-1);
        },
        next: function() { // 下一首
            return this.getIndex(1);
        },
        getIndex: function(val) { // 用来获取索引，包括越界判定
            this.index = (this.index + val + this.len) % this.len;
            return this.index;
        }
    }
    // 暴露构造函数，原因需要传递参数
    root.controlIndex = Index;
})(window.player || (window.player = {}))