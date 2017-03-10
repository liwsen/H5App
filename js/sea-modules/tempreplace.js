define(function(require, exports, module) {
  var fn = require('m/fn');

  exports.init = function(options) {
    var DEFAULTS = {
      starTag: '{{',
      endTag: '}}',
      id: 'test_content',
      className: []
    };
    this.options = $.extend({}, DEFAULTS, options);
    return this;
  };
  exports.done = function(temp, data, cb) {
    var globalName = '__tempData';
    var EVAL = eval;
    var className = this.options.className;
    var cName = '';
    var forBlockReg = /{:for[ \w]+}([\s\S]+?){\/for}/g;
    var forStarReg = /{:for([ \w]+)}/;
    var forEndReg = /{\/for}/;
    if (typeof temp !== 'string' || !temp) {
      temp = '';
    }
    temp = fn.htmlspecialchars(temp);

    if (typeof data === 'object') {
      // 升级为全局变量
      window[globalName] = data;
      // For循环，不支持嵌套
      if (forBlockReg.test(temp)) {
        var forStrArr = temp.match(forBlockReg);
        // 遍历所有循环
        for (var i in forStrArr) {
          var forItem = forStrArr[i];
          var itemArray = [];
          var itemTemp = forItem.replace(forStarReg, '').replace(
            forEndReg, '');
          var _reg = /\w+/g;
          if (forStrArr.hasOwnProperty(i)) {
            // for条件成立
            if (forStarReg.test(forItem) && forItem.match(forStarReg)[0].match(
                _reg).length === 4) {
              var _for = forItem.match(forStarReg)[0];
              var _k = forItem.match(forStarReg)[0].match(_reg)[1];
              var _data = forItem.match(forStarReg)[0].match(_reg)[3];
              // 转换为html
              if (data.hasOwnProperty(_data) && typeof data[_data] ===
                'object' && data[_data] instanceof Array) {
                // 循环数据
                for (var j in data[_data]) {
                  var itemStr = itemTemp;
                  var itemReg;
                  // 值为字符串时
                  if (data[_data].hasOwnProperty(j) && typeof data[_data]
                    [j] ===
                    'string') {
                    itemReg = new RegExp(this.options.starTag + _k + this
                      .options.endTag, 'g');
                    itemStr = itemStr.replace(itemReg, data[_data][j]);
                    itemArray.push(itemStr);
                    // 值为对象时
                  } else {
                    itemReg = new RegExp(this.options.starTag + _k +
                      '([\\.\\w\\W]*?)' + this.options.endTag, 'g');
                    itemReg2 = new RegExp(this.options.starTag + _k +
                      '.([\\w\\W]*?)' + this.options.endTag);
                    if (itemReg.test(itemStr)) {
                      var itemArr = itemStr.match(itemReg);
                      // 循环所有for循环中的子选项
                      for (var s in itemArr) {
                        if (itemArr.hasOwnProperty(s)) {
                          var name = itemArr[s].match(itemReg2)[1];
                          itemStr = itemStr.replace(itemArr[s], data[
                            _data][j][name]);
                        }
                      }
                    }
                    itemArray.push(itemStr);
                  } // end if
                } // end for 循环数据
              } // end if 转换为html
            } // end if for条件成立
          } // end if
          // 替换for板块内容
          temp = temp.replace(forItem, itemArray.join(''));
        } // end for
      }
      // 替换单个变量
      for (var k in data) {
        if (data.hasOwnProperty(k)) {
          var reg = new RegExp(this.options.starTag + k + this.options.endTag,
            'g');
          if (reg.test(temp)) {
            temp = temp.replace(reg, '\'+ ' + globalName + '.' + k +
              ' +\'');
          }
        }
      }
    }
    // 执行标签内容
    temp = EVAL("(\'" + temp + "\')");
    // Html字符串变为实体
    temp = fn.htmlspecialchars_decode(temp);
    // 添加样式名
    if (typeof className === 'object' && className instanceof Array) {
      cName = className.join(' ');
    } else if (typeof className === 'string') {
      cName = className;
    }
    // 回调
    if (typeof cb === 'function')
      cb('<div id="' + this.options.id +
        '" class="opContainer ' + cName + '"><div class="pageBlock">' +
        temp + '</div></div>');
    return this;
  };
});
