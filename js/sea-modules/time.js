define(function(require, exports, module){
    
    //获取当前时间戳
    exports.getTimestamp = function(){
        return parseInt(new Date().getTime()/1000);
    }

    //获取当前日期
    exports.getDate = function(){
        var now = new Date();
        var yy = now.getFullYear();      //年
        var mm = now.getMonth() + 1;     //月
        var dd = now.getDate();          //日
        var hh = now.getHours();         //时
        var ii = now.getMinutes();       //分
        var ss = now.getSeconds();       //秒
        var clock = yy + "-";
        if(mm < 10) clock += "0";
        clock += mm + "-";
        if(dd < 10) clock += "0";
        clock += dd + " ";
        if(hh < 10) clock += "0";
        clock += hh + ":";
        if (ii < 10) clock += '0'; 
        clock += ii + ":";
        if (ss < 10) clock += '0'; 
        clock += ss;
        return clock;
    }

    //日期字符串转时间戳，date => '2015-03-05 17:59:00' or '2015/03/05 17:59:00'
    exports.dateToTimestamp = function(date){
        if(!date) return date;
        date = date.substring(0,19);    
        date = date.replace(/-/g,'/'); 
        return  new Date(date).getTime()/1000;
    }

    //时间戳转日期字符串 'YY-MM-DD hh:ii:ss'
    exports.timestampToDate = function(timestamp, format){
        if(!timestamp) return timestamp;
        timestamp = String(timestamp);
        if(timestamp.length === 10){
            timestamp = timestamp * 1000;
        }
        var d = new Date(timestamp);//根据时间戳生成的时间对象
        var year = d.getFullYear();
        var month = d.getMonth() + 1;
        var date = d.getDate();
        var hours = d.getHours();
        var minutes = d.getMinutes();
        var seconds = d.getSeconds();
        month = month < 10 ? '0'+ month : month;
        if(!!format){
            var DATE = format.replace('YYYY', year).replace('yyyy', year).replace('YY', year).replace('yy', year)
                             .replace('MM', month).replace('mm', month)
                             .replace('DD', date).replace('dd', date)
                             .replace('hh', hours).replace('ii', minutes).replace('ss', seconds);
        }else{
            var DATE = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        }
        return DATE;
    }

    //时间计算
    exports.timesCount = function(seconds, date, format){
        if(!seconds){
            seconds = 0;
        }
        if(!date){
            date = this.getTimestamp();
        }
        if(!/^\d+$/.test(date)){
            date = this.dateToTimestamp(date);
        }
        return this.timestampToDate(parseInt(date, 10) + parseInt(seconds, 10), format);
    }

});