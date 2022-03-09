// pages/report/report.js
var http = require('../../utils/http.js');
const time = require('../../utils/time.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:'',
    report:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getmyorder()
  },
    // 进去举报
    getreportdetail(){
      var that=this
      if(that.data.id==''){
        wx.showToast({
          title: '您还没有选择要举报的订单，请选择订单',
          icon:'none',
          duration:2000
        })
        return
      }
      wx.navigateTo({
        url: '/pages/reportdetail/reportdetail?id='+that.data.id,
      })
    },
clickradio(e){
  console.log(e.target.dataset.index)
  let i=e.target.dataset.index
  let id=''
  for (let index = 0; index < this.data.report.length; index++) {
    const element = this.data.report[index];
    if(index==i){
      id=element.id
      element.radiotrue=true
    }else{
      element.radiotrue=false
    }
  }
  this.setData({
    id:id,
    report: this.data.report,
  });
},
//获取全部订单
getmyorder() {
  let that=this
  let url = 'api/users/myOrderList'
  let data = {
    openid: wx.getStorageSync('openid')
  }
  http.postReq(url, data, (res)=>{
    console.log("我的订单", res)
    if (res.code == 200) {
        if(res.data.length==0){
          that.setData({
            myorder:false
          })
        }else{
          for(var i=0;i<res.data.length;i++){
            res.data[i].add_time=time.formatTimeTwo(res.data[i].add_time, 'Y-M-D h:m:s')
            res.data[i].radiotrue=false
          }
          console.log(res.data)
          that.setData({
            report:res.data
          })
          console.log('orderdetail',that.data.report)
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