
if (!WebPlatform.onReady) {
  WebPlatform.documentReadyRequests = [];
  WebPlatform.onReady = function (request) {
    if (WebPlatform.documentReadyRequests === null) {
      request();
    } else {
      WebPlatform.documentReadyRequests.push(request);
    }
  };
}

WebPlatform.collectPageStats = () => {
  if (WebPlatform._pageStatsCollected === true) {
    return;
  }
  const isPreview = WebPlatform.getUrlQueryParameter(window.location.href, 'preview') !== '';
  if (!WebPlatform.areSystemAnalyticsEnabled() || window.location.pathname.indexOf('/_preview') === 0 || isPreview || WebPlatform.pageForbidden === true) {
    return;
  }
  WebPlatform._pageStatsCollected = true;
  const who = (() => {
    let ua = navigator.userAgent, tem,
            M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return ['Internet Explorer', (tem[1] || '')];
    }
    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem !== null) {
        tem = tem.slice(1);
        for (let i = 0; i < tem.length; ++i) {
          tem[i] = tem[i].replace('OPR', 'Opera');
        }
        return tem;
      }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    tem = ua.match(/version\/(\d+)/i);
    if (tem !== null)
      M.splice(1, 1, tem[1]);
    return M;
  })();

  let data = {
    browser: who[0],
    browserVersion: who[1],
    url: window.location.pathname,
    query: window.location.search,
    title: document.title,
    referrer: document.referrer.indexOf(location.protocol + "//" + location.host) === 0 ? '' : document.referrer,
    screenWidth: screen.width || windowWidth,
    screenHeight: screen.height || windowHeight,
    funnelVar: WebPlatform.Funnels && WebPlatform.Funnels.variant ? WebPlatform.Funnels.variant : '',
    _r: (new Date()).getTime()
  };

 // $.post('/hit', data).done(() => {}).fail(() => {});
  WebPlatform.PageStatsService.track(data);
};

WebPlatform.PageStatsService = (() => {
  const get = (key) => {
    try {
      let data = localStorage.getItem(key);
      if (data) {
        data = JSON.parse(data);
      }
      return data;
    } catch (e) {
      return null;
    }
  };

  const set = (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
    }
  }

  const track = async (postData) => {
    let sessionDetails = get('session-details');
    if (!sessionDetails) {
      // fallback for our legacy tracking. Values were stored in cookies wplp, wpcp and wpvp
      sessionDetails = {
        funnelProgress: {}
      };
      document.cookie.split(';').forEach(function(el) {
        let [key, value] = el.split('=');
        key = key.trim();
        if (key.startsWith('wplp') || key.startsWith('wpcp') || key.startsWith('wpvp')) {
          sessionDetails.funnelProgress[key] = value;
        }
      });
    }

    postData.sessionDetails = sessionDetails;
    postData.type = postData.type || "page";

    let path = 'https://' + WebPlatform.serviceApiDomain + '/page-hit?r=' + (new Date()).getTime();
    let response = await fetch(path, {
      method: 'POST',
      headers: {
        "Content-Type": 'application/json',
        "X-Website-Hash": WebPlatform.hash
      },
      mode: "cors",
      body: JSON.stringify(postData)
    });

    let data = await response.json();
    if (data && data.sessionDetails) {
      set('session-details', data.sessionDetails);
    }
  };

  const trackFunnelPopupStepView = (funnelId, stepId, variantId) => {
    track({
      funnel: funnelId,
      step: stepId,
      variant: variantId,
      type: "funnel-step"
    });
  };

  return {
    track: track,
    trackFunnelPopupStepView: trackFunnelPopupStepView
  }
})();

// Report stats
WebPlatform.onReady(WebPlatform.collectPageStats);
