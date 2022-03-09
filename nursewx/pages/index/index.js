const http = require('../../utils/http.js');
const time = require('../../utils/time.js');
const citySelector = requirePlugin('citySelector');
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const app = getApp();
const qqmapsdk = new QQMapWX({
  key: 'U4GBZ-3VJKW-DXORK-OSCOG-SHEO6-LJBWO'
});
Page({
  /**
   * 页面的初始数据
   */
  data: {
    completeshow: false,
    showLogin: false,
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    radiotrue: false,
    cityname: '未选择',
    user: '',
    lon: '',
    lat: '',
    reward: '',
    register: 0,
    refusedtrue: false,
    rewardid: '',
    notice: '',
  },
  clickradio() {
    const that = this
    this.setData({
      radiotrue: !that.data.radiotrue,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    var that = this
    /**
     * 获取当前设备的宽高
     */
    this.getReport1()
    wx.getSystemInfo({
      success: function (res) {
        var height = res.windowWidth * 2
        that.setData({
          winWidth: res.windowWidth * 2,
          winHeight: res.windowHeight * 2
        });
      }
    });
    that.setData({
      lon: wx.getStorageSync("lon"),
      lat: wx.getStorageSync("lat")
    });
  
  },
  // 展示与否

  /**
   * 生命周期函数--监听页面显示
   */
  chnagerefusedtrue() {
    var that = this
    this.setData({
      refusedtrue: that.refusedtrue = !that.refusedtrue
    });
  },
  onShow: function () {
    this.getnotice()
    const selectedCity = citySelector.getCity(); // 选择城市后返回城市信息对象，若未选择返回null
    const openid = wx.getStorageSync('openid');
    console.log(selectedCity)
    if (selectedCity != null || selectedCity != undefined) {
      this.setData({
        cityname: selectedCity.name,
      });
      this.getmylocation(selectedCity.location.latitude, selectedCity.location.longitude)
    }
    this.getnurseType()
  },
  Login1: function (e) {
    this.setData({
      showLogin: e.detail.showLogin,
    })
    var openid = wx.getStorageSync('openid');
    console.log(openid)
    if (openid == null || openid == undefined || openid.length == 0) {} else {
      this.getnurseType()
    }
  },
  // 跳转到map 使用者传入id
  getTake1(e) {
    var id = e.currentTarget.dataset.index
    wx.redirectTo({
      url: '/pages/map/map?id=' + id,
    })
  },
  // // 跳转到map
  // getmap(e) {
  //   wx.navigateTo({
  //     url: '/pages/map/map',
  //   })
  // },
  // 跳转到富文本解析
  getwxhtml(e) {
    console.log(e.target.dataset.index)
    var url = ''
    if (e.target.dataset.index == 1) {
      url = '/pages/wxhtml/deal'
    } else if (e.target.dataset.index == 2) {
      url = '/pages/wxhtml/wxhtml?type=2'
    }
    wx.navigateTo({
      url
    })
  },
  getReport1() {
    var url = 'api/users/advertisement'
    var data = {
      pid: 3
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
  // 获取护士订单
  getnurseOrder() {
    const that = this
    var url = "api/users/nurseOrder"
    var data = {
      openid: wx.getStorageSync('openid'),
      is_type: that.data.currentTab,
      nurse_lng: wx.getStorageSync("lon"),
      nurse_lat: wx.getStorageSync("lat"),
    }
    http.postReq(url, data, function (res) {
      console.log(res)
      if (res.data != '' || res.data.lengt > 0) {
        res.data.map(function (item, index, arr) {
          item.add_time = time.formatTimeTwo(item.add_time, 'M-D h:m:s')
          console.log(item)
          console.log(item.hasOwnProperty("child"))
          if (item.give == 3) {
            item.showcom = false
            if (that.data.rewardid == item.id) {
              item.showcom = true
            }
          }

        })
        that.setData({
          reward: res.data
        })
      } else {
        that.setData({
          reward: []
        })
      }
    })
  },
  changeshowcom(e) {
    console.log(e.target.dataset.index)
    this.data.reward[e.target.dataset.index].showcom = !this.data.reward[e.target.dataset.index].showcom
    var reward = this.data.reward
    var rewardid = ''
    if (this.data.reward[e.target.dataset.index].showcom) {
      rewardid = this.data.reward[e.target.dataset.index].id
    } else {
      rewardid = ''
    }
    this.setData({
      rewardid: rewardid,
      reward: reward
    })
  },
  // 获取我的经纬度
  // getlatlon() {
  //   var _this = this
  //   wx.getLocation({
  //     type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
  //     success: function (res) {
  //       _this.setData({
  //         lat: res.latitude,
  //         lon: res.longitude,
  //       })
  //       _this.getnurseOrder()
  //       var times = setInterval(() => {
  //         _this.getnurseOrder()
  //       }, 5000);
  //       _this.setData({
  //         interval: times
  //       })
  //     },
  //     fail: function (err) {
  //       console.log(err)
  //     }
  //   })
  // },
  //获取护士的公告
  getnotice() {
    var that = this
    var url = 'api/users/message'
    http.postReq(url, '', function (res) {
      console.log('notice', res)
      that.setData({
        notice: res.data.content
      })
    })
  },
  // 获取个人数据
  getnurseType() {
    var that = this
    var url = 'api/users/userData'
    var data = {
      //openid: wx.getStorageSync('openid')
       openid: "o01wy5HxEg4hsbmMXcJDzt34jYMo"
    }
    http.postReq(url, data, function (res) {
      console.log('user', res)
      if (res.is_type == 0) {
        that.setData({
          register: 1
        })
      } else if (res.user_type == 2 && res.is_type == 0) {
        that.setData({
          register: 1
        })
      } else if (res.user_type == 2 && res.is_type == 1) {
        that.setData({
          register: 1,
          radiotrue: true,
          cityname: res.rider_city
        })
      } else if (res.user_type == 3 && res.line == 1) {
        console.log('进来了', res.user_type)
        console.log('进来了', res.line)
        that.setData({
          register: 2
        })
        that.getnurseOrder()
        var times = setInterval(() => {
          that.getnurseOrder()
        }, 5000);
        that.setData({
          interval: times
        })
      } else if (res.user_type == 4 && res.is_type == 1) {
        that.setData({
          register: 1,
          radiotrue: true,
          cityname: res.rider_city
        })
      } else {
        console.log(1231)
        wx.redirectTo({
          url: '/pages/map/map',
        })
      }
      that.setData({
        user: res,
      })
    })
  },
  getmylocation(lat, lon) {
    const that = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: lat,
        longitude: lon
      },
      success: function (res) { //成功后的回调
        console.log(res);
        var res = res.result;
        wx.setStorageSync("province", res.address_component.province)
        wx.setStorageSync("city", res.address_component.city)
        console.log(wx.getStorageSync('city'))
        console.log(wx.getStorageSync('province'))
      }
    })
  },
  // 跳转到选择城市
  getselect() {
    const key = 'UJ6BZ-P5TKR-2NAWQ-WWWWI-VN5GK-K6FWW'; // 使用在腾讯位置服务申请的key
    const referer = '护士端'; // 调用插件的app的名称
    const hotCitys = ''; // 用户自定义的的热门城市
    wx.navigateTo({
      url: `plugin://citySelector/index?key=${key}&referer=${referer}&hotCitys=${hotCitys}`,
    })
  },
  // 跳转到订单详情
  getorder(e) {
    var id = e.currentTarget.dataset.index
    wx.redirectTo({
      url: '/pages/orderdetail/orderdetail?id=' + id,
    })
  },
  changeupload() {
    wx.navigateTo({
      url: '/pages/informationupload1/informationupload',
    })
  },
  // 跳转到注册护士
  getupload() {
    const openid = wx.getStorageSync('openid');
    if (openid == undefined || openid == undefined || openid.length == 0) {
      this.setData({
        showLogin: true,
      })
      return false;
    } else if (this.data.cityname == '未选择') {
      wx.showToast({
        title: '请选择城市',
        icon: 'none',
        duration: 2000
      })
      return
    } else if (this.data.radiotrue == false) {
      wx.showToast({
        title: '请点击同意护士注册协议',
        icon: 'none',
        duration: 2000
      })
      return
    } else {
      wx.navigateTo({
        url: '/pages/informationupload/informationupload',
      })
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    citySelector.clearCity();
    clearInterval(this.data.interval);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 页面卸载时清空插件数据，防止再次进入页面，getCity返回的是上次的结果
    citySelector.clearCity();
    clearInterval(this.data.interval);
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
        reward: ''
      })
      // that.getnurseOrder()

    }
  },

  bindChange: function (e) {

    var that = this;
    that.setData({
      currentTab: e.detail.current,
      reward: ''
    });
    that.getnurseOrder()
  },
})