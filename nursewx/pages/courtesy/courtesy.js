// pages/order/order.js
var http = require('../../utils/http.js');
const time = require('../../utils/time.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    /**
     * 获取当前设备的宽高
     */
    wx.getSystemInfo( {

        success: function( res ) {
            var height = res.windowWidth*2
            that.setData( {
                winWidth: res.windowWidth*2,
                winHeight: res.windowHeight*2
            });
        }

    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  clickEvaluateList:function(){
      wx.navigateTo({
        url: '/pages/evaluateList/evaluateList',
      })
  },
  clickEvaluateAdd:function(){
    wx.navigateTo({
      url: '/pages/evaluateAdd/evaluateAdd',
    })
},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.getreward()
    // this.getlowerUser()
  },
  // 获取邀请奖励信息
  getreward(){
    const that=this
    var url="api/users/invitationRichText"
    http.postReq(url, '', function (res) {
        console.log(res)
        that.setData({
          reward:res.data
        })
        
    })
  },
  getinviter(){
    wx.navigateTo({
      url: '/pages/inviter/inviter',
    })
  },
    //获取我的下级 
    getlowerUser(){
      const that=this
      var url = 'api/users/lowerUser'
      console.log(that.data.user)
      var data={
        openid: wx.getStorageSync('openid'),
      }
      http.postReq(url, data, function (res) {
        if (res.code == 200) {
          console.log(res.data)
          for(var i=0;i<res.data.length;i++){
            res.data[i].create_time=time.formatTime(res.data[i].create_time,'M-D h:m:s')
          }
          that.setData({
            array: res.data
          })
          console.log(that.data.array)
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

  },
  //  tab切换逻辑
  swichNav: function( e ) {

    var that = this;
    if( this.data.currentTab === e.target.dataset.current ) {
        return false;
    } else {
        that.setData( {
            currentTab: e.target.dataset.current
        })
    }
},

bindChange: function( e ) {

    var that = this;
    that.setData( { currentTab: e.detail.current });

},
})