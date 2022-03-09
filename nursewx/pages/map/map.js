const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
const http = require('../../utils/http.js');
const time = require('../../utils/time.js');
const WxParse = require('../../wxParse/wxParse.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'U4GBZ-3VJKW-DXORK-OSCOG-SHEO6-LJBWO'
});
Page({
  data: {
    LocationList:true,
    model2: false, //警示
    id: '',
    user: '',
    Height: 0,
    scale: 13,
    latitude: "", //正常地图经纬度
    longitude: "",
    latchange: '', //实时请求的地址
    lonchange: '',
    address: '',
    markers: [],

    // controls: [{
    //   id: 1,
    //   iconPath: '/assests/imgs/jian.png',
    //   position: {
    //     left: 320,
    //     top: 100 - 50,
    //     width: 20,
    //     height: 20
    //   },
    //   clickable: true
    // },
    // {
    //   id: 2,
    //   iconPath: '/assests/imgs/jia.png',
    //   position: {
    //     left: 340,
    //     top: 100 - 50,
    //     width: 20,
    //     height: 20
    //   },
    //   clickable: true
    // }
    // ],
    takeindent: '', //未接单单子详情
    circles: [],
    reid: '', //单子id 请求详情
    indent: '', //单子详情
    estimate_time: '', //预约到达时间
    user: '',
    setinterval: '',
    yizhuimg: '',
  },
  changemodel2() {
    var that = this
    that.setData({
      model2: !that.data.model2
    })
  },
  onLoad: function (options) {
    var _this = this;
    // 接单的id
    _this.setData({
      id: options.id
    })
    wx.getSystemInfo({
      success: function (res) {
        //设置map高度，根据当前设备宽高满屏显示
        _this.setData({
          view: {
            Height: res.windowHeight
          }

        })

      }
    })
    // 只是获取未上线时候的地址在那里
    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {
        console.log(res)
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) { //成功后的回调
            console.log('load里面', res);
            var res = res.result;
            _this.setData({
              address: res.address,
            })
          }
        })
        _this.setData({
          latitude: res.latitude,
          longitude: res.longitude,
        })
        _this.myorderdetail()
        _this.getuserdetail()
        _this.getcontent()
      },
      fail: function (err) {
        console.log(err)
      }
    })
    // _this.getnurseOrder()
    //getlocation替换为实时监听地址在onShow里面
    // _this.getlocation()
  },
  onShow() {
    var _this = this
    // this.gettakedetail()
    this.getUserLocation()
    const _locationChangeFn = res => {
      console.log('location change', res.latitude, res.longitude)
      _this.setData({
        latchange: res.latitude,
        lonchange: res.longitude,
      })
    }
    wx.onLocationChange(_locationChangeFn);
    var timer = setInterval(function () {
      _this.changePosition()
    }, 5000);
    _this.setData({
      setinterval: timer
    })
  },
  //开启实时定位
  getUserLocation() {
    wx.getSetting({
      success(res) {
        console.log(res)
        if (res.authSetting['scope.userLocationBackground']) {
          console.log(123)
          wx.startLocationUpdateBackground({
            success: (res) => {
              console.log('startLocationUpdate-res11', res)
            },
            fail: (err) => {
              console.log('startLocationUpdate-err22', err)
            }
          })
        } else {
          if (res.authSetting['scope.userLocation'] == false) {
            console.log('打开设置页面去授权')
          } else {
            wx.startLocationUpdateBackground({
              success: (res) => {
                console.log('startLocationUpdate-res333', res)
              },
              fail: (err) => {
                wx.showModal({
                  title: '警告',
                  content: '实时定位失败，请设置位置为使用时和离开后',
                  showCancel: false,
                  confirmText: '返回授权',
                  success: function (res) {
                    // 用户没有授权成功，不需要改变 isHide 的值
                    if (res.confirm) {
                      wx.openSetting({
                        success(res) {
                          console.log(res.authSetting)
                          // res.authSetting = {
                          //   "scope.userInfo": true,
                          //   "scope.userLocation": true
                          // }
                        }
                      })
                    }
                  }
                });
                console.log('startLocationUpdate-err444', err)
              }
            })
          }
        }
      }
    })
  },

  //获取接单的详情
  // gettakedetail() {
  //   var that = this
  //   var url = 'api/users/orderDetails'
  //   var data = {
  //     id: that.data.id
  //   }
  //   http.postReq(url, data, (res) => {
  //     console.log("获取单子详情", res)
  //     if (res.code == 200) {
  //       // 获取预约到达时间
  //       res.data.add_time = time.formatTimeTwo(res.data.add_time, 'M-D h:m:s')
  //       this.setData({
  //         takeindent: res.data,
  //         yizhuimg: res.data.image
  //       })
  //     }
  //   })
  // },
  //接单
  getTake(e) {
    const that = this
    var url = "api/users/meetOrder"
    var data = {
      openid: wx.getStorageSync('openid'),
      id: that.data.id,
      nurse_lng: that.data.longitude,
      nurse_lat: that.data.latitude, 
    }
    wx.showModal({
      title: '提醒',
      content: '请仔细确认该订单的时间和地点后,再进行接单',
      cancelText: '再看看',
      confirmText: '确定接单',
      success(res) {
        if (res.confirm) {
          http.postReq(url, data, function (res) {
            console.log(res)
            wx.showToast({
              title: res.msg,
              icon: "none",
              duration: 2000
            })
            that.myorderdetail()
            // that.onLoad()
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  // // 获取已接单子
  // getnurseOrder() {
  //   const that = this
  //   var url = "api/users/nurseOrder"
  //   var data = {
  //     openid: wx.getStorageSync('openid'),
  //     is_type: 1,
  //   }
  //   http.postReq(url, data, function (res) {
  //     if (res.code == 200 && res.data.length > 0) {
  //       console.log(res.data[0].id)
  //       that.setData({
  //         reid: res.data[0].id
  //       })
  //       that.myorderdetail()
  //       var times = setInterval(() => {
  //         that.myorderdetail()
  //       }, 5000);
  //       that.setData({
  //         interval: times 
  //       })
  //     }
  //   })
  // },
  //获取单子详情
  myorderdetail() { 
    var that = this
    var url = 'api/users/orderDetails'
    var data = {
      id: that.data.id
      // id:'16412735934901'
    } 
    http.postReq(url, data, (res) => {
      console.log("获取单子详情", res) 
      if (res.code == 200) { 
        // if (res.data.nurse_name == '') {
        //   wx.switchTab({
        //     url: '/pages/index/index',
        //   })
        // }
        // 获取预约到达时间
        res.data.add_time = time.formatTimeTwo(res.data.add_time, 'M-D h:m:s')
        var estimate_time = time.formatTimeTwo(res.data.estimate_time, 'M-D h:m:s')
        this.setData({
          estimate_time: estimate_time,
          indent: res.data,
          yizhuimg: res.data.image, 
          markers: [{
            id: "1",
            latitude: res.data.lat,
            longitude: res.data.lng,
            width: 40,
            height: 40,
            title: "客户",
            iconPath: '../../image/usericon.png'
          }],
        })
        this.getchooseimg1()
      }
    })
  },
  //获取公告
  getcontent() {
    var that = this
    var url = 'api/users/contentText'
    var data = {
      id: 10
    }
    http.postReq(url, data, function (res) {
      console.log('获取公告', res)
      that.setData({
        message: res.data.message,
        content: res.data.content,
      })
      WxParse.wxParse('article', 'html', res.data.content, that, 5);
    })
  },
  // 获取个人信息
  getuserdetail() {
    var that = this
    var url = 'api/users/userData'
    var data = {
      openid: wx.getStorageSync('openid')
    }
    http.postReq(url, data, function (res) {
      console.log('护士信息', res)
      that.setData({
        user: res,
      })
    })
  },
  // 获取地址
  // getlocation() {
  //   var _this = this;
  //   var timer = setInterval(function () {
  //     wx.getLocation({
  //       type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
  //       success: function (res) {
  //         console.log(res)
  //         _this.setData({
  //           latitude: res.latitude,
  //           longitude: res.longitude,
  //         })
  //         _this.changePosition()
  //       },
  //       fail: function (err) {
  //         console.log(err)
  //       }
  //     })
  //   }, 60000);
  //   _this.setData({
  //     setinterval: timer
  //   })
  // },
  regionchange(e) {
    if (e.type !== 'end') return;
    console.log("regionchange===" + JSON.stringify(e))
    // this.mapCtx.getCenterLocation({
    //   success:(res)=>{
    //     console.log(res)
    //   }
    // })
  },
  //取消订单
  cancelbtn() {
    var that = this
    if(that.data.indent.give==3&&that.data.indent.cancel_status==1){
      wx.showToast({
        title: '您提交了取消订单，无法再次进行取消',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    wx.showModal({
      content: '是否取消该订单',
      success(res) {
        if (res.confirm) {
          var url = 'api/users/nurseCancelOrder'
          var data = {
            id: that.data.id,
            openid: wx.getStorageSync('openid'),
            action_type:1 
          }
          http.postReq(url, data, (res) => {
            wx.showToast({
              title: res.msg,
              icon: 'none',
              duration: 2000
            })
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/index/index',
              })
            }, 2000);
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
      url: '/pages/orderdetail/orderdetail?id=' + that.data.id,
    })
  },
  // 修改护士经纬度(){
  changePosition() {
    var that = this
    console.log('修改护士经纬度id', this.data.id)

    var url = 'api/users/nursePositionUpdate'
    var data = {
      openid: wx.getStorageSync('openid'),
      nurse_lng: this.data.lonchange,
      nurse_lat: this.data.latchange,
      order_id: this.data.id
    }
    http.postReq(url, data, function (res) {
      console.log('护士经纬度', res)
      that.setData({
        latitude:that.data.latchange,
        longitude:that.data.lonchange,
      })
      that.getchooseimg1()
    })
  },
  // getstart 出发
  getstart(e) {
    var that = this
    if(that.data.indent.give==3&&that.data.indent.cancel_status==1){
      wx.showToast({
        title: '您提交了取消订单，无法进行下一步操作',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    if (that.data.indent.take == 2) {
      wx.showToast({
        title: '用户已经提交了取消订单，无法进行下一步操作',
        icon: 'none',
        duration: 2000,
      })
      return false;
    }
    var status = e.currentTarget.dataset.index

    var url = 'api/users/setOut'
    var data = {
      openid: wx.getStorageSync('openid'),
      id: this.data.id,
      status: status
    }
    http.postReq(url, data, function (res) {
      if (res.code == 200 && status == 1) {
        wx.showToast({
          title: '已成功出发',
          icon: "none",
          duration: 2000
        })
        that.getchooseimg()
      } else if (res.code == 200 && status == 2) {
        wx.showToast({
          title: '已成功到达',
          icon: "none",
          duration: 2000
        })
        clearInterval(that.data.interval);
        clearInterval(that.data.setinterval);
      }
      that.myorderdetail()
    })
  },
  // 完成订单
  getfinishorder() {
    var that = this
    var url = 'api/users/completeOrder'
    var data = {
      openid: wx.getStorageSync('openid'),
      id: this.data.id,
    }
    http.postReq(url, data, function (res) {
      if (res.code == 200) {
        wx.showToast({
          title: '订单已完成',
          icon: "none",
          duration: 1000
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }, 1000);
        clearInterval(that.data.interval);
      }
    })
  },

  // 跳转到医嘱并查看
  getyizhu() {
    console.log(this.data.yizhuimg)
    const that = this

    wx.navigateTo({
      url: '/pages/advice/advice?img=' + that.data.yizhuimg,
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
  //上线
  getline() {
    var that = this
    var url = 'api/users/line'
    var data = {
      openid: wx.getStorageSync('openid'),
      line: 1
    }
    http.postReq(url, data, function (res) {
      wx.showToast({
        title: '上线成功',
        icon: 'none',
        duration: 2000
      })
      wx.switchTab({
        url: '/pages/index/index'
      })
    })
  },

  // 路线导航choose
  getchooseimg() {
    // markers: [{
    //   id: "1",
    //   latitude: res.data.lat,
    //   longitude: res.data.lng,
    //   width: 50,
    //   height: 50,
    //   title: "客户"
    // }],
    var that = this
    console.log(that.data.markers[0])
    console.log(parseFloat(that.data.markers[0].latitude))

    let plugin = requirePlugin('routePlan');
    let key = 'UJ6BZ-P5TKR-2NAWQ-WWWWI-VN5GK-K6FWW'; //使用在腾讯位置服务申请的key
    let referer = '护士端'; //调用插件的app的名称
    let startPoint = JSON.stringify({ //终点
      'name': '我的位置',
      'latitude': parseFloat(that.data.latitude),
      'longitude': parseFloat(that.data.longitude)
    });
    //   let endPoint = JSON.stringify({ //终点
    //     'name': '北京西站',
    // 'latitude': 39.894806,
    // 'longitude': 116.321592
    //   });
    let endPoint = JSON.stringify({ //终点
      'name': that.data.indent.address,
      'latitude': parseFloat(that.data.markers[0].latitude),
      'longitude': parseFloat(that.data.markers[0].longitude)
    });
    console.log('1', endPoint)
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint + '&startPoint=' + startPoint + '&navigation=1'
    });
  },
  // 上面的是官方导航插件，这个是自己写的导航位置，导航图在地图上画出来
  getchooseimg1() {
    var _this = this;
    var start = _this.data.latitude + "," + _this.data.longitude
    var end = _this.data.markers[0].latitude + "," + _this.data.markers[0].longitude
    //调用距离计算接口
    console.log('start', start)
    console.log('end', end)
    qqmapsdk.direction({
      mode: 'driving', //可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
      //from参数不填默认当前地址
      from: start,
      to: end,
      success: function (res) {
        console.log('路线规划', res);
        var ret = res;
        var coors = ret.result.routes[0].polyline,
          pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;

        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({
            latitude: coors[i],
            longitude: coors[i + 1]
          })
        }
        // 设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        var pllength = pl.length - 1 //获取最后一位
        // var lat = (Number(_this.data.latitude) + Number(_this.data.markers[0].latitude)) / 2;
        // var lng = (Number(_this.data.longitude) + Number(_this.data.markers[0].longitude)) / 2;
        _this.setData({
          // pl: centerpl,
          // latitude: pl[0].latitude,
          // longitude: pl[0].longitude,
          polyline: [{
            points: pl,
            "color": "#1ACB72",
            "width": 10,
            "arrowLine": true,
            "arrowGap": 40,
            "borderWidth": 2,
            "borderColor": "#ffffff",
          }],
          markers: [{
            id: "1",
            latitude: pl[pllength].latitude,
            longitude: pl[pllength].longitude,
            width: 40,
            height: 40,
            title: "客户",
            iconPath: '../../image/usericon.png'
          }, {
            id: "2",
            latitude: pl[0].latitude,
            longitude: pl[0].longitude,
            width: 40,
            height: 40,
            title: "自己",
            iconPath: '../../image/nurseicon.png'
          }],
        })
        _this.getLocationList(pl)
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    });
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
  // 传入路线规划用户端那边看的
  getLocationList(pl) {
    var that = this
    var jspl = JSON.stringify(pl)
    var url = 'api/users/uploadLocationList'
    var data = {
      order_id: this.data.id,
      locations: jspl
    }
    http.postReq(url, data, function (res) {
      if (res.code == 200) {
        console.log(that.data.LocationList)
      if(that.data.LocationList){
        var centerpl = [{
          latitude: that.data.latitude,
          longitude: that.data.longitude
        }, {
          latitude: that.data.markers[0].latitude,
          longitude: that.data.markers[0].longitude
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

      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  //点击merkers及客户信息
  markertap(e) {
    console.log(e.markerId)
    wx.showActionSheet({
      itemList: ["A"],
      success: function (res) {
        console.log(res.tapIndex)
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  //点击缩放按钮动态请求数据
  // controltap(e) {
  //   var that = this;
  //   console.log("scale===" + this.data.scale)
  //   if (e.controlId === 1) {
  //     // if (this.data.scale === 13) {
  //     that.setData({
  //       scale: --this.data.scale
  //     })
  //     // }
  //   } else {
  //     //  if (this.data.scale !== 13) {
  //     that.setData({
  //       scale: ++this.data.scale
  //     })
  //     // }
  //   }
  // },
  onHide:function(){
    // 页面卸载时清空插件数据，防止再次进入页面，getCity返回的是上次的结果
    clearInterval(this.data.interval);
    clearInterval(this.data.setinterval);
  },
  onUnload: function () {
    // 页面卸载时清空插件数据，防止再次进入页面，getCity返回的是上次的结果
    clearInterval(this.data.interval);
    clearInterval(this.data.setinterval);
  },
})