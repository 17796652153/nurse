// pages/orderdetail/orderdetail.js
var http = require('../../utils/http.js');
const time = require('../../utils/time.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    moneyture: false,
    zhushetrue: false,
    orderid: '',
    user: '',
    indent: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      orderid: options.id || 422,
      user: wx.getStorageSync('user')
    })
    this.myorderdetail()
  },
  //去查看医嘱 
  readadvice() {
    var that=this
    wx.navigateTo({
      url: '/pages/advice/advice?type=2&img=' + that.data.indent.image,
    })
  },
  //获取订单详情
  myorderdetail() {
    var that = this
    var url = 'api/users/orderDetails'
    var data = {
      id: that.data.orderid
    }
    http.postReq(url, data, (res) => {
      console.log("我的订单", res)
      if (res.code == 200) {
        var datetime = time.formatTimeTwo(res.data.add_time, 'Y-M-D h:m:s')
        console.log(datetime)
        if (res.data.zs_money == 0) {
          that.setData({
            time: datetime,
            indent: res.data,
            zhushetrue: false
          })
        } else {
          that.setData({
            time: datetime,
            indent: res.data,
            zhushetrue: true
          })
        }
        that.getnurseType()
      }
    })
  },
  // 请求上门人员信息
  getnurseType() {
    var that = this
    var url = 'api/users/userData'
    var data = {
      openid: this.data.indent.nurse_openid
    }
    http.postReq(url, data, function (res) {
      console.log('112',res)
      if(res.is_type==0){
        console.log(231)
        return
      }
      // 获取工作年限
      let date = new Date()
      let year = date.getFullYear();
      console.log(year)
      let trade = res.trade_time.split('-')
      res.trade_time = parseInt(year) - parseInt(trade) + 1
      console.log(res.trade_time)
      that.setData({
        user: res,
      })
    })
  },
  changemoneytrue() {
    this.setData({
      moneyture: !this.data.moneyture
    })
  },
  // 看上门人员证明
  gettonurse(){
    var that=this
    wx.navigateTo({
      url: '/pages/nurse/nurse?id='+that.data.indent.nurse_openid,
    })
  },
  // 拨打用户电话
  getphone(e) {
    let phone = e.currentTarget.dataset.index;
    wx.makePhoneCall({
      phoneNumber: phone //仅为示例，并非真实的电话号码
    })
  },
  // 拨打客服电话
  customerphone() {
    var site_phone = this.data.indent.site_phone
    wx.makePhoneCall({
      phoneNumber: site_phone //仅为示例，并非真实的电话号码
    })
  },
  call110() {
    wx.makePhoneCall({
      phoneNumber: '110' //仅为示例，并非真实的电话号码
    })
  },
  cancelbtn(){
    if(this.data.indent.order_type==1){
      //取消订单接
      this.cancelbtn1()
    }else{

      var that = this
      wx.showModal({
        content: '是否取消该订单',
        success(res) {
          if (res.confirm) {
            let url="api/users/delOrder"
            let data={
              id: that.data.orderid,
            }
            http.postReq(url, data, (res) => {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
              setTimeout(()=>{
                wx.navigateBack({
                  delta: 1,
                })
              },2000)
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
    //取消订单
    cancelbtn1() {
      var that = this
      wx.showModal({
        content: '是否取消该订单',
        success(res) {
          if (res.confirm) {
            var url = 'api/users/cancelOrder'
            var data = {
              id: that.data.orderid,
              username: that.data.user.username, 
              avatar: that.data.user.avatar,
              openid: wx.getStorageSync('openid'),
            }
            http.postReq(url, data, (res) => {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
              })
              setTimeout(()=>{
                wx.navigateBack({
                  delta: 1,
                })
              },2000)
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        } 
      })
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