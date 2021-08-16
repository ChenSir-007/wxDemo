//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    conditionCode: {
      100: "/images/image/100.png",
      101: "/images/image/101.png",
      102: "/images/image/102.png",
      103: "/images/image/103.png",
      104: "/images/image/104.png",
      150: "/images/image/150.png",
      153: "/images/image/153.png",
      154: "/images/image/154.png",
      300: "/images/image/300.png",
      301: "/images/image/301.png",
      302: "/images/image/302.png",
      303: "/images/image/303.png",
      304: "/images/image/304.png",
      305: "/images/image/305.png",
      306: "/images/image/306.png",
      307: "/images/image/307.png",
      308: "/images/image/308.png",
      309: "/images/image/309.png",
      310: "/images/image/310.png",
      311: "/images/image/311.png",
      312: "/images/image/312.png",
      313: "/images/image/313.png",
      314: "/images/image/314.png",
      315: "/images/image/315.png",
      316: "/images/image/316.png",
      317: "/images/image/317.png",
      318: "/images/image/318.png",
      350: "/images/image/350.png",
      351: "/images/image/351.png",
      399: "/images/image/399.png",
      400: "/images/image/400.png",
      401: "/images/image/401.png",
      402: "/images/image/402.png",
      403: "/images/image/403.png",
      404: "/images/image/404.png",
      405: "/images/image/405.png",
      406: "/images/image/406.png",
      407: "/images/image/407.png",
      408: "/images/image/408.png",
      409: "/images/image/409.png",
      410: "/images/image/410.png",
      456: "/images/image/456.png",
      457: "/images/image/457.png",
      499: "/images/image/499.png",
      500: "/images/image/500.png",
      501: "/images/image/501.png",
      502: "/images/image/502.png",
      503: "/images/image/503.png",
      504: "/images/image/504.png",
      507: "/images/image/507.png",
      508: "/images/image/508.png",
      509: "/images/image/509.png",
      510: "/images/image/510.png",
      511: "/images/image/511.png",
      512: "/images/image/512.png",
      513: "/images/image/513.png",
      514: "/images/image/514.png",
      515: "/images/image/515.png",
      900: "/images/image/900.png",
      901: "/images/image/901.png",
      999: "/images/image/999.png",
    },
    location: "none",
    city: "上地",
    summary: "多云",
    localTemperature: "1",
    days: [],
    suggestion: [],
    suggestionIcon: {
      air: "/images/image/life/air.svg",
      cw: "/images/image/life/cw.svg",
      sport: "/images/image/life/sport.svg",
      drsg: "/images/image/life/drsg.svg",
      flu: "/images/image/life/flu.svg",
      uv: "/images/image/life/uv.svg",
      trav: "/images/image/life/trav.svg",
      comf: "/images/image/life/comf.svg",
    },
    detail: {},
    detailIcon: {
      windy: "/images/image/detail/windy.svg",
      barometer: "/images/image/detail/barometer.svg",
      temperature: "/images/image/detail/temperature.svg",
      humidity: "/images/image/detail/humidity.svg",
    },
    show: true, //显示加载中图标
    showsuggestion: false, //显示天气建议
    prompt: "Loading ...", // 页面的初始数据
    lodingsrc: "/images/image/location/umbrella.svg",
    air: {
      aqi: 'AQI',
      co: '一氧化碳',
      no2: '二氧化氮',
      o3: '臭氧',
      pm10: 'PM10',
      pm25: 'PM2.5',
      qlty: '空气质量',
      so2: '二氧化硫',
    },
    hourly: [],
    suggestiondetail: {}
  },
  onTab(e) {
    this.setData({
      showsuggestion: true,
      suggestiondetail: e.currentTarget.dataset.suggestion
    })
  },
  close() {
    this.setData({
      showsuggestion: false
    })
  },
  maskTouchMove() {},
  touchMove() {},
  getUserLocation() { // 获取用户当前经纬度
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.decodingGps(res.longitude, res.latitude)
      },
      fail: () => {
        this.add()
      }
    })
  },
  decodingGps(x, y) { // 解析经纬度到到地址
    wx.request({
      url: 'https://restapi.amap.com/v3/geocode/regeo',
      data: {
        location: x + "," + y,
        key: 'd85046bc67dd87d5ca1e1618829d33d7',
      },
      success: (res) => {
        this.setData({
          location: res.data.regeocode.addressComponent.district
        })
        this.getWeather()
        this.getNowWeather()
        this.getLifestyle()
        this.getHourly()
      },
      fail: () => {
        this.add()
      }
    })
  },
  getHourly() { // 实况天气
    wx.request({
      url: 'https://free-api.heweather.com/s6/weather/hourly',
      data: {
        location: this.data.location,
        key: '9b88e317475943c495cb5b60e35991b4'
      },
      success: (res) => {
        let {
          hourly
        } = res.data.HeWeather6[0]
        let hourlyArray = hourly.map(it => {
          return {
            time: it.time.slice(11),
            condCode: this.data.conditionCode[it.cond_code],
            tmp: it.tmp
          }
        })
        this.setData({
          hourly: hourlyArray
        })
      },
      fail: () => {
        this.add()
      }
    })
  },
  getNowWeather() { // 实况天气
    wx.request({
      url: 'https://free-api.heweather.com/s6/weather/now',
      data: {
        location: this.data.location,
        key: '9b88e317475943c495cb5b60e35991b4'
      },
      success: (res) => {
        let {
          basic,
          now
        } = res.data.HeWeather6[0]
        this.setData({
          city: basic.parent_city,
          summary: now.cond_txt,
          localTemperature: now.tmp,
          detail: now
        })
      },
      fail: () => {
        this.add()
      }
    })
  },
  getLifestyle() { // 生活指数
    wx.request({
      url: 'https://free-api.heweather.com/s6/weather/lifestyle',
      data: {
        location: this.data.location,
        key: '9b88e317475943c495cb5b60e35991b4'
      },
      success: (res) => {
        console.log(res.data.HeWeather6[0].lifestyle);
        let suggestion = res.data.HeWeather6[0].lifestyle
        this.setData({
          suggestion
        })
      },
      fail: () => {
        this.add()
      }
    })
  },

  getWeather: function () { // 3-10天天气预报
    wx.request({
      url: 'https://free-api.heweather.com/s6/weather/forecast',
      data: {
        location: this.data.location,
        key: '9b88e317475943c495cb5b60e35991b4'
      },
      success: (res) => {
        let arrayWeather = res.data.HeWeather6[0].daily_forecast.slice(1, 6)
        let weekDaysMap = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
        let list = arrayWeather.map(it => ({
          time: weekDaysMap[new Date(it.date.split("-").join("/")).getDay()],
          icon: this.data.conditionCode[it.cond_code_d],
          detail: it.cond_txt_d,
          minTemperature: it.tmp_min,
          maxTemperature: it.tmp_max
        }))
        this.setData({
          days: list,
          show: false,
        })
      },
      fail: () => {
        this.add()
      }
    })
  },
  onPullDownRefresh: function () { // 页面相关事件处理函数--监听用户下拉动作
    setTimeout(function () {
      wx.stopPullDownRefresh()
    }, 1000)
    if (!this.data.show) {
      this.getUserLocation()
    }
  },
  onLoad: function () { // 生命周期函数--监听页面加载
    this.getUserLocation()
    wx.showShareMenu({ // 转发
      withShareTicket: true
    })
  },
  onShow: function () { // 生命周期函数--监听页面显示
    let dataFromSearch = wx.getStorageSync('data');
    if (dataFromSearch) {
      this.setData({
        location: dataFromSearch
      })
      wx.removeStorageSync('data')
      if (this.data.location === "auto") {
        this.getUserLocation()
      } else if (this.data.location) {
        this.getWeather()
        this.getNowWeather()
        this.getLifestyle()
        this.getHourly()
      }
    }
  },
  add: function () { // 转跳到搜索页面
    wx.navigateTo({
      url: '/pages/weather-search/weather-search'
    })
  }
})