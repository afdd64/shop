// pages/list/list.js
const app = getApp()

Page({
  data: {
    order: [],
    currentTab: 'all',
    orderTabs: [
      { value: 'all', label: '全部订单' },
      { value: 'unpaid', label: '待支付' },
      { value: 'undelivered', label: '待发货' },
      { value: 'received', label: '待收货' },
      { value: 'unreviewed', label: '待评价' }
    ]
  },

  onLoad(options) {
    const validStatus = ['all', 'unpaid', 'undelivered', 'received', 'unreviewed']
    const status = validStatus.includes(options.type) ? options.type : 'all'
    this.setData({ currentTab: status }, this.loadOrder)
  },

  async loadOrder() {
    try {
      // 修改请求 URL 为 order 路由
      const { data } = await wx.request({
        url: `http://localhost:3000/order?status=${this.data.currentTab}`,
        header: { 'X-User-Id': app.globalData.userId }
      })
      this.setData({ order: data.map(order => ({
        ...order,
        statusText: this.getStatusText(order.status)
      })) })
    } catch (e) {
      wx.showToast({ title: '加载失败', icon: 'none' })
    }
  },

  getStatusText(status) {
    const statusMap = {
      unpaid: '待支付',
      undelivered: '待发货',
      received: '待收货',
      unreviewed: '待评价'
    }
    return statusMap[status] || '未知状态'
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ currentTab: tab }, this.loadOrder)
  },

  viewOrderDetail(e) {
    const orderId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/detail/detail?id=${orderId}`
    })
  }
})