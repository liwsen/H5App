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
            show: true,//初始化时是否直接显示
            backBtn: true,//返回按钮是否显示
            moreBtn: true,//更多按钮是否显示
            moreListTitle: '',//左侧列表标题
            moreListContent: '',//左侧列表Html
            fullScreen: false,
            customHeader: '',//自定义头部，该项不为空，title,moreBtn,moreListTitle,moreListContent无效
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
            $onepage.addClass('hasBack');
        }
        if(!!my.options.customHeader){
            if(/^[\.|#]\w+$/.test(my.options.customHeader) && $(my.options.customHeader).length){
                html.push($(my.options.customHeader)[0].outerHTML);
            }else{
                html.push(my.options.customHeader);
            }
        }else{
            if(my.options.moreBtn){
                html.push('<span class="item right btnMore" morelist="title:\''+ my.options.moreListTitle +'\',content:\''+ my.options.moreListContent +'\'"></span>');
                $onepage.addClass('hasMore');
            }
            html.push('<span class="item title">'+ my.options.title +'</span>');
        }
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
        $onepage.html(html.join('')).find('.hide').removeClass('hide');
        //是否显示
        my.options.show && my.show();
        //loader
        my.iframe = $('#onepage_iframe');
        if(my.iframe.length){
            loader.init();
            if(my.iframe[0].attachEvent){
                my.iframe[0].attachEvent("onload", function(){
                    loader.hide();
                });
            }else{
                my.iframe[0].onload = function(){
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
                    var primitiveSrc = $.trim(my.iframe[0].getAttribute('src'));
                    var nowSrc = $.trim(my.iframe[0].contentWindow.location.href);
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
                    console.log(err);
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