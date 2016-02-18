// Generated by CoffeeScript 1.9.3
(function() {
  var dtaskUrl, getDTaskUrl, getTowerToken, initUrls, loginToTower, loginTowerUrl, port, setDefaultLinksEL, settingDefaultLinksPagesUrl;

  port = chrome.runtime.connect({
    name: "dataconnect"
  });

  dtaskUrl = "";

  loginTowerUrl = "";

  setDefaultLinksEL = $("#defaultLinks");

  settingDefaultLinksPagesUrl = "";

  port.onMessage.addListener(function(msg) {
    switch (msg.type) {
      case "query_dtask_tools_url_result":
        console.log("query_dtask_tools_url_result ", msg.url);
        dtaskUrl = msg.url;
        initUrls();
        return getTowerToken();
    }
  });

  getDTaskUrl = function() {
    return port.postMessage({
      type: "query_dtask_tools_url"
    });
  };

  loginToTower = function() {
    return port.postMessage({
      type: "bugz_open_tower_login_tab"
    });
  };

  initUrls = function() {
    var dtaskIndexUrl;
    settingDefaultLinksPagesUrl = dtaskUrl + "/plugin/static/set_bugz_todolist_links.html";
    loginTowerUrl = dtaskUrl + "/plugin/static/tower_login.html";
    dtaskIndexUrl = dtaskUrl + "/plugin/pages/index.html";
    return $("#about").attr({
      "href": dtaskIndexUrl
    });
  };

  getTowerToken = function() {
    console.log("get tower token...");
    return chrome.cookies.get({
      url: "https://bugzilla.deepin.io",
      name: "Tower-Token"
    }, function(cookie) {
      var towerToken;
      if (!cookie) {
        console.log("login to tower");
        return setDefaultLinksEL.attr({
          target: "_blank",
          href: loginTowerUrl
        });
      } else {
        towerToken = cookie.value;
        setDefaultLinksEL.attr({
          target: "_blank",
          href: settingDefaultLinksPagesUrl + "?tt=" + towerToken
        });
        return console.log(settingDefaultLinksPagesUrl + "?tt=" + towerToken);
      }
    });
  };

  getDTaskUrl();

}).call(this);