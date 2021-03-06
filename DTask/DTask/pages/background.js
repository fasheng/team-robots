// Generated by CoffeeScript 1.10.0
(function() {
  var cache, dtaskToolsUrl, dtaskUrl, hackingDayUrl, lastBugzTabId, method, ports, towerLoginUrl, towerTokenCookieDomain;

  dtaskUrl = "https://tools.deepin.io/dtask";

  hackingDayUrl = "https://private.deepin.io";

  dtaskToolsUrl = "https://tools.deepin.io/dtask";

  towerLoginUrl = dtaskToolsUrl + "/plugin/static/tower_login.html";

  towerTokenCookieDomain = "https://bugzilla.deepin.io";

  ports = [];

  lastBugzTabId = 0;

  cache = {};

  console.log("init background...");

  method = {
    "query_dtask_url": function(id, port) {
      return port.postMessage({
        type: "query_dtask_url_result",
        url: dtaskUrl
      });
    },
    "query_dtask_tools_url": function(id, port) {
      return port.postMessage({
        type: "query_dtask_tools_url_result",
        url: dtaskToolsUrl
      });
    },
    "query_hacking_day_url": function(id, port) {
      return port.postMessage({
        type: "query_hacking_day_url_result",
        url: hackingDayUrl
      });
    },
    "cache_store": function(id, port, data) {
      var k, ref, v;
      ref = data.cache;
      for (k in ref) {
        v = ref[k];
        cache[k] = v;
      }
      return port.postMessage({
        type: "cache_store_result",
        cache: data.cache
      });
    },
    "cache_get": function(id, port, data) {
      var key, value;
      key = data.key;
      value = null;
      if (cache.hasOwnProperty(key)) {
        value = cache[key];
      }
      return port.postMessage({
        type: "cache_get_result",
        key: key,
        value: value
      });
    },
    "bugz_open_tower_login_tab": function(id, port, msg) {
      var data, index, ref, ref1, tmpId;
      tmpId = (ref = port.sender.tab) != null ? ref.id : void 0;
      index = (ref1 = port.sender.tab) != null ? ref1.index : void 0;
      if (!tmpId) {
        lastBugzTabId = tmpId;
      }
      if (!index) {
        index = 0;
      }
      chrome.tabs.create({
        url: towerLoginUrl,
        index: index + 1
      });
      data = {};
      data["msg"] = "open tab normally ";
      return port.postMessage({
        type: "bugz_open_tower_login_tab_result",
        data: data
      });
    },
    "bugz_store_tower_token": function(id, port, msg) {
      var expires, token;
      token = msg.token;
      expires = msg.expires;
      console.log("bugz store tower token");
      if (token !== "") {
        chrome.cookies.set({
          "name": "Tower-Token",
          "url": towerTokenCookieDomain,
          "value": token,
          "expirationDate": new Date().getTime() / 1000 + parseInt(expires)
        });
        if (lastBugzTabId) {
          chrome.tabs.reload(lastBugzTabId);
          chrome.tabs.update(lastBugzTabId, {
            highlighted: true
          });
        }
        return chrome.tabs.remove(port.sender.tab.id);
      }
    }
  };

  chrome.runtime.onConnect.addListener(function(port) {
    console.log("Found an new port", port);
    ports[port.sender.id] = port;
    port.onMessage.addListener(function(msg) {
      var name;
      msg.id = msg.id || 0;
      return typeof method[name = msg.type] === "function" ? method[name](msg.id, port, msg) : void 0;
    });
    return port.onDisconnect.addListener(function(p) {
      return delete ports[port.sender.id];
    });
  });

}).call(this);
