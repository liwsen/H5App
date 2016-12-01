//测试页面
define(function(require, exports, module){
    var $ = require('jquery');

    exports.init = function(options) {
        var DEFAULTS = {
            prefix: 'op_content_',//前缀
            onepage: null,//页面数据
            data: null,//异步加载数据
        };
        this.options = $.extend({}, DEFAULTS, options);
        this.$content = $('#'+ this.options.prefix + this.options.onepage.options.index);
        return this;
    };
    exports.display = function() {
        var my = this;
        var content = [];
        var op = my.options.onepage;
        var data = my.options.data;

        content.push('<div id="test_content" class="opContainer grayBg">');
        if(!!op && !!data){
            content.push('\
                <div class="pageBlock">\
                    <div class="qyLists">\
                        <p>我是异步读取数据的页面，读取的是Pages下面test.php文件。Json传输。</p>\
                        <h3>返回来的参数数据：</h3>\
                        '+ JSON.stringify(data) +'\
                    </div>\
                </div>\
            ');
        }else{
            content.push('<div class="pageBlock">暂无数据</div>');
        }
        content.push('</div>');
        my.$content.html(content.join(''));
        return my;
    };
});