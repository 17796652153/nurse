// pages/order/order.js
var http = require('../../utils/http.js');
const time = require('../../utils/time.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderdetail:'',
    rewardid:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

              if(res.data[i].give==3){
                res.data[i].showcom=false
                if(that.data.rewardid==res.data[i].id){
                  res.data[i].showcom=true
                }
              }
            }
            console.log('订单吧',res.data)

            that.setData({
              orderdetail:res.data
            })
            console.log('orderdetail',that.data.orderdetail)
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
  getdetail(e){
    var id=e.currentTarget.dataset.index
    wx.navigateTo({
      url: '/pages/orderdetail/orderdetail?id='+id,
    })
  },
  changeshowcom(e){
    console.log(e.target.dataset.index)
    console.log(this.data.orderdetail)
        this.data.orderdetail[e.target.dataset.index].showcom=!this.data.orderdetail[e.target.dataset.index].showcom
        var orderdetail=this.data.orderdetail
        var rewardid=''
        if(this.data.orderdetail[e.target.dataset.index].showcom){
          rewardid =this.data.orderdetail[e.target.dataset.index].id
        }else{
          rewardid =''
        }
        this.setData({
          rewardid:rewardid,
          orderdetail:orderdetail
        })
    },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getmyorder()
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