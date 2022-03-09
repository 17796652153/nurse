// pages/advice/advice.js
var http = require('../../utils/http.js');
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pics: [], //图片
    user: '',
    zs: '',
    lat: '',
    lon: '',
    address: '',
    money: '', //支付价格
    money1: '', //原始价格（不带注射）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    // 根据经纬度计算地址和省市
    const that = this;
    if (options.type == 1) {
      var qqmapsdk = new QQMapWX({
        key: '5F3BZ-ZXJ6K-QWAJK-AC6NI-O76KS-JSFJZ'
      });
      qqmapsdk.reverseGeocoder({
        location: {
          latitude: options.lat,
          longitude: options.lon
        },
        success: function (res) { //成功后的回调

          var res = res.result;
          console.log('地址', res);
          var money1 = options.money - options.zs
          money1.toFixed(2)
          that.setData({
            type: 1,
            province: res.address_component.province,
            city: res.address_component.city,
            zs: options.zs,
            lat: options.lat,
            lon: options.lon,
            money: options.money,
            money1: money1
          })
          // wx.setStorageSync("province", res.address_component.province)
          // wx.setStorageSync("city", res.address_component.city)
        }
      })
    } else {
      that.setData({
        type: 2,
        image: options.img
      })
    }


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
    this.getuserdetail()
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
  //生成订单
  //   openid	是	string	用户openid
  // unionid	是	string	用户unionid
  // address	是	string	用户地址
  // name	是	string	姓名
  // phone	是	string	电话
  // door_time	是	string	预约时间
  // money	是	string	支付金额
  // order_money	是	string	订单金额
  // lng	是	string	地址经度
  // lat	是	string	地址纬度
  // give	是	string	1下单,2预约下单
  // avatar	是	string	用户头像
  // username	是	string	用户昵称
  // image	是	string	医嘱
  // province	是	string	省
  // city	是	
  getmoney() {
    var that = this
    var url = 'api/users/payNumber'
    var pic = that.data.pics
    if (that.data.pics.length == 0) {
      wx.showToast({
        title: '您这边没有上传医嘱，不能提交支付',
        icon: 'none',
        duration: 2000
      })
      return false
    }
    console.log(pic)
    console.log(that.data.lon)
    console.log(that.data.lat)
    var v2 = wx.getStorageSync('v2')
    var data = {
      openid: wx.getStorageSync('openid'),
      unionid: that.data.user.unionid,
      address: wx.getStorageSync('addressname'),
      name: that.data.user.name,
      phone: that.data.user.phone,
      door_time: wx.getStorageSync('time'),
      money: that.data.money,
      order_money: that.data.money1,
      zs_money: that.data.zs,
      lng: that.data.lon,
      lat: that.data.lat,
      give: wx.getStorageSync('give'),
      avatar: that.data.user.avatar,
      username: that.data.user.username,
      image: pic,
      province: that.data.province,
      city: that.data.city,
      type: v2.type,
      days: v2.days,
      extend_address: wx.getStorageSync('daddress'),
      order_address: wx.getStorageSync('address')
    }
    http.postReq(url, data, (res) => {
      if (res.code == 200) {
        var order = res.order
        console.log('ding', order)
        wx.requestPayment({
          timeStamp: res.config.timestamp,
          nonceStr: res.config.nonceStr,
          package: res.config.package,
          signType: 'MD5',
          paySign: res.config.paySign,
          success(res) {
            console.log(res)
            wx.showToast({
              title: '付款成功',
              icon: 'none',
              duration: 2000
            })
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/map/map?address=' + order.address + '&orderid=' + order.id,
              })
            }, 2000)
          },
          fail(res) {
            console.log('支付失败', res)
            //调取支付失败接口
            let url = 'api/users/cancelPay'
            let data = {
              id: order.id
            }
            http.postReq(url, data, (res) => {
              console.log(res)
            })
          }
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //上传图片开始
  chooseImg: function (e) {
    var that = this,
      pics = this.data.pics;
    console.log(pics);
    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        wx.showLoading({
          title: '请等待...',
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        let url = 'api/users/upload'
        http.base64({
          url: tempFilePaths[0],
          type: 'png'
        }).then(res => {
          let data = {
            base64: res
          }
          http.postReq(url, data, function (res) {
            wx.hideLoading()
            if (res.code == 200) {
              pics.push(http.rootDocment + res.data)
              that.setData({
                pics: pics
              })
            }
          })
        })
      },
    });
  },
  // 删除图片
  deleteImg: function (e) {
    var that = this;
    var pics = this.data.pics;
    var index = e.currentTarget.dataset.index;
    pics.splice(index, 1);
    console.log(pics)
    this.setData({
      pics: pics,
    })
  },
  // 预览图片
  previewImg1: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var pics = this.data.pics;
    wx.previewImage({
      //当前显示图片
      current: pics[index],
      //所有图片
      urls: pics
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