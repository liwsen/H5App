define(function(require, exports, module){

    exports.init = function(options) {
        var DEFAULTS = {
            id: 'test_content',
            className: []
        };
        this.options = $.extend({}, DEFAULTS, options);
        return this;
    };
    exports.done = function(temp,data,cb) {
        var className = this.options.className;
        var cName = '';
        if(typeof temp !== 'string' || !temp){
            temp = this.temp || '';
        }
        if(typeof data === 'object'){
            for(var k in data){
                var reg = new RegExp('{{([ ]*)'+ k +'([ ]*)}}', 'g');
                if(reg.test(temp)){
                    temp = temp.replace(reg, data[k]);
                }
            }
        }
        this.temp = temp;
        if(typeof className === 'object' && className instanceof Array){
            cName = className.join(' ');
        }else if(typeof className === 'string'){
            cName = className;
        }
        // 回调
        typeof cb === 'function' && cb('<div id="'+ this.options.id +'" class="opContainer '+ cName +'"><div class="pageBlock">'+ temp +'</div></div>');
        return this;
    };
});