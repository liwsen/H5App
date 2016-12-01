
define(function(require, exports, module){
    exports.set = function(name,value,time) {
        time = !!time ? time : 7*24*60*60*1000;
        var exp = new Date();
        exp.setTime(exp.getTime() + time);
        document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
    };
    exports.get = function(name) {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg))
            return unescape(arr[2]);
        else
            return null;
    };
    exports.del = function(name) {
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=this.get(name);
        if(cval!=null)
            document.cookie= name + "="+cval+";expires="+exp.toGMTString();
    };
});