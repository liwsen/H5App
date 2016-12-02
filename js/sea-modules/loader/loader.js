define(function(require, exports, module){
    var $ = require('jquery');
    var $loader = $('#tw4_loader');
    require('m/loader/loader.css');

    exports.init = function(options) {
        var DEFAULTS = {
            elem: $('#tw4_container'),
        };
        this.options = $.extend({}, DEFAULTS, options);
        if(this.options.elem.length){
            this.loader();
        }
        return this;
    };

    //加载
    exports.loader = function() {
        if($loader.length === 0){
            $loader = $('<div id="tw4_loader" class="animated fadeIn show"></div>');
            $loader.appendTo(this.options.elem);
        }else{
            $loader.addClass('show');
        }
        $loader.html('<span class="_loader center"></div>');
        return this;
    };
    //隐藏
    exports.hide = function() {
        $loader.removeClass('show');
        return this;
    };

});