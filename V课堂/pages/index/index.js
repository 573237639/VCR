//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    currentItemId : 1,

    dicData: [{id:1,name:'推荐'},{id:2,name:'吉他'}],
    videoList: [],
    page: 1,
    pageSize: 10,
    hasMoreData: true,//是否有更多数据
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })    
  },
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.getVideoList('加载更多数据')
    } else {
      wx.showToast({
        title: '没有更多数据',
      })
    }
  },
  onLoad: function () {
    var that = this;
    
    wx.request({
      url: 'http://192.168.2.222:8300/tf/common/dict/getDicCategory', //分类字典
      data: {
        
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data)
        if (res.data.data){
          that.setData({
            dicData: res.data.data
          })
        }
      }
    })

    that.getVideoList('正在加载数据...')
    
  },
  getVideoList: function (message) {
    var that = this
    wx.request({
      url: 'http://192.168.2.222:8300/tf/video/getLists', //首页列表
      data: {
        pageNum: that.data.page,
        pageSize: that.data.pageSize
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data.data);
        if (res.data.data) {
          var contentlistTem = that.data.videoList
          if (that.data.page == 1) {
            contentlistTem = []
          }
          var contentlist = res.data.data.list
          if (contentlistTem.length >= res.data.data.total - res.data.data.pageSize) {
            that.setData({
              videoList: contentlistTem.concat(contentlist),
              hasMoreData: false
            })
          } else {
            that.setData({
              videoList: contentlistTem.concat(contentlist),
              hasMoreData: true,
              page: that.data.page + 1
            })
          }
        }else{
          wx.showToast({
            title: '加载数据失败',
          })
        }
      }
    })
  },
  tagChoose: function (options) {
    var id = options.currentTarget.dataset.id;
    console.log(id)
    //设置当前样式  
    this.setData({
      currentItemId: id
    })
  },
  videoChoose: function (options) {
    var id = options.currentTarget.dataset.id;
    console.log(id)
    wx.navigateTo({
      url: '../index/videoInfo/videoInfo?id=' + id,  //跳转页面的路径，可带参数 ？隔开，不同参数用 & 分隔；相对路径，不需要.wxml后缀
      success: function(){
        
      }
    })
  }
})
