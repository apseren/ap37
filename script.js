(function script() {
  'use strict';
  var w = ap37.getScreenWidth(),
    h = ap37.getScreenHeight();

  function init() {
    background.init();
    print(0, 0, 'ap37-c7fe3fc0');
    time.init();
    notifications.init();
    apps.init();
    markets.init();
    transmissions.init();
    print(w - 3, h - 1, 'EOF');

    wordGlitch.init();
    lineGlitch.init();

    ap37.setOnTouchListener(function(x, y) {
      notifications.onTouch(x, y);
      apps.onTouch(x, y);
      transmissions.onTouch(x, y);
    });
  }

  // modules

  var background = {
    buffer: [],
    bufferColors: [],
    pattern: '',
    printPattern: function(x0, xf, y) {
      print(x0, y,
        background.pattern.substring(y * w + x0, y * w + xf),
        '#333333');
    },
    init: function() {
      background.pattern = rightPad(script.toString(), h * w, ' ');

      for (var i = 0; i < h; i++) {
        background.buffer.push(background.pattern.substr(i * w, w));
        background.bufferColors.push(arrayFill('#333333', w));
      }

      ap37.printLines(background.buffer, '#333333');
    }
  };

  var time = {
    update: function() {
      var d = new Date();
      var time = d.getFullYear() +
        leftPad((d.getMonth() + 1).toString(), 2, '0') +
        leftPad(d.getDate().toString(), 2, '0') + ' ' +
        leftPad(d.getHours().toString(), 2, '0') +
        leftPad(d.getMinutes().toString(), 2, '0');
      print(w - 13, 0, time);
    },
    init: function() {
      time.update();
      setInterval(time.update, 60000);
    }
  };

  var notifications = {
    list: [],
    active: false,
    update: function() {
      notifications.active = ap37.notificationsActive();
      if (notifications.active) {
        var nots = ap37.getNotifications();
        for (var i = 0; i < 3; i++) {
          var y = i + 2;
          background.printPattern(0, w, y);
          if (i < nots.length) {
            var name = nots[i].name;
            nots[i].y = y;
            if (i == 2 && nots.length > 3) {
              var length = Math.min(name.length, w - 10);
              name = name.substring(0, length) + "... +" +
                (nots.length - 3);
            }
            print(0, y, name);
          }
        }
        notifications.list = nots;
      } else {
        print(0, 3, 'Activate notifications');
      }
    },
    init: function() {
      ap37.setOnNotificationsListener(notifications.update);
      notifications.update();
    },
    onTouch: function(x, y) {
      if (notifications.active) {
        for (var i = 0; i < notifications.list.length; i++) {
          if (notifications.list[i].y === y) {
            ap37.openNotification(notifications.list[i].id);
            return;
          }
        }
      } else if (y === 3) {
        ap37.requestNotificationsPermission();
      }
    }
  };

  var apps = {
    list: [],
    lineHeight: 2,
    topMargin: 6,
    bottomMargin: 8,
    lines: 0,
    appWidth: 6,
    appsPerLine: 0,
    appsPerPage: 0,
    currentPage: 0,
    isNextPageButtonVisible: false,
    printPage: function(page) {
      var appPos = page * apps.appsPerPage;

      for (var y = apps.topMargin; y < apps.topMargin + apps.lines *
        apps.lineHeight; y += apps.lineHeight) {
        for (var x = 0; x + apps.appWidth <= w; x += apps.appWidth) {
          background.printPattern(x, x + apps.appWidth, y);
          if (appPos < apps.list.length) {
            var app = apps.list[appPos];
            app.y = y;
            app.x0 = x;
            app.xf = x + apps.appWidth;
            print(x, y, '_' +
              app.name.substring(0, apps.appWidth - 2), '#999999');
            print(x + 1, y, app.name.substring(0, 1), '#ffffff');
            appPos++;
          }
        }
      }
    },
    init: function() {
      apps.list = ap37.getApps();
      apps.lines = Math.floor(
        (h - apps.topMargin - apps.bottomMargin) / apps.lineHeight);
      apps.appsPerLine = Math.ceil(apps.list.length / apps.lines);
      apps.appWidth = Math.floor(w / apps.appsPerLine);

      // check minimum app name length
      if (apps.appWidth < 6) {
        apps.appWidth = 6;
        apps.appsPerLine = Math.floor(w / apps.appWidth);
        apps.isNextPageButtonVisible = true;
        print(w - 4, h - 9, '>>>');
      } else {
        apps.isNextPageButtonVisible = false;
        background.printPattern(w - 4, w, h - 9);
      }

      apps.appsPerPage = apps.lines * apps.appsPerLine;
      apps.currentPage = 0;

      apps.printPage(apps.currentPage);

      ap37.setOnAppsListener(apps.init);
    },
    onTouch: function(x, y) {
      for (var i = apps.currentPage * apps.appsPerPage; i <
        apps.list.length; i++) {
        var app = apps.list[i];
        if (y >= app.y && y <= app.y + 1 &&
          x >= app.x0 && x <= app.xf) {
          ap37.openApp(app.id);
          return;
        }
      }
      if (apps.isNextPageButtonVisible &&
        y >= h - 9 && y <= h - 8 &&
        x >= w - 4 && x <= w) {
        apps.currentPage++;
        if (apps.currentPage * apps.appsPerPage >= apps.list.length) {
          apps.currentPage = 0;
        }
        apps.printPage(apps.currentPage);
      }
    }
  };

  var markets = {
    update: function() {
      get('https://api.cryptowat.ch/markets/prices', function(response) {
        var result = JSON.parse(response).result,
          marketString =
          'BTC' + Math.floor(result['kraken:btcusd']) +
          ' BCH' + Math.floor(result['kraken:bchusd']) +
          ' ETH' + Math.floor(result['kraken:ethusd']) +
          ' ETC' + Math.floor(result['kraken:etcusd']) +
          ' LTC' + Math.floor(result['kraken:ltcusd']) +
          ' ZEC' + Math.floor(result['kraken:zecusd']);
        background.printPattern(0, w, h - 7);
        print(0, h - 7, marketString);
      });
    },
    init: function() {
      print(0, h - 8, '// Markets');
      markets.update();
      setInterval(markets.update, 60000);
    }
  };

  var transmissions = {
    list: [],
    update: function() {
      get('https://dangeru.us/api/v2/board/cyb', function(response) {
        var result = JSON.parse(response),
          line = h - 4,
          t = transmissions;
        t.list = [];
        for (var i = 0; i < result.length && t.list.length < 3; i++) {
          if (!result[i].sticky) {
            var transmission = {
              title: result[i].title,
              url: 'https://dangeru.us/cyb/thread/' + result[i].post_id,
              y: line
            };
            t.list.push(transmission);
            background.printPattern(0, w, line);
            t.printTransmission(transmission, false);
            line++;
          }
        }
      });
    },
    printTransmission: function(transmission, highlight) {
      print(0, transmission.y, transmission.title,
        highlight ? '#ff3333' : '#ffffff');
      if (highlight) {
        setTimeout(function() {
          transmissions.printTransmission(transmission, false);
        }, 3000);
      }
    },
    init: function() {
      print(0, h - 5, '// Transmissions');
      transmissions.update();
      setInterval(transmissions.update, 3600000);
    },
    onTouch: function(x, y) {
      for (var i = 0; i < transmissions.list.length; i++) {
        if (transmissions.list[i].y === y) {
          transmissions.printTransmission(transmissions.list[i], true);
          ap37.openLink(transmissions.list[i].url);
          return;
        }
      }
    }
  };

  var wordGlitch = {
    tick: 0,
    length: 0,
    x: 0,
    y: 0,
    text: [],
    update: function() {
      var g = wordGlitch;
      if (g.tick === 0) { // generate new glitch
        g.length = 5 + Math.floor(Math.random() * 6);
        g.x = Math.floor(Math.random() * (w - g.length));
        g.y = Math.floor(Math.random() * h);

        g.text = [];
        for (var i = 0; i < 5; i++) {
          g.text.push(Math.random().toString(36).substr(2, g.length));
        }

        ap37.print(g.x, g.y, g.text[g.tick], '#666666');
        g.tick++;
      } else if (g.tick === 5) { // remove glitch
        ap37.printMultipleColors(g.x, g.y,
          background.buffer[g.y].substr(g.x, g.length),
          background.bufferColors[g.y].slice(g.x, g.x + g.length)
        );
        g.tick = 0;
      } else {
        ap37.print(g.x, g.y, g.text[g.tick], '#666666');
        g.tick++;
      }
    },
    init: function() {
      setInterval(wordGlitch.update, 100);
    }
  };

  var lineGlitch = {
    tick: 0,
    line: 0,
    update: function() {
      var g = lineGlitch;
      if (g.tick === 0) { // shift line
        g.line = 1 + Math.floor(Math.random() * h - 1);

        var offset = 1 + Math.floor(Math.random() * 4),
          direction = Math.random() >= 0.5;

        if (direction) {
          ap37.printMultipleColors(0, g.line,
            rightPad(
              background.buffer[g.line].substring(offset), w,
              ' '),
            background.bufferColors[g.line].slice(offset));
        } else {
          ap37.printMultipleColors(0, g.line,
            leftPad(background.buffer[g.line]
              .substring(0, w - offset), w, ' '),
            arrayFill('#ffffff', offset)
            .concat(background.bufferColors[g.line]
              .slice(0, w - offset))
          );
        }
        g.tick++;
      } else { // restore line
        ap37.printMultipleColors(
          0, g.line, background.buffer[g.line],
          background.bufferColors[g.line]);
        g.tick = 0;
      }
    },
    init: function() {
      setInterval(lineGlitch.update, 200);
    }
  };

  //utils

  function print(x, y, text, color) {
    color = color || '#ffffff';
    background.buffer[y] = background.buffer[y].substr(0, x) + text +
      background.buffer[y].substr(x + text.length);
    for (var i = x; i < x + text.length; i++) {
      background.bufferColors[y][i] = color;
    }
    ap37.print(x, y, text, color);
  }

  function get(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
      if (xhr.status === 200) {
        callback(xhr.response)
      };
    }
    xhr.send();
  }

  function leftPad(str, newLength, char) {
    return newLength > str.length ?
      new Array(newLength - str.length + 1).join(char) + str : str;
  }

  function rightPad(str, newLength, char) {
    return newLength > str.length ?
      str + new Array(newLength - str.length + 1).join(char) : str;
  }

  function arrayFill(value, length) {
    var result = [];
    for (var i = 0; i < length; i++) {
      result.push(value);
    }
    return result;
  }

  init();
})();

// pull requests github.com/apseren/ap37
// btc donations 1MvZ1VsC2eCHv8DFfUNk474ipNcqWmpV93
// eth donations 0x736F85B150eF7f75ba1F8729912e950BF22014d4
