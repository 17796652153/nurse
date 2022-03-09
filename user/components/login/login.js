let http = require('../../utils/http')

// components/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    showLogin: false, // 登录
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 登录
    login() {
      let that = this;
      wx.getUserProfile({
        desc: '用于完善用户资料',
        success(res) {
          let userInfo = res.userInfo;
          console.log(userInfo, '用户信息');
          const iv = res.iv;
          const encryptedData = res.encryptedData;
          const avatarUrl = res.userInfo.avatarUrl;
          const nickName = res.userInfo.nickName;
          // 获取code，换取openid
          wx.login({
            success(rst) {
              console.log(rst, '登录态Code');
              let code = rst.code
              wx.setStorageSync('code', code)
              if (code) {
                const data = {
                  code: code,
                  nickName: nickName,
                  avatarUrl: avatarUrl,
                  iv: iv,
                  encryptedData: encryptedData,
                  province: wx.getStorageSync('province'),
                  city: wx.getStorageSync('city'),
                  district: wx.getStorageSync('district'),
                }
                http.postReq('api/login/login',data, function (req) {
                  console.log(req, '用户唯一标识Token');
                  if (req.data == 1) {
                    console.log("登录接口", req)
                    wx.setStorageSync("user", req.user)
                    // wx.setStorageSync("integral", res.user.integral)
                    wx.setStorageSync("openid", req.user.openid)
                    that.triggerEvent('showLogin',{showLogin:false})
                    // wx.showTabBar({
                    //   animation: true,
                    // })
                  }
                })
              }
            },
            fail(err) {
              console.log(err, '获取失败');
            }
          })
        },
        fail(err) {
          console.log(err, '拒绝登录');
          // 用户点了取消授权
          wx.showModal({
            title: '警告',
            content: '您点击了拒绝授权，将无法正常使用小程序，请授权之后再进入!!!',
            showCancel: false,
            confirmText: '返回授权',
            success: function (res) {
              // 用户没有授权成功，不需要改变 isHide 的值
              if (res.confirm) {
                console.log('用户点击了“返回授权”');
              }
            }
          })
        }
      })
    },

    // 隐藏登录框
    hideLogin() {
      console.log(213)
      this.setData({
        showLogin: false,
      })
      this.triggerEvent('showLogin',{showLogin:false})
    },
  }
})
