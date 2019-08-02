(function () {
  var CircularJSON = JSON;

  var replacer = function replacer(k, v) {
    if (v === undefined) {
      return '©undefined';
    } else if (v === null) {
      return '©null';
    } else if (v === -Infinity) {
      return '©- Infinity';
    } else if (v === Infinity) {
      return '©Infinity';
    } else if (typeof v === 'number' && isNaN(v)) {
      return '©NaN';
    } else if (typeof v === 'function') {
      return '©function';
    }
    return v;
  };
  try {
    CircularJSON = eval('(function(JSON,RegExp){var specialChar="~",safeSpecialChar="\\\\x"+("0"+specialChar.charCodeAt(0).toString(16)).slice(-2),escapedSafeSpecialChar="\\\\"+safeSpecialChar,specialCharRG=new RegExp(safeSpecialChar,"g"),safeSpecialCharRG=new RegExp(escapedSafeSpecialChar,"g"),safeStartWithSpecialCharRG=new RegExp("(?:^|([^\\\\\\\\]))"+escapedSafeSpecialChar),indexOf=[].indexOf||function(v){for(var i=this.length;i--&&this[i]!==v;);return i},$String=String;function generateReplacer(value,replacer,resolve){var doNotIgnore=false,inspect=!!replacer,path=[],all=[value],seen=[value],mapp=[resolve?specialChar:"[Circular]"],last=value,lvl=1,i,fn;if(inspect){fn=typeof replacer==="object"?function(key,value){return key!==""&&replacer.indexOf(key)<0?void 0:value}:replacer}return function(key,value){if(inspect)value=fn.call(this,key,value);if(doNotIgnore){if(last!==this){i=lvl-indexOf.call(all,this)-1;lvl-=i;all.splice(lvl,all.length);path.splice(lvl-1,path.length);last=this}if(typeof value==="object"&&value){if(indexOf.call(all,value)<0){all.push(last=value)}lvl=all.length;i=indexOf.call(seen,value);if(i<0){i=seen.push(value)-1;if(resolve){path.push((""+key).replace(specialCharRG,safeSpecialChar));mapp[i]=specialChar+path.join(specialChar)}else{mapp[i]=mapp[0]}}else{value=mapp[i]}}else{if(typeof value==="string"&&resolve){value=value.replace(safeSpecialChar,escapedSafeSpecialChar).replace(specialChar,safeSpecialChar)}}}else{doNotIgnore=true}return value}}function retrieveFromPath(current,keys){for(var i=0,length=keys.length;i<length;current=current[keys[i++].replace(safeSpecialCharRG,specialChar)]);return current}function generateReviver(reviver){return function(key,value){var isString=typeof value==="string";if(isString&&value.charAt(0)===specialChar){return new $String(value.slice(1))}if(key==="")value=regenerate(value,value,{});if(isString)value=value.replace(safeStartWithSpecialCharRG,"$1"+specialChar).replace(escapedSafeSpecialChar,safeSpecialChar);return reviver?reviver.call(this,key,value):value}}function regenerateArray(root,current,retrieve){for(var i=0,length=current.length;i<length;i++){current[i]=regenerate(root,current[i],retrieve)}return current}function regenerateObject(root,current,retrieve){for(var key in current){if(current.hasOwnProperty(key)){current[key]=regenerate(root,current[key],retrieve)}}return current}function regenerate(root,current,retrieve){return current instanceof Array?regenerateArray(root,current,retrieve):current instanceof $String?current.length?retrieve.hasOwnProperty(current)?retrieve[current]:retrieve[current]=retrieveFromPath(root,current.split(specialChar)):root:current instanceof Object?regenerateObject(root,current,retrieve):current}var CircularJSON={stringify:function stringify(value,replacer,space,doNotResolve){return CircularJSON.parser.stringify(value,generateReplacer(value,replacer,!doNotResolve),space)},parse:function parse(text,reviver){return CircularJSON.parser.parse(text,generateReviver(reviver))},parser:JSON};return CircularJSON})(JSON,RegExp)');
  } catch (e) {
    console.error(e);
  }

  // eslint-disable-next-line
  var OriginalFunction = Function;
  var OriginalFetch = self.fetch;

  var callInternalAPI = function callInternalAPI(api, param) {
    var actionData = {
      data: {
        method: api,
        param: param
      },
      action: 'internalAPI'
    };
    var apiQueryString = encodeURIComponent(JSON.stringify(actionData));
    var url = 'https://alipay.kylinBridge/?data=' + apiQueryString;

    if (OriginalFetch) {
      OriginalFetch(url, {
        mode: 'no-cors'
      }).then(function () {}).catch(function () {});
    } else {
      if (self.AlipayJSBridge) {
        AlipayJSBridge.call('internalAPI', {
          method: api,
          param: param
        });
      } else {
        var interval = setInterval(function () {
          if (self.AlipayJSBridge) {
            AlipayJSBridge.call('internalAPI', {
              method: api,
              param: param
            });
            clearInterval(interval);
          }
        }, 60);
      }
    }
  };

  var eventHandler = function eventHandler(data) {
    try {
      if (data.fromVConsoleToWorker) {
        var requestId = data.requestId;

        if (data.method === 'exec') {
          var sendBack = function sendBack(value) {
            return callInternalAPI('tinyDebugConsole', {
              type: 'msgFromWorkerToVConsole',
              content: CircularJSON.stringify({
                requestId: requestId,
                returnValue: value
              }, replacer)
            });
          };
          try {
            new OriginalFunction('requestId', 'sendBack', '\n              const res = ' + data.script + ';\n              console.log(res);\n            ')(requestId, sendBack);
          } catch (error) {
            console.error(error.name + ':' + error.message);
          }
        }
      }
    } catch (e) {}
  };

  setTimeout(function () {
    if (self.document) {
      self.document.addEventListener('push', function (e) {
        try {
          eventHandler(JSON.parse(e.data.param.content));
        } catch (e) {}
      });
    }
    // eslint-disable-next-line
    self.addEventListener('push', function (e) {
      try {
        var data = JSON.parse(JSON.parse(e.data.text()).param.data.content);
        eventHandler(data);
      } catch (e) {}
    });
  }, 10);

  ['log', 'info', 'error', 'debug', 'warn'].forEach(function (type) {
    var originalType = 'o' + type;
    if (console[originalType]) {
      return;
    }
    console[originalType] = console[type];
    console[type] = function () {
      var _console;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      (_console = console)[originalType].apply(_console, args);
      var content = void 0;
      try {
        content = CircularJSON.stringify(args.map(function (i) {
          return i instanceof Error ? i.name + ': ' + i.message : i;
        }), replacer);
      } catch (e) {
        console.error(e.name + ': ' + e.message);
        return;
      }
      callInternalAPI('tinyDebugConsole', {
        content: content,
        type: 'console_' + type
      });
    };
  });
})();
require('./config$');
require('./importScripts$');
function success() {
require('../..//app');
require('../../components/nav/nav');
require('../../node_modules/mini-antui/es/badge/index');
require('../../node_modules/mini-antui/es/tabs/index');
require('../../node_modules/mini-antui/es/tabs/tab-content/index');
require('../../components/add-button/add-button');
require('../../node_modules/mini-antui/es/search-bar/index');
require('../../node_modules/mini-antui/es/popup/index');
require('../../node_modules/mini-antui/es/list/index');
require('../../node_modules/mini-antui/es/list/list-item/index');
require('../../node_modules/mini-antui/es/swipe-action/index');
require('../../node_modules/mini-antui/es/modal/index');
require('../../node_modules/mini-antui/es/stepper/index');
require('../../node_modules/mini-antui/es/am-checkbox/index');
require('../../node_modules/mini-antui/es/calendar/index');
require('../../node_modules/mini-antui/es/notice/index');
require('../../pages/index/index');
require('../../pages/todos/todos');
require('../../pages/shop/shoplist/shoplist');
require('../../pages/shop/shopDetail/shopDetail');
require('../../pages/me/me/me');
require('../../pages/order/orderlist/orderlist');
require('../../pages/home/search/search');
require('../../pages/home/extension/extension');
require('../../pages/home/more/more');
require('../../pages/me/setup/setup');
require('../../pages/me/helpCenter/index/index');
require('../../pages/me/helpCenter/help/help');
require('../../pages/me/userinfo/index/index');
require('../../pages/me/userinfo/info/info');
require('../../pages/me/userinfo/security/index/index');
require('../../pages/me/userinfo/security/newpassword/newpassword');
require('../../pages/me/userinfo/security/bindphone/bindphone');
require('../../pages/me/userinfo/security/sendcode/sendcode');
require('../../pages/me/userinfo/security/newphone/newphone');
require('../../pages/me/userinfo/address/addresslist/addresslist');
require('../../pages/me/userinfo/address/addaddress/addaddress');
require('../../pages/me/integral/integral');
require('../../pages/me/integralrule/integralrule');
require('../../pages/me/cart/cart');
require('../../pages/me/coupon/coupon');
require('../../pages/me/myBalance/index/index');
require('../../pages/me/myBalance/cash/cash');
require('../../pages/me/myBalance/bankcard/bankcard');
require('../../pages/me/myBalance/addbankcard/addbankcard');
require('../../pages/me/certification/index/index');
require('../../pages/me/certification/people/people');
require('../../pages/me/certification/addPeople/addPeople');
require('../../pages/me/certification/realname/realname');
require('../../pages/me/certification/realnameSuc/realnameSuc');
require('../../pages/me/certification/realnameUnbundling/realnameUnbundling');
require('../../pages/home/welfareAgency/welfareAgency');
require('../../pages/goodsDetail/goodsDetail');
require('../../pages/home/commitList/commitList');
require('../../pages/hosting/gohosting/index/index');
require('../../pages/hosting/gohosting/steps2/steps2');
require('../../pages/hosting/gohosting/steps3/steps3');
require('../../pages/hosting/gohosting/steps4/steps4');
require('../../pages/login/login/login');
require('../../pages/login/passwordLogin/passwordLogin');
require('../../pages/login/forgetPassword/forgetPassword');
require('../../pages/login/resetPassword/resetPassword');
require('../../pages/login/inputCode/inputCode');
require('../../pages/order/pay/pay');
require('../../pages/buy/buy');
require('../../pages/order/address/addresslist/addresslist');
require('../../pages/order/address/addaddress/addaddress');
require('../../pages/order/people/people');
require('../../pages/order/locationList/locationList');
require('../../pages/order/calendar/calendar');
require('../../pages/order/agreement/agreement');
require('../../pages/hosting/gohosting/successful/successful');
require('../../pages/hosting/myhosting/index/index');
require('../../pages/hosting/myhosting/hostCancel/hostCancel');
require('../../pages/hosting/myhosting/detail/detail');
require('../../pages/hosting/myhosting/nodetail/nodetail');
require('../../pages/hosting/myhosting/pay/pay');
require('../../pages/hosting/myhosting/platformDeli/platformDeli');
require('../../pages/hosting/myhosting/postDeli/postDeli');
require('../../pages/order/buypay/buypay');
require('../../pages/order/comments/comments');
require('../../pages/order/buydetail/buydetail');
require('../../pages/order/buyOrderDetail/buyOrderDetail');
require('../../pages/home/redpacket/redpacket/redpacket');
require('../../pages/home/redpacket/rpfriend/rpfriend');
require('../../pages/order/relet/relet');
require('../../pages/order/compensation/compensation');
require('../../pages/order/deny/deny');
require('../../pages/order/refund/refund');
require('../../pages/order/friendRepay/friendRepay');
require('../../pages/order/appointmentExpress/appointmentExpress');
require('../../pages/order/sendBack/sendBack');
require('../../pages/order/shopping/shopping');
require('../../pages/order/orderDetail/orderDetail');
require('../../pages/home/questionnaire/questionnaire');
require('../../pages/friendBuyShare/friendBuyShare');
require('../../pages/web/web');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
