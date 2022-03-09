const http = require('../../utils/http.js');
const dateTimePicker = require('../../utils/dateTimePicker.js');
const chooseLocation = requirePlugin('chooseLocation');
const app = getApp();
Page({

  /** 
   * 页面的初始数据
   */
  data: {
    model1: false, //选择打什么针
    needlelist: [],
    needleindex: 0,
    model: false, //关注公众号二维码
    showLogin: false,
    hushiid: 1,
    background: ['/image/img1.png', '/image/img1.png'],
    background1: '',
    choose: false,
    address: '东方之门5号',
    service: 0,
    statusbar: 0,
    // 时间
    estimate_in_time: '请选择预约时间',
    dateTime: null,
    dateTimeArray: null,
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear() + 20,
    daddress: '',
  },
  changeDateTime(e) {
    console.log('时间', e)
    this.setData({
      dateTime: e.detail.value
    });
    var arr = this.data.dateTime,
      dateArr = this.data.dateTimeArray;
    console.log('时间', dateArr)
    var month = dateArr[0][arr[0]].substring(0, 2)
    var day = dateArr[1][arr[1]].substring(0, 2)
    var hour = dateArr[2][arr[2]].substring(0, 2)
    var min = dateArr[3][arr[3]].substring(0, 2)
    var estimate_in_time = `${month}-${day} ${hour}:${min}`;
    var estimate_in_time1 = `${this.data.startYear}/${month}/${day} ${hour}:${min}`;
    console.log(estimate_in_time)
    console.log(estimate_in_time1)
    var estimate = new Date(estimate_in_time1)
    var estimate1 = new Date()
    console.log(JSON.stringify(estimate))
    console.log(estimate1)
    var time1 = estimate.getTime()
    var time2 = estimate1.getTime()
    console.log(time1)
    console.log(time2)
    // this.setData({
    //   estimate:JSON.stringify(estimate),
    //   estimate1:JSON.stringify(estimate1), 
    //   time1,
    //   time2,
    // });
    this.setData({
      dateTimeArray: dateArr,
      dateTime: arr,
      estimate_in_time,
    });
    // if (time1 > time2) {

    // // } else {
    // //   wx.showToast({
    // //     title: '选择的时间不能小于当前时间',
    // //     icon: 'none',
    // //     duration: 2000
    // //   })
    // // }
    // this.setData({
    //   dateTimeArray: dateArr,
    //   dateTime: arr,
    //   estimate_in_time,
    // });
  },
  // 跳转到webview页面
  getwebview() {
    wx.navigateTo({
      url: '/pages/webview/webview',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    const res = wx.getSystemInfoSync()
    var statusbarH = res.statusBarHeight
    this.setData({
      statusbar: statusbarH
    })
    this.getisOpen()
    this.getReport()
    this.getReport1()
    this.getReport2()
    this.getReport3()
    this.gettitle()
    // 获取完整的年月日 时分秒，以及默认显示的数组
    var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    var lastArray = obj1.dateTimeArray.pop();
    var lastTime = obj1.dateTime.pop();
    obj1.dateTimeArray.shift()
    obj1.dateTime.shift()
    console.log(obj1)
    this.setData({
      dateTime: obj1.dateTime,
      dateTimeArray: obj1.dateTimeArray
    });
  },
  //接口关闭是否需要注射包
  getisOpen() {
    var url = 'api/index/isOpen'
    http.postReq(url, '', (res) => {
      if (res.code == 200) {
        console.log("isOpen", res.data)
        this.setData({
          isOpen: res.data
        })
      }
    })
  },
  Login: function (e) {
    // console.log(e.detail.showLogin)
    this.setData({
      showLogin: e.detail.showLogin,
    })
    var openid = wx.getStorageSync('openid');
    if (openid == null || openid == undefined || openid.length == 0) {} else {
      this.getuserdetail()
    }
  },
  getmyorder() {
    var that = this
    var url = 'api/users/serviceOrderUser'
    var data = {
      openid: wx.getStorageSync('openid')
    }
    http.postReq(url, data, (res) => {
      console.log("我的订单1", res)
      if (res.data == null || res.data == undefined) {
        that.setData({
          service: 0,
        })
      } else {
        that.setData({
          service: 1,
          orderid: res.data.id,
          orderaddress: res.data.address
        })
      }
    })
  },
  getmap1() {
    var that = this
    wx.navigateTo({
      url: '/pages/map/map?address=' + that.data.orderaddress + '&orderid=' + that.data.orderid,
    })
  },

  gettitle() {
    var url = 'api/users/getConfig'
    var data = {
      name: 'order_remark'
    }
    http.postReq(url, data, (res) => {
      console.log('title', res)
      this.setData({
        contanttitle: res.data,
      })
    })
  },
  // 获取单子的价格
  getordermoney() {
    var url = 'api/users/payPrice'
    var data = {
      openid: wx.getStorageSync('openid')
    }
    http.postReq(url, data, (res) => {
      console.log(res)
      // res.pay 0首单,1不是首单
      this.setData({
        money: res.money,
        pay: res.pay
      })
      wx.setStorageSync("money", res.money)
    })
  },
  // 信息参照
  getreference() {
    wx.navigateTo({
      url: '/pages/nurse/reference',
    })
  },
  //跳转到地图页面
  getmap() {
    var that = this
    var openid = wx.getStorageSync('openid');
    console.log(this.data.user)
    if (openid == null || openid == undefined || openid.length == 0) {
      that.setData({
        showLogin: true,
      })
      return
    } else if (this.data.user.phone == '' || this.data.user.phone == null) {
      wx.showToast({
        title: '请先去绑定电话,在进行叫上门人员',
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/bindingPhone/bindingPhone',
        })
      }, 2000);
      return
    }
    if (that.data.hushiid == 1) {
      wx.setStorageSync("give", 1)
      wx.setStorageSync("time", '')

    } else {
      console.log(that.data.estimate_in_time)
      if (that.data.estimate_in_time == '请选择预约时间') {
        return wx.showToast({
          title: '请选择预约时间',
          icon: 'none',
          duration: 2000
        })
      }
      // var times = that.data.date + ' ' + that.data.timebox
      wx.setStorageSync("give", 2)
      wx.setStorageSync("time", that.data.estimate_in_time)
    }
    wx.navigateTo({
      url: '/pages/map/map?address=' + that.data.address + '&needleindex=' + that.data.needleindex,
    })
  },
  changemodel() {
    var that = this
    that.setData({
      model: !that.data.model,
    })
  },
  changemodel1() {
    var that = this
    that.setData({
      model1: !that.data.model1
    })
  },
  saveimg() {
    var that = this
    wx.showLoading({
      title: '保存中···',
    })
    wx.saveImageToPhotosAlbum({
      filePath: '/image/gongzonghao.jpg', // 此为图片路径
      success: (res) => {
        console.log(res)
        wx.showToast({
          title: '保存成功，请到相册中查看',
          icon: 'none',
          duration: 2000
        })
        wx.hideLoading();
        that.data.model = false
      },
      fail: (err) => {
        console.log(err)
        wx.showToast({
          title: '保存失败，请稍后重试',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  getaddress(e) {
    const that = this
    that.setData({
      address: e.detail.value,
    })
  },
  bindchoose() {
    // wx.navigateTo({
    //   url: './chooseaddress',
    // })
    const key = 'QJOBZ-SX4LX-5AO4S-TTTQE-LDAIT-NBFP4'; //使用在腾讯位置服务申请的key
    const referer = '打针'; //调用插件的app的名称
    const location = JSON.stringify({
      latitude: app.globalData.lat,
      longitude: app.globalData.lon
    });
    const category = '生活服务,娱乐休闲';

    wx.navigateTo({
      url: `plugin://chooseLocation/index?key=${key}&referer=${referer}&location=${location}&category=${category}`
    });
  },
  binddetailaddress() {
    wx.navigateTo({
      url: './chooseaddress',
    })
    // this.bindchoose()
  },
  changehushi(e) {
    // console.log(e.currentTarget.dataset.id)
    this.setData({
      hushiid: e.currentTarget.dataset.id
    })
  },

  changeneedle(e) {
    // console.log(e.currentTarget.dataset.index)
    this.setData({
      needleindex: e.currentTarget.dataset.index
    })

  },
  getReport() {
    var url = 'api/users/advertisement'
    var data = {
      pid: 1
    }
    http.postReq(url, data, (res) => {
      console.log("轮播", res)
      if (res.code == 200) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].image = http.rootDocment + res.data[i].ad_image
        }
        this.setData({
          background: res.data
        })
      }
    })
  },
  getReport2() {
    var url = 'api/users/advertisement'
    var data = {
      pid: 2
    }
    http.postReq(url, data, (res) => {
      console.log("轮播1", res)
      if (res.code == 200) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].image = http.rootDocment + res.data[i].ad_image
        }
        this.setData({
          background1: res.data
        })
      }
    })
  },
  getReport3() {
    var url = 'api/users/advertisement'
    var data = {
      pid: 4
    }
    http.postReq(url, data, (res) => {
      console.log("轮播1", res)
      if (res.code == 200) {
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].image = http.rootDocment + res.data[i].ad_image
        }
        this.setData({
          background2: res.data
        })
      }
    })
  },
  // 不是
  getReport1() {
    var url = 'api/goods/getGoodsInfo'
    http.postReq(url, '', (res) => {
      console.log("轮播1", res)
      if (res.code == 200) {
        this.setData({
          needlelist: res.data
        })
        console.log("轮播11", this.data.needlelist)
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
    console.log(wx.getStorageSync('daddress'))
    const location = chooseLocation.getLocation(); // 如果点击确认选点按钮，则返回选点结果对象，否则返回null
    this.getordermoney()
    this.getmyorder()
    console.log("location", location)
    if (location != '' && location != null) {
      this.setData({
        address: location.address,
        addressname: location.name,
        lat: location.latitude,
        lon: location.longitude,
        daddress: wx.getStorageSync('daddress') || '请填写门牌号',
      })
      wx.setStorageSync("address", location.address)
      wx.setStorageSync("lat", location.latitude)
      wx.setStorageSync("lon", location.longitude)
      wx.setStorageSync("addressname", location.name)
    } else {
      this.setData({
        address: wx.getStorageSync('address') || '请选择您的位置',
        daddress: wx.getStorageSync('daddress') || '请填写门牌号',
        lat: wx.getStorageSync('lat') || '',
        lon: wx.getStorageSync('lon') || '',
        addressname: wx.getStorageSync('addressname') || '请选择您的位置'
      })
    }
    var openid = wx.getStorageSync('openid');
    if (openid == null || openid == undefined || openid.length == 0) {} else {
      this.getuserdetail()
    }
  },
  getaddress() {
    wx.showToast({
      title: '请选择您的位置',
      icon: 'none',
      duration: 2000,
    })
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
  getmy() {
    wx.switchTab({
      url: '/pages/my/my',
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})