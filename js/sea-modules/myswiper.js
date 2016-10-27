define(function(require, exports, module){
    require('swiper-css');
    exports.done = function(callback) {
        require.async(['swiper'], function(swiper) {
        	callback && callback();
        });
    };
});