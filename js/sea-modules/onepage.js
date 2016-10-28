define(function(require, exports, module){
    var $ = require('jquery');
    var $onepage = $('#tw4_onepage');
    var loader = require('m/loader/loader');

    exports.init = function(options) {
        var DEFAULTS = {
            elem: $('#tw4_container'),
            title: '标题',
            type: 1,//1为Html或jquery元素（./#开头），2为Iframe
            content: '',//html内容或者iframe连接地址
            show: true,
            backBtn: true,
            moreBtn: true,
            moreListTitle: '',//左侧列表标题
            moreListContent: '',//左侧列表Html
            fullScreen: false,
        };
        this.options = $.extend({}, DEFAULTS, options);
        if(this.options.elem.length){
            this.create().back();
        }
        return this;
    };

    //创建
    exports.create = function(){
        var my = this;
        var html = [];
        if($onepage.length === 0){
            $onepage = $('<div id="tw4_onepage"></div>');
            $onepage.appendTo(my.options.elem);
        }
        //全屏
        if(my.options.fullScreen){
            $onepage.addClass('fullScreen');
            html.push('<div class="quit"></div>');
        }else{
            $onepage.removeClass('fullScreen');
        }
        //头部
        html.push('<div class="op_header" id="op_header">');
        if(my.options.backBtn){
            html.push('<span class="item left btnBack"></span>');
        }
        if(my.options.moreBtn){
            html.push('<span class="item right btnMore" morelist="title:\''+ this.options.moreListTitle +'\',content:\''+ this.options.moreListContent +'\'"></span>');
        }
        html.push('<span class="item title">'+ my.options.title +'</span>');
        html.push('</div>');
        //内容
        if(my.options.type === 2){
            html.push('<div class="op_content" id="op_content" style="overflow:hidden;">');
            html.push('<iframe name="onepage_iframe" id="onepage_iframe" src="'+ my.options.content +'"></iframe>');
        }else{
            html.push('<div class="op_content" id="op_content">');
            if(/^[\.|#]\w+$/.test(my.options.content) && $(my.options.content).length){
                html.push($(my.options.content)[0].outerHTML);
            }else{
                html.push(my.options.content);
            }
        }
        html.push('</div>');
        $onepage.html(html.join(''));
        //是否显示
        my.options.show && my.show();
        //loader
        $iframe = $('#onepage_iframe');
        if($iframe.length){
            loader.init();
            if($iframe[0].attachEvent){
                $iframe[0].attachEvent("onload", function(){
                    loader.hide();
                });
            }else{
                $iframe[0].onload = function(){
                    loader.hide();
                };
            }
        }
        return this;
    };

    //显示
    exports.show = function(){
        $onepage.addClass('show');
        return this;
    };
    //隐藏
    exports.hide = function(){
        $onepage.removeClass('show');
        return this;
    };
    //返回按钮
    exports.back = function(){
        var my = this;
        $onepage.off().on('click', '.btnBack', function(event) {
            event.preventDefault();
            if(my.options.type === 2){
                try{
                    var $iframe = document.getElementById('onepage_iframe');
                    var primitiveSrc = $.trim($iframe.getAttribute('src'));
                    var nowSrc = $.trim($iframe.contentWindow.location.href);
                    var rule = function(str){
                        return str.replace(/^http[s]*:\/\//i, '').replace(/\/$/, '').replace(/\/$/, '');
                    }
                    var reg = new RegExp(rule(nowSrc).replace(rule(primitiveSrc), ''), 'i');
                    // console.log(rule(nowSrc),rule(primitiveSrc));
                    // console.log(reg);
                    // console.log(window.location.href);
                    // console.log(reg.test(rule(window.location.href)));
                    if(!reg.test(window.location.href)){
                        document.getElementById('onepage_iframe').contentWindow.history.back();
                    }else{
                        my.hide();
                    }
                }
                catch(err){
                    my.hide();
                }
            }else if(my.options.type === 1){
                my.hide();
            }
        })
        .on('click', '.quit', function(event) {
            event.preventDefault();
            my.hide();
        });
        return this;
    };

    //单页事件
    exports.event = function(){
        var my = this;
        $('body').off('click', '*[onepage]').on('click', '*[onepage]', function(event) {
            event.preventDefault();
            console.log(123);
            var str = $(this).attr('onepage');
            try{
                var obj = (new Function("return {" + str +'}'))();
                my.init(obj);
            }
            catch(err){
                console.log(err);
            }
        });
        return this;
    }

});