// pages/my/my.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var http = require('../../utils/http.js');
const time = require('../../utils/time.js');
var qqmapsdk;
const app = getApp()
Page({

  /**
   * 页面的初始数据 mysubmit
   */
  data: {
    showLogin:false,
    show: false,
    show1: false,
    isLogin: false,
    user: '',
    province: '',
    city: '',
    district: '',
    id: '',
    openid: '',
    myorder: false,
    estimate_time: '', //预约到达时间
    orderdetail: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //请求接口判断签到没有，没有签到弹出签到框

  },
  /**
   * 生命周期函数--监听页面显示
   */
  handleContact(e) {
    console.log(e.detail.path)
    console.log(e.detail.query)
  },
  // 获取个人数据
  getuserdetail() {
    var that = this
    var url = 'api/users/userData'
    var data = {
      openid: wx.getStorageSync('openid')
    }
    http.postReq(url, data, function (res) {
      console.log(res)
      that.setData({
        user: res,
      })
    })
  },
  onShow: function () {
    const that = this;
    that.setData({
      user: wx.getStorageSync('user'),
      province: wx.getStorageSync('province'),
      city: wx.getStorageSync('city'),
      district: wx.getStorageSync('district')
    });
    console.log('地址', that.data.province)
    console.log('用户', that.data.user)
    // 判断是否登录
    const openid = wx.getStorageSync('openid');
    console.log("openid", openid);
    if (openid == null || openid == undefined || openid.length == 0) {
      that.setData({
        isLogin: true
      });
      console.log("未登录");
    } else {
      that.setData({
        isLogin: false
      });
      this.getuserdetail()
      that.getmyorder()
      console.log("已登录", that.data.user.username);
    }
  },
  getmap(e) {
    var that=this
    var id = e.currentTarget.dataset.index
    var orderdetail=that.data.orderdetail
    var address=''
    for(var i=0;i<orderdetail.length;i++){
      if(id==orderdetail[i].id){
        address=orderdetail[i].address
      }
    }
    console.log(address)
    wx.navigateTo({
      url: '/pages/map/map?address=' + address + '&orderid=' + id, 
    })
  },
  //我的订单
  getrich() {
    var url = 'api/users/myOrder'
    var data = {
      openid: wx.getStorageSync('openid')
    }
    http.postReq(url, data, (res) => {
      console.log("我的订单", res)
      if (res.code == 200) {
        console.log('进来code', res.data.length)
        if (res.data.length == 0) {
          this.setData({
            myorder: false
          })
        } else {
          var estimate_time = time.formatTimeTwo(res.data[0].estimate_time, 'Y-M-D h:m:s')
          this.setData({
            estimate_time: estimate_time,
            myorder: true,
            orderdetail: res.data
          })
          console.log(that.data.orderdetail)
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  login() {
    // 微信登录
    const that = this;
    wx.getUserProfile({
      desc: '用于完善用户资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log("用户信息", res);
        const iv = res.iv;
        const encryptedData = res.encryptedData;
        const avatarUrl = res.userInfo.avatarUrl;
        const nickName = res.userInfo.nickName;
        // 获取定位
        wx.login({
          success: function (res) {
            console.log(res)
            const code = res.code
            console.log(code, 'code')
            // const upper_openid=wx.getStorageSync('upper_openid');
            // const upper_openid = '';
            const url = 'api/login/login';
            const data = {
              code: code,
              nickName: nickName,
              avatarUrl: avatarUrl,
              iv: iv,
              encryptedData: encryptedData,
              province: that.data.province,
              city: that.data.city,
              district: that.data.district,
            }
            console.log('shujju', data)
            http.postReq(url, data, function (res) {
              console.log("登录接口", res)
              wx.setStorageSync("user", res.user)
              // wx.setStorageSync("integral", res.user.integral)
              wx.setStorageSync("openid", res.user.openid)
              that.setData({
                isLogin: false,
                user: res.user,
                id: res.user.id,
                openid: res.user.openid,
              })
              console.log(res.user.phone)
            })
          }
        })
      },
      fail: (err) => {
        console.log(err, "1111");
        //用户按了拒绝按钮
        wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
          showCancel: false,
          confirmText: '返回授权',
          success: function (res) {
            // 用户没有授权成功，不需要改变 isHide 的值
            if (res.confirm) {
              console.log('用户点击了“返回授权”');
            }
          }
        });
      }
    })
  },
  getmyorder() {
    let that = this
    let url = 'api/users/myOrder'
    let data = {
      openid: wx.getStorageSync('openid')
    }
    http.postReq(url, data, (res) => {
      console.log("我的订单", res)
      if (res.code == 200) {
        if (res.data.length == 0) {
          console.log("我的订单", that.data.myorder)
          that.setData({
            myorder: false
          })
        } else {
          var estimate_time = time.formatTimeTwo(res.data[0].estimate_time, 'Y-M-D h:m:s')
          that.setData({
            estimate_time: estimate_time,
            myorder: true,
            orderdetail: res.data
          })
          console.log('orderdetail', that.data.orderdetail)
        }
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  getallorder(e) {
    console.log(e.target.dataset.index)
    var url = ''
    if(e.target.dataset.index == 0 || e.target.dataset.index == 1){
      var openid = wx.getStorageSync('openid');
      if (openid == null || openid == undefined || openid.length == 0) {
        this.setData({
          showLogin: true,
        })
        return false;
      }
    }
    if (e.target.dataset.index == 0) {
      url = '/pages/order/order'
    } else if (e.target.dataset.index == 1) {
      url = '/pages/report/report'
    } else if (e.target.dataset.index == 2) {
      url = '/pages/wxhtml/wxhtml?type=2'
    } else if (e.target.dataset.index == 3) {
      url = '/pages/wxhtml/wxhtml?type=3'
    }
    wx.navigateTo({
      url
    })
  },
  getsetting() {
    var openid = wx.getStorageSync('openid');
    if (openid == null || openid == undefined || openid.length == 0) {
      this.setData({
        showLogin: true,
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/information/information',
    })
  },
  getmessage() {
    var openid = wx.getStorageSync('openid');
    if (openid == null || openid == undefined || openid.length == 0) {
      this.setData({
        showLogin: true,
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/message/message',
    })
  },
  Login1: function(e){
    // console.log(e.detail.showLogin)
    this.setData({
      showLogin: e.detail.showLogin,
    })
    var openid = wx.getStorageSync('openid');
    if (openid == null || openid == undefined || openid.length == 0) {
    } else {
      this.getuserdetail()
    }
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