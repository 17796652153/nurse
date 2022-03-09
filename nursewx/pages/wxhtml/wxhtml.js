// pages/wxhtml/wxhtml.js
var http = require('../../utils/http.js');
const WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: '', //根据type看不同的数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      type: options.type
    })
    this.getrich()
  },
  // 获取富文本描述
  //   content	int	id->4 程序介绍   type=2
  // content	int	id->5 关于我们   type=3
  // content	int	id->6 护士注册协议
  // content	int	id->7 法律条款和隐私政策
  // content	int	id->8 规则中心
  getrich() {
    let that=this
   let url='api/users/content'
    http.getReq(url, (res)=>{
      console.log("rich", res)
      if (res.code == 200) {
        if(that.data.type==2){
          var article = ''
          res.data.map(function (item, index, arr) {
            if(item.id==6){
              article=item.content
            }
          })
         
          /**
           * WxParse.wxParse(bindName , type, data, target,imagePadding)
           * 1.bindName绑定的数据名(必填)
           * 2.type可以为html或者md(必填)
           * 3.data为传入的具体数据(必填)
           * 4.target为Page对象,一般为this(必填)
           * 5.imagePadding为当图片自适应是左右的单一padding(默认为0,可选)
           */
          console.log(12132, article)
          WxParse.wxParse('article', 'html', article, that, 5);
        }else if(that.data.type==7){
          var article = ''
          res.data.map(function (item, index, arr) {
            if(item.id==7){
              article=item.content
            }
            WxParse.wxParse('article', 'html', article, that, 5);
          })
        }else if(that.data.type==8){
          var article = ''
          res.data.map(function (item, index, arr) {
            if(item.id==8){
              article=item.content
            }
            WxParse.wxParse('article', 'html', article, that, 5);
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