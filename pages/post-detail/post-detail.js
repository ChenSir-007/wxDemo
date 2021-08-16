// pages/post-detail/post-detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    postData: {},
    _pid: null,
    collected: false,
    _postsCollected: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    wx.request({
      url: app.gNewsBaseUrl + 'content',
      data: {
        uniquekey: options.pid,
        key: '17abfa15e2dbd180bac3eaaebde657c2'
      },
      success: (res) => {
        const data = res.data.result
        console.log(data);
        this.setData({
          postData: data
        })
      }
    })
    this.data._pid = options.pid
    const postsCollected = wx.getStorageSync('posts_collected')
    this.data._postsCollected = postsCollected || {}
    const collected = postsCollected[this.data._pid]
    this.setData({
      collected,
    })
  },
  onShare(event) {
    wx.showActionSheet({
      itemList: ['分享到QQ', '分享到微信', '分享到朋友圈'],
    })
  },
  onCollect() {
    // 假设未收藏 -> 收藏
    // todo true->false状态改变后为什么仓库也跟着改变了
    // 赋值的是地址并未进行拷贝操作
    const postsCollected = this.data._postsCollected
    postsCollected[this.data._pid] = !postsCollected[this.data._pid]
    this.setData({
      collected: postsCollected[this.data._pid]
    })
    wx.setStorageSync('posts_collected', postsCollected)
    wx.showToast({
      title: this.data.collected ? '收藏成功' : '取消收藏',
      duration: 3000
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