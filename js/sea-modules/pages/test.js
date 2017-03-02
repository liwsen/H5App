//测试页面
define(function(require, exports, module){
    var $ = require('jquery');
    var TRP = require('m/tempreplace').init({ id: 'test_content', className: ['grayBg']});

    exports.init = function(options) {
        var DEFAULTS = {
            prefix: 'op_content_',// 前缀
            onepage: null,// 页面数据
            data: null,// 异步加载数据
            tempData: {}// 模版中的数据
        };
        this.options = $.extend({}, DEFAULTS, options);
        this.$content = $('#'+ this.options.prefix + this.options.onepage.options.index);
        return this;
    };
    exports.setTempData = function() {
        var my = this;

        this.options.tempData = {
            title: '测试页面',
            data: JSON.stringify(my.options.data)
        };
    };
    exports.setTemplate = function() {
        return (function () {/*
            <!-- template star -->

            <div class="test-block"
                <h2>{{ title }}</h2>
                <hr />
                <p>我是异步读取数据的页面，读取的是Pages下面test.php文件。Json传输。</p>
                <h3>返回来的参数数据：</h3>
                {{data}}
                <h1>我是模版文件。。。</h1>
            </div>
            
            <!-- template end -->       
        */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
    };
    exports.display = function() {
        var my = this;
        var template = this.setTemplate();
        // 设值
        this.setTempData();

        if(!this.options.onepage){
            template = '暂无数据';
        }

        // 更新模版
        TRP.done(template, this.options.tempData, function(html){
            my.$content.html(html);
        });

        return this;
    };

});