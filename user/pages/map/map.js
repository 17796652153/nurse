var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const http = require('../../utils/http.js');
const time = require('../../utils/time.js');
const app = getApp();
const WxParse = require('../../wxParse/wxParse.js');
const qqmapsdk = new QQMapWX({
  key: '5F3BZ-ZXJ6K-QWAJK-AC6NI-O76KS-JSFJZ'
});
Page({
  data: {
    LocationList:true,
    model1: false, //选择打什么针
    model2: false, //警示
    needlelist: ['打促排卵针', '打保胎针', '静脉注射', '采血'],
    needleindex: 0,
    days: 1,
    Height: 0,
    scale: 13,
    latitude: "",
    longitude: "",
    markers: [],
    selected: false,
    sterilize: '',
    circles: [],
    address: '',
    money: 0,
    orderid: '',
    indent: '',
    user: ''
  },
  onLoad: function (option) {
    var _this = this;
    // _this.gettitle()
    _this.getrich()
    this.getisOpen()
    console.log(1, wx.getStorageSync('lat'))
    console.log(1, wx.getStorageSync('lon'))
    _this.setData({
      // address: option.address,
      latitude: wx.getStorageSync('lat'),
      longitude: wx.getStorageSync('lon'),
      orderid: option.orderid,
      user: wx.getStorageSync('user'),
      needleindex: option.needleindex || 0
    })
    console.log(_this.data.orderid)
    if (_this.data.orderid != undefined) {
      _this.myorderdetail()
      var times = setInterval(() => {
        _this.myorderdetail()
      }, 5000);
      _this.setData({
        interval: times
      })
    }
    wx.getSystemInfo({
      success: function (res) {
        //设置map高度，根据当前设备宽高满屏显示
        _this.setData({
          view: {
            Height: res.windowHeight,

          }

        })
      }
    })
    // 不进行地址解析了，直接传lat lon
    // _this.getlatitude()

  },
  onShow() {
    this.getReport1()
    this.setData({
      money: wx.getStorageSync('money')
    })
  },
  onUnload() {},
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
  // 获取针剂
  getReport1() {
    var url = 'api/goods/getGoodsInfo'
    http.postReq(url, '', (res) => {
      console.log("轮播1", res)
      if (res.code == 200) {
        this.setData({
          needlelist: res.data
        })
        console.log("轮播11", this.data.needlelist)
        this.getReportList()
      }
    })
  },
  //获取针剂价格
  getReportList() {
    var url = 'api/goods/getGoodsList'
    var data = {
      type: this.data.needlelist[this.data.needleindex].type,
    }
    http.postReq(url, data, (res) => {
      console.log('针的详情', res)
      if (res.code == 200) {
        var pricespread = res.data[this.data.days - 1].money - res.data[this.data.days - 1].price
        pricespread = pricespread.toFixed(2)
        this.setData({
          sterilize: res.data,
          selected: false,
          money: res.data[this.data.days - 1].price,
          pricespread: pricespread,
        })
      }
    })
  },
  // 添加天数与减少天数
  adddays() {
    var that = this
    if (that.data.days >= 10) {
      wx.showToast({
        title: '套餐最大只能购买十次',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var days = ++that.data.days
    var pricespread = this.data.sterilize[days - 1].money - this.data.sterilize[days - 1].price
    pricespread = pricespread.toFixed(2)
    this.setData({
      days: days,
      selected: false,
      pricespread: pricespread,
      money: this.data.sterilize[days - 1].price
    })
  },
  prevdays() {
    var that = this
    if (that.data.days == 1) {
      wx.showToast({
        title: '套餐购买不能少于1次',
        icon: 'none',
        duration: 2000
      })
      return;
    }
    var days = --that.data.days
    var pricespread = this.data.sterilize[days - 1].money - this.data.sterilize[days - 1].price
    pricespread = pricespread.toFixed(2)
    this.setData({
      days: days,
      selected: false,
      pricespread: pricespread,
      money: this.data.sterilize[days - 1].price
    })
  },
  // 添加到的获取changemode1
  changemodel1() {
    var that = this
    that.setData({
      model1: !that.data.model1
    })
  },
  changemodel2() {
    var that = this
    that.setData({
      model2: !that.data.model2
    })
  },
  changeneedle(e) {
    // console.log(e.currentTarget.dataset.index)
    this.setData({
      needleindex: e.currentTarget.dataset.index,
      days: 1,
    })
    this.getReportList()
  },
  // 跳转到上门人员详情
  getnurse() {
    wx.navigateTo({
      url: '/pages/nurse/nurse?id=' + this.data.user.openid,
    })
  },
  gettitle() {
    var url = 'api/users/getConfig'
    var data = {
      name: 'money'
    }
    http.postReq(url, data, (res) => {
      console.log('title', res)
      this.setData({
        contanttitle: res.data,
      })
    })
  },

  // 打针的注意事项
  getrich() {
    let that = this
    let url = 'api/users/content'
    http.getReq(url, (res) => {
      console.log("rich", res)
      if (res.code == 200) {
        var article = ''
        res.data.map(function (item, index, arr) {
          if (item.id == 9) {
            article = item.content
          }
        })
        WxParse.wxParse('article', 'html', article, that, 5);
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //有订单的话订单详情
  myorderdetail() {
    var that = this
    var url = 'api/users/orderDetails'
    var data = {
      id: that.data.orderid
    }
    http.postReq(url, data, (res) => {
      console.log("我的订单", res)
      if (res.code == 200) {
        var estimate_time = time.formatTimeTwo(res.data.estimate_time, 'Y-M-D h:m:s')
        console.log(res.data.hasOwnProperty("locations"))
        if(res.data.hasOwnProperty("locations")){
          var pl = JSON.parse(res.data.locations)
          // var pl = res.data.locations
          var pllength = pl.length - 1
          that.setData({
            estimate_time: estimate_time,
            indent: res.data,
            // latitude: res.data.lat,
            // longitude: res.data.lng,
            polyline: [{
              points: pl,
              "color": "#00FF7F",
              "width": 10,
              "arrowLine": true,
              "arrowGap": 20,
              "borderWidth": 2,
              "borderColor": "#ffffff",
            }],
            markers: [{
              id: "1",
              latitude: pl[pllength].latitude,
              longitude: pl[pllength].longitude,
              width: 40,
              height: 40,
              iconPath: '../../image/usericon.png'
            }, {
              id: "2",
              latitude: pl[0].latitude,
              longitude: pl[0].longitude,
              width: 40,
              height: 40,
              iconPath: '../../image/nurseicon.png'
            }],
          })
          if(that.data.LocationList){
            var centerpl = [{
              latitude: pl[pllength].latitude,
              longitude: pl[pllength].longitude,
            }, {
              latitude: pl[0].latitude,
              longitude: pl[0].longitude
            }, ]
            var mapCtx = wx.createMapContext("map");
            mapCtx.includePoints({ 
              padding: [30],
              points: centerpl,
              success:function(res){
                console.log('进来res')
                that.setData({
                  LocationList:false
                })
              },
            })
          }
        }else{
          that.setData({
            estimate_time: estimate_time,
            indent: res.data,
            markers: [{
              id: "1",
              latitude: res.data.nurse_lat,
              longitude: res.data.nurse_lng,
              width: 40,
              height: 40, 
              iconPath: '../../image/nurseicon.png' 
            }]
          }) 
        }
        that.getnurseType() 
        
      }
    })
  },

  //地图缩放
  addscale(){
    var scale=this.data.scale+1
    console.log(scale)
    if(scale>20){
     wx.showToast({
       title: '已放大到最高级别',
       icon: 'none',
       duration: 2000
     })
     scale=20
    }
     this.setData({
       scale
     })
   },
   prevscale(){
     var scale=this.data.scale-1
     console.log(scale)
     if(scale<3){
       wx.showToast({
         title: '已缩小到最低级别',
         icon: 'none',
         duration: 2000
       })
       scale=2
      }
      this.setData({
        scale
      })
   },


  // 获取个人数据
  getnurseType() {
    var that = this
    var url = 'api/users/userData'
    var data = {
      openid: this.data.indent.nurse_openid
    }
    http.postReq(url, data, function (res) {
      console.log('上门人员', res)
      // 获取工作年限
      if (res.is_type == 0) {

      } else {
        let date = new Date()
        let year = date.getFullYear();
        console.log(year)
        let trade = res.trade_time.split('-')
        res.trade_time = parseInt(year) - parseInt(trade) + 1
        console.log(res.trade_time)
        that.setData({
          user: res,
        })
      }

    })
  },
  // 跳转到上传医嘱
  getadvice() {
    var that = this
    var zs = ''
    if (that.data.selected == false) {
      zs = 0
    } else {
      zs = this.data.sterilize[0].extend_price * this.data.days
      zs = zs.toFixed(2)
    }
    // if (that.data.days > 1) {
    //   wx.setStorageSync("give", 3)
    // }
    var v2 = {
      type: this.data.needlelist[this.data.needleindex].type,
      days: this.data.days
    }
    wx.setStorageSync("v2", v2)
    wx.navigateTo({
      url: '/pages/advice/advice?type=1&lat=' + that.data.latitude + '&lon=' + that.data.longitude + '&zs=' + zs + '&money=' + that.data.money,
    })
  },
  // 拨打用户电话
  getphone(e) {
    var phone = e.currentTarget.dataset.index
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
  // 计算总金额和选择zs包
  bindCheckbox() {
    var that = this
    var money;
    if (!that.data.selected) {
      money = Number(that.data.money) + Number(that.data.sterilize[0].extend_price * that.data.days)
    } else {
      money = Number(that.data.money) - Number(that.data.sterilize[0].extend_price * that.data.days)
    }
    money = money.toFixed(2)
    that.setData({
      selected: !that.data.selected,
      money: money
    })
  },
  //取消订单
  cancelbtn() {
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
            that.myorderdetail()
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // 跳转到订单详情
  detailbtn() {
    var that = this
    wx.navigateTo({
      url: '/pages/orderdetail/orderdetail?id=' + that.data.orderid,
    })
  },
  //地址解析成经纬度地图展示
  getlatitude() {
    console.log(this.data.address) 
    // 引入SDK核心类
    var _this = this
    var address = this.data.address
    qqmapsdk.geocoder({
      //获取表单传入地址
      address: address, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
      success: function (res) { //成功后的回调
        console.log(res);
        var res = res.result;
        var latitude = res.location.lat;
        var longitude = res.location.lng;
        //根据地址解析在地图上标记解析地址位置
        _this.setData({
          latitude: latitude,
          longitude: longitude,
        })
        console.log(_this.data.latitude)
        console.log(_this.data.longitude)
      },
      fail: function (error) {
        console.error(error);
      },
    })
  },

  //点击缩放按钮动态请求数据
  controltap(e) {
    var that = this;
    console.log("scale===" + this.data.scale)
    if (e.controlId === 1) {
      // if (this.data.scale === 13) {
      that.setData({
        scale: --this.data.scale
      })
      // }
    } else {
      //  if (this.data.scale !== 13) {
      that.setData({
        scale: ++this.data.scale
      })
      // }
    }

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log(123)
    clearInterval(this.data.interval);
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log(1223)
    clearInterval(this.data.interval);
  },
})