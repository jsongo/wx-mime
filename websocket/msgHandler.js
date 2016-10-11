
module.exports = function(msg, page) { // page -> index page
    var app = getApp();
    // console.log(msg);
    // if (typeof(msg) === 'object') {
    msg = JSON.parse(msg);
    var type = msg.data && msg.data.type || 
        msg.errMsg && msg.errMsg.type;
    if (type === 'dig') {
      if (msg.errCode == 0) {
        var result = msg.data.answer,
            x = msg.data.x,
            y = msg.data.y;
        if (result < 0) { // 挖到金子了
          app.decreaseCount();
          var leftGolds = page.data.leftGolds,
            score = page.data.score;
          if (msg.data.isMe) {
            score ++;
          }
          page.setData({
            leftGolds: --leftGolds,
            score: score
          });
        }
        // 把相应的格子翻出来
        page.setData({
          ['mimeMap[' + y + '][' + x + ']']: result,
        });
      }
    }
    else if (type === 'create') {
        if(msg.errCode == 0) {
            var mimeMap = msg.data.map;
            app.updateMap(mimeMap);         // 地图场景
            app.setCount(msg.data.count);   // 金子的个数
            page.setData({
              mimeMap: mimeMap,
              leftGolds: msg.data.count     // app.getCount()
            });
        }
        else {
            wx.navigateBack();
        }
    }
}