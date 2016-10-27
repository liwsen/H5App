define(function(require, exports, module){
    var $ = require('jquery');
    var HEAD = require('m/header');
    var ONEPAGE = require('m/onepage');
    var $header = $('#header');
    var myswiper = require('m/myswiper');

    exports.init = function(options) {
        var DEFAULTS = {
        	initialSlide: 0,
        };
        this.options = $.extend({}, DEFAULTS, options);
        
        this.headerOptionsType = 0;
        this.swiperEffect().headerOptions(this.headerOptionsType);
        ONEPAGE.event();
        return this;
    };

    //整体滑动效果
    exports.swiperEffect = function(){
    	var my = this;
		var $pages = $('#tw4_pages').find('.pageItem');
		var paginationClassName = 'paginationItem';
		var swiperResize = function(swiper){
			var $items = $('#page_pagination').find('.'+ paginationClassName);
    		$items.css({width: (100/$items.length) + '%'});
		};

        myswiper.done(function(){
        	swiper = new Swiper('#tw4_pages', {
		        pagination: '#page_pagination',
		        paginationClickable: true,
				paginationBulletRender: function (index, className) {
					var myclass = $pages.eq(index).data('classname')||index;
					var icon = $pages.eq(index).data('icon');
					var iconhover = $pages.eq(index).data('iconhover');
					return '<div class="item_'+ myclass +' '+ paginationClassName +' '+ className +'"><span>' + $pages.eq(index).data('title') + '</span><img class="defIcon" src="'+ icon +'"><img class="hoverIcon" src="'+ iconhover +'"></div>';
				},
				onInit: swiperResize,
				// observer:true,
				// observeParents:true,
				onTransitionEnd: function(swiper){
					if(my.headerOptionsType !== swiper.activeIndex){
						my.headerOptionsType = swiper.activeIndex;
						my.headerOptions(swiper.activeIndex);
					}
				},
				parallax : true,
				roundLengths : true,
				initialSlide : my.options.initialSlide,//初始化slide
		    });
	    	$(window).on('resize', function(event) {
		    	event.preventDefault();
		    	swiperResize(swiper);
		    });
        });
		return my;
    };

    //头部配置
    exports.headerOptions = function(type){
    	if(typeof type === 'undefined' || type === 0){
    		HEAD.init({elem: $header, title: '主页标题', options: 'logo,menu'});
    	//公告头部
    	}else if(type === 1){
    		HEAD.init({elem: $header, title: '公告通知', options: 'title,menu,home'});
    	//搜索头部
    	}else if(type === 2){
    		HEAD.init({elem: $header, title: '搜索', options: 'title,more,home'});
    	//联系我们
    	}else if(type === 3){
    		HEAD.init({elem: $header, title: '联系我们', options: 'title,home,more'});
    	}
    	return this;
    }

});