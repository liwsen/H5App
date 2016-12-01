define(function(require, exports, module){
    require('static/js/base64');
    var b = new Base64();  

    exports.encode = function(str){
        return b.encode(String(str));
    };
    exports.decode = function(str){
        return b.decode(String(str));
    };
});