define(function(require, exports, module){
    var $ = require('jquery');

    /* ===默认回调函数========================================================= */
    exports.base = function(file, op, data){
        require.async('m/pages/'+ file, function(a) {
            a.init({
                onepage: op,
                data: data
            })
            .display();
        });
    };

});