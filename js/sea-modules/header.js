define(function(require, exports, module){
    var $ = require('jquery');
    var fn = require('m/fn');
    require('static/css/animate/custom.animate.css');

    exports.init = function(options) {
        var DEFAULTS = {
        	elem: null,
        	body: '#tw4_pages .pageItem.swiper-slide-active',
        	options: 'home,menu',//this.allOptions
        	title: '标题',
            menuTitle: '',
            menuClassName: '',
        	menuUrl: '',
            moreListTitle: '',//左侧列表标题
            moreListClassName: '',//左侧列表样式名称
            moreListContent: '',//左侧列表Html
            customHeader: '',//自定义头部，该项不为空，options无效
        };
        this.options = $.extend({}, DEFAULTS, options);
	    this.allOptions = ['home','logo','title','menu','more'];

	    var headHtml = '';
        if(!!this.options.elem && this.options.elem.length){
            var lists = this.options.options.split(',');
            if(!!this.options.customHeader){
                // if($.inArray('home', lists) !== -1){
                //     headHtml += this.home();
                // }
                if(/^[\.|#]\w+$/.test(this.options.customHeader) && $(this.options.customHeader).length){
                    headHtml += $(this.options.customHeader)[0].outerHTML;
                }else{
                    headHtml += this.options.customHeader;
                }
            }else{
                for (var i = 0; i < lists.length; i++) {
                    if($.inArray('logo', lists) !== -1 && $.inArray('title', lists) !== -1){
                        if('title' === lists[i]){
                            continue;
                        }
                    }
                    if($.inArray(lists[i], this.allOptions) !== -1 && this.hasOwnProperty(lists[i])){
                        headHtml += this[lists[i]]();
                    }
                }
            }
        	this.options.elem.html(headHtml).find('.hide').removeClass('hide');
	        this.event();
        }
    };

    //带logo的标题
    exports.logo = function(){
    	return '<span class="animated fadeIn item title logo">'+ fn.htmlspecialchars_decode(this.options.title) +'</span>';
    };

    //标题
    exports.title = function(){
    	return '<span class="animated fadeIn item title">'+ fn.htmlspecialchars_decode(this.options.title) +'</span>';
    };

    //主页
    exports.home = function(){
    	return '<span class="animated fadeInLeft item left btnHome"></span>';
    };

    //列表
    exports.menu = function(){
        var menuTitle = this.options.menuTitle || this.options.title;
    	return '<span class="animated fadeInRight item right btnMenu '+ this.options.menuClassName +'" onepage="title:\''+ menuTitle +'\',type:2,content:\''+ this.options.menuUrl +'\'"></span>';
    };

    //更多
    exports.more = function(){
    	return '<span class="animated fadeInRight item right btnMore '+ this.options.moreListClassName +'" morelist="title:\''+ this.options.moreListTitle +'\',content:\''+ this.options.moreListContent +'\'"></span>';
    };

    //事件
    exports.event = function(){
    	var my = this;
    	//返回顶部
    	this.options.elem.off('click', '.title').on('click', '.title', function(event) {
    		event.preventDefault();
    		$(my.options.body).animate({scrollTop: '0px'}, 600);
    	})
        //返回上一步
        .off('click', '.btnHome').on('click', '.btnHome', function(event) {
            event.preventDefault();
            var initialSlide = TW4MAIN.options.initialSlide || 0;
            $('#page_pagination').find('.paginationItem').eq(initialSlide).trigger('click');
        });
    	return this;
    };

});