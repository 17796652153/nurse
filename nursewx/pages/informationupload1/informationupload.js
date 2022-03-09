// pages/bindingPhone/bindingPhone.js
var http = require('../../utils/http.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 60,
    hide: 2,
    user: '',
    username: '',
    phone: '',
    hospital: '',
    phone_code: '',
    date: '请选择就业时间',
    pics: [],
    pics1: [],
    pics2: [],
    pics3: [],
  },


  sendPhone: function () {
    const that = this
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(that.data.phone)) {
      wx.showToast({
        title: '号码不符合规范',
        icon: 'none',
        duration: 2000
      })
      return false;
    } else {
      var num = 60;
      this.setData({
        hide: 1
      })
      var times = setInterval(function () {
        num--
        that.setData({
          num: num
        })
        if (num <= 0) {
          clearInterval(times);
          that.setData({
            hide: 2,
            num: 60
          })
        }
      }, 1000)
      var url = 'api/users/sendCode'
      var data = {
        phone: that.data.phone
      }
      http.postReq(url, data, function (res) {
        console.log("登录接口", res)
        if (res.code == 200) {
          wx.showToast({
            title: '请等待',
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getshopdetail()
  },
  getshopdetail() {
    var that = this
    var url = "api/users/getRider" 
    var data = {  
      openid: wx.getStorageSync('openid'),
    }
    http.postReq(url, data, function (res) {
      console.log(res)
      that.data.pics.push(res.data.rider_image1)
      that.data.pics1.push(res.data.rider_image2)
      that.data.pics2.push(res.data.image3)
      that.data.pics3.push(res.data.image4)
      that.setData({
        date: res.data.trade_time,
        username: res.data.username,
        hospital: res.data.hospital,
        phone: res.data.rider_phone,
        pics: that.data.pics,
        pics1: that.data.pics1,
        pics2: that.data.pics2,
        pics3: that.data.pics3,
      })
    })
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  usernameInput(e) {
    const that = this
    that.setData({
      username: e.detail.value
    })
  },
  phoneInput(e) {
    const that = this
    that.setData({
      phone: e.detail.value
    })
  },
  hospitalInput(e) {
    const that = this
    that.setData({
      hospital: e.detail.value
    })
  },
  codeInput(e) {
    const that = this
    that.setData({
      phone_code: e.detail.value
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
    this.setData({
      user: wx.getStorageSync('user'),
    });
  },
  delPic(e) {
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index
    var that = this;
    if (index == 1) {
      that.setData({
        pics: []
      })
    } else if (index == 2) {
      that.setData({
        pics1: []
      })
    } else if (index == 3) {
      that.setData({
        pics2: []
      })
    } else {
      that.setData({
        pics3: []
      })
    }
  },
  getsubmit() {
    var that = this
    //     openid	是	string	用户openid
    // phone_code	是	string	验证码
    // phone	是	string	手机号
    // alipay_name	是	string	支付宝姓名
    // alipay_number	是	string	支付宝账号
    // wechat_number
    var url = "api/users/editRider"
    var data = {
      openid: wx.getStorageSync('openid'),
      rider_name: this.data.username,
      rider_phone: this.data.phone,
      rider_image1: this.data.pics[0],
      rider_image2: this.data.pics1[0],
      image3: this.data.pics2[0],
      image4: this.data.pics3[0],
      trade_time: this.data.date,
      hospital: this.data.hospital,
      code: this.data.phone_code,
      username: this.data.user.username,
      avatar: this.data.user.avatar,
      province: wx.getStorageSync('province'),
      city: wx.getStorageSync('city')
    }
    http.postReq(url, data, function (res) {
      if (res.code == 200) {
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
  uploadPic: function (e) {
    console.log(e.currentTarget.dataset.index)
    var index = e.currentTarget.dataset.index
    var that = this;

    wx.chooseImage({
      count: 1, // 最多可以选择的图片张数，默认9
      sizeType: ['compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        console.log(res)
        wx.showLoading({
          title: '上传中···',
          mask: true
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
            if (res.code == 200) {
              var list = []
              if (index == 1) {
                list.push(http.rootDocment + res.data)
                that.setData({
                  pics: list
                })
                console.log(that.data.pics)
              } else if (index == 2) {
                list.push(http.rootDocment + res.data)
                that.setData({
                  pics1: list
                })
              } else if (index == 3) {
                list.push(http.rootDocment + res.data)
                that.setData({
                  pics2: list
                })
              } else {
                list.push(http.rootDocment + res.data)
                that.setData({
                  pics3: list
                })
              }
              wx.hideLoading()
            } else {
              wx.showToast({
                title: res.msg,
                icon: 'none',
                duration: 2000
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
  //图片预览
  priveimg(e) {
    var that = this;
    var current = e.target.dataset.index;
    console.log(current)
    var imgList = [];
    if (current == 1) {
      imgList = this.data.pics
    } else if (current == 2) {
      imgList = this.data.pics1
    } else if (current == 3) {
      imgList = this.data.pics2
    } else {
      imgList = this.data.pics3
    }
    wx.previewImage({
      current: imgList[0], //当前点击的图片链接
      urls: imgList //图片数组
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