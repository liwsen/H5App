define(function(require, exports, module){
    var $ = require('jquery');
    var idprefix = 'tw4_onepage_';//ID前缀
    var pagesClass = 'tw4Onepage';
    var container = 'tw4_container';
    var moreList = 'tw4_more_list';
    var oldStatus = null;//上一次状态
    require('static/js/jquery.hash');

    //响应路由
    window.addEventListener("hashchange", function(){
        var hash = window.location.hash;
        var nav_reg = /;_nav=(\d+)/;
        var route_page = $.hash("_p") || -1;
        var route_nav = $.hash("_nav") || 0;
        var $btnMore = $('#'+ idprefix + route_page).find('.btnMore');
        var status = route_nav+':'+route_page;

        // 判断状态，路由一致但路径字符位置不一致时，取值判断，值为一致时，自动后退一步。
        if(oldStatus !== null && oldStatus === status){
            history.go(-1);
            oldStatus = null;
        }

        $('.'+ pagesClass).each(function(index, el) {
        	if($(this).data('index') > route_page){
        		$(this).css({left:'100%',right:'-100%'}).removeClass('show');
        	}
        });

        if($('#'+ moreList).hasClass('show')){
            $('#'+ container).css({left: 0, right: 0});
            $('#'+ moreList).removeClass('show');
            $.hash('_nav', null);
        }else if($btnMore.length && !!route_nav){
            setTimeout(function(){
                $('#'+ container).css({left: '80%', right: '-80%'});
                $('#'+ moreList).addClass('show');
            },200);
        }
        // 设置状态
        oldStatus = status;
    }, false);
    //设置路由
    exports.set = function(name, val){
    	if(!name){
    		name = '_p';
    	}
    	if(val !== '' && val !== 'undefined'){
			$.hash(name, val);
    	}else{
			$.hash(name, null);
    	}
    };
    exports.back = function(){
        history.go(-1);
    };
});