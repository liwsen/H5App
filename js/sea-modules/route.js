define(function(require, exports, module){
    var $ = require('jquery');
    var pagesClass = 'tw4Onepage';
    var container = 'tw4_container';
    var moreList = 'tw4_more_list';
    require('static/js/jquery.hash');

    //响应路由
    window.addEventListener("hashchange", function(){
        var route_page = $.hash("_p") || -1;
        var route_nav = $.hash("_nav") || 0;

        if($('#'+ moreList).hasClass('show')){
	        $('#'+ container).css({left: 0, right: 0});
	        $('#'+ moreList).removeClass('show');
            $.hash('_nav', null);
        }
        if(!route_nav){
	        $('.'+ pagesClass).each(function(index, el) {
	        	if($(this).data('index') > route_page){
	        		$(this).css({left:'100%',right:'-100%'}).removeClass('show');
	        	}
	        });
        }
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
    exports.display = function(){
    };
});