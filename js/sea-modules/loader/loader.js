define(function(require, exports, module){
    var $ = require('jquery');
    var $loader = $('#tw4_loader');
    require('m/loader/loader.css');
    require('static/js/jquery.hash');

    exports.init = function(options) {
        var my = this;
        var DEFAULTS = {
            elem: $('#tw4_container'),
        };
        my.options = $.extend({}, DEFAULTS, options);
        if(my.options.elem.length){
            my.loader();
        }

        return my;
    };

    //加载
    exports.loader = function() {
        var my = this;
        if($loader.length === 0){
            $loader = $('<div id="tw4_loader" class="animated fadeIn show"></div>');
            $loader.appendTo(my.options.elem);
        }else{
            $loader.addClass('show');
        }
        $loader.html('<span class="_loader center"></div>');

        // 路由响应，改变时，隐藏loader
        window.addEventListener("hashchange", function(){
            setTimeout(my.hide, 500);
        }, false);
        return my;
    };
    //隐藏
    exports.hide = function() {
        $loader.removeClass('show');
        return this;
    };

});