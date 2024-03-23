/* eslint-disable */
if (!Upsell) {
  var Upsell = {};
}

if (!Logger) {
  var Logger = {};
}

Logger = {
  debugIsOn : false,
  setDebug : function(isOn) {
    this.debugIsOn = isOn;
  },
  error : function(msg) {
    if (this.debugIsOn) {
      window.alert(msg);
    }
  }
};

Upsell.Util = {
  getProtocol : function() {
    return document.location.protocol;
  },
  render : function(template, params) {
    return template.replace(/\#\{([^{}]*)\}/g, function(a, b) {
      var r = params[b] || '';
      return typeof r === 'string' || typeof r === 'number' ? r : a;
    });
  },
  toQueryString : function(params) {
    var pairs = [];
    for (var key in params) {
      if (params[key] !== null && params[key] !== '' && typeof params[key] !== 'function') {
        pairs.push( [ key, params[key] ].join('='));
      }
    }
    return pairs.join('&');
  },
  isIE : function(test) {
    if (/MSIE (\d+\.\d+);/.test(navigator.userAgent)) {
      if (typeof test === "function") {
        return test(Number(RegExp.$1));
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
};
Upsell.Page = {
  getDimensions : function() {
    var de = document.documentElement;
    var width = window.innerWidth || self.innerWidth || (de && de.clientWidth) || document.body.clientWidth;
    var height = window.innerHeight || self.innerHeight || (de && de.clientHeight) || document.body.clientHeight;
    return {
      width : width,
      height : height
    };
  }
};
Upsell.Frame = {
  urlFunnel : function(params){
    var queryString = window.location.search;
    console.log(params);
    var currentHost = window.location.hostname.indexOf('buildstaging.com') !== -1
      ? 'https://app-hotmart-checkout.buildstaging.com/funnel'
      : 'https://pay.hotmart.com/funnel';
    if (queryString.indexOf('?fsid') === -1) {
      currentHost += '?'
    }
    var url = currentHost + queryString + "&" + (params.buttonImage !== '' ? 'buttonImage=' + params.buttonImage + '&' : '') + (params.customStyle !== '' ? 'customStyle=' + params.customStyle + '&' : '');
    var funnel = '<iframe id="hotmart_upsell_iframe" class="hotmart_upsell_iframe" src="' + url + '#{query}" width="#{width}" height="#{height}" frameborder="0" scrolling="auto" allowtransparency="true"></iframe>';

    return { funnelFrame: funnel };
  },
  content_template : function(params) {
    return { frame : this.urlFunnel(params).funnelFrame }
  },
  //'<iframe id="hotmart_upsell_iframe" src="' + document.querySelector('script[src$="upsell-window.js"]').getAttribute('src').split('js/widgets/upsell-window.js')[0] + '/widgets/funnel/upsell.html?#{query}" width="#{width}" height="#{height}" frameborder="0" scrolling="auto" allowtransparency="true" ></iframe>',
  //content_template : '<iframe id="hotmart_upsell_iframe" src="//www.hotmart.net.br/widgets/funnel/upsell.html?#{query}" width="#{width}" height="#{height}" frameborder="0" scrolling="auto" allowtransparency="true" ></iframe>',

  getBox : function() {
    return document.getElementById("box_hotmart");
  },
  getQuery : function(params) {
    return Upsell.Util.toQueryString( {
      key : params.key,
      launcherCode: params.launcherCode
    });
  },
  getFrameParams : function(params) {
    return {
      protocol : Upsell.Util.getProtocol(),
      query : this.getQuery(params),
      width : params.width,
      height : params.height,
      buttonImage: params.buttonImage || '',
      customStyle: params.customStyle || ''
    };
  },
  b64EncodeUnicode: function(str){
    // Read this - https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#The_Unicode_Problem
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
        return String.fromCharCode('0x' + p1);
      }))
  },
  show : function(params) {
    params.buttonImage = this.b64EncodeUnicode(params.buttonImage || '');
    params.customStyle = this.b64EncodeUnicode(params.customStyle || '');

    var iframeParams = this.getFrameParams(params);
    var iframeHtml = Upsell.Util.render(this.content_template(params).frame, iframeParams);
    var box = this.getBox();

    var iframeStyles = document.createElement('style');
    iframeStyles.innerHTML = '@media only screen and (max-width: 720px) { .hotmart_upsell_iframe {width: 100%; height: 380px} }';
    document.head.appendChild(iframeStyles);

    box.innerHTML = iframeHtml;
  }
};
Upsell.Widget = {

  setupOptions : function(params, optDebug) {
    if (optDebug !== null && typeof (optDebug) !== 'undefined') {
      Logger.setDebug(optDebug);
    } if (typeof (params) === 'undefined' || params === null) {
      Logger.error("Nenhum parametro informado ao Widget do Hotmart. Verifique se a variavel 'opts' se ela esta preenchida ou com algum erro de sintaxe.");
      return;
    } if (params.key === null) {
      Logger.error("A chave ('key') do widget deve ser informada. Verifique na variavel 'opts' e adicione a propriedade 'key' com o valor retornado pelo Hotmart");
      return;
    }
    this.params = params;
  },
  show : function(options, optDebug) {
    this.setupOptions(options, optDebug);
    Upsell.Frame.show(this.params);
  }
};

function getQueryParameter( name, url ) {
  if (!url) url = location.href;
    name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  return results === null ? null : results[1];
}
/* eslint-disable */
