define(function(require, exports, module) {
  var fn = exports;

  //HTML实体 转换为 html字符串
  fn.htmlspecialchars = function(str) {
    var s = "";
    if (str.length === 0) return "";
    for (var i = 0; i < str.length; i++) {
      switch (str.substr(i, 1)) {
        case "<":
          s += "&lt;";
          break;
        case ">":
          s += "&gt;";
          break;
        case "&":
          s += "&amp;";
          break;
        case "\"":
          s += "&quot;";
          break;
        case "\'":
          s += "&apos;";
          break;
        case " ":
          if (str.substr(i + 1, 1) == " ") {
            s += " &nbsp;";
            i++;
          } else s += " ";
          break;
        case "\n\r":
          s += "<br>";
          break;
        case "\r\n":
          s += "<br>";
          break;
        case "\r":
          s += "<br>";
          break;
        case "\n":
          s += "<br>";
          break;
        default:
          s += str.substr(i, 1);
          break;
      }
    }
    return s;
  };

  //html字符串转换为 HTML 实体
  fn.htmlspecialchars_decode = function(str) {
    str = str.replace(/&amp;/g, '&');
    str = str.replace(/&lt;/g, '<');
    str = str.replace(/&gt;/g, '>');
    str = str.replace(/&quot;/g, "\"");
    str = str.replace(/&apos;/g, "\'");
    str = str.replace(/&nbsp;/g, " ");
    str = str.replace(/<br>/g, "\n");
    return str;
  };

  //复制对象方法
  fn.cloneObj = function(oldObj) {
    if (typeof(oldObj) != 'object') return oldObj;
    if (oldObj === null) return oldObj;
    var newObj = {};
    for (var i in oldObj)
      newObj[i] = cloneObj(oldObj[i]);
    return newObj;
  };

  //扩展对象
  fn.extendObj = function() {
    var args = arguments;
    if (args.length < 2) return;
    var temp = this.cloneObj(args[0]); //调用复制对象方法
    for (var n = 1; n < args.length; n++) {
      for (var i in args[n]) {
        temp[i] = args[n][i];
      }
    }
    return temp;
  };

  //打乱数组
  fn.messArr = function(arr) {
    arr.sort(function() {
      return 0.5 - Math.random();
    });
    return arr;
  };

  //所传的字符串参数转换为JSON对象
  fn.toJson = function(str) {
    var Eval = eval;
    return Eval('({' + str + '})');
  };

  //滚动到底部回调
  fn.scrollBottom = function(elem, cb) {
    var min = 100;
    if (!!elem) {
      elem.addEventListener('scroll', function(event) {
        if (this.scrollHeight - this.clientHeight > min && this.scrollHeight -
          this.scrollTop - this.clientHeight <
          min && typeof cb === 'function') {
          cb(event);
        }
      }, false);
    }
  };

});
