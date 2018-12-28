var app = getApp();
var music_over = 0;
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
      
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
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

  },
  r1_select:function(){
    app.globalData.level = 1
  },
  r2_select: function () {
    app.globalData.level = 2
  },
  r3_select: function () {
    app.globalData.level = 3
  },

  Music_On: function(){
    music_over = 0;
    var that = this;
    wx.playBackgroundAudio({
      dataUrl: 'http://www.170mv.com/kw/other.web.nf01.sycdn.kuwo.cn/resource/n2/1/3/2266279594.mp3',
      success: function () {
        setTimeout((function callback() {
          if (music_over === 0){
            that.Music_On();
          }
        }).bind(that), 32000);
      }
    })
    console.log("...")
  },

  Music_Off: function(){
    wx.stopBackgroundAudio()
    music_over = 1;
  }
  
})