define(function(require, exports, module){
    var $ = require('jquery');
    require('static/css/animate/custom.animate.css');

    exports.init = function(options) {
        var DEFAULTS = {
        	elem: null,
        	body: '#tw4_pages .pageItem.swiper-slide-active',
        	options: 'home,menu',//this.allOptions
        	title: '标题',
        	homeTitle: '主页',
        	menuUrl: '',
        	moreList: [
        		['首页', '#'],
        	]
        };
        this.options = $.extend({}, DEFAULTS, options);
	    this.allOptions = ['home','logo','title','menu','more'];

	    var headHtml = '';
        if(!!this.options.elem && this.options.elem.length){
        	var lists = this.options.options.split(',');
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
        	this.options.elem.html(headHtml);
	        this.event();
        }
    };

    //带logo的标题
    exports.logo = function(){
    	return '<span class="animated fadeIn item title logo">'+ this.options.title +'</span>';
    };

    //标题
    exports.title = function(){
    	return '<span class="animated fadeIn item title">'+ this.options.title +'</span>';
    };

    //主页
    exports.home = function(){
    	return '<span class="animated fadeInLeft item left btnHome">'+ this.options.homeTitle +'</span>';
    };

    //列表
    exports.menu = function(){
    	return '<span class="animated fadeInRight item right btnMenu"></span>';
    };

    //更多
    exports.more = function(){
    	return '<span class="animated fadeInRight item right btnMore"></span>';
    };

    //事件
    exports.event = function(){
    	var my = this;
    	//返回顶部
    	this.options.elem.off().on('click', '.title', function(event) {
    		event.preventDefault();
    		$(my.options.body).animate({scrollTop: '0px'}, 600);
    	})
    	//返回上一步
    	.on('click', '.btnHome', function(event) {
    		event.preventDefault();
    		var name = $(my.options.body).parent().find(':first-child').data('classname');
    		$('#page_pagination').find('.item_'+ name).trigger('click');
    	});
    	return this;
    };

});