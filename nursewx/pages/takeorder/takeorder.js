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
    currentTab:1,
    rewardid:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.getnurseOrder()
    /**
     * 获取当前设备的宽高
     */
    wx.getSystemInfo({

      success: function (res) {
        var height = res.windowWidth * 2
        that.setData({
          winWidth: res.windowWidth * 2,
          winHeight: res.windowHeight * 2
        });
      }

    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 跳转到map
  getTake1(e) {
    var id = e.currentTarget.dataset.index
    wx.redirectTo({
      url: '/pages/map/map?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},
  // 跳转到订单详情
  getorder(e) {
    var id = e.currentTarget.dataset.index
    wx.redirectTo({
      url: '/pages/orderdetail/orderdetail?id=' + id,
    })
  },
  // 获取护士订单
  getnurseOrder() {
    const that = this
    var url = "api/users/nurseOrder"
    //     openid	是	string	用户openid
    // is_type	是	string	0附近订单,1待完成,2已完成,3我的订单页
    // nurse_lng	是	string	经度
    // nurse_lat	是	string	纬度
    var data = {
      openid: wx.getStorageSync('openid'),
      is_type: that.data.currentTab,
    }
    http.postReq(url, data, function (res) {
      console.log(res)
      res.data.map(function (item, index, arr) {
        item.add_time = time.formatTimeTwo(item.add_time, 'M-D h:m:s')
        if(item.hasOwnProperty("child")){
          item.showcom=false
          if(that.data.rewardid==item.id){
            item.showcom=true
          }
        }
      })
      that.setData({
        reward: res.data
      })
    })
  },
  changeshowcom(e){
    console.log(e.target.dataset.index)
        this.data.reward[e.target.dataset.index].showcom=!this.data.reward[e.target.dataset.index].showcom
        var reward=this.data.reward
        var rewardid=''
        if(this.data.reward[e.target.dataset.index].showcom){
          rewardid =this.data.reward[e.target.dataset.index].id
        }else{
          rewardid =''
        }
        this.setData({
          rewardid:rewardid,
          reward:reward
        })
    },
      // 跳转到map
  getmap(){
    wx.navigateTo({
      url: '/pages/map/map',
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
  swichNav: function (e) {

    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        reward:''
      })
      that.getnurseOrder()
    }
  },

  bindChange: function (e) {

    var that = this;
    that.setData({
      currentTab: e.detail.current,
      reward:''
    });
    that.getnurseOrder()
  },
})