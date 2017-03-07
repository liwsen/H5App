define(function(require, exports, module){
    var $ = require('jquery');
    var route = require('m/route');
    var $list = $('#tw4_more_list');
    var $container = $('#tw4_container');

    exports.init = function(options) {
        var DEFAULTS = {
            title: '',
            content: '',
        };
        this.options = $.extend({}, DEFAULTS, options);
        if(!!this.options.content){
            this.setHtml();
            //事件
            $list.off('click', '.moreListBg').on('click', '.moreListBg', this.hide)
            .off('click', '*[onepage]').on('click', '*[onepage]', this.hide);
        }
        return this;
    };

    //添加
    exports.setHtml = function() {
        var html = [];
        var hasClass = '';
        if($list.length === 0){
            $list = $('<div id="tw4_more_list"></div>');
            $list.appendTo($('body'));
        }
        html.push('<div class="moreListBg"></div>');
        html.push('<div class="wrapper">');
        //头部
        if(!!this.options.title){
            html.push('<div class="moreBlockHeader">'+ this.options.title +'</div>');
            hasClass = 'hasHeader';
        }
        //内容
        var content = this.options.content;
        if(/^[\.|#]\w+$/.test(this.options.content) && $(this.options.content).length){
            content = $(this.options.content)[0].outerHTML;
        }
        html.push('<div class="moreBlockContent '+ hasClass +'">'+ content +'</div>');
        html.push('</div>');
        $list.html(html.join('')).find('.hide').removeClass('hide');

        route.set('_nav', 1);//设置路由
        
        setTimeout(this.show,200);
        return this;
    };
    //显示
    exports.show = function(){
        $container.css({left: '80%', right: '-80%'});
        $list.addClass('show');
        return this;
    };
    //隐藏
    exports.hide = function() {
        $container.css({left: 0, right: 0});
        $list.removeClass('show');
        route.back();//路由后退一步
        return this;
    };

});