// pages/payment/payment.js
const app = getApp()

Page({
  data: {
    paymentAmount: 0,
    cartItems: [],
    currentProduct: null
  },

  onLoad(options) {
    this.initPaymentData(options.type)
  },

  async loadDefaultAddress() {
    try {
      const { data } = await wx.request({
        url: 'http://localhost:3000/addresses/default',
        header: { 'X-User-Id': app.globalData.userId }
      })
      if (data) {
        this.setData({ selectedAddress: data })
      }
    } catch (e) {
      console.error('加载地址失败', e)
    }
  },

  async chooseAddress() {
    const { data } = await wx.navigateTo({
      url: '/pages/address/address?selectMode=true'
    })
    if (data) {
      this.setData({ selectedAddress: data })
    }
  },

  initPaymentData(type) {
    if (type === 'cart') {
      const cartItems = app.cart.get()
      if (cartItems.length === 0) {
        wx.showToast({ title: '购物车为空', icon: 'none' })
        return wx.navigateBack()
      }
      const amount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      this.setData({ paymentAmount: amount, cartItems })
    } else {
      const product = app.globalData.currentProduct
      if (!product || !product.price) {
        wx.showToast({ title: '商品信息错误', icon: 'none' })
        return wx.navigateBack()
      }
      this.setData({ paymentAmount: product.price, currentProduct: product })
    }
  },

  handlePayment() {
    // 这里添加处理支付的逻辑
    console.log('开始处理支付');
  }
})