// var rootDocment = 'https://sx.hnhuirn.com/';
// var rootDocment = 'https://ljhs.ingamesoftware.com/';
var rootDocment = 'https://hs.mengya-app.com/'; 

var header = {  
  'Accept': 'application/json', 
  'content-type': 'application/json', 
  'Authorization': null, 
}
function getReq(url, cb) { 
  // wx.showLoading({
  //   title: '加载中',
  // })
  var url=rootDocment + url
  wx.request({
    url: url,
    method: 'GET',
    header: header,
    success: function (res) {
      // console.log('http',res,url
      // wx.hideLoading();
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      // wx.hideLoading();
      console.log(err,url)
      wx.showModal({
        title: '网络错误',
        content: '网络出错，请刷新重试',
        showCancel: false
      })
      return typeof cb == "function" && cb(false)
    }
  })
}
 
function postReq(url, data, cb) {
    // wx.showLoading({
    //   title: '加载中',
    // })
    var url=rootDocment + url
    wx.request({
      url: url,
      header: {
            'content-type': 'application/x-www-form-urlencoded' //post
       },
      data: data,
      // type:"json",
      method: 'POST',
      success: function (res) {
      //  console.log(res)
      // console.log('POST',res,url)
        // wx.hideLoading();
        return typeof cb == "function" && cb(res.data)
      },
      fail: function (err) {
        // wx.hideLoading();
        console.log(err,url)
        wx.showModal({
          title: '网络错误',
          content: '网络出错，请刷新重试',
          showCancel: false
        })
        return typeof cb == "function" && cb(err)
      }
    })
 
}

function base64({url,type}){
  return new Promise((resolve, reject) => {
    wx.getFileSystemManager().readFile({
      filePath: url, //选择图片返回的相对路径
      encoding: 'base64', //编码格式
      success: res => {
        resolve('data:image/' + type.toLocaleLowerCase() + ';base64,' + res.data)
      },
      fail: res => reject(res.errMsg)
    })
  })
}
module.exports = {
  getReq: getReq,
  postReq: postReq,
  rootDocment:rootDocment,
  header: header,
  base64:base64
} 