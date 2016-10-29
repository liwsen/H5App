define(function(require, exports, module){
    var fn = exports;

    //html字符串转换为 HTML 实体
    fn.htmlspecialchars = function(str){
        var s = "";  
        if (str.length == 0) return "";  
        for   (var i=0; i<str.length; i++){  
            switch (str.substr(i,1)){  
                case "<": s += "&lt;"; break;  
                case ">": s += "&gt;"; break;  
                case "&": s += "&amp;"; break;  
                case " ":  
                    if(str.substr(i + 1, 1) == " "){  
                        s += " &nbsp;";  
                        i++;  
                    } else s += " ";  
                    break;  
                case "\"": s += "&quot;"; break;  
                case "\n": s += "<br>"; break;  
                default: s += str.substr(i,1); break;  
            }  
        }  
        return s;
    };

    //HTML实体 转换为 html字符串
    fn.htmlspecialchars_decode = function(str){
        str = str.replace(/&amp;/g, '&'); 
        str = str.replace(/&lt;/g, '<');
        str = str.replace(/&gt;/g, '>');
        str = str.replace(/&quot;/g, "''");  
        str = str.replace(/&#039;/g, "'");  
        return str;
    };
});