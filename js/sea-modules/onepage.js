define(function(require, exports, module){
    require('static/js/sha1');//加密函数
    var $ = require('jquery');
    var $callback = require('m/callback');//回调函数处理
    var $onepage = null;
    var loader = require('m/loader/loader');
    var fn = require('m/fn');
    var pagesOptions = {};//各个单页配置
    var idprefix = 'tw4_onepage_';//ID前缀
    var pagesClass = 'tw4Onepage';
    var pageCache = {};//异步加载数据缓存

    exports.init = function(options) {
        var my = this;
        var DEFAULTS = {
            elem: $('#tw4_container'),
            title: '标题',
            type: 1,//1为Html或jquery元素（./#开头），2为Iframe，3为异步加载数据并缓存
            content: '',//html内容或者iframe连接地址
            show: true,//初始化时是否直接显示
            backBtn: true,//返回按钮是否显示
            moreBtn: false,//更多按钮是否显示
            moreListTitle: '',//左侧列表标题
            moreListContent: '',//左侧列表Html
            fullScreen: false,//全屏显示
            quitBtn: false,//全屏显示的情况下，是否显示退出按钮
            customHeader: '',//自定义头部，该项不为空，title,moreBtn,moreListTitle,moreListContent无效
            ajaxData: {},//type为3时，异步传递的数据
            callback: null,//回调函数，(输出名称:文件名)，中间用':'隔开，只有文件名时，输出名称默认为base
            index: 0,//单页索引，标识第几个单页
        };
        my.options = $.extend({}, DEFAULTS, options);

        //回调函数处理
        if(!!my.options.callback){
            if(/:/.test(my.options.callback)){
                my.callbackName = $.trim(my.options.callback.split(':')[0]);
                my.callbackValue = $.trim(my.options.callback.split(':')[1]);
            }else{
                my.callbackName = 'base';
                my.callbackValue = $.trim(my.options.callback);
            }
        }

        //操作
        if(my.options.elem.length){
            //单页元素
            $onepage = $('#'+idprefix+parseInt(my.options.index, 10));
            //创建
            my.create().back();
            //记录单页配置
            pagesOptions[idprefix+ my.options.index] = my.options;
        }

        //返回函数，使用在iframe子页面下调用。window.parent.onepage_back();
        window['onepage_back'] = my.hide;

        return my;
    };

    //创建
    exports.create = function(){
        var my = this;
        var html = [];

        if($onepage.length === 0){
            $onepage = $('<div id="'+ idprefix + my.options.index +'" class="'+ pagesClass +'" data-index="'+ my.options.index +'"></div>');
            $onepage.appendTo(my.options.elem).css('z-index', 90+parseInt(my.options.index, 10));
        }
        //全屏
        if(my.options.fullScreen){
            $onepage.addClass('fullScreen');
            if(my.options.quitBtn){
                html.push('<div class="quit"></div>');
            }
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
                html.push(fn.htmlspecialchars_decode(my.options.customHeader));
            }
        }else{
            if(my.options.moreBtn){
                html.push('<span class="item right btnMore" morelist="title:\''+ my.options.moreListTitle +'\',content:\''+ my.options.moreListContent +'\'"></span>');
                $onepage.addClass('hasMore');
            }
            html.push('<span class="item title">'+ fn.htmlspecialchars_decode(my.options.title) +'</span>');
        }
        html.push('</div>');

        //==============================================
        //异步加载数据内容时，并缓存数据
        if(my.options.type === 3 && !!my.options.content){
            loader.init();
            var appendHtml = function(html, content){
                html.push('<div class="op_content" id="op_content_'+ my.options.index +'">');
                html.push(content);
                html.push('</div>');
                $onepage.html(html.join('')).find('.hide').removeClass('hide');
                //是否显示
                my.options.show && my.show();
            };
            var cacheKey = hex_sha1(my.options.content+JSON.stringify(my.options.ajaxData));

            //缓存页面
            if(pageCache.hasOwnProperty(cacheKey)){//缓存存在
                appendHtml(html, '');
                //回调函数
                loader.hide();
                $callback[my.callbackName] && $callback[my.callbackName](my.callbackValue, my, pageCache[cacheKey]);

            }else{//缓存不存在
                $.ajax({
                    url: my.options.content,
                    type: 'POST',
                    dataType: 'json',
                    data: my.options.ajaxData,
                    // contentType: "application/json;charset=utf-8",
                })
                .done(function(data) {
                    if(data.status){
                        appendHtml(html, '');
                        //缓存
                        pageCache[cacheKey] = data.data;
                        //回调函数
                        $callback[my.callbackName] && $callback[my.callbackName](my.callbackValue, my, pageCache[cacheKey]);
                    }else{
                        appendHtml(html, data.msg);
                    }
                })
                .fail(function() {
                    appendHtml(html, '加载失败！');
                })
                .always(function() {
                    loader.hide();
                });
            }


        //==============================================
        //非异步加载数据内容时
        }else{
            if(my.options.type === 2 && !!my.options.content){
                html.push('<div class="op_content" id="op_content_'+ my.options.index +'" style="overflow:hidden;">');
                html.push('<iframe name="onepage_iframe_'+ my.options.index +'" id="onepage_iframe_'+ my.options.index +'" src="'+ my.options.content +'"></iframe>');
            }else{
                html.push('<div class="op_content" id="op_content_'+ my.options.index +'">');
                if(/^[\.|#]\w+$/.test(my.options.content) && $(my.options.content).length){
                    html.push($(my.options.content)[0].outerHTML);
                }else{
                    html.push(fn.htmlspecialchars_decode(my.options.content));
                }
            }
            html.push('</div>');
            $onepage.html(html.join('')).find('.hide').removeClass('hide');
            //是否显示
            my.options.show && my.show();
            //loader
            my.iframe = $('#onepage_iframe_'+ my.options.index);
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
            //回调函数
            $callback[my.callbackName] && $callback[my.callbackName](my.callbackValue, my, pageCache[cacheKey]);
        }
        return this;
    };

    //恢复到当前单页
    exports.recovery = function(id){
        if(!!id && idprefix+this.options.index !== id){
            $onepage = $('#'+id);
            this.options = pagesOptions[id];
        }
    };
    //显示
    exports.show = function(){
        setTimeout(function(){
            $onepage.css({left:0,right:0}).addClass('show');
        }, 50);//稍作停顿，实现滑动效果
        return this;
    };
    //隐藏
    exports.hide = function(){
        $onepage.css({left:'100%',right:'-100%'}).removeClass('show');
        return this;
    };
    //返回按钮
    exports.back = function(){
        var my = this;
        //返回
        $onepage.off().on('click', '.btnBack', function(event) {
            event.preventDefault();
            my.recovery($(this).closest('.'+ pagesClass).attr('id'));//检查响应页面
            if(my.options.type === 2 && !!my.options.content){
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
                        document.getElementById('onepage_iframe_'+ my.options.index).contentWindow.history.back();
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
            }else{
                my.hide();
            }
        })
        //退出全屏
        .on('click', '.quit', function(event) {
            event.preventDefault();
            my.recovery($(this).closest('.'+ pagesClass).attr('id'));//检查响应页面
            my.hide();
        });
        return this;
    };
    //数据加密
    exports.encrypted = function(u,p){
        return hex_sha1(u+hex_sha1(p));
    };

    //单页事件
    exports.event = function(){
        var my = this;
        $('body').find('*[data-onepage]').each(function(index, el) {
            var op = $(this).data('onepage');
            if(!!op && typeof onepages !== 'undefined' && onepages.hasOwnProperty(op) && !!onepages[op]){
                $(this).attr('onepage', onepages[op]);
            }
        });
        $('body').off('click', '*[onepage]').on('click', '*[onepage]', function(event) {
            event.preventDefault();
            var str = $(this).attr('onepage');
            try{
                var obj = (new Function("return {" + str +'}'))();
                //初始化异步传递数据
                if(!obj.hasOwnProperty('ajaxData')){
                    obj['ajaxData'] = {};
                }
                obj.ajaxData['isOnepage'] = true;
                //初始化
                my.init(obj);
            }
            catch(err){
                console.log(err);
            }
        });
        return this;
    }

});