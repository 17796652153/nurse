// pages/capital/capital.js
var http = require('../../utils/http.js');
const time = require('../../utils/time.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getdata()
  },
  //获取资金明细
  getdata(){
    var that=this
    var url = 'api/users/fundDetails'
    var data={
      openid: wx.getStorageSync('openid'),
    }
    http.postReq(url, data, function (res) {
      if (res.code == 200) {
        console.log(res.data)
        var array=res.data
        for(var k=0;k<array.length;k++){
          array[k].time=time.formatTimeTwo(array[k].time,'Y-M-D h:m:s')  
        }
        that.setData({
          array:array,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})