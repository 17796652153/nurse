// pages/index/chooseaddress.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    province:'',
    city:'',
    county:'',
    detail:'',
  },
  regionChange:function (e) {
    var that=this
    that.setData({
      province: e.detail.province,
      city: e.detail.city,
      county: e.detail.county,
    });
  },
  getdetail:function(e){
    console.log(e)
    this.setData({
      detail: e.detail.value,
    })
  },
  getbtn(){ 
    wx.setStorageSync("daddress", this.data.detail)
    setTimeout(()=>{
      wx.navigateBack({
        delta: 1,
      })
    },1000)

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
     this.setData({
      detail:wx.getStorageSync('daddress')
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